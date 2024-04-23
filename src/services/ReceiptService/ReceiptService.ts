import { ICurrencyService, IReceiptService, TReceiptData } from '../../types';
import fs from 'node:fs';
import path from 'node:path';

export default class ReceiptService implements IReceiptService {
  currencyService: ICurrencyService;

  constructor(currencyService: ICurrencyService) {
    this.currencyService = currencyService;
  }

  generate(data: TReceiptData): void {
    const rootDirectory = process.cwd();
    const receiptsDirectory = path.join(rootDirectory, 'receipts');

    if (!fs.existsSync(receiptsDirectory)) {
      fs.mkdirSync(receiptsDirectory);
    }

    const receiptsTextFolder = path.join(rootDirectory, 'receipts/text');

    if (!fs.existsSync(receiptsTextFolder)) {
      fs.mkdirSync(receiptsTextFolder);
    }

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
      receiptString += `${data.discount.percentage * 100}% Discount: -${this.currencyService.format(
        data.discount.deductedAmount,
      )}\n\n`;
    }

    receiptString += `Total: ${this.currencyService.format(data.total)}`;

    fs.writeFileSync(path.join(receiptsTextFolder, 'receipt.txt'), receiptString);
  }
}
