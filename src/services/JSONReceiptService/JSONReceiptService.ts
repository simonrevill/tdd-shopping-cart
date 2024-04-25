import { ICurrencyService, IReceiptFormatService, TReceiptData } from '../../types';

export default class JSONReceiptService implements IReceiptFormatService {
  currencyService: ICurrencyService;

  constructor(currencyService: ICurrencyService) {
    this.currencyService = currencyService;
  }

  create(data: TReceiptData): string {
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

    return receiptJSON;
  }
}
