import {
  ICurrencyService,
  IReceiptService,
  TReceiptData,
  TReceiptOutputDirectory,
  TReceiptOutputPath,
  TReceiptServiceCreateOptions,
} from '../../types';
import JSONReceiptService from '../JSONReceiptService';
import TextReceiptService from '../TextReceiptService';
import fs from 'node:fs';
import path from 'node:path';

export default class ReceiptService implements IReceiptService {
  currencyService: ICurrencyService;
  textReceiptService: TextReceiptService;
  jsonReceiptService: JSONReceiptService;

  constructor(currencyService: ICurrencyService) {
    this.currencyService = currencyService;
    this.textReceiptService = new TextReceiptService(this.currencyService);
    this.jsonReceiptService = new JSONReceiptService(this.currencyService);
  }

  buildOutputDirectory(outputDirectoryName: TReceiptOutputDirectory): TReceiptOutputPath {
    const rootDirectory = process.cwd();
    const receiptsDirectory = path.join(rootDirectory, 'receipts');

    if (!fs.existsSync(receiptsDirectory)) {
      fs.mkdirSync(receiptsDirectory);
    }

    const outputDirectory = path.join(
      rootDirectory,
      `receipts/${outputDirectoryName}`,
    ) as TReceiptOutputPath;

    if (!fs.existsSync(outputDirectory)) {
      fs.mkdirSync(outputDirectory);
    }

    return outputDirectory;
  }

  create(data: TReceiptData, options: TReceiptServiceCreateOptions): void {
    const outputDirectory = this.buildOutputDirectory(options.format);

    if (options.format === 'text') {
      this.textReceiptService.create(data, outputDirectory);
    }

    if (options.format === 'json') {
      this.jsonReceiptService.create(data, outputDirectory);
    }
  }
}
