import { Item, DiscountPercentage } from '../types';

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

  applyDiscount(price: number, discountPercentage: DiscountPercentage) {
    return this.format(price - price * discountPercentage);
  }

  get totalGrossValue(): string {
    if (this._items.length === 0) {
      return '£0.00';
    }

    const grossPricesAsNumbers = this.getGrossItemPrices().map(this.removeCurrencySymbolFromPrice);

    return this.format(this.getTotalGrossPrice(grossPricesAsNumbers));
  }

  get totalNetValue(): string {
    if (this._items.length === 0) {
      return '£0.00';
    }

    const grossPrice = this.removeCurrencySymbolFromPrice(this.totalGrossValue);

    if (grossPrice > 200) {
      return this.applyDiscount(grossPrice, 0.1);
    }

    if (grossPrice > 100) {
      return this.applyDiscount(grossPrice, 0.05);
    }

    return this.totalGrossValue;
  }
}
