import { ICurrencyService } from '../../types';

export default class CurrencyService implements ICurrencyService {
  locale: string;
  currency: string;
  currencySymbol: string;
  currencyFormatter: Intl.NumberFormat;
  numberFormatter: Intl.NumberFormat;

  constructor(locale: string, currency: string, currencySymbol: string) {
    this.locale = locale;
    this.currency = currency;
    this.currencySymbol = currencySymbol;

    this.currencyFormatter = new Intl.NumberFormat(this.locale, {
      style: 'currency',
      currency: this.currency,
    });

    this.numberFormatter = new Intl.NumberFormat(this.locale, {
      minimumFractionDigits: 2,
    });
  }

  format(value: number | bigint | string): string {
    return this.currencyFormatter.format(value);
  }

  formatNumber(value: number | bigint | string): string {
    return this.numberFormatter.format(value);
  }

  getNilPriceInCurrency(): string {
    return this.format(0);
  }
}
