import {
  ICurrencyService,
  IReceiptFormatService,
  TRawReceiptData,
  TRawReceiptDiscountData,
  TRawReceiptItem,
} from '../../types';

export default class HTMLReceiptService implements IReceiptFormatService {
  currencyService: ICurrencyService;

  constructor(currencyService: ICurrencyService) {
    this.currencyService = currencyService;
  }

  private writeNewLine(): string {
    return '\n';
  }

  private buildTableHead(): string {
    return [
      '<tr>',
      '<th>Unit Price</th>',
      '<th>Quantity</th>',
      '<th>Gross Price</th>',
      '</tr>',
    ].join(this.writeNewLine());
  }

  private buildItems(items: TRawReceiptItem[]): string {
    const tableItemsString = items
      .map((item) => {
        return [
          '<tr>',
          `<td>${this.currencyService.format(item.unitPrice)}</td>`,
          `<td>${item.quantity}</td>`,
          `<td>${this.currencyService.format(item.grossPrice)}</td>`,
          '</tr>',
        ].join(this.writeNewLine());
      })
      .join(this.writeNewLine());

    return tableItemsString;
  }

  private buildSubtotal(subtotal: number): string {
    return [
      '<tr>',
      '<td></td>',
      '<td><strong>Subtotal</strong></td>',
      `<td>${this.currencyService.format(subtotal)}</td>`,
      '</tr>',
    ].join(this.writeNewLine());
  }

  private buildDiscount(percentage: number, deductedAmount: number): string {
    return [
      '<tr>',
      '<td></td>',
      `<td><strong>${percentage * 100}% Discount</strong></td>`,
      `<td style="color: red;">-${this.currencyService.format(deductedAmount)}</td>`,
      '</tr>',
    ].join(this.writeNewLine());
  }

  private buildTotal(total: number): string {
    return [
      '<tr>',
      '<td></td>',
      '<td><strong>Total</strong></td>',
      `<td>${this.currencyService.format(total)}</td>`,
      '</tr>',
    ].join(this.writeNewLine());
  }

  private buildTableFooter(
    subtotal: number,
    total: number,
    discount?: TRawReceiptDiscountData,
  ): string {
    return [
      this.buildSubtotal(subtotal),
      discount ? this.buildDiscount(discount.percentage, discount.deductedAmount) : '',
      this.buildTotal(total),
    ]
      .filter((line) => line.length > 0)
      .join(this.writeNewLine());
  }

  create(data: TRawReceiptData): string {
    return [
      '<h1>Your receipt</h1>',
      '<table>',
      '<thead>',
      this.buildTableHead(),
      '</thead>',
      '<tbody>',
      this.buildItems(data.items),
      '</tbody>',
      '<tfoot>',
      this.buildTableFooter(data.subtotal, data.total, data.discount),
      '</tfoot>',
      '</table>',
    ].join(this.writeNewLine());
  }
}
