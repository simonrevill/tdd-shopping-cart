import fs from 'node:fs';
import path from 'node:path';
import { TReceiptFormat } from '../types';
import { FileExtensions, RECEIPTS_DIRECTORY } from '../constants';

const readGeneratedReceipt = (format: TReceiptFormat): string[] | string => {
  const receiptsFolder = path.join(process.cwd(), `${RECEIPTS_DIRECTORY}/${format}`);

  const receipt = fs.readFileSync(
    path.join(receiptsFolder, `receipt.${FileExtensions[format]}`),
    'utf-8',
  );

  return format === 'json' ? receipt : receipt.split(/\n/g);
};

export default readGeneratedReceipt;
