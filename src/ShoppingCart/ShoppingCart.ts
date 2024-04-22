import { DiscountPercentages, DiscountThresholds } from '../constants';
import { Item, DiscountPercentage, CurrencyService } from '../types';

export default class ShoppingCart {
  private items: Item[] = [];
  private currencyService: CurrencyService;

  constructor(currencyService: CurrencyService) {
    this.currencyService = currencyService;
  }

  private grossPrice(): number {
    const grossPriceList = this.items.map(([unitPrice, quantity]) => unitPrice * quantity);

    return grossPriceList.reduce((previousPrice, currentPrice) => previousPrice + currentPrice);
  }

  private getDiscountedPrice(price: number): number {
    const discountPercentage: DiscountPercentage =
      price > DiscountThresholds.TWO_HUNDRED ? DiscountPercentages.TEN : DiscountPercentages.FIVE;

    return price - price * discountPercentage;
  }

  addItems(items: Item[]) {
    this.items = items;
  }

  list(): Item[] {
    return this.items;
  }

  total(): string {
    if (this.items.length === 0) {
      return this.currencyService.getZeroPriceInCurrency();
    }

    const grossPrice = this.grossPrice();

    const shouldApplyDiscount = [
      DiscountThresholds.ONE_HUNDRED,
      DiscountThresholds.TWO_HUNDRED,
    ].some((discountThreshold) => grossPrice > discountThreshold);

    return this.currencyService.format(
      shouldApplyDiscount ? this.getDiscountedPrice(grossPrice) : grossPrice,
    );
  }
}
