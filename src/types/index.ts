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

type BaseReceiptItem<T> = {
  unitPrice: T;
  quantity: T;
  grossPrice: T;
};

type BaseReceiptDiscountData<T> = {
  percentage: T;
  deductedAmount: T;
  netPrice: T;
};

type BaseReceiptData<T> = {
  items: BaseReceiptItem<T>[];
  discount?: BaseReceiptDiscountData<T>;
  subtotal: T;
  total: T;
};

export type TRawReceiptItem = BaseReceiptItem<number>;

export type TReceiptItem = BaseReceiptItem<string>;

export type TRawReceiptDiscountData = BaseReceiptDiscountData<number>;

export type TReceiptDiscountData = BaseReceiptDiscountData<string>;

export type TRawReceiptData = BaseReceiptData<number>;

export type TReceiptData = BaseReceiptData<string>;
