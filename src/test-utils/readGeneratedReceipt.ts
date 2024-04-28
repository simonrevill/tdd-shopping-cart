import fs from 'node:fs';
import path from 'node:path';
import { TReceiptFormat } from '../types';
import { FileExtensions, RECEIPTS_DIRECTORY } from '../constants';

function readGeneratedReceipt(format: 'json'): string;
function readGeneratedReceipt(format: 'text' | 'html'): string[];
function readGeneratedReceipt(format: TReceiptFormat) {
  const receiptsFolder = path.join(process.cwd(), `${RECEIPTS_DIRECTORY}/${format}`);

  const receipt = fs.readFileSync(
    path.join(receiptsFolder, `receipt.${FileExtensions[format]}`),
    'utf-8',
  );

  return format === 'json' ? receipt : receipt.split(/\n/g);
}

export default readGeneratedReceipt;
