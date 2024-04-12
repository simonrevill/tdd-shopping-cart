import ShoppingCart from './ShoppingCart';

describe('shopping cart', () => {
  describe('add items to cart', () => {
    it('adds a single items to the cart', () => {
      const cart = new ShoppingCart();

      cart.addItem([10, 1]);

      expect(cart.items).toEqual([[10, 1]]);
    });

    it('adds multiple quantities of a single item to the cart', () => {
      const cart = new ShoppingCart();

      cart.addItem([10, 2]);

      expect(cart.items).toEqual([[10, 2]]);
    });

    it('adds two different items with different quantities to the cart', () => {
      const cart = new ShoppingCart();

      cart.addItem([10, 2]);
      cart.addItem([20, 3]);

      expect(cart.items).toEqual([
        [10, 2],
        [20, 3],
      ]);
    });
  });
});
