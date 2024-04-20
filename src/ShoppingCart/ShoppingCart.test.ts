import { CurrencyFormatterOptions, CurrencyService } from '../types';
import { createCurrencyService } from '../services';
import ShoppingCart from './ShoppingCart';

let cart: ShoppingCart;
let currencyService: CurrencyService;

const currencies = [
  { locale: 'en-GB', currency: 'GBP', currencySymbol: '£', currencyName: 'Great British Pound' },
  { locale: 'en-US', currency: 'USD', currencySymbol: '$', currencyName: 'US Dollar' },
];

describe.each(currencies)(
  'shopping cart with $currency as currency',
  ({ locale, currency, currencySymbol }: CurrencyFormatterOptions) => {
    beforeEach(() => {
      currencyService = createCurrencyService({
        locale,
        currency,
        currencySymbol,
      });

      cart = new ShoppingCart(currencyService);
    });

    describe('add items to cart', () => {
      it('adds a single items to the cart', () => {
        cart.addItems([[10, 1]]);

        expect(cart.list()).toEqual([[10, 1]]);
      });

      it('adds multiple quantities of a single item to the cart', () => {
        cart.addItems([[10, 2]]);

        expect(cart.list()).toEqual([[10, 2]]);
      });

      it('adds two different items with different quantities to the cart', () => {
        cart.addItems([
          [10, 2],
          [20, 3],
        ]);

        expect(cart.list()).toEqual([
          [10, 2],
          [20, 3],
        ]);
      });
    });

    describe('calculate gross values', () => {
      it(`gets '${currencySymbol}0.00' as gross value if cart is empty`, () => {
        expect(cart.total()).toBe(`${currencySymbol}0.00`);
      });

      it('gets gross value for single item in the cart', () => {
        cart.addItems([[10, 1]]);

        expect(cart.total()).toBe(`${currencySymbol}10.00`);
      });

      it('gets gross value of multiple single items in the cart', () => {
        cart.addItems([[10, 2]]);

        expect(cart.total()).toBe(`${currencySymbol}20.00`);
      });

      it('gets gross value for two different items with different quantities in the cart', () => {
        cart.addItems([
          [10, 2],
          [15, 3],
        ]);

        expect(cart.total()).toBe(`${currencySymbol}65.00`);
      });

      it('gets total gross value with unit prices of varying decimal values', () => {
        cart.addItems([
          [17.09, 2],
          [14.5, 3],
          [7.22, 2],
        ]);

        expect(cart.total()).toBe(`${currencySymbol}92.12`);
      });
    });

    describe('calculate net value', () => {
      it(`gets '${currencySymbol}0.00' as net value if cart is empty`, () => {
        expect(cart.total()).toBe(`${currencySymbol}0.00`);
      });

      it('gets total net value', () => {
        cart.addItems([
          [10, 2],
          [15, 3],
        ]);

        expect(cart.total()).toBe(`${currencySymbol}65.00`);
      });

      it(`applies a 5% discount if total gross value is over ${currencySymbol}100`, () => {
        cart.addItems([
          [50, 2],
          [10, 1],
        ]);

        expect(cart.total()).toBe(`${currencySymbol}104.50`);
      });

      it(`does not apply a 5% discount if total gross value is equal to ${currencySymbol}100`, () => {
        cart.addItems([[50, 2]]);

        expect(cart.total()).toBe(`${currencySymbol}100.00`);
      });

      it(`applies a 10% discount if total gross value is over ${currencySymbol}200`, () => {
        cart.addItems([
          [50, 4],
          [10, 1],
        ]);

        expect(cart.total()).toBe(`${currencySymbol}189.00`);
      });
    });
  },
);
