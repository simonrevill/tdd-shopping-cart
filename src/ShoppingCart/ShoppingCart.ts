import { Item } from '../types';

export default class ShoppingCart {
  _items: Item[];

  constructor() {
    this._items = [];
  }

  get items(): Item[] {
    return this._items;
  }

  addItems(items: Item[]) {
    items.forEach((item: Item) => {
      this._items.push(item);
    });
  }

  format(value: number | bigint | string): string {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
    }).format(value);
  }

  getGrossItemPrices(): string[] {
    return this._items.map(([unitPrice, quantity]) => this.format(unitPrice * quantity));
  }

  removeCurrencySymbolFromPrice(price: string) {
    return parseFloat(price.replace('£', ''));
  }

  getTotalGrossPrice(prices: number[]): number {
    return prices.reduce((previousPrice, currentPrice) => previousPrice + currentPrice);
  }

  get totalGrossValue(): string {
    const grossPricesAsNumbers = this.getGrossItemPrices().map(this.removeCurrencySymbolFromPrice);

    return this.format(this.getTotalGrossPrice(grossPricesAsNumbers));
  }

  get totalNetValue(): string {
    const grossPrice = this.removeCurrencySymbolFromPrice(this.totalGrossValue);

    if (grossPrice > 100) {
      return this.format(grossPrice - grossPrice * 0.05);
    }

    return this.totalGrossValue;
  }
}
