export type Item = [number, number];

export type DiscountPercentage = 0.05 | 0.1;

export type CurrencyFormatter = (value: number | bigint | string) => string;

export type CurrencyServiceOptions = {
  locale: string;
  currency: string;
  currencySymbol: string;
};

export type CurrencyService = {
  format: CurrencyFormatter;
  currencySymbol: string;
  getZeroPriceInCurrency: () => string;
};
