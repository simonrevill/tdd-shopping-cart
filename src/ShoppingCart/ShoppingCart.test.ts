import ShoppingCart from './ShoppingCart';

let cart: ShoppingCart;

beforeEach(() => {
  cart = new ShoppingCart();
});

describe('shopping cart', () => {
  describe('add items to cart', () => {
    it('adds a single items to the cart', () => {
      cart.addItems([[10, 1]]);

      expect(cart.items).toEqual([[10, 1]]);
    });

    it('adds multiple quantities of a single item to the cart', () => {
      cart.addItems([[10, 2]]);

      expect(cart.items).toEqual([[10, 2]]);
    });

    it('adds two different items with different quantities to the cart', () => {
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
      cart.addItems([[10, 1]]);

      expect(cart.totalGrossValue).toBe('£10.00');
    });

    it('gets gross value of multiple single items in the cart', () => {
      cart.addItems([[10, 2]]);

      expect(cart.totalGrossValue).toBe('£20.00');
    });

    it('gets gross value for two different items with different quantities in the cart', () => {
      cart.addItems([
        [10, 2],
        [15, 3],
      ]);

      expect(cart.totalGrossValue).toBe('£65.00');
    });

    it('gets total gross value with unit prices of varying decimal values', () => {
      cart.addItems([
        [17.09, 4],
        [14.5, 1],
        [7.22, 3],
      ]);

      expect(cart.totalGrossValue).toBe('£104.52');
    });
  });

  describe('calculate net value', () => {
    it('gets total net value', () => {
      cart.addItems([
        [10, 2],
        [15, 3],
      ]);

      expect(cart.totalNetValue).toBe('£65.00');
    });

    it('applies a 5% discount if total gross value is over £100', () => {
      cart.addItems([
        [50, 2],
        [10, 1],
      ]);

      expect(cart.totalNetValue).toBe('£104.50');
    });

    it('applies a 10% discount if total gross value is over £200', () => {
      cart.addItems([
        [50, 4],
        [10, 1],
      ]);

      expect(cart.totalNetValue).toBe('£189.00');
    });
  });
});
