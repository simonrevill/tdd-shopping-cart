import { ICurrencyService, IReceiptService } from '../types';
import { createCurrencyService, createReceiptService } from '../services';
import ShoppingCart from './ShoppingCart';
import fs from 'node:fs';
import path from 'node:path';

let cart: ShoppingCart;
let currencyService: ICurrencyService;
let receiptService: IReceiptService;

const currencies = [
  { locale: 'en-GB', currency: 'GBP', currencySymbol: '£', currencyName: 'Great British Pound' },
  { locale: 'en-US', currency: 'USD', currencySymbol: '$', currencyName: 'US Dollar' },
];

describe.each(currencies)(
  'shopping cart with $currency as currency',
  ({ locale, currency, currencySymbol }) => {
    beforeEach(() => {
      currencyService = createCurrencyService({
        locale,
        currency,
        currencySymbol,
      });

      receiptService = createReceiptService(currencyService);

      cart = new ShoppingCart(currencyService, receiptService);
    });

    afterEach(() => {
      fs.rmSync(path.join(process.cwd(), 'receipts'), { recursive: true, force: true });
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

      it(`only applies a 5% discount (not 10%) if total gross value is equal to ${currencySymbol}200`, () => {
        cart.addItems([[50, 4]]);

        expect(cart.total()).toBe(`${currencySymbol}190.00`);
      });
    });

    describe(`generate receipts with ${currency} as currency`, () => {
      describe('write receipt to text file', () => {
        it('throws an error when attempting to generate a receipt with an empty cart', () => {
          expect(() => {
            cart.generateReceipt();
          }).toThrow('Cannot generate text receipt. Cart is empty!');
        });

        it('writes a receipt to a text file with no discount', () => {
          cart.addItems([
            [50, 1],
            [25, 2],
          ]);

          cart.generateReceipt();

          const receiptsFolder = path.join(process.cwd(), 'receipts/text');

          const receipt = fs
            .readFileSync(path.join(receiptsFolder, 'receipt.txt'), 'utf-8')
            .split(/\n/g);

          expect(receipt[0]).toBe('Your receipt');
          expect(receipt[1]).toBe('');
          expect(receipt[2]).toBe(`1. 50.00 x 1 - ${currencySymbol}50.00`);
          expect(receipt[3]).toBe(`2. 25.00 x 2 - ${currencySymbol}50.00`);
          expect(receipt[4]).toBe('');
          expect(receipt[5]).toBe(`Subtotal: ${currencySymbol}100.00`);
          expect(receipt[6]).toBe('');
          expect(receipt[7]).toBe(`Total: ${currencySymbol}100.00`);
        });
      });
    });
  },
);
