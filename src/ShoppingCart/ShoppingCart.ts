import { DiscountPercentages, DiscountThresholds } from '../constants';
import { Item, DiscountPercentage, CurrencyService } from '../types';

export default class ShoppingCart {
  private items: Item[] = [];
  private currencyService: CurrencyService;

  constructor(currencyService: CurrencyService) {
    this.currencyService = currencyService;
  }

  private getGrossItemPrices(): string[] {
    return this.items.map(([unitPrice, quantity]) =>
      this.currencyService.format(unitPrice * quantity),
    );
  }

  private getTotalGrossPrice(prices: number[]): number {
    return prices.reduce((previousPrice, currentPrice) => previousPrice + currentPrice);
  }

  private totalGrossValue(): string {
    const grossPricesAsNumbers = this.getGrossItemPrices().map(
      this.currencyService.removeCurrencySymbolFromPrice,
    );

    return this.currencyService.format(this.getTotalGrossPrice(grossPricesAsNumbers));
  }

  private getDiscountedPrice(price: number): string {
    const discountPercentage: DiscountPercentage =
      price > DiscountThresholds.TWO_HUNDRED ? DiscountPercentages.TEN : DiscountPercentages.FIVE;

    return this.currencyService.format(price - price * discountPercentage);
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

    const grossPrice = this.currencyService.removeCurrencySymbolFromPrice(this.totalGrossValue());

    const shouldApplyDiscount = [
      DiscountThresholds.ONE_HUNDRED,
      DiscountThresholds.TWO_HUNDRED,
    ].some((discountThreshold) => grossPrice > discountThreshold);

    return shouldApplyDiscount ? this.getDiscountedPrice(grossPrice) : this.totalGrossValue();
  }
}
