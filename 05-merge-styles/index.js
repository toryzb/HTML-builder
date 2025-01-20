const fs = require('fs');
const path = require('path');
const stylesDir = path.join(__dirname, 'styles');
const outputFile = path.join(__dirname, 'project-dist', 'bundle.css');

async function mergeStyles() {
  await fs.promises.writeFile(outputFile, '', 'utf-8');
  const files = await fs.promises.readdir(stylesDir);
  for (const file of files) {
    const filePath = path.join(stylesDir, file);
    const stat = await fs.promises.stat(filePath);
    if (stat.isFile() && path.extname(file) === '.css') {
      const fileContent = await fs.promises.readFile(filePath, 'utf-8');
      await fs.promises.appendFile(outputFile, fileContent + '\n', 'utf-8');
    }
  }
}

mergeStyles();
