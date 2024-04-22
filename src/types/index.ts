export type Item = [number, number];

export type DiscountPercentage = 0.05 | 0.1;

export type CurrencyFormatter = (value: number | bigint | string) => string;

export interface ICurrencyServiceOptions {
  locale: string;
  currency: string;
  currencySymbol: string;
}

export interface ICurrencyService extends ICurrencyServiceOptions {
  format: CurrencyFormatter;
  getZeroPriceInCurrency: () => string;
}
