const fs = require('fs');
const readline = require('readline');
const path = require('path');
const filePath = path.join(__dirname, 'text.txt');
const writeStream = fs.createWriteStream(filePath);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

console.log('Hello! Type some text. To exit, type "exit" or press Ctrl + C.');

rl.on('line', (input) => {
  if (input.toLowerCase() === 'exit') {
    console.log('Bye!');
    rl.close();
    writeStream.end();
    process.exit();
  } else {
    writeStream.write(input + '\n');
  }
});

process.on('SIGINT', () => {
  rl.close();
  writeStream.end();

  writeStream.on('finish', () => {
    console.log('Bye!');
    process.exit();
  });
});
