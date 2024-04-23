import { DiscountPercentages, DiscountThresholds } from '../constants';
import {
  TItem,
  TDiscountPercentage,
  ICurrencyService,
  IReceiptService,
  TReceiptData,
  TReceiptServiceGeneratorOptions,
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

  private get discountedPrice(): { percentage: number; deductedAmount: number; netPrice: number } {
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

  generateReceipt(options: TReceiptServiceGeneratorOptions) {
    if (!this.items.length) {
      throw new Error(`Cannot generate ${options.format} receipt. Cart is empty!`);
    }

    const data: TReceiptData = {
      items: this.items.map(([unitPrice, quantity]) => ({
        unitPrice,
        quantity,
        grossPrice: unitPrice * quantity,
      })),
      subtotal: this.grossPrice,
      total: this.shouldApplyDiscount ? this.discountedPrice.netPrice : this.grossPrice,
    };

    if (this.shouldApplyDiscount) {
      data.discount = {
        percentage: this.discountedPrice.percentage,
        deductedAmount: this.discountedPrice.deductedAmount,
        netPrice: this.discountedPrice.netPrice,
      };
    }

    this.receiptService.generate(data, options);
  }
}
