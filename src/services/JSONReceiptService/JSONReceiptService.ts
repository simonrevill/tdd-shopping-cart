import {
  ICurrencyService,
  IReceiptFormatService,
  TReceiptData,
  TReceiptOutputPath,
} from '../../types';
import fs from 'node:fs';
import path from 'node:path';

export default class JSONReceiptService implements IReceiptFormatService {
  currencyService: ICurrencyService;

  constructor(currencyService: ICurrencyService) {
    this.currencyService = currencyService;
  }

  create(data: TReceiptData, outputDirectory: TReceiptOutputPath): void {
    const receiptObject: Partial<TReceiptData> = {
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

    if (data.discount) {
      receiptObject.discount = {
        percentage: `${(data.discount.percentage as number) * 100}%`,
        deductedAmount: `-${this.currencyService.format(data.discount.deductedAmount)}`,
        netPrice: `${this.currencyService.format(data.discount.netPrice)}`,
      };
    }

    receiptObject.subtotal = this.currencyService.format(data.subtotal);
    receiptObject.total = this.currencyService.format(data.total);

    const receiptJSON = JSON.stringify(receiptObject);

    fs.writeFileSync(path.join(outputDirectory, 'receipt.json'), receiptJSON);
  }
}
