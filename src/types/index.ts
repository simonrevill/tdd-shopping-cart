export type TItem = [number, number];

export type TDiscountPercentage = 0.05 | 0.1;

export type TCurrencyFormatter = (value: number | bigint | string) => string;

export interface ICurrencyServiceOptions {
  locale: string;
  currency: string;
  currencySymbol: string;
}

export interface ICurrencyService extends ICurrencyServiceOptions {
  format: TCurrencyFormatter;
  getZeroPriceInCurrency: () => string;
}
