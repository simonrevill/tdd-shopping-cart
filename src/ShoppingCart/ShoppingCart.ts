import { DISCOUNT_PERCENTAGES } from '../constants';
import { Item, DiscountPercentage, CurrencyFormatter } from '../types';

export default class ShoppingCart {
  private items: Item[] = [];
  private format: CurrencyFormatter;

  constructor(currencyFormatter: CurrencyFormatter) {
    this.format = currencyFormatter;
  }

  private getGrossItemPrices(): string[] {
    return this.items.map(([unitPrice, quantity]) => this.format(unitPrice * quantity));
  }

  private removeCurrencySymbolFromPrice(price: string) {
    return parseFloat(price.replace('£', ''));
  }

  private getTotalGrossPrice(prices: number[]): number {
    return prices.reduce((previousPrice, currentPrice) => previousPrice + currentPrice);
  }

  private totalGrossValue(): string {
    const grossPricesAsNumbers = this.getGrossItemPrices().map(this.removeCurrencySymbolFromPrice);

    return this.format(this.getTotalGrossPrice(grossPricesAsNumbers));
  }

  private getDiscountedPrice(price: number, discountPercentage: DiscountPercentage): string {
    return this.format(price - price * discountPercentage);
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
      return '£0.00';
    }

    const grossPrice = this.removeCurrencySymbolFromPrice(this.totalGrossValue());

    if (grossPrice > 100) {
      return this.getDiscountedPrice(
        grossPrice,
        grossPrice > 200 ? DISCOUNT_PERCENTAGES.TEN_PERCENT : DISCOUNT_PERCENTAGES.FIVE_PERCENT,
      );
    }

    return this.totalGrossValue();
  }
}
