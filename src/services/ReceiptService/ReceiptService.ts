import {
  ICurrencyService,
  IReceiptService,
  TReceiptData,
  TReceiptServiceCreateOptions,
} from '../../types';
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
    this.textReceiptService = new TextReceiptService(this.currencyService, this.fileSystemService);
    this.jsonReceiptService = new JSONReceiptService(this.currencyService, this.fileSystemService);
  }

  create(data: TReceiptData, options: TReceiptServiceCreateOptions): void {
    const outputDirectory = this.fileSystemService.buildOutputDirectory(options.format);

    if (options.format === 'text') {
      this.textReceiptService.create(data, outputDirectory);
    }

    if (options.format === 'json') {
      this.jsonReceiptService.create(data, outputDirectory);
    }
  }
}
