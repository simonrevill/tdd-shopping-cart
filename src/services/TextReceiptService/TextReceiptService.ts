import { ICurrencyService, IReceiptFormatService, TReceiptData, TReceiptItem } from '../../types';

export default class TextReceiptService implements IReceiptFormatService {
  currencyService: ICurrencyService;

  constructor(currencyService: ICurrencyService) {
    this.currencyService = currencyService;
  }

  writeItem(item: TReceiptItem, index: number): string {
    let itemString = `${index + 1}. `;
    itemString += `${this.currencyService.formatNumber(item.unitPrice)}`;
    itemString += ` x `;
    itemString += `${item.quantity}`;
    itemString += ` - `;
    itemString += `${this.currencyService.format(item.grossPrice)}`;

    return itemString;
  }

  writeNewLine(newLine: 'single' | 'double'): string {
    return { single: '\n', double: '\n\n' }[newLine];
  }

  create(data: TReceiptData): string {
    let receiptString = 'Your receipt';
    receiptString += this.writeNewLine('double');

    data.items.forEach((item, index) => {
      receiptString += this.writeItem(item, index);
      receiptString += this.writeNewLine(index === data.items.length - 1 ? 'double' : 'single');
    });

    receiptString += `Subtotal: ${this.currencyService.currencySymbol}`;
    receiptString += this.currencyService.formatNumber(data.subtotal);
    receiptString += this.writeNewLine('double');

    if (data.discount) {
      receiptString += (data.discount.percentage as number) * 100 + '% ';
      receiptString += 'Discount: -';
      receiptString += this.currencyService.format(data.discount.deductedAmount);
      receiptString += this.writeNewLine('double');
    }

    receiptString += `Total: ${this.currencyService.format(data.total)}`;

    return receiptString;
  }
}
