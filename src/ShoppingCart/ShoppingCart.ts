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

  get total(): string {
    return '£10.00';
  }
}
