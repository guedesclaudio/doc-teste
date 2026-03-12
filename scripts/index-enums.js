#!/usr/bin/env node
/**
 * scripts/index-enums.js
 *
 * Recursively fetches Markdown enum files from GitHub (enums/lists/**\/*.md)
 * and builds src/data/enums-index.json.
 *
 * Usage:
 *   TOKEN=ghp_xxx node scripts/index-enums.js
 *
 * The token is required for private repos.
 */

const https = require('https');
const fs    = require('fs');
const path  = require('path');

// ── Config ─────────────────────────────────────────────────────────────────
const OWNER      = 'agriness-team';
const REPO       = 'ponto-b-sandbox';
const BRANCH     = 'development';
const ENUMS_PATH = 'enums/lists';
const OUTPUT     = path.resolve(__dirname, '../src/data/enums-index.json');
const TOKEN      = process.env.TOKEN;

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

// ── Recursively list all .md files ─────────────────────────────────────────
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

// ── Derive category from file path ─────────────────────────────────────────
// enums/lists/swine/animal.md         → "SWINE"
// enums/lists/animal_enumerations.md  → "ANIMAL"
function categoryFromPath(filePath) {
  const parts    = filePath.split('/');
  const listsIdx = parts.indexOf('lists');
  if (listsIdx === -1) return 'UNKNOWN';

  const afterLists = parts.slice(listsIdx + 1);
  if (afterLists.length > 1) {
    return afterLists[0].replace(/_/g, ' ').toUpperCase();
  }
  return afterLists[0]
    .replace(/(_enumerations)?\.md$/i, '')
    .replace(/_/g, ' ')
    .toUpperCase();
}

// ── Extract values from a text block ───────────────────────────────────────
// Matches:  - VALUE;
function extractValues(text) {
  const values = [];
  const re = /^[ \t]*-[ \t]+([A-Z][A-Z0-9_]*)[ \t]*;/gm;
  let m;
  while ((m = re.exec(text)) !== null) {
    if (!values.includes(m[1])) values.push(m[1]);
  }
  return values;
}

// ── Parse groups (### subheadings + values) from a section ─────────────────
function parseGroups(sectionContent) {
  const groups      = [];
  const subHeadingRe = /^###\s+(.+)$/gm;
  const subMatches  = [];
  let m;

  while ((m = subHeadingRe.exec(sectionContent)) !== null) {
    subMatches.push({ label: m[1].trim(), index: m.index + m[0].length });
  }

  if (subMatches.length === 0) {
    const values = extractValues(sectionContent);
    if (values.length > 0) groups.push({ label: '', values });
    return groups;
  }

  // Values before the first subgroup (ungrouped)
  const preValues = extractValues(sectionContent.slice(0, subMatches[0].index));
  if (preValues.length > 0) groups.push({ label: '', values: preValues });

  for (let i = 0; i < subMatches.length; i++) {
    const { label, index } = subMatches[i];
    const end     = subMatches[i + 1]?.index ?? sectionContent.length;
    const content = sectionContent.slice(index, end);
    const values  = extractValues(content);
    if (values.length > 0) groups.push({ label, values });
  }

  return groups;
}

// ── Parse a markdown file → EnumEntry[] ────────────────────────────────────
function parseMarkdown(content, filePath) {
  const category = categoryFromPath(filePath);
  const baseLink  = `https://github.com/${OWNER}/${REPO}/blob/${BRANCH}/${filePath}`;
  const enums     = [];

  // Match ## N. EnumName headings
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

    const groups = parseGroups(section);
    const values = groups.flatMap((g) => g.values);

    if (values.length === 0) continue;

    // "AnimalType (or AnimalGroupAnimalType)" → "animal_type"
    const enumId = name
      .replace(/\s*\(.*?\)\s*/g, '')
      .trim()
      .replace(/([A-Z])/g, (c, i) => (i === 0 ? c.toLowerCase() : `_${c.toLowerCase()}`))
      .replace(/__+/g, '_');

    enums.push({ name, enum: enumId, category, link: baseLink, values, groups });
  }

  return enums;
}

// ── Main ───────────────────────────────────────────────────────────────────
async function main() {
  if (!TOKEN) {
    console.warn('⚠  TOKEN not set — requests may be rate-limited or fail for private repos.');
  }

  console.log(`Listing markdown files under ${ENUMS_PATH} (recursive)…`);
  const mdFiles = await listMarkdownFiles(ENUMS_PATH);
  console.log(`Found ${mdFiles.length} markdown file(s)\n`);

  const allEnums = [];

  for (const file of mdFiles) {
    process.stdout.write(`  ${file.path} … `);
    const fileData = await get(file.url);
    const content  = Buffer.from(fileData.content, 'base64').toString('utf-8');
    const enums    = parseMarkdown(content, file.path);
    console.log(`${enums.length} enum(s)`);
    allEnums.push(...enums);
  }

  fs.mkdirSync(path.dirname(OUTPUT), { recursive: true });
  fs.writeFileSync(OUTPUT, JSON.stringify(allEnums, null, 2), 'utf-8');
  console.log(`\n✓ ${allEnums.length} enums indexed → ${path.relative(process.cwd(), OUTPUT)}`);
}

main().catch((err) => {
  console.error('\n✗ Indexing failed:', err.message);
  process.exit(1);
});
