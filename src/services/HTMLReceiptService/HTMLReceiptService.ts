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
      '    <tr>',
      '      <th>Name</th>',
      '      <th>Unit Price</th>',
      '      <th>Quantity</th>',
      '      <th>Gross Price</th>',
      '    </tr>',
    ].join(this.writeNewLine());
  }

  private buildItems(items: TRawReceiptItem[]): string {
    return items
      .map(({ id, name, unitPrice, description, quantity, grossPrice }) => {
        return [
          '    <tr>',
          `      <td>`,
          `        <div style="display: flex; flex-direction: column; gap: 0.25rem; max-width: 16rem;">`,
          `          <span>${name}</span>`,
          `          <span style="font-size: 0.75rem"><strong>ID:</strong> ${id}</span>`,
          `          <span style="font-size: 0.75rem"><strong>Description:</strong> ${description}</span>`,
          `        </div>`,
          `      </td>`,
          `      <td>${this.currencyService.format(unitPrice)}</td>`,
          `      <td>${quantity}</td>`,
          `      <td>${this.currencyService.format(grossPrice)}</td>`,
          '    </tr>',
        ].join(this.writeNewLine());
      })
      .join(this.writeNewLine());
  }

  private buildSubtotal(subtotal: number): string {
    return [
      '    <tr>',
      '      <td></td>',
      '      <td></td>',
      '      <td><strong>Subtotal</strong></td>',
      `      <td><strong>${this.currencyService.format(subtotal)}</strong></td>`,
      '    </tr>',
    ].join(this.writeNewLine());
  }

  private buildDiscount(percentage: number, deductedAmount: number): string {
    return [
      '    <tr>',
      '      <td></td>',
      '      <td></td>',
      `      <td><strong>${percentage * 100}% Discount</strong></td>`,
      `      <td style="color: red;"><strong>-${this.currencyService.format(
        deductedAmount,
      )}</strong></td>`,
      '    </tr>',
    ].join(this.writeNewLine());
  }

  private buildTotal(total: number): string {
    return [
      '    <tr>',
      '      <td></td>',
      '      <td></td>',
      '      <td><strong>Total</strong></td>',
      `      <td><strong>${this.currencyService.format(total)}</strong></td>`,
      '    </tr>',
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

  create({ items, subtotal, total, discount }: TRawReceiptData): string {
    return [
      '<h1>Your receipt</h1>',
      '<table>',
      '  <thead>',
      this.buildTableHead(),
      '  </thead>',
      '  <tbody>',
      this.buildItems(items),
      '  </tbody>',
      '  <tfoot>',
      this.buildTableFooter(subtotal, total, discount),
      '  </tfoot>',
      '</table>',
    ].join(this.writeNewLine());
  }
}
