import ShoppingCart from '../src/ShoppingCart/ShoppingCart';
import { ICurrencyService, IReceiptService } from '../src/types';
import { createCurrencyService, createReceiptService } from '../src/services';
import {
  deleteReceiptsDirectory,
  readGeneratedReceipt,
  currencies,
  PRODUCT_DATA,
} from './test-utils';

let cart: ShoppingCart;
let currencyService: ICurrencyService;
let receiptService: IReceiptService;

describe.each(currencies)(
  'shopping cart with $currencyName ($currencyCode) as currency',
  ({ locale, currencyCode, currencySymbol, currencyName }) => {
    beforeEach(() => {
      currencyService = createCurrencyService({
        locale,
        currencyCode,
        currencySymbol,
      });

      receiptService = createReceiptService(currencyService);

      cart = new ShoppingCart(currencyService, receiptService);
    });

    afterEach(() => {
      deleteReceiptsDirectory();
    });

    describe('add items to cart', () => {
      it('adds a single items to the cart', () => {
        cart.addItems([[PRODUCT_DATA.PRODUCT_A_10, 1]]);

        expect(cart.list()).toEqual([[PRODUCT_DATA.PRODUCT_A_10, 1]]);
      });

      it('adds multiple quantities of a single item to the cart', () => {
        cart.addItems([[PRODUCT_DATA.PRODUCT_A_10, 2]]);

        expect(cart.list()).toEqual([[PRODUCT_DATA.PRODUCT_A_10, 2]]);
      });

      it('adds two different items with different quantities to the cart', () => {
        cart.addItems([
          [PRODUCT_DATA.PRODUCT_A_10, 2],
          [PRODUCT_DATA.PRODUCT_B_20, 3],
        ]);

        expect(cart.list()).toEqual([
          [PRODUCT_DATA.PRODUCT_A_10, 2],
          [PRODUCT_DATA.PRODUCT_B_20, 3],
        ]);
      });
    });

    describe('calculate gross values', () => {
      it(`gets '${currencySymbol}0.00' as gross value if cart is empty`, () => {
        expect(cart.total()).toBe(`${currencySymbol}0.00`);
      });

      it('gets gross value for single item in the cart', () => {
        cart.addItems([[PRODUCT_DATA.PRODUCT_A_10, 1]]);

        expect(cart.total()).toBe(`${currencySymbol}10.00`);
      });

      it('gets gross value of multiple single items in the cart', () => {
        cart.addItems([[PRODUCT_DATA.PRODUCT_A_10, 2]]);

        expect(cart.total()).toBe(`${currencySymbol}20.00`);
      });

      it('gets gross value for two different items with different quantities in the cart', () => {
        cart.addItems([
          [PRODUCT_DATA.PRODUCT_A_10, 2],
          [PRODUCT_DATA.PRODUCT_C_15, 3],
        ]);

        expect(cart.total()).toBe(`${currencySymbol}65.00`);
      });

      it('gets total gross value with unit prices of varying decimal values', () => {
        cart.addItems([
          [PRODUCT_DATA.PRODUCT_D_17_09, 2],
          [PRODUCT_DATA.PRODUCT_E_14_5, 3],
          [PRODUCT_DATA.PRODUCT_F_7_22, 2],
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
          [PRODUCT_DATA.PRODUCT_A_10, 2],
          [PRODUCT_DATA.PRODUCT_C_15, 3],
        ]);

        expect(cart.total()).toBe(`${currencySymbol}65.00`);
      });

      it(`applies a 5% discount if total gross value is over ${currencySymbol}100`, () => {
        cart.addItems([
          [PRODUCT_DATA.PRODUCT_G_50, 2],
          [PRODUCT_DATA.PRODUCT_A_10, 1],
        ]);

        expect(cart.total()).toBe(`${currencySymbol}104.50`);
      });

      it(`does not apply a 5% discount if total gross value is equal to ${currencySymbol}100`, () => {
        cart.addItems([[PRODUCT_DATA.PRODUCT_G_50, 2]]);

        expect(cart.total()).toBe(`${currencySymbol}100.00`);
      });

      it(`applies a 10% discount if total gross value is over ${currencySymbol}200`, () => {
        cart.addItems([
          [PRODUCT_DATA.PRODUCT_G_50, 4],
          [PRODUCT_DATA.PRODUCT_A_10, 1],
        ]);

        expect(cart.total()).toBe(`${currencySymbol}189.00`);
      });

      it(`only applies a 5% discount (not 10%) if total gross value is equal to ${currencySymbol}200`, () => {
        cart.addItems([[PRODUCT_DATA.PRODUCT_G_50, 4]]);

        expect(cart.total()).toBe(`${currencySymbol}190.00`);
      });
    });

    describe(`generate receipts with ${currencyName} (${currencyCode}) as currency`, () => {
      describe('write receipt to text file', () => {
        it('throws an error when attempting to generate a text receipt with an empty cart', () => {
          expect(() => {
            cart.createReceipt('text');
          }).toThrow('Cannot generate text receipt. Cart is empty!');
        });

        it('writes a receipt to a text file with no discount', () => {
          cart.addItems([
            [PRODUCT_DATA.PRODUCT_G_50, 1],
            [PRODUCT_DATA.PRODUCT_H_25, 2],
          ]);

          cart.createReceipt('text');

          const receipt = readGeneratedReceipt('text');

          const expectedReceipt = [
            `Your receipt`,
            ``,
            `1. ${PRODUCT_DATA.PRODUCT_G_50.name} - ${currencySymbol}50.00 x 1 - ${currencySymbol}50.00`,
            `   ID: ${PRODUCT_DATA.PRODUCT_G_50.id}`,
            `   ---------------------------------------------`,
            `2. ${PRODUCT_DATA.PRODUCT_H_25.name} - ${currencySymbol}25.00 x 2 - ${currencySymbol}50.00`,
            `   ID: ${PRODUCT_DATA.PRODUCT_H_25.id}`,
            `   ---------------------------------------------`,
            ``,
            `   Subtotal: ${currencySymbol}100.00`,
            ``,
            `   Total: ${currencySymbol}100.00`,
          ];

          expect(receipt).toEqual(expectedReceipt);
        });

        it('writes a receipt to a text file with 5% discount', () => {
          cart.addItems([
            [PRODUCT_DATA.PRODUCT_G_50, 1],
            [PRODUCT_DATA.PRODUCT_H_25, 2],
            [PRODUCT_DATA.PRODUCT_A_10, 1],
          ]);

          cart.createReceipt('text');

          const receipt = readGeneratedReceipt('text');

          const expectedReceipt = [
            `Your receipt`,
            ``,
            `1. ${PRODUCT_DATA.PRODUCT_G_50.name} - ${currencySymbol}50.00 x 1 - ${currencySymbol}50.00`,
            `   ID: ${PRODUCT_DATA.PRODUCT_G_50.id}`,
            `   ---------------------------------------------`,
            `2. ${PRODUCT_DATA.PRODUCT_H_25.name} - ${currencySymbol}25.00 x 2 - ${currencySymbol}50.00`,
            `   ID: ${PRODUCT_DATA.PRODUCT_H_25.id}`,
            `   ---------------------------------------------`,
            `3. ${PRODUCT_DATA.PRODUCT_A_10.name} - ${currencySymbol}10.00 x 1 - ${currencySymbol}10.00`,
            `   ID: ${PRODUCT_DATA.PRODUCT_A_10.id}`,
            `   ---------------------------------------------`,
            ``,
            `   Subtotal: ${currencySymbol}110.00`,
            ``,
            `   5% Discount: -${currencySymbol}5.50`,
            ``,
            `   Total: ${currencySymbol}104.50`,
          ];

          expect(receipt).toEqual(expectedReceipt);
        });

        it('writes a receipt to a text file with 10% discount', () => {
          cart.addItems([
            [PRODUCT_DATA.PRODUCT_G_50, 2],
            [PRODUCT_DATA.PRODUCT_H_25, 4],
            [PRODUCT_DATA.PRODUCT_A_10, 1],
          ]);

          cart.createReceipt('text');

          const receipt = readGeneratedReceipt('text');

          const expectedReceipt = [
            `Your receipt`,
            ``,
            `1. ${PRODUCT_DATA.PRODUCT_G_50.name} - ${currencySymbol}50.00 x 2 - ${currencySymbol}100.00`,
            `   ID: ${PRODUCT_DATA.PRODUCT_G_50.id}`,
            `   ---------------------------------------------`,
            `2. ${PRODUCT_DATA.PRODUCT_H_25.name} - ${currencySymbol}25.00 x 4 - ${currencySymbol}100.00`,
            `   ID: ${PRODUCT_DATA.PRODUCT_H_25.id}`,
            `   ---------------------------------------------`,
            `3. ${PRODUCT_DATA.PRODUCT_A_10.name} - ${currencySymbol}10.00 x 1 - ${currencySymbol}10.00`,
            `   ID: ${PRODUCT_DATA.PRODUCT_A_10.id}`,
            `   ---------------------------------------------`,
            ``,
            `   Subtotal: ${currencySymbol}210.00`,
            ``,
            `   10% Discount: -${currencySymbol}21.00`,
            ``,
            `   Total: ${currencySymbol}189.00`,
          ];

          expect(receipt).toEqual(expectedReceipt);
        });
      });

      describe('write receipt to JSON file', () => {
        it('throws an error when attempting to generate a JSON receipt with an empty cart', () => {
          expect(() => {
            cart.createReceipt('json');
          }).toThrow('Cannot generate json receipt. Cart is empty!');
        });

        it('writes a receipt to a JSON file with no discount', () => {
          cart.addItems([
            [PRODUCT_DATA.PRODUCT_G_50, 1],
            [PRODUCT_DATA.PRODUCT_H_25, 2],
          ]);

          cart.createReceipt('json');

          const receipt = JSON.parse(readGeneratedReceipt('json'));

          const expectedJSON = JSON.parse(`
              {
                "items": [
                  {
                    "id": "${PRODUCT_DATA.PRODUCT_G_50.id}",
                    "name": "${PRODUCT_DATA.PRODUCT_G_50.name}",
                    "unitPrice": "${currencySymbol}50.00",
                    "quantity": "1",
                    "grossPrice": "${currencySymbol}50.00"
                  },
                  {
                    "id": "${PRODUCT_DATA.PRODUCT_H_25.id}",
                    "name": "${PRODUCT_DATA.PRODUCT_H_25.name}",
                    "unitPrice": "${currencySymbol}25.00",
                    "quantity": "2",
                    "grossPrice": "${currencySymbol}50.00"
                  }
                ],
                "subtotal": "${currencySymbol}100.00",
                "total": "${currencySymbol}100.00"
              }
            `);

          expect(receipt).toEqual(expectedJSON);
        });

        it('writes a receipt to a JSON file with 5% discount', () => {
          cart.addItems([
            [PRODUCT_DATA.PRODUCT_G_50, 1],
            [PRODUCT_DATA.PRODUCT_H_25, 2],
            [PRODUCT_DATA.PRODUCT_A_10, 1],
          ]);

          cart.createReceipt('json');

          const receipt = JSON.parse(readGeneratedReceipt('json'));

          const expectedJSON = JSON.parse(`
              {
                "items": [
                  {
                    "id": "${PRODUCT_DATA.PRODUCT_G_50.id}",
                    "name": "${PRODUCT_DATA.PRODUCT_G_50.name}",
                    "unitPrice": "${currencySymbol}50.00",
                    "quantity": "1",
                    "grossPrice": "${currencySymbol}50.00"
                  },
                  {
                    "id": "${PRODUCT_DATA.PRODUCT_H_25.id}",
                    "name": "${PRODUCT_DATA.PRODUCT_H_25.name}",
                    "unitPrice": "${currencySymbol}25.00",
                    "quantity": "2",
                    "grossPrice": "${currencySymbol}50.00"
                  },
                  {
                    "id": "${PRODUCT_DATA.PRODUCT_A_10.id}",
                    "name": "${PRODUCT_DATA.PRODUCT_A_10.name}",
                    "unitPrice": "${currencySymbol}10.00",
                    "quantity": "1",
                    "grossPrice": "${currencySymbol}10.00"
                  }
                ],
                "discount": {
                  "percentage": "5%",
                  "deductedAmount": "-${currencySymbol}5.50",
                  "netPrice": "${currencySymbol}104.50"
                },
                "subtotal": "${currencySymbol}110.00",
                "total": "${currencySymbol}104.50"
              }
            `);

          expect(receipt).toEqual(expectedJSON);
        });

        it('writes a receipt to a JSON file with 10% discount', () => {
          cart.addItems([
            [PRODUCT_DATA.PRODUCT_G_50, 2],
            [PRODUCT_DATA.PRODUCT_H_25, 4],
            [PRODUCT_DATA.PRODUCT_A_10, 1],
          ]);

          cart.createReceipt('json');

          const receipt = JSON.parse(readGeneratedReceipt('json'));

          const expectedJSON = JSON.parse(`
              {
                "items": [
                  {
                    "id": "${PRODUCT_DATA.PRODUCT_G_50.id}",
                    "name": "${PRODUCT_DATA.PRODUCT_G_50.name}",
                    "unitPrice": "${currencySymbol}50.00",
                    "quantity": "2",
                    "grossPrice": "${currencySymbol}100.00"
                  },
                  {
                    "id": "${PRODUCT_DATA.PRODUCT_H_25.id}",
                    "name": "${PRODUCT_DATA.PRODUCT_H_25.name}",
                    "unitPrice": "${currencySymbol}25.00",
                    "quantity": "4",
                    "grossPrice": "${currencySymbol}100.00"
                  },
                  {
                    "id": "${PRODUCT_DATA.PRODUCT_A_10.id}",
                    "name": "${PRODUCT_DATA.PRODUCT_A_10.name}",
                    "unitPrice": "${currencySymbol}10.00",
                    "quantity": "1",
                    "grossPrice": "${currencySymbol}10.00"
                  }
                ],
                "discount": {
                  "percentage": "10%",
                  "deductedAmount": "-${currencySymbol}21.00",
                  "netPrice": "${currencySymbol}189.00"
                },
                "subtotal": "${currencySymbol}210.00",
                "total": "${currencySymbol}189.00"
              }
            `);

          expect(receipt).toEqual(expectedJSON);
        });
      });

      describe('write receipt to HTML file', () => {
        it('throws an error when attempting to generate an HTML receipt with an empty cart', () => {
          expect(() => {
            cart.createReceipt('html');
          }).toThrow('Cannot generate html receipt. Cart is empty!');
        });

        it('writes a receipt to an HTML file with no discount', () => {
          cart.addItems([
            [PRODUCT_DATA.PRODUCT_G_50, 1],
            [PRODUCT_DATA.PRODUCT_H_25, 2],
          ]);

          cart.createReceipt('html');

          const receipt = readGeneratedReceipt('html');

          const expectedReceipt = [
            `<h1>Your receipt</h1>`,
            `<table>`,
            `  <thead>`,
            `    <tr>`,
            `      <th>Name</th>`,
            `      <th>Unit Price</th>`,
            `      <th>Quantity</th>`,
            `      <th>Gross Price</th>`,
            `    </tr>`,
            `  </thead>`,
            `  <tbody>`,
            `    <tr>`,
            `      <td style="display: flex; flex-direction: column; gap: 0.25rem">`,
            `        <span>${PRODUCT_DATA.PRODUCT_G_50.name}</span>`,
            `        <span style="font-size: 0.75rem">ID: ${PRODUCT_DATA.PRODUCT_G_50.id}</span>`,
            `      </td>`,
            `      <td>${currencySymbol}50.00</td>`,
            `      <td>1</td>`,
            `      <td>${currencySymbol}50.00</td>`,
            `    </tr>`,
            `    <tr>`,
            `      <td style="display: flex; flex-direction: column; gap: 0.25rem">`,
            `        <span>${PRODUCT_DATA.PRODUCT_H_25.name}</span>`,
            `        <span style="font-size: 0.75rem">ID: ${PRODUCT_DATA.PRODUCT_H_25.id}</span>`,
            `      </td>`,
            `      <td>${currencySymbol}25.00</td>`,
            `      <td>2</td>`,
            `      <td>${currencySymbol}50.00</td>`,
            `    </tr>`,
            `  </tbody>`,
            `  <tfoot>`,
            `    <tr>`,
            `      <td></td>`,
            `      <td></td>`,
            `      <td><strong>Subtotal</strong></td>`,
            `      <td><strong>${currencySymbol}100.00</strong></td>`,
            `    </tr>`,
            `    <tr>`,
            `      <td></td>`,
            `      <td></td>`,
            `      <td><strong>Total</strong></td>`,
            `      <td><strong>${currencySymbol}100.00</strong></td>`,
            `    </tr>`,
            `  </tfoot>`,
            `</table>`,
          ];

          expect(receipt).toEqual(expectedReceipt);
        });

        it('writes a receipt to an HTML file with 5% discount', () => {
          cart.addItems([
            [PRODUCT_DATA.PRODUCT_G_50, 1],
            [PRODUCT_DATA.PRODUCT_H_25, 2],
            [PRODUCT_DATA.PRODUCT_A_10, 1],
          ]);

          cart.createReceipt('html');

          const receipt = readGeneratedReceipt('html');

          const expectedReceipt = [
            `<h1>Your receipt</h1>`,
            `<table>`,
            `  <thead>`,
            `    <tr>`,
            `      <th>Name</th>`,
            `      <th>Unit Price</th>`,
            `      <th>Quantity</th>`,
            `      <th>Gross Price</th>`,
            `    </tr>`,
            `  </thead>`,
            `  <tbody>`,
            `    <tr>`,
            `      <td style="display: flex; flex-direction: column; gap: 0.25rem">`,
            `        <span>${PRODUCT_DATA.PRODUCT_G_50.name}</span>`,
            `        <span style="font-size: 0.75rem">ID: ${PRODUCT_DATA.PRODUCT_G_50.id}</span>`,
            `      </td>`,
            `      <td>${currencySymbol}50.00</td>`,
            `      <td>1</td>`,
            `      <td>${currencySymbol}50.00</td>`,
            `    </tr>`,
            `    <tr>`,
            `      <td style="display: flex; flex-direction: column; gap: 0.25rem">`,
            `        <span>${PRODUCT_DATA.PRODUCT_H_25.name}</span>`,
            `        <span style="font-size: 0.75rem">ID: ${PRODUCT_DATA.PRODUCT_H_25.id}</span>`,
            `      </td>`,
            `      <td>${currencySymbol}25.00</td>`,
            `      <td>2</td>`,
            `      <td>${currencySymbol}50.00</td>`,
            `    </tr>`,
            `    <tr>`,
            `      <td style="display: flex; flex-direction: column; gap: 0.25rem">`,
            `        <span>${PRODUCT_DATA.PRODUCT_A_10.name}</span>`,
            `        <span style="font-size: 0.75rem">ID: ${PRODUCT_DATA.PRODUCT_A_10.id}</span>`,
            `      </td>`,
            `      <td>${currencySymbol}10.00</td>`,
            `      <td>1</td>`,
            `      <td>${currencySymbol}10.00</td>`,
            `    </tr>`,
            `  </tbody>`,
            `  <tfoot>`,
            `    <tr>`,
            `      <td></td>`,
            `      <td></td>`,
            `      <td><strong>Subtotal</strong></td>`,
            `      <td><strong>${currencySymbol}110.00</strong></td>`,
            `    </tr>`,
            `    <tr>`,
            `      <td></td>`,
            `      <td></td>`,
            `      <td><strong>5% Discount</strong></td>`,
            `      <td style="color: red;"><strong>-${currencySymbol}5.50</strong></td>`,
            `    </tr>`,
            `    <tr>`,
            `      <td></td>`,
            `      <td></td>`,
            `      <td><strong>Total</strong></td>`,
            `      <td><strong>${currencySymbol}104.50</strong></td>`,
            `    </tr>`,
            `  </tfoot>`,
            `</table>`,
          ];

          expect(receipt).toEqual(expectedReceipt);
        });

        it('writes a receipt to an HTML file with 10% discount', () => {
          cart.addItems([
            [PRODUCT_DATA.PRODUCT_G_50, 2],
            [PRODUCT_DATA.PRODUCT_H_25, 4],
            [PRODUCT_DATA.PRODUCT_A_10, 1],
          ]);

          cart.createReceipt('html');

          const receipt = readGeneratedReceipt('html');

          const expectedReceipt = [
            `<h1>Your receipt</h1>`,
            `<table>`,
            `  <thead>`,
            `    <tr>`,
            `      <th>Name</th>`,
            `      <th>Unit Price</th>`,
            `      <th>Quantity</th>`,
            `      <th>Gross Price</th>`,
            `    </tr>`,
            `  </thead>`,
            `  <tbody>`,
            `    <tr>`,
            `      <td style="display: flex; flex-direction: column; gap: 0.25rem">`,
            `        <span>${PRODUCT_DATA.PRODUCT_G_50.name}</span>`,
            `        <span style="font-size: 0.75rem">ID: ${PRODUCT_DATA.PRODUCT_G_50.id}</span>`,
            `      </td>`,
            `      <td>${currencySymbol}50.00</td>`,
            `      <td>2</td>`,
            `      <td>${currencySymbol}100.00</td>`,
            `    </tr>`,
            `    <tr>`,
            `      <td style="display: flex; flex-direction: column; gap: 0.25rem">`,
            `        <span>${PRODUCT_DATA.PRODUCT_H_25.name}</span>`,
            `        <span style="font-size: 0.75rem">ID: ${PRODUCT_DATA.PRODUCT_H_25.id}</span>`,
            `      </td>`,
            `      <td>${currencySymbol}25.00</td>`,
            `      <td>4</td>`,
            `      <td>${currencySymbol}100.00</td>`,
            `    </tr>`,
            `    <tr>`,
            `      <td style="display: flex; flex-direction: column; gap: 0.25rem">`,
            `        <span>${PRODUCT_DATA.PRODUCT_A_10.name}</span>`,
            `        <span style="font-size: 0.75rem">ID: ${PRODUCT_DATA.PRODUCT_A_10.id}</span>`,
            `      </td>`,
            `      <td>${currencySymbol}10.00</td>`,
            `      <td>1</td>`,
            `      <td>${currencySymbol}10.00</td>`,
            `    </tr>`,
            `  </tbody>`,
            `  <tfoot>`,
            `    <tr>`,
            `      <td></td>`,
            `      <td></td>`,
            `      <td><strong>Subtotal</strong></td>`,
            `      <td><strong>${currencySymbol}210.00</strong></td>`,
            `    </tr>`,
            `    <tr>`,
            `      <td></td>`,
            `      <td></td>`,
            `      <td><strong>10% Discount</strong></td>`,
            `      <td style="color: red;"><strong>-${currencySymbol}21.00</strong></td>`,
            `    </tr>`,
            `    <tr>`,
            `      <td></td>`,
            `      <td></td>`,
            `      <td><strong>Total</strong></td>`,
            `      <td><strong>${currencySymbol}189.00</strong></td>`,
            `    </tr>`,
            `  </tfoot>`,
            `</table>`,
          ];

          expect(receipt).toEqual(expectedReceipt);
        });
      });
    });
  },
);
