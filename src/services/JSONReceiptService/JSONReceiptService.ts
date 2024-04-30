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

  create({ items, subtotal, total, discount }: TRawReceiptData): string {
    const receiptObject: TReceiptData = {
      items: items.map(({ id, name, unitPrice, description, quantity, grossPrice }) => ({
        id,
        name,
        unitPrice: this.currencyService.format(unitPrice),
        description,
        quantity: quantity.toString(),
        grossPrice: this.currencyService.format(grossPrice),
      })),
      ...(discount && {
        discount: {
          percentage: (discount.percentage as number) * 100 + '%',
          deductedAmount: '-' + this.currencyService.format(discount.deductedAmount),
          netPrice: this.currencyService.format(discount.netPrice),
        },
      }),
      subtotal: this.currencyService.format(subtotal),
      total: this.currencyService.format(total),
    };

    const receiptJSON = JSON.stringify(receiptObject);

    return receiptJSON;
  }
}
