import { ICurrencyServiceOptions, ICurrencyService } from '../../types';
import CurrencyService from './CurrencyService';

const createCurrencyService = ({
  locale,
  currency,
  currencySymbol,
}: ICurrencyServiceOptions): ICurrencyService => {
  return new CurrencyService(locale, currency, currencySymbol);
};

export default createCurrencyService;
