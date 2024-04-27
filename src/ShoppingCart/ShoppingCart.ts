import { DiscountPercentages, DiscountThresholds } from '../constants';
import {
  TItem,
  TDiscountPercentage,
  ICurrencyService,
  IReceiptService,
  TDiscount,
  TRawReceiptData,
  TReceiptServiceCreateFormat,
} from '../types';

export default class ShoppingCart {
  private items: TItem[] = [];
  private currencyService: ICurrencyService;
  private receiptService: IReceiptService;

  constructor(currencyService: ICurrencyService, receiptService: IReceiptService) {
    this.currencyService = currencyService;
    this.receiptService = receiptService;
  }

  private get grossPrice(): number {
    const grossPriceList = this.items.map(([unitPrice, quantity]) => unitPrice * quantity);

    return grossPriceList.reduce((previousPrice, currentPrice) => previousPrice + currentPrice);
  }

  private get discountedPrice(): TDiscount {
    const discountPercentage: TDiscountPercentage =
      this.grossPrice > DiscountThresholds.TWO_HUNDRED
        ? DiscountPercentages.TEN
        : DiscountPercentages.FIVE;

    return {
      percentage: discountPercentage,
      deductedAmount: this.grossPrice * discountPercentage,
      netPrice: this.grossPrice - this.grossPrice * discountPercentage,
    };
  }

  private get shouldApplyDiscount(): boolean {
    return [DiscountThresholds.ONE_HUNDRED, DiscountThresholds.TWO_HUNDRED].some(
      (discountThreshold) => this.grossPrice > discountThreshold,
    );
  }

  private buildReceiptData(): TRawReceiptData {
    return {
      items: this.items.map(([unitPrice, quantity]) => ({
        unitPrice,
        quantity,
        grossPrice: unitPrice * quantity,
      })),
      ...(this.shouldApplyDiscount && {
        discount: {
          percentage: this.discountedPrice.percentage,
          deductedAmount: this.discountedPrice.deductedAmount,
          netPrice: this.discountedPrice.netPrice,
        },
      }),
      subtotal: this.grossPrice,
      total: this.shouldApplyDiscount ? this.discountedPrice.netPrice : this.grossPrice,
    };
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

    return this.currencyService.format(
      this.shouldApplyDiscount ? this.discountedPrice.netPrice : this.grossPrice,
    );
  }

  createReceipt(format: TReceiptServiceCreateFormat): void {
    if (!this.items.length) {
      throw new Error(`Cannot generate ${format} receipt. Cart is empty!`);
    }

    const data = this.buildReceiptData();

    this.receiptService.create(data, format);
  }
}
