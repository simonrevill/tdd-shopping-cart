import fs from 'node:fs';
import path from 'node:path';

const deleteReceiptsDirectory = () => {
  fs.rmSync(path.join(process.cwd(), 'receipts'), { recursive: true, force: true });
};

export default deleteReceiptsDirectory;
