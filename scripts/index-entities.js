#!/usr/bin/env node
/**
 * scripts/index-entities.js
 *
 * Recursively fetches Markdown entity files from GitHub (entities/lists/**\/*.md)
 * and builds src/data/entities-index.json.
 *
 * Usage:
 *   TOKEN=ghp_xxx node scripts/index-entities.js
 *
 * The token is required for private repos.
 */

const https = require('https');
const fs    = require('fs');
const path  = require('path');

// ── Config ─────────────────────────────────────────────────────────────────
const OWNER         = 'agriness-team';
const REPO          = 'ponto-b-sandbox';
const BRANCH        = 'development';
const ENTITIES_PATH = 'entities/lists';
const OUTPUT        = path.resolve(__dirname, '../src/data/entities-index.json');
const TOKEN         = process.env.TOKEN;

// ── HTTP helper ────────────────────────────────────────────────────────────
function get(url) {
  return new Promise((resolve, reject) => {
    const headers = {
      'User-Agent': 'sds-docs-indexer/1.0',
      'Accept':     'application/vnd.github+json',
    };
    if (TOKEN) headers['Authorization'] = `Bearer ${TOKEN}`;

    https.get(url, { headers }, (res) => {
      let raw = '';
      res.on('data', (c) => (raw += c));
      res.on('end', () => {
        if (res.statusCode >= 400) {
          reject(new Error(`HTTP ${res.statusCode} → ${url}\n${raw}`));
          return;
        }
        try { resolve(JSON.parse(raw)); }
        catch (e) { reject(new Error(`JSON parse error: ${e.message}`)); }
      });
    }).on('error', reject);
  });
}

// ── Recursively list all .md files under a GitHub path ────────────────────
// Skips README.md files.
async function listMarkdownFiles(dirPath) {
  const url     = `https://api.github.com/repos/${OWNER}/${REPO}/contents/${dirPath}?ref=${BRANCH}`;
  const entries = await get(url);

  const files = [];
  for (const entry of entries) {
    if (
      entry.type === 'file' &&
      entry.name.endsWith('.md') &&
      entry.name.toLowerCase() !== 'readme.md'
    ) {
      files.push(entry);
    } else if (entry.type === 'dir') {
      const subFiles = await listMarkdownFiles(entry.path);
      files.push(...subFiles);
    }
  }
  return files;
}

// ── Derive category from the file path ────────────────────────────────────
// entities/lists/swine/animal_gilt_empty.md → "SWINE"
// entities/lists/animal_gilt_empty.md       → "ANIMAL GILT EMPTY"
function categoryFromPath(filePath) {
  const parts    = filePath.split('/');
  const listsIdx = parts.indexOf('lists');
  if (listsIdx === -1) return 'UNKNOWN';

  const afterLists = parts.slice(listsIdx + 1);
  if (afterLists.length > 1) {
    return afterLists[0].replace(/_/g, ' ').toUpperCase();
  }
  return afterLists[0].replace(/\.md$/i, '').replace(/_/g, ' ').toUpperCase();
}

// ── Extract field names from a Python schema block ─────────────────────────
// Matches top-level lines like:  "farm_uuid": str,   "uuid": str,
function extractFields(code) {
  const fields = [];
  const re = /^\s+"(\w+)":/gm;
  let m;
  while ((m = re.exec(code)) !== null) {
    if (!fields.includes(m[1])) fields.push(m[1]);
  }
  return fields;
}

// ── Parse a markdown file → EntityEntry[] ─────────────────────────────────
function parseMarkdown(content, filePath) {
  const category = categoryFromPath(filePath);
  const baseLink  = `https://github.com/${OWNER}/${REPO}/blob/${BRANCH}/${filePath}`;
  const entities  = [];

  // Match ## N. Entity Name headings (sections within the file)
  const headingRe = /^##\s+(?:\d+\.\s+)?(.+)$/gm;
  const matches   = [];
  let m;

  while ((m = headingRe.exec(content)) !== null) {
    matches.push({ name: m[1].trim(), index: m.index + m[0].length });
  }

  for (let i = 0; i < matches.length; i++) {
    const { name, index } = matches[i];
    const end     = matches[i + 1]?.index ?? content.length;
    const section = content.slice(index, end);

    // First python block = schema (field definitions), second = example
    const blockRe = /```python\s*([\s\S]*?)```/g;
    const blocks  = [];
    let bm;
    while ((bm = blockRe.exec(section)) !== null) {
      blocks.push(bm[1].trim());
    }

    if (blocks.length === 0) continue;

    const schema  = blocks[0];
    const example = blocks[1] ?? '';
    const fields  = extractFields(schema);

    // "Animal - Swine - Gilt - Empty" → "animal_swine_gilt_empty"
    const entity = name.toLowerCase().replace(/[\s\-]+/g, '_').replace(/[^a-z0-9_]/g, '');

    entities.push({ name, entity, category, link: baseLink, fields, schema, example });
  }

  return entities;
}

// ── Main ───────────────────────────────────────────────────────────────────
async function main() {
  if (!TOKEN) {
    console.warn('⚠  TOKEN not set — requests may be rate-limited or fail for private repos.');
  }

  console.log(`Listing markdown files under ${ENTITIES_PATH} (recursive)…`);
  const mdFiles = await listMarkdownFiles(ENTITIES_PATH);
  console.log(`Found ${mdFiles.length} markdown file(s)\n`);

  const allEntities = [];

  for (const file of mdFiles) {
    process.stdout.write(`  ${file.path} … `);
    const fileData = await get(file.url);
    const content  = Buffer.from(fileData.content, 'base64').toString('utf-8');
    const entities = parseMarkdown(content, file.path);
    console.log(`${entities.length} entity(ies)`);
    allEntities.push(...entities);
  }

  fs.mkdirSync(path.dirname(OUTPUT), { recursive: true });
  fs.writeFileSync(OUTPUT, JSON.stringify(allEntities, null, 2), 'utf-8');
  console.log(`\n✓ ${allEntities.length} entities indexed → ${path.relative(process.cwd(), OUTPUT)}`);
}

main().catch((err) => {
  console.error('\n✗ Indexing failed:', err.message);
  process.exit(1);
});
