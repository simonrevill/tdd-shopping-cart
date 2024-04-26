import {
  ICurrencyService,
  IReceiptService,
  TRawReceiptData,
  TReceiptFormat,
  TReceiptServiceCreateFormat,
} from '../../types';
import { FileExtensions } from '../../constants';
import FileSystemService from '../FileSystemService';
import TextReceiptService from '../TextReceiptService';
import JSONReceiptService from '../JSONReceiptService';
import HTMLReceiptService from '../HTMLReceiptService';

export default class ReceiptService implements IReceiptService {
  currencyService: ICurrencyService;
  fileSystemService: FileSystemService;
  textReceiptService: TextReceiptService;
  jsonReceiptService: JSONReceiptService;
  htmlReceiptService: HTMLReceiptService;

  constructor(currencyService: ICurrencyService) {
    this.currencyService = currencyService;
    this.fileSystemService = new FileSystemService();
    this.textReceiptService = new TextReceiptService(this.currencyService);
    this.jsonReceiptService = new JSONReceiptService(this.currencyService);
    this.htmlReceiptService = new HTMLReceiptService(this.currencyService);
  }

  writeToFile(receiptString: string, receiptFormat: TReceiptFormat): void {
    const outputDirectory = this.fileSystemService.buildOutputDirectory(receiptFormat);

    this.fileSystemService.writeToFile(
      outputDirectory,
      'receipt.' + FileExtensions[receiptFormat],
      receiptString,
    );
  }

  create(data: TRawReceiptData, format: TReceiptServiceCreateFormat): void {
    let receiptString = '';

    if (format === 'text') {
      receiptString = this.textReceiptService.create(data);
    }

    if (format === 'json') {
      receiptString = this.jsonReceiptService.create(data);
    }

    if (format === 'html') {
      receiptString = this.htmlReceiptService.create(data);
    }

    this.writeToFile(receiptString, format);
  }
}
