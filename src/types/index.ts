export type TItem = [number, number];

export type TDiscountPercentage = 0.05 | 0.1;

export type TCurrencyFormatter = (value: number | bigint | string) => string;

export type TNumberFormatter = TCurrencyFormatter;
export interface ICurrencyServiceOptions {
  locale: string;
  currency: string;
  currencySymbol: string;
}

export interface ICurrencyService extends ICurrencyServiceOptions {
  format: TCurrencyFormatter;
  formatNumber: TNumberFormatter;
  getZeroPriceInCurrency: () => string;
}

export interface IFileSystemService {
  buildOutputDirectory: (outputDirectoryName: TReceiptOutputDirectory) => string;
  writeToFile: (outputDirectory: TReceiptOutputPath, fileName: string, data: string) => void;
}

export type TReceiptFormat = 'text' | 'json' | 'html';

export type TReceiptOutputDirectory = TReceiptFormat;

export type TReceiptOutputPath = `receipts/${TReceiptOutputDirectory}`;

export type TReceiptServiceCreateOptions = {
  format: TReceiptFormat;
};

export interface IReceiptService {
  writeToFile: (receiptString: string, receiptFormat: TReceiptFormat) => void;
  create: (data: TReceiptData, options: TReceiptServiceCreateOptions) => void;
}

export interface IReceiptFormatService {
  currencyService: ICurrencyService;
  create: (data: TReceiptData, outputDirectory: TReceiptOutputPath) => void;
}

export type TDiscount = {
  percentage: number;
  deductedAmount: number;
  netPrice: number;
};

export type TReceiptItem = {
  unitPrice: number | string;
  quantity: number | string;
  grossPrice: number | string;
};

export type TReceiptData = {
  items: TReceiptItem[];
  subtotal: number | string;
  discount?: {
    percentage: number | string;
    deductedAmount: number | string;
    netPrice: number | string;
  };
  total: number | string;
};
