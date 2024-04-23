import { DiscountPercentages, DiscountThresholds } from '../constants';
import { TItem, TDiscountPercentage, ICurrencyService } from '../types';

export default class ShoppingCart {
  private items: TItem[] = [];
  private currencyService: ICurrencyService;

  constructor(currencyService: ICurrencyService) {
    this.currencyService = currencyService;
  }

  private grossPrice(): number {
    const grossPriceList = this.items.map(([unitPrice, quantity]) => unitPrice * quantity);

    return grossPriceList.reduce((previousPrice, currentPrice) => previousPrice + currentPrice);
  }

  private discountedPrice(price: number): number {
    const discountPercentage: TDiscountPercentage =
      price > DiscountThresholds.TWO_HUNDRED ? DiscountPercentages.TEN : DiscountPercentages.FIVE;

    return price - price * discountPercentage;
  }

  addItems(items: TItem[]): void {
    this.items = items;
  }

  list(): TItem[] {
    return this.items;
  }

  total(): string {
    if (!this.items.length) {
      return this.currencyService.getZeroPriceInCurrency();
    }

    const grossPrice = this.grossPrice();

    const shouldApplyDiscount = [
      DiscountThresholds.ONE_HUNDRED,
      DiscountThresholds.TWO_HUNDRED,
    ].some((discountThreshold) => grossPrice > discountThreshold);

    return this.currencyService.format(
      shouldApplyDiscount ? this.discountedPrice(grossPrice) : grossPrice,
    );
  }

  generateReceipt() {
    if (!this.items.length) {
      throw new Error('Cannot generate text receipt. Cart is empty!');
    }
  }
}
