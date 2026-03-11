#!/usr/bin/env node
/**
 * scripts/index-events.js
 *
 * Fetches Markdown event files from GitHub and builds src/data/events-index.json.
 *
 * Usage:
 *   GITHUB_TOKEN=ghp_xxx node scripts/index-events.js
 *
 * The token is required for private repos.
 */

const https = require('https');
const fs    = require('fs');
const path  = require('path');

// ── Config ─────────────────────────────────────────────────────────────────
const OWNER       = 'agriness-team';
const REPO        = 'ponto-b-sandbox';
const BRANCH      = 'development';
const EVENTS_PATH = 'events/lists';
const OUTPUT      = path.resolve(__dirname, '../src/data/events-index.json');
const TOKEN       = process.env.GITHUB_TOKEN;

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

// ── Extract field names from a Python dict schema string ───────────────────
// Matches lines like:  "farm_uuid": str,  or  "uuid": str,
function extractFieldsFromPython(code) {
  const fields = [];
  const re = /^\s+"(\w+)":\s+/gm;
  let m;
  while ((m = re.exec(code)) !== null) {
    if (!fields.includes(m[1])) fields.push(m[1]);
  }
  return fields;
}

// ── Extract EventType value from example block ─────────────────────────────
// Matches:  "type": EventType.ANIMAL_REGISTER  →  "animal_register"
function extractEventType(exampleCode) {
  const m = /"type"\s*:\s*EventType\.(\w+)/.exec(exampleCode);
  return m ? m[1].toLowerCase() : '';
}

// ── Parse a markdown file → EventEntry[] ──────────────────────────────────
function parseMarkdown(content, filename) {
  const category = filename.replace(/\.md$/i, '');
  const baseLink = `https://github.com/${OWNER}/${REPO}/blob/${BRANCH}/${EVENTS_PATH}/${filename}`;
  const events   = [];

  // Only target ### headings — these are the actual event names.
  // ## headings are category groups within the file.
  const sectionRegex = /^###\s+(.+)$/gm;
  const matches = [];
  let m;
  while ((m = sectionRegex.exec(content)) !== null) {
    matches.push({ title: m[2] ? m[2].trim() : m[1].trim(), rawMatch: m[1].trim(), index: m.index });
  }

  for (let i = 0; i < matches.length; i++) {
    const { rawMatch, index } = matches[i];
    const end     = matches[i + 1]?.index ?? content.length;
    const section = content.slice(index, end);

    // Collect all python code blocks in this section (schema first, example second)
    const blockRegex = /```python\s*([\s\S]*?)```/g;
    const blocks = [];
    let bm;
    while ((bm = blockRegex.exec(section)) !== null) {
      blocks.push(bm[1].trim());
    }

    // Need at least the schema block
    if (blocks.length === 0) continue;

    const schema    = blocks[0];
    const example   = blocks[1] ?? '';
    const fields    = extractFieldsFromPython(schema);
    const eventType = extractEventType(example);

    // Clean title: strip "a. " / "1. " prefixes
    const cleanName = rawMatch
      .replace(/^\d+\.\s+/, '')
      .replace(/^[a-z]\.\s+/i, '')
      .trim();

    events.push({
      name:     cleanName,
      rawTitle: rawMatch,
      category,
      link:     baseLink,
      fields,
      schema,
      example,
      eventType,
    });
  }

  return events;
}

// ── Main ───────────────────────────────────────────────────────────────────
async function main() {
  if (!TOKEN) {
    console.warn('⚠  GITHUB_TOKEN not set — requests may be rate-limited or fail for private repos.');
  }

  const listUrl = `https://api.github.com/repos/${OWNER}/${REPO}/contents/${EVENTS_PATH}?ref=${BRANCH}`;
  console.log('Fetching file list…');
  const entries = await get(listUrl);

  const mdFiles = entries.filter((f) => f.type === 'file' && f.name.endsWith('.md'));
  console.log(`Found ${mdFiles.length} markdown file(s)\n`);

  const allEvents = [];

  for (const file of mdFiles) {
    process.stdout.write(`  ${file.name} … `);
    const fileData = await get(file.url);
    const content  = Buffer.from(fileData.content, 'base64').toString('utf-8');
    const events   = parseMarkdown(content, file.name);
    console.log(`${events.length} event(s)`);
    allEvents.push(...events);
  }

  fs.mkdirSync(path.dirname(OUTPUT), { recursive: true });
  fs.writeFileSync(OUTPUT, JSON.stringify(allEvents, null, 2), 'utf-8');
  console.log(`\n✓ ${allEvents.length} events indexed → ${path.relative(process.cwd(), OUTPUT)}`);
}

main().catch((err) => {
  console.error('\n✗ Indexing failed:', err.message);
  process.exit(1);
});
