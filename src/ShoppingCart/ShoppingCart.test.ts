import ShoppingCart from './ShoppingCart';

describe('shopping cart', () => {
  describe('add items to cart', () => {
    it('adds a single items to the cart', () => {
      const cart = new ShoppingCart();

      cart.addItems([[10, 1]]);

      expect(cart.items).toEqual([[10, 1]]);
    });

    it('adds multiple quantities of a single item to the cart', () => {
      const cart = new ShoppingCart();

      cart.addItems([[10, 2]]);

      expect(cart.items).toEqual([[10, 2]]);
    });

    it('adds two different items with different quantities to the cart', () => {
      const cart = new ShoppingCart();

      cart.addItems([
        [10, 2],
        [20, 3],
      ]);

      expect(cart.items).toEqual([
        [10, 2],
        [20, 3],
      ]);
    });
  });

  describe('calculate gross values', () => {
    it('gets gross value for single item in the cart', () => {
      const cart = new ShoppingCart();

      cart.addItems([[10, 1]]);

      expect(cart.totalGrossValue).toBe('£10.00');
    });

    it('gets gross value of multiple single items in the cart', () => {
      const cart = new ShoppingCart();

      cart.addItems([[10, 2]]);

      expect(cart.totalGrossValue).toBe('£20.00');
    });

    it('gets gross value for two different items with different quantities in the cart', () => {
      const cart = new ShoppingCart();

      cart.addItems([
        [10, 2],
        [15, 3],
      ]);

      expect(cart.totalGrossValue).toBe('£65.00');
    });

    it('gets total gross value with unit prices of varying decimal values', () => {
      const cart = new ShoppingCart();

      cart.addItems([
        [17.09, 4],
        [14.5, 1],
        [7.22, 3],
      ]);

      expect(cart.totalGrossValue).toBe('£104.52');
    });
  });
});
