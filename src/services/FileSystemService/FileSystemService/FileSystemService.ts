import fs from 'node:fs';
import path from 'node:path';
import { IFileSystemService, TReceiptOutputDirectory, TReceiptOutputPath } from '../../../types';

export default class FileSystemService implements IFileSystemService {
  rootDirectory: string = process.cwd();

  buildOutputDirectory(outputDirectoryName: TReceiptOutputDirectory): TReceiptOutputPath {
    const receiptsDirectoryName = 'receipts';
    const receiptsDirectory = path.join(this.rootDirectory, receiptsDirectoryName);

    if (!fs.existsSync(receiptsDirectory)) {
      fs.mkdirSync(receiptsDirectory);
    }

    const outputDirectory = path.join(
      this.rootDirectory,
      `${receiptsDirectoryName}/${outputDirectoryName}`,
    ) as TReceiptOutputPath;

    if (!fs.existsSync(outputDirectory)) {
      fs.mkdirSync(outputDirectory);
    }

    return outputDirectory;
  }

  writeToFile(outputDirectory: TReceiptOutputPath, fileName: string, data: string): void {
    fs.writeFileSync(`${outputDirectory}/${fileName}`, data);
  }
}
