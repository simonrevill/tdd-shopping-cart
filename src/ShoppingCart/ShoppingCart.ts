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

  get total(): string {
    const itemTotals = this._items.map(([unitPrice, quantity]) => {
      return this.format(unitPrice * quantity);
    });

    return itemTotals[0];
  }
}
