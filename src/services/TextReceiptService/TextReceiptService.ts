import {
  ICurrencyService,
  IReceiptFormatService,
  TRawReceiptData,
  TRawReceiptItem,
} from '../../types';

export default class TextReceiptService implements IReceiptFormatService {
  currencyService: ICurrencyService;

  constructor(currencyService: ICurrencyService) {
    this.currencyService = currencyService;
  }

  private writeItem(item: TRawReceiptItem, index: number): string {
    let itemString = `${index + 1}. `;
    itemString += `${this.currencyService.formatNumber(item.unitPrice)}`;
    itemString += ` x `;
    itemString += `${item.quantity}`;
    itemString += ` - `;
    itemString += `${this.currencyService.format(item.grossPrice)}`;

    return itemString;
  }

  private writeNewLine(newLine: 'single' | 'double'): string {
    return { single: '\n', double: '\n\n' }[newLine];
  }

  create({ items, subtotal, total, discount }: TRawReceiptData): string {
    let receiptString = 'Your receipt';
    receiptString += this.writeNewLine('double');

    items.forEach((item, index) => {
      const isLastItem = index === items.length - 1;
      receiptString += this.writeItem(item, index);
      receiptString += this.writeNewLine(isLastItem ? 'double' : 'single');
    });

    receiptString += `Subtotal: ${this.currencyService.currencySymbol}`;
    receiptString += this.currencyService.formatNumber(subtotal);
    receiptString += this.writeNewLine('double');

    if (discount) {
      receiptString += discount.percentage * 100 + '% ';
      receiptString += 'Discount: -';
      receiptString += this.currencyService.format(discount.deductedAmount);
      receiptString += this.writeNewLine('double');
    }

    receiptString += `Total: ${this.currencyService.format(total)}`;

    return receiptString;
  }
}
