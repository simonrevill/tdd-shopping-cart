import fs from 'node:fs';
import path from 'node:path';
import { FileExtensions, RECEIPTS_DIRECTORY } from '../../src/constants';
import { TReceiptFormat } from '../../src/types';

export const deleteReceiptsDirectory = () => {
  fs.rmSync(path.join(process.cwd(), RECEIPTS_DIRECTORY), { recursive: true, force: true });
};

export function readGeneratedReceipt(format: 'json'): string;
export function readGeneratedReceipt(format: 'text' | 'html'): string[];
export function readGeneratedReceipt(format: TReceiptFormat) {
  const receiptsFolder = path.join(process.cwd(), `${RECEIPTS_DIRECTORY}/${format}`);

  const receipt = fs.readFileSync(
    path.join(receiptsFolder, `receipt.${FileExtensions[format]}`),
    'utf-8',
  );

  return format === 'json' ? receipt : receipt.split(/\n/g);
}
