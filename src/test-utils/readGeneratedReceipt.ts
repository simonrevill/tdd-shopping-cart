import fs from 'node:fs';
import path from 'node:path';

const readGeneratedReceipt = (): string[] => {
  const receiptsFolder = path.join(process.cwd(), 'receipts/text');

  const receipt = fs.readFileSync(path.join(receiptsFolder, 'receipt.txt'), 'utf-8').split(/\n/g);

  return receipt;
};

export default readGeneratedReceipt;
