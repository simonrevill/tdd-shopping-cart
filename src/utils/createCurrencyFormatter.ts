import { CurrencyFormatterOptions, CurrencyFormatterService } from '../types';

const createCurrencyFormatterService = ({
  locale,
  currency,
  currencySymbol,
}: CurrencyFormatterOptions): CurrencyFormatterService => ({
  format: new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format,
  currencySymbol,
});

export default createCurrencyFormatterService;
