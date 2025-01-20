const fs = require('fs');
const path = require('path');

const folderPath = path.join(__dirname, 'secret-folder');

async function displayFilesInfo() {
  const files = await fs.promises.readdir(folderPath, { withFileTypes: true });

  for (const file of files) {
    if (file.isFile()) {
      const filePath = path.join(folderPath, file.name);

      const stats = await fs.promises.stat(filePath);

      const extname = path.extname(file.name).slice(1);

      const sizeInKB = (stats.size / 1024).toFixed(3);

      console.log(`${file.name} - ${extname} - ${sizeInKB}kb`);
    }
  }
}

displayFilesInfo();
