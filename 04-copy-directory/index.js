const fs = require('fs');
const path = require('path');
const sourceDir = path.join(__dirname, 'files');
const targetDir = path.join(__dirname, 'files-copy');

async function copyDir() {
  await fs.promises.mkdir(targetDir, { recursive: true });
  const files = await fs.promises.readdir(sourceDir);
  for (const file of files) {
    const sourceFilePath = path.join(sourceDir, file);
    const targetFilePath = path.join(targetDir, file);
    const stat = await fs.promises.stat(sourceFilePath);

    if (stat.isDirectory()) {
      await copyDir(sourceFilePath, targetFilePath);
    } else {
      await fs.promises.copyFile(sourceFilePath, targetFilePath);
    }
  }
}

copyDir();
