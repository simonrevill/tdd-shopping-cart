import ShoppingCart from './ShoppingCart';

describe('shopping cart', () => {
  describe('add items to cart', () => {
    it('adds a single items to the cart', () => {
      const cart = new ShoppingCart();

      cart.addItem([10]);

      expect(cart.items).toEqual([[10]]);
    });
  });
});
