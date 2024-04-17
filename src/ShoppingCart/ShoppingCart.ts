import { DISCOUNT_PERCENTAGES } from '../constants';
import { Item, DiscountPercentage, CurrencyFormatter, CurrencyFormatterService } from '../types';

export default class ShoppingCart {
  private items: Item[] = [];
  private currencyFormatterService: CurrencyFormatterService;

  constructor(currencyFormatterService: CurrencyFormatterService) {
    this.currencyFormatterService = currencyFormatterService;
  }

  private getGrossItemPrices(): string[] {
    return this.items.map(([unitPrice, quantity]) =>
      this.currencyFormatterService.format(unitPrice * quantity),
    );
  }

  private removeCurrencySymbolFromPrice(price: string) {
    return parseFloat(price.replace(this.currencyFormatterService.currencySymbol, ''));
  }

  private getTotalGrossPrice(prices: number[]): number {
    return prices.reduce((previousPrice, currentPrice) => previousPrice + currentPrice);
  }

  private totalGrossValue(): string {
    const grossPricesAsNumbers = this.getGrossItemPrices().map(
      this.removeCurrencySymbolFromPrice.bind(this),
    );

    return this.currencyFormatterService.format(this.getTotalGrossPrice(grossPricesAsNumbers));
  }

  private getDiscountedPrice(price: number): string {
    const discountPercentage: DiscountPercentage =
      price > 200 ? DISCOUNT_PERCENTAGES.TEN_PERCENT : DISCOUNT_PERCENTAGES.FIVE_PERCENT;

    return this.currencyFormatterService.format(price - price * discountPercentage);
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
      return `${this.currencyFormatterService.currencySymbol}0.00`;
    }

    const grossPrice = this.removeCurrencySymbolFromPrice(this.totalGrossValue());

    if (grossPrice > 200 || grossPrice > 100) {
      return this.getDiscountedPrice(grossPrice);
    }

    return this.totalGrossValue();
  }
}
