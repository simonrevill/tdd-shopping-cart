import { DiscountPercentages, DiscountThresholds } from '../constants';
import { Item, DiscountPercentage, CurrencyService } from '../types';

export default class ShoppingCart {
  private items: Item[] = [];
  private currencyService: CurrencyService;

  constructor(currencyService: CurrencyService) {
    this.currencyService = currencyService;
  }

  private getGrossItemPrices(): number[] {
    return this.items.map(([unitPrice, quantity]) => unitPrice * quantity);
  }

  private getTotalGrossPrice(prices: number[]): number {
    return prices.reduce((previousPrice, currentPrice) => previousPrice + currentPrice);
  }

  private totalGrossValue(): number {
    const grossPricesAsNumbers = this.getGrossItemPrices();

    return this.getTotalGrossPrice(grossPricesAsNumbers);
  }

  private getDiscountedPrice(price: number): number {
    const discountPercentage: DiscountPercentage =
      price > DiscountThresholds.TWO_HUNDRED ? DiscountPercentages.TEN : DiscountPercentages.FIVE;

    return price - price * discountPercentage;
  }

  addItems(items: Item[]) {
    items.forEach((item: Item) => {
      this.items.push(item);
    });
  }

  list(): Item[] {
    return this.items;
  }

  total(): string {
    if (this.items.length === 0) {
      return this.currencyService.getZeroPriceInCurrency();
    }

    const grossPrice = this.totalGrossValue();

    const shouldApplyDiscount = [
      DiscountThresholds.ONE_HUNDRED,
      DiscountThresholds.TWO_HUNDRED,
    ].some((discountThreshold) => grossPrice > discountThreshold);

    return shouldApplyDiscount
      ? this.currencyService.format(this.getDiscountedPrice(grossPrice))
      : this.currencyService.format(this.totalGrossValue());
  }
}
