import { ICurrencyService } from '../../types';

export default class CurrencyService implements ICurrencyService {
  locale: string;
  currency: string;
  currencySymbol: string;

  constructor(locale: string, currency: string, currencySymbol: string) {
    this.locale = locale;
    this.currency = currency;
    this.currencySymbol = currencySymbol;
  }

  format(value: number | bigint | string): string {
    const options: Intl.NumberFormatOptions = {
      style: 'currency',
      currency: this.currency,
    };

    const currencyFormat = new Intl.NumberFormat(this.locale, options);

    return currencyFormat.format(value);
  }

  formatNumber(value: number | bigint | string): string {
    const options: Intl.NumberFormatOptions = {
      minimumFractionDigits: 2,
    };
    const numberFormat = new Intl.NumberFormat(this.locale, options);

    return numberFormat.format(value);
  }

  getZeroPriceInCurrency(): string {
    return this.format(0);
  }
}
