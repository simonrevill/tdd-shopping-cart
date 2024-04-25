import {
  ICurrencyService,
  IFileSystemService,
  IReceiptFormatService,
  TReceiptData,
  TReceiptOutputPath,
} from '../../types';

export default class JSONReceiptService implements IReceiptFormatService {
  currencyService: ICurrencyService;
  fileSystemService: IFileSystemService;

  constructor(currencyService: ICurrencyService, fileSystemService: IFileSystemService) {
    this.currencyService = currencyService;
    this.fileSystemService = fileSystemService;
  }

  create(data: TReceiptData, outputDirectory: TReceiptOutputPath): void {
    const receiptObject: Partial<TReceiptData> = {
      items: data.items.map((item) => {
        return {
          unitPrice: this.currencyService.format(item.unitPrice),
          quantity: item.quantity.toString(),
          grossPrice: this.currencyService.format(item.grossPrice),
        };
      }),
    };

    if (data.discount) {
      receiptObject.discount = {
        percentage: (data.discount.percentage as number) * 100 + '%',
        deductedAmount: '-' + this.currencyService.format(data.discount.deductedAmount),
        netPrice: this.currencyService.format(data.discount.netPrice),
      };
    }

    receiptObject.subtotal = this.currencyService.format(data.subtotal);
    receiptObject.total = this.currencyService.format(data.total);

    const receiptJSON = JSON.stringify(receiptObject);

    this.fileSystemService.writeToFile(outputDirectory, 'receipt.json', receiptJSON);
  }
}
