import fs from 'node:fs';
import path from 'node:path';
import { TReceiptFormat } from '../types';
import { FileExtensions } from '../constants';

const readGeneratedReceipt = (format: TReceiptFormat): string[] | string => {
  const receiptsFolder = path.join(process.cwd(), `receipts/${format}`);

  const receipt = fs.readFileSync(
    path.join(receiptsFolder, `receipt.${FileExtensions[format]}`),
    'utf-8',
  );

  return format === 'text' ? receipt.split(/\n/g) : receipt;
};

export default readGeneratedReceipt;
