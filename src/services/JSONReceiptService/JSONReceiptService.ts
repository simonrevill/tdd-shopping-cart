import {
  ICurrencyService,
  IReceiptFormatService,
  TRawReceiptData,
  TReceiptData,
} from '../../types';

export default class JSONReceiptService implements IReceiptFormatService {
  currencyService: ICurrencyService;

  constructor(currencyService: ICurrencyService) {
    this.currencyService = currencyService;
  }

  create(data: TRawReceiptData): string {
    const receiptObject: TReceiptData = {
      items: data.items.map((item) => {
        return {
          unitPrice: this.currencyService.format(item.unitPrice),
          quantity: item.quantity.toString(),
          grossPrice: this.currencyService.format(item.grossPrice),
        };
      }),
      ...(data.discount && {
        discount: {
          percentage: (data.discount.percentage as number) * 100 + '%',
          deductedAmount: '-' + this.currencyService.format(data.discount.deductedAmount),
          netPrice: this.currencyService.format(data.discount.netPrice),
        },
      }),
      subtotal: this.currencyService.format(data.subtotal),
      total: this.currencyService.format(data.total),
    };

    const receiptJSON = JSON.stringify(receiptObject);

    return receiptJSON;
  }
}
