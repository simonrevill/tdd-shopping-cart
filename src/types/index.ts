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
  getNilPriceInCurrency: () => string;
}

export interface IFileSystemService {
  buildOutputDirectory: (outputDirectoryName: TReceiptOutputDirectory) => string;
  writeToFile: (outputDirectory: TReceiptOutputPath, fileName: string, data: string) => void;
}

export type TReceiptFormat = 'text' | 'json' | 'html';

export type TReceiptOutputDirectory = TReceiptFormat;

export type TReceiptOutputPath = `receipts/${TReceiptOutputDirectory}`;

export type TReceiptServiceCreateFormat = TReceiptFormat;

export interface IReceiptService {
  writeToFile: (receiptString: string, receiptFormat: TReceiptFormat) => void;
  create: (data: TRawReceiptData, format: TReceiptServiceCreateFormat) => void;
}

export interface IReceiptFormatService {
  currencyService: ICurrencyService;
  create: (data: TRawReceiptData) => string;
}

export type TDiscount = {
  percentage: number;
  deductedAmount: number;
  netPrice: number;
};

export type TRawReceiptItem = {
  unitPrice: number;
  quantity: number;
  grossPrice: number;
};

export type TReceiptItem = {
  unitPrice: string;
  quantity: string;
  grossPrice: string;
};

export type TRawReceiptDiscountData = {
  percentage: number;
  deductedAmount: number;
  netPrice: number;
};

export type TRawReceiptData = {
  items: TRawReceiptItem[];
  discount?: TRawReceiptDiscountData;
  subtotal: number;
  total: number;
};

export type TReceiptDiscountData = {
  percentage: string;
  deductedAmount: string;
  netPrice: string;
};

export type TReceiptData = {
  items: TReceiptItem[];
  discount?: TReceiptDiscountData;
  subtotal: number | string;
  total: number | string;
};
