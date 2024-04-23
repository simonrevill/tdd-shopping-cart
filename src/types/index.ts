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

export interface IReceiptService {
  generate: (data: TReceiptData) => void;
}

export type TReceiptItem = {
  unitPrice: number;
  quantity: number;
  grossPrice: number;
};

export type TReceiptData = {
  items: TReceiptItem[];
  subtotal: number;
  total: number;
};
