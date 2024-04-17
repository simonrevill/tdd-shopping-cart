import { DISCOUNT_PERCENTAGES, DISCOUNT_THRESHOLDS } from '../constants';
import { Item, DiscountPercentage, CurrencyService } from '../types';

export default class ShoppingCart {
  private items: Item[] = [];
  private currencyService: CurrencyService;

  constructor(currencyService: CurrencyService) {
    this.currencyService = currencyService;
  }

  private getGrossItemPrices(): string[] {
    return this.items.map(([unitPrice, quantity]) =>
      this.currencyService.format(unitPrice * quantity),
    );
  }

  private removeCurrencySymbolFromPrice(price: string) {
    return parseFloat(price.replace(this.currencyService.currencySymbol, ''));
  }

  private getTotalGrossPrice(prices: number[]): number {
    return prices.reduce((previousPrice, currentPrice) => previousPrice + currentPrice);
  }

  private totalGrossValue(): string {
    const grossPricesAsNumbers = this.getGrossItemPrices().map(
      this.removeCurrencySymbolFromPrice.bind(this),
    );

    return this.currencyService.format(this.getTotalGrossPrice(grossPricesAsNumbers));
  }

  private getDiscountedPrice(price: number): string {
    const discountPercentage: DiscountPercentage =
      price > DISCOUNT_THRESHOLDS.TWO_HUNDRED
        ? DISCOUNT_PERCENTAGES.TEN_PERCENT
        : DISCOUNT_PERCENTAGES.FIVE_PERCENT;

    return this.currencyService.format(price - price * discountPercentage);
  }

  addItems(items: Item[]) {
    items.forEach((item: Item) => {
      this.items.push(item);
    });
  }

  list(): Item[] {
    return this.items;
  }

  total(): string {
    if (this.items.length === 0) {
      return `${this.currencyService.currencySymbol}0.00`;
    }

    const grossPrice = this.removeCurrencySymbolFromPrice(this.totalGrossValue());

    const shouldApplyDiscount =
      grossPrice > DISCOUNT_THRESHOLDS.ONE_HUNDRED || grossPrice > DISCOUNT_THRESHOLDS.TWO_HUNDRED;

    return shouldApplyDiscount ? this.getDiscountedPrice(grossPrice) : this.totalGrossValue();
  }
}
