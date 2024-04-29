import { ICurrencyServiceOptions, ICurrencyService } from '../../types';
import CurrencyService from './CurrencyService';

const createCurrencyService = ({
  locale,
  currencyCode,
  currencySymbol,
}: ICurrencyServiceOptions): ICurrencyService => {
  return new CurrencyService(locale, currencyCode, currencySymbol);
};

export default createCurrencyService;
