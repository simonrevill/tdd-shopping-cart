import { ICurrencyServiceOptions, ICurrencyService } from '../types';

class CurrencyService implements ICurrencyService {
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

    const numberFormat = new Intl.NumberFormat(this.locale, options);

    return numberFormat.format(value);
  }

  getZeroPriceInCurrency(): string {
    return this.format(0);
  }
}

const createCurrencyService = ({
  locale,
  currency,
  currencySymbol,
}: ICurrencyServiceOptions): ICurrencyService => {
  return new CurrencyService(locale, currency, currencySymbol);
};

export default createCurrencyService;
