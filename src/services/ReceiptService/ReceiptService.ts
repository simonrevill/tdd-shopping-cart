import {
  ICurrencyService,
  IReceiptService,
  TReceiptData,
  TReceiptServiceGeneratorOptions,
} from '../../types';
import JSONReceiptService from './JSONReceiptService';
import TextReceiptService from './TextReceiptService';

export default class ReceiptService implements IReceiptService {
  currencyService: ICurrencyService;
  textReceiptService: TextReceiptService;
  jsonReceiptService: JSONReceiptService;

  constructor(currencyService: ICurrencyService) {
    this.currencyService = currencyService;
    this.textReceiptService = new TextReceiptService(this.currencyService);
    this.jsonReceiptService = new JSONReceiptService(this.currencyService);
  }

  generate(data: TReceiptData, options: TReceiptServiceGeneratorOptions): void {
    if (options.format === 'text') {
      this.textReceiptService.generate(data);
    }

    if (options.format === 'json') {
      this.jsonReceiptService.generate(data);
    }
  }
}
