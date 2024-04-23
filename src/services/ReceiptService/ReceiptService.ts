import {
  ICurrencyService,
  IReceiptService,
  TReceiptData,
  TReceiptServiceGeneratorOptions,
} from '../../types';
import TextReceiptService from './TextReceiptService';

export default class ReceiptService implements IReceiptService {
  currencyService: ICurrencyService;
  textReceiptService: TextReceiptService;

  constructor(currencyService: ICurrencyService) {
    this.currencyService = currencyService;
    this.textReceiptService = new TextReceiptService(this.currencyService);
  }

  generate(data: TReceiptData, options: TReceiptServiceGeneratorOptions): void {
    if (options.format === 'text') {
      this.textReceiptService.generate(data);
    }
  }
}
