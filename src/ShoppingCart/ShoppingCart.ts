import { Item, DiscountPercentage } from '../types';

export default class ShoppingCart {
  private items: Item[] = [];

  private format(value: number | bigint | string): string {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
    }).format(value);
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

  private applyDiscount(price: number, discountPercentage: DiscountPercentage) {
    return this.format(price - price * discountPercentage);
  }

  private totalGrossValue(): string {
    const grossPricesAsNumbers = this.getGrossItemPrices().map(this.removeCurrencySymbolFromPrice);

    return this.format(this.getTotalGrossPrice(grossPricesAsNumbers));
  }

  public addItems(items: Item[]) {
    items.forEach((item: Item) => {
      this.items.push(item);
    });
  }

  public list(): Item[] {
    return this.items;
  }

  public total(): string {
    if (this.items.length === 0) {
      return '£0.00';
    }

    const grossPrice = this.removeCurrencySymbolFromPrice(this.totalGrossValue());

    if (grossPrice > 200) {
      return this.applyDiscount(grossPrice, 0.1);
    }

    if (grossPrice > 100) {
      return this.applyDiscount(grossPrice, 0.05);
    }

    return this.totalGrossValue();
  }
}
