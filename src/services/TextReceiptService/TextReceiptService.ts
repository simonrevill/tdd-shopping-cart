import {
  ICurrencyService,
  IReceiptFormatService,
  TReceiptData,
  TReceiptOutputPath,
} from '../../types';
import fs from 'node:fs';
import path from 'node:path';

export default class TextReceiptService implements IReceiptFormatService {
  currencyService: ICurrencyService;

  constructor(currencyService: ICurrencyService) {
    this.currencyService = currencyService;
  }

  create(data: TReceiptData, outputDirectory: TReceiptOutputPath): void {
    let receiptString = 'Your receipt\n\n';

    data.items.forEach((item, index) => {
      receiptString += `${index + 1}. ${this.currencyService.formatNumber(item.unitPrice)} x ${
        item.quantity
      } - ${this.currencyService.format(item.grossPrice)}${
        index === data.items.length - 1 ? '\n\n' : '\n'
      }`;
    });

    receiptString += `Subtotal: ${
      this.currencyService.currencySymbol
    }${this.currencyService.formatNumber(data.subtotal)}\n\n`;

    if (data.discount) {
      receiptString += `${
        (data.discount.percentage as number) * 100
      }% Discount: -${this.currencyService.format(data.discount.deductedAmount)}\n\n`;
    }

    receiptString += `Total: ${this.currencyService.format(data.total)}`;

    fs.writeFileSync(path.join(outputDirectory, 'receipt.txt'), receiptString);
  }
}
