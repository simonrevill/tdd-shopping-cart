import { DiscountPercentages, DiscountThresholds } from '../constants';
import {
  TItem,
  TDiscountPercentage,
  ICurrencyService,
  IReceiptService,
  TReceiptData,
} from '../types';

export default class ShoppingCart {
  private items: TItem[] = [];
  private currencyService: ICurrencyService;
  private receiptService: IReceiptService;

  constructor(currencyService: ICurrencyService, receiptService: IReceiptService) {
    this.currencyService = currencyService;
    this.receiptService = receiptService;
  }

  private grossPrice(): number {
    const grossPriceList = this.items.map(([unitPrice, quantity]) => unitPrice * quantity);

    return grossPriceList.reduce((previousPrice, currentPrice) => previousPrice + currentPrice);
  }

  private discountedPrice(price: number): number {
    const discountPercentage: TDiscountPercentage =
      price > DiscountThresholds.TWO_HUNDRED ? DiscountPercentages.TEN : DiscountPercentages.FIVE;

    return price - price * discountPercentage;
  }

  private get shouldApplyDiscount(): boolean {
    const grossPrice = this.grossPrice();

    return [DiscountThresholds.ONE_HUNDRED, DiscountThresholds.TWO_HUNDRED].some(
      (discountThreshold) => grossPrice > discountThreshold,
    );
  }

  addItems(items: TItem[]): void {
    this.items = items;
  }

  list(): TItem[] {
    return this.items;
  }

  total(): string {
    if (!this.items.length) {
      return this.currencyService.getZeroPriceInCurrency();
    }

    const grossPrice = this.grossPrice();

    return this.currencyService.format(
      this.shouldApplyDiscount ? this.discountedPrice(grossPrice) : grossPrice,
    );
  }

  generateReceipt() {
    if (!this.items.length) {
      throw new Error('Cannot generate text receipt. Cart is empty!');
    }

    const grossPrice = this.grossPrice();

    const data: TReceiptData = {
      items: this.items.map((item) => ({
        unitPrice: item[0],
        quantity: item[1],
        grossPrice: item[0] * item[1],
      })),
      subtotal: grossPrice,
      total: this.shouldApplyDiscount ? this.discountedPrice(grossPrice) : grossPrice,
    };

    this.receiptService.generate(data);
  }
}
