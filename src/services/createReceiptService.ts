import { ICurrencyService, IReceiptService } from '../types';
import ReceiptService from './ReceiptService';

const createReceiptService = (currencyService: ICurrencyService): IReceiptService => {
  return new ReceiptService(currencyService);
};

export default createReceiptService;
