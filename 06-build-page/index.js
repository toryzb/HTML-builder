const fs = require('fs');
const path = require('path');

const distPath = path.join(__dirname, 'project-dist');
const assetsPath = path.join(__dirname, 'assets');
const stylesPath = path.join(__dirname, 'styles');
const distAssetsPath = path.join(distPath, 'assets');
const distStylePath = path.join(distPath, 'style.css');
const distIndexPath = path.join(distPath, 'index.html');
const templatePath = path.join(__dirname, 'template.html');
const componentsPath = path.join(__dirname, 'components');

async function copyDir(sourceDir, targetDir) {
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

async function mergeStyles() {
  await fs.promises.writeFile(distStylePath, '', 'utf-8');
  const files = await fs.promises.readdir(stylesPath);
  for (const file of files) {
    const filePath = path.join(stylesPath, file);
    const stat = await fs.promises.stat(filePath);
    if (stat.isFile() && path.extname(file) === '.css') {
      const fileContent = await fs.promises.readFile(filePath, 'utf-8');
      await fs.promises.appendFile(distStylePath, fileContent + '\n', 'utf-8');
    }
  }
}

async function createProjectDist() {
  await fs.promises.mkdir(distPath, { recursive: true });
  await fs.promises.mkdir(distAssetsPath, { recursive: true });
}

async function generateIndexHTML() {
  const templateContent = await fs.promises.readFile(templatePath, 'utf-8');
  let indexHTML = templateContent;

  const components = await fs.promises.readdir(componentsPath);

  for (const component of components) {
    const componentName = path.basename(component, '.html');
    const componentTag = `{{${componentName}}}`;
    const componentPath = path.join(componentsPath, component);

    if (path.extname(component) === '.html') {
      const componentContent = await fs.promises.readFile(
        componentPath,
        'utf-8',
      );
      indexHTML = indexHTML.replace(
        new RegExp(componentTag, 'g'),
        componentContent,
      );
    }
  }

  await fs.promises.writeFile(distIndexPath, indexHTML, 'utf-8');
}

async function buildPage() {
  await createProjectDist();
  await generateIndexHTML();
  await mergeStyles();
  await copyDir(assetsPath, distAssetsPath);
}

buildPage();
