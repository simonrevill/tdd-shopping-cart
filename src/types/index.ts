export type TProduct = {
  id: string;
  name: string;
  unitPrice: number;
  description: string;
};

export type TShoppingCartItem = [TProduct, number];

export type TDiscountPercentage = 0.05 | 0.1;

export type TCurrency = {
  locale: string;
  currencyCode: string;
  currencySymbol: string;
  currencyName: string;
};

export type TCurrencyFormatter = (value: number | bigint | string) => string;

export type TNumberFormatter = TCurrencyFormatter;

export interface ICurrencyServiceOptions {
  locale: string;
  currencyCode: string;
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

type TBaseReceiptItem<T> = {
  id: string;
  name: string;
  unitPrice: T;
  description: string;
  quantity: T;
  grossPrice: T;
};

type TBaseReceiptDiscountData<T> = {
  percentage: T;
  deductedAmount: T;
  netPrice: T;
};

type TBaseReceiptData<T> = {
  items: TBaseReceiptItem<T>[];
  discount?: TBaseReceiptDiscountData<T>;
  subtotal: T;
  total: T;
};

export type TRawReceiptItem = TBaseReceiptItem<number>;

export type TReceiptItem = TBaseReceiptItem<string>;

export type TRawReceiptDiscountData = TBaseReceiptDiscountData<number>;

export type TReceiptDiscountData = TBaseReceiptDiscountData<string>;

export type TRawReceiptData = TBaseReceiptData<number>;

export type TReceiptData = TBaseReceiptData<string>;
