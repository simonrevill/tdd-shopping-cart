import { TProduct } from '../../src/types';

type TTestProducts = { [key: string]: TProduct };

export const PRODUCT_DATA: TTestProducts = {
  PRODUCT_A_10: {
    id: '1',
    name: 'Product A',
    unitPrice: 10,
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
  },
  PRODUCT_B_20: {
    id: '2',
    name: 'Product B',
    unitPrice: 20,
    description: 'sed do eiusmod tempor incididunt ut labore et',
  },
  PRODUCT_C_15: {
    id: '3',
    name: 'Product C',
    unitPrice: 15,
    description: 'dolore magna aliqua. Ut enim ad minim veniam',
  },
  PRODUCT_D_17_09: {
    id: '4',
    name: 'Product D',
    unitPrice: 17.09,
    description: 'quis nostrud exercitation ullamco laboris nisi ut aliquip',
  },
  PRODUCT_E_14_5: {
    id: '5',
    name: 'Product E',
    unitPrice: 14.5,
    description: 'ex ea commodo consequat. Duis aute irure dolor',
  },
  PRODUCT_F_7_22: {
    id: '6',
    name: 'Product F',
    unitPrice: 7.22,
    description: 'in reprehenderit in voluptate velit esse cillum dolore',
  },
  PRODUCT_G_50: {
    id: '7',
    name: 'Product G',
    unitPrice: 50,
    description: 'eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat',
  },
  PRODUCT_H_25: {
    id: '8',
    name: 'Product H',
    unitPrice: 25,
    description: 'non proident, sunt in culpa qui officia deserunt',
  },
};
