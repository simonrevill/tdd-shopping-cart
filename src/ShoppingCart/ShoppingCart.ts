import { Item } from '../types';

export default class ShoppingCart {
  _items: Item[];

  constructor() {
    this._items = [];
  }

  get items(): Item[] {
    return this._items;
  }

  addItem(item: Item) {
    this._items.push(item);
  }
}
