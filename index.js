const fs = require('fs');
const readLine = require('readline')
const { REGEX } = require('./config');

const red     = '\u001b[31m';
const green   = '\u001b[32m';
const yellow  = '\u001b[33m';
const reset   = '\u001b[0m';

try {
  fs.statSync('./import');
} catch(err) {
  console.log(`${red}Failed to find "import" directory${reset}`);
  return;
}

const files = fs.readdirSync('./import');
const sources = files.filter(fileName => fileName.match(REGEX));

if (!sources.length > 0) {
  console.log(`${yellow}No source file in ./import${reset}`);
  return;
}

sources.forEach((fileName, index) => {
  const filePath = `./import/${fileName}`;
  try {
    fs.statSync(filePath);
  } catch(err) {
    console.log(`${red}Failed to find ${fileName} in ./import${reset}`);
    return;
  }
  const readStream = fs.createReadStream(filePath);
  const reader = readLine.createInterface({ input: readStream });
  const output = [];
  reader.on('line', dataString => {
    output.push(`"${dataString}"`);
  });
  reader.on('close', () => {
    fs.writeFileSync(`./export/${fileName}.txt`, output.join('\n'));
  });
});

console.log(
  `${
    green
  }[ Finished ]${
    reset
  } Total: ${
    sources.length
  } file${
    sources.length > 1 ? 's' : ''
  }.`
  );
return;
