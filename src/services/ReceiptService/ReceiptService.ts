import {
  ICurrencyService,
  IReceiptService,
  TReceiptData,
  TReceiptFormat,
  TReceiptServiceCreateOptions,
} from '../../types';
import { FileExtensions } from '../../constants';
import FileSystemService from '../FileSystemService/FileSystemService/FileSystemService';
import TextReceiptService from '../TextReceiptService';
import JSONReceiptService from '../JSONReceiptService';

export default class ReceiptService implements IReceiptService {
  currencyService: ICurrencyService;
  fileSystemService: FileSystemService;
  textReceiptService: TextReceiptService;
  jsonReceiptService: JSONReceiptService;

  constructor(currencyService: ICurrencyService) {
    this.currencyService = currencyService;
    this.fileSystemService = new FileSystemService();
    this.textReceiptService = new TextReceiptService(this.currencyService);
    this.jsonReceiptService = new JSONReceiptService(this.currencyService);
  }

  writeToFile(receiptString: string, receiptFormat: TReceiptFormat): void {
    const outputDirectory = this.fileSystemService.buildOutputDirectory(receiptFormat);

    this.fileSystemService.writeToFile(
      outputDirectory,
      'receipt.' + FileExtensions[receiptFormat],
      receiptString,
    );
  }

  create(data: TReceiptData, options: TReceiptServiceCreateOptions): void {
    let receiptString = '';

    if (options.format === 'text') {
      receiptString = this.textReceiptService.create(data);
    }

    if (options.format === 'json') {
      receiptString = this.jsonReceiptService.create(data);
    }

    this.writeToFile(receiptString, options.format);
  }
}
