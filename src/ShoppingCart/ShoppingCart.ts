import { DiscountPercentages, DiscountThresholds } from '../constants';
import {
  TShoppingCartItem,
  TDiscountPercentage,
  ICurrencyService,
  IReceiptService,
  TRawReceiptData,
  TReceiptServiceCreateFormat,
  TRawReceiptDiscountData,
} from '../types';

export default class ShoppingCart {
  private items: TShoppingCartItem[] = [];
  private currencyService: ICurrencyService;
  private receiptService: IReceiptService;

  constructor(currencyService: ICurrencyService, receiptService: IReceiptService) {
    this.currencyService = currencyService;
    this.receiptService = receiptService;
  }

  private get grossPrice(): number {
    const grossPriceList = this.items.map(([{ unitPrice }, quantity]) => unitPrice * quantity);

    return grossPriceList.reduce((previousPrice, currentPrice) => previousPrice + currentPrice);
  }

  private get discountedPrice(): TRawReceiptDiscountData {
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
      items: this.items.map(([{ id, name, unitPrice, description }, quantity]) => ({
        id,
        name,
        unitPrice,
        description,
        quantity,
        grossPrice: unitPrice * quantity,
      })),
      ...(this.shouldApplyDiscount && {
        discount: this.discountedPrice,
      }),
      subtotal: this.grossPrice,
      total: this.shouldApplyDiscount ? this.discountedPrice.netPrice : this.grossPrice,
    };
  }

  addItems(items: TShoppingCartItem[]): void {
    this.items = [...this.items, ...items];
  }

  list(): TShoppingCartItem[] {
    return this.items;
  }

  total(): string {
    if (!this.items.length) {
      return this.currencyService.getNilPriceInCurrency();
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
