import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, '../data');

const ERAS = ['ancient', 'medieval', 'early_modern', 'modern1', 'contemporary'];
const TYPES = ['person', 'year', 'event'];

for (const era of ERAS) {
  for (const type of TYPES) {
    const filePath = path.join(DATA_DIR, `${era}_${type}.json`);
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    data.forEach((item, index) => {
      item.id = index + 1;
    });
    fs.writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
    console.log(`${era}_${type}.json: ids 1–${data.length}`);
  }
}

console.log('Reindex complete.');
