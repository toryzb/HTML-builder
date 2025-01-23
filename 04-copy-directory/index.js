const fs = require('fs');
const path = require('path');
const sourceDir = path.join(__dirname, 'files');
const targetDir = path.join(__dirname, 'files-copy');

async function copyDir(sourceDir, targetDir) {
  await fs.promises.mkdir(targetDir, { recursive: true });
  const sourceFiles = await fs.promises.readdir(sourceDir);

  const targetFiles = await fs.promises.readdir(targetDir);

  for (const targetFile of targetFiles) {
    const targetFilePath = path.join(targetDir, targetFile);
    const sourceFilePath = path.join(sourceDir, targetFile);

    try {
      await fs.promises.stat(sourceFilePath);
    } catch (error) {
      await fs.promises.rm(targetFilePath, { recursive: true, force: true });
    }
  }

  for (const file of sourceFiles) {
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

copyDir(sourceDir, targetDir);
