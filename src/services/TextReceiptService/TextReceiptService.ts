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

  private writeNewLine(newLine: 'single' | 'double' | 'separator'): string {
    return {
      single: '\n',
      double: '\n\n',
      separator: '   ---------------------------------------------',
    }[newLine];
  }

  private writeItem(
    { id, name, unitPrice, description, quantity, grossPrice }: TRawReceiptItem,
    index: number,
  ): string {
    let itemString = '';
    const itemUnitPrice = this.currencyService.format(unitPrice);
    const itemGrossPrice = this.currencyService.format(grossPrice);

    itemString += `${index + 1}. ${name} - ${itemUnitPrice} x ${quantity} - ${itemGrossPrice}`;
    itemString += this.writeNewLine('single');
    itemString += `   ID: ${id}`;
    itemString += this.writeNewLine('single');
    itemString += `   Description: ${description}`;
    itemString += this.writeNewLine('single');
    itemString += this.writeNewLine('separator');

    return itemString;
  }

  create({ items, subtotal, total, discount }: TRawReceiptData): string {
    let receiptString = 'Your receipt';
    receiptString += this.writeNewLine('double');

    items.forEach((item, index) => {
      const isLastItem = index === items.length - 1;
      receiptString += this.writeItem(item, index);
      receiptString += this.writeNewLine(isLastItem ? 'double' : 'single');
    });

    receiptString += `   Subtotal: ${this.currencyService.currencySymbol}`;
    receiptString += this.currencyService.formatNumber(subtotal);
    receiptString += this.writeNewLine('double');

    if (discount) {
      receiptString += '   ' + discount.percentage * 100 + '% Discount: -';
      receiptString += this.currencyService.format(discount.deductedAmount);
      receiptString += this.writeNewLine('double');
    }

    receiptString += `   Total: ${this.currencyService.format(total)}`;

    return receiptString;
  }
}
