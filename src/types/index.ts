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

export type TReceiptFormat = 'text' | 'json' | 'html';

export type TReceiptServiceCreateOptions = {
  format: TReceiptFormat;
};

export interface IReceiptService {
  create: (data: TReceiptData, options: TReceiptServiceCreateOptions) => void;
}

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
