export default class ShoppingCart {
  _items: [number][];

  constructor() {
    this._items = [];
  }

  get items(): [number][] {
    return this._items;
  }

  addItem(item: [number]) {
    this._items.push(item);
  }
}
