import fs from 'node:fs';
import path from 'node:path';
import { RECEIPTS_DIRECTORY } from '../constants';

const deleteReceiptsDirectory = () => {
  fs.rmSync(path.join(process.cwd(), RECEIPTS_DIRECTORY), { recursive: true, force: true });
};

export default deleteReceiptsDirectory;
