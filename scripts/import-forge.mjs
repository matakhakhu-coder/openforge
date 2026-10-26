import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const dry = process.argv.includes('--dry-run');
const cfg = JSON.parse(fs.readFileSync(path.join(root, 'scripts', 'forge-import.config.json'), 'utf8'));

if (!cfg.enabled || !cfg.inputPath) {
  console.log('FORGE import is off. Set enabled and inputPath in scripts/forge-import.config.json.');
  process.exit(0);
}

const input = JSON.parse(fs.readFileSync(cfg.inputPath, 'utf8'));
if (!Array.isArray(input)) {
  console.error('Input must be a JSON array of { collection, slug, record }.');
  process.exit(1);
}

const categories = ['gazettes', 'tenders', 'municipal-finance', 'legal', 'other'];
const required = {
  resources: ['title', 'summary', 'category', 'publisher', 'url'],
  projects: ['title', 'summary', 'maintainer', 'url'],
};
const dirs = {
  resources: path.join(root, 'src', 'content', 'resources'),
  projects: path.join(root, 'src', 'content', 'projects'),
};

const knownUrls = new Set();
for (const dir of Object.values(dirs)) {
  for (const f of fs.readdirSync(dir).filter((n) => n.endsWith('.json'))) {
    const rec = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'));
    if (rec.url) knownUrls.add(rec.url.replace(/\/+$/, '').toLowerCase());
  }
}

const tally = { added: 0, existing: 0, duplicateUrl: 0, rejected: 0 };

for (const item of input) {
  const { collection, slug, record } = item ?? {};
  const label = `${collection}/${slug}`;
  const fields = required[collection];

  if (!fields || !/^[a-z0-9-]+$/.test(slug ?? '') || typeof record !== 'object' || record === null) {
    console.log(`REJECT ${label}: bad collection, slug or record`);
    tally.rejected++;
    continue;
  }
  const missing = fields.filter((k) => !record[k]);
  if (missing.length) {
    console.log(`REJECT ${label}: missing ${missing.join(', ')}`);
    tally.rejected++;
    continue;
  }
  try { new URL(record.url); } catch {
    console.log(`REJECT ${label}: url is not valid`);
    tally.rejected++;
    continue;
  }
  if (collection === 'resources' && !categories.includes(record.category)) {
    console.log(`REJECT ${label}: unknown category ${record.category}`);
    tally.rejected++;
    continue;
  }

  const file = path.join(dirs[collection], `${slug}.json`);
  if (fs.existsSync(file)) {
    console.log(`SKIP   ${label}: a record with that name already exists`);
    tally.existing++;
    continue;
  }
  const urlKey = record.url.replace(/\/+$/, '').toLowerCase();
  if (knownUrls.has(urlKey)) {
    console.log(`SKIP   ${label}: url already listed`);
    tally.duplicateUrl++;
    continue;
  }

  const out = {
    ...record,
    provenance: {
      origin: 'forge-export',
      status: 'unverified',
      confidence: 'low',
      checkedOn: null,
      ...(record.provenance?.notes ? { notes: record.provenance.notes } : {}),
    },
  };
  if (!dry) fs.writeFileSync(file, JSON.stringify(out, null, 2) + '\n', 'utf8');
  knownUrls.add(urlKey);
  console.log(`${dry ? 'WOULD ADD' : 'ADDED'} ${label}`);
  tally.added++;
}

console.log(`${dry ? 'Dry run. ' : ''}Added ${tally.added}, existing ${tally.existing}, duplicate url ${tally.duplicateUrl}, rejected ${tally.rejected}.`);