import { ICurrencyService, IReceiptService, TReceiptData } from '../../types';
import fs from 'node:fs';
import path from 'node:path';

export default class JSONReceiptService implements IReceiptService {
  currencyService: ICurrencyService;

  constructor(currencyService: ICurrencyService) {
    this.currencyService = currencyService;
  }

  create(data: TReceiptData): void {
    const rootDirectory = process.cwd();
    const receiptsDirectory = path.join(rootDirectory, 'receipts');

    if (!fs.existsSync(receiptsDirectory)) {
      fs.mkdirSync(receiptsDirectory);
    }

    const receiptsJSONFolder = path.join(rootDirectory, 'receipts/json');

    if (!fs.existsSync(receiptsJSONFolder)) {
      fs.mkdirSync(receiptsJSONFolder);
    }

    const receiptObject = {
      items: data.items.map((item) => {
        return {
          unitPrice: this.currencyService.format(item.unitPrice),
          quantity: `${item.quantity}`,
          grossPrice: this.currencyService.format(item.grossPrice),
        };
      }),
      subtotal: this.currencyService.format(data.subtotal),
      total: this.currencyService.format(data.total),
    };

    const receiptJSON = JSON.stringify(receiptObject);

    console.log('receiptJson: ', receiptJSON);

    fs.writeFileSync(path.join(receiptsJSONFolder, 'receipt.json'), receiptJSON);
  }
}
