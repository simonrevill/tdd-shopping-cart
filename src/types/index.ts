export type Item = [number, number];

export type DiscountPercentage = 0.05 | 0.1;

export type CurrencyFormatterOptions = {
  locale: string;
  currency: string;
  currencySymbol: string;
};

export type CurrencyFormatter = (value: number | bigint | string) => string;

export type CurrencyFormatterService = {
  format: CurrencyFormatter;
  currencySymbol: string;
};
