import { CurrencyFormatterOptions, CurrencyService } from '../types';

const createCurrencyService = ({
  locale,
  currency,
  currencySymbol,
}: CurrencyFormatterOptions): CurrencyService => ({
  format: new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format,
  currencySymbol,
});

export default createCurrencyService;
