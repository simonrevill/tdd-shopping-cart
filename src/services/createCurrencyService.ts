import { CurrencyServiceOptions, CurrencyService } from '../types';

const createCurrencyService = ({
  locale,
  currency,
  currencySymbol,
}: CurrencyServiceOptions): CurrencyService => ({
  format: new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format,
  currencySymbol,
  removeCurrencySymbolFromPrice(price: string) {
    return parseFloat(price.replace(currencySymbol, ''));
  },
  getZeroPriceInCurrency() {
    return this.format(0);
  },
});

export default createCurrencyService;
