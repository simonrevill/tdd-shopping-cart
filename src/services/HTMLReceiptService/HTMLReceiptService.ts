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

  writeNewLine(): string {
    return '\n';
  }

  buildTableHead(): string {
    return [
      '<thead>',
      '<tr>',
      '<th>Unit Price</th>',
      '<th>Quantity</th>',
      '<th>Gross Price</th>',
      '</tr>',
      '</thead>',
    ].join(this.writeNewLine());
  }

  buildItems(items: TRawReceiptItem[]): string {
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

  buildSubtotal(subtotal: number): string {
    return [
      '<tr>',
      '<td></td>',
      '<td><strong>Subtotal</strong></td>',
      `<td>${this.currencyService.format(subtotal)}</td>`,
      '</tr>',
    ].join(this.writeNewLine());
  }

  buildDiscount(percentage: number, deductedAmount: number): string {
    return [
      '<tr>',
      '<td></td>',
      `<td><strong>${percentage * 100}% Discount</strong></td>`,
      `<td style="color: red;">-${this.currencyService.format(deductedAmount)}</td>`,
      '</tr>',
    ].join(this.writeNewLine());
  }

  buildTableFooter(subtotal: number, total: number, discount?: TRawReceiptDiscountData): string {
    let tableFooterString = '<tfoot>';
    tableFooterString += this.writeNewLine();
    tableFooterString += this.buildSubtotal(subtotal);
    tableFooterString += this.writeNewLine();

    if (discount) {
      tableFooterString += this.buildDiscount(discount.percentage, discount.deductedAmount);
      tableFooterString += this.writeNewLine();
    }

    tableFooterString += '<tr>';
    tableFooterString += this.writeNewLine();
    tableFooterString += '<td></td>';
    tableFooterString += this.writeNewLine();
    tableFooterString += '<td><strong>Total</strong></td>';
    tableFooterString += this.writeNewLine();
    tableFooterString += `<td>${this.currencyService.format(total)}</td>`;
    tableFooterString += this.writeNewLine();
    tableFooterString += '</tr>';
    tableFooterString += this.writeNewLine();
    tableFooterString += '</tfoot>';
    tableFooterString += this.writeNewLine();

    return tableFooterString;
  }

  create(data: TRawReceiptData): string {
    let receiptHTML = '<h1>Your receipt</h1>';
    receiptHTML += this.writeNewLine();
    receiptHTML += '<table>';
    receiptHTML += this.writeNewLine();
    receiptHTML += this.buildTableHead();
    receiptHTML += this.writeNewLine();
    receiptHTML += '<tbody>';
    receiptHTML += this.writeNewLine();
    receiptHTML += this.buildItems(data.items);
    receiptHTML += this.writeNewLine();
    receiptHTML += '</tbody>';
    receiptHTML += this.writeNewLine();
    receiptHTML += this.buildTableFooter(data.subtotal, data.total, data.discount);
    receiptHTML += '</table>';

    return receiptHTML;
  }
}
