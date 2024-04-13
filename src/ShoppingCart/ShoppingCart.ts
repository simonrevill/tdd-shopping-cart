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

  removeCurrencySymbolFromPrice(grossItemPrice: string) {
    return parseFloat(grossItemPrice.replace('£', ''));
  }

  getTotalGrossPrice(grossPrices: number[]): number {
    return grossPrices.reduce((previousPrice, currentPrice) => previousPrice + currentPrice);
  }

  get totalGrossValue(): string {
    const grossItemsPricesAsNumbers = this.getGrossItemPrices().map(
      this.removeCurrencySymbolFromPrice,
    );

    return this.format(this.getTotalGrossPrice(grossItemsPricesAsNumbers));
  }
}
