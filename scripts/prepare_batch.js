const fs = require('fs');
const path = require('path');

const fileList = process.argv.slice(2);
const root = path.resolve(__dirname, '..');

const files = fileList.map(relPath => {
  const fullPath = path.join(root, relPath);
  const content = fs.readFileSync(fullPath, 'utf8');
  return {
    path: relPath.replace(/\\/g, '/'),
    content
  };
});

fs.writeFileSync(path.join(__dirname, 'batch.json'), JSON.stringify(files, null, 2));
console.log(`Generated batch.json with ${files.length} files.`);
