import fs from 'node:fs';
import path from 'node:path';
import { TReceiptFormat } from '../types';

const readGeneratedReceipt = (format: TReceiptFormat): string[] | string => {
  const fileExtensions = {
    text: 'txt',
    json: 'json',
    html: 'html',
  };

  const receiptsFolder = path.join(process.cwd(), `receipts/${format}`);

  const receipt = fs.readFileSync(
    path.join(receiptsFolder, `receipt.${fileExtensions[format]}`),
    'utf-8',
  );

  return format === 'text' ? receipt.split(/\n/g) : receipt;
};

export default readGeneratedReceipt;
