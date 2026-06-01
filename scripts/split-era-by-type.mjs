import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, '../data');

const ERAS = ['ancient', 'medieval', 'early_modern', 'modern1', 'contemporary'];
const TYPES = ['person', 'year', 'event'];

for (const era of ERAS) {
  const srcPath = path.join(DATA_DIR, `${era}.json`);
  if (!fs.existsSync(srcPath)) {
    console.error(`Missing: ${srcPath}`);
    process.exit(1);
  }

  const data = JSON.parse(fs.readFileSync(srcPath, 'utf8'));
  if (!Array.isArray(data)) {
    console.error(`Not an array: ${srcPath}`);
    process.exit(1);
  }

  for (const type of TYPES) {
    const filtered = data.filter((item) => item.type === type);
    const outPath = path.join(DATA_DIR, `${era}_${type}.json`);
    fs.writeFileSync(outPath, `${JSON.stringify(filtered, null, 2)}\n`, 'utf8');
    console.log(`${era}_${type}.json: ${filtered.length} items`);
  }

  fs.unlinkSync(srcPath);
  console.log(`Deleted ${era}.json`);
}

console.log('Done: 15 type files created, 5 era files removed.');
