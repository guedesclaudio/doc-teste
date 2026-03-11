#!/usr/bin/env node
/**
 * scripts/index-entities.js
 *
 * Fetches Markdown inference files from GitHub and builds src/data/entities-index.json.
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
const OWNER          = 'agriness-team';
const REPO           = 'ponto-b-sandbox';
const BRANCH         = 'development';
const ENTITIES_PATH  = 'entities/inferences';
const OUTPUT         = path.resolve(__dirname, '../src/data/entities-index.json');
const TOKEN          = process.env.TOKEN;

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

// ── Extract field names from inference text ────────────────────────────────
// Matches lines like:  "farm_uuid": str (Common Root Inference): ...
function extractFields(text) {
  const fields = [];
  const re = /^\s*"(\w+)":/gm;
  let m;
  while ((m = re.exec(text)) !== null) {
    if (!fields.includes(m[1])) fields.push(m[1]);
  }
  return fields;
}

// ── Extract code blocks from a section ────────────────────────────────────
// Returns first ```json or ```python block found
function extractExample(text) {
  const m = /```(?:json|python)\s*([\s\S]*?)```/.exec(text);
  return m ? m[1].trim() : '';
}

// ── Extract raw inference field lines from a section ──────────────────────
// Lines that start with optional whitespace and a quoted field name
function extractInferences(text) {
  const lines = text.split('\n');
  const inferenceLines = [];
  let inCodeBlock = false;

  for (const line of lines) {
    if (line.trim().startsWith('```')) {
      inCodeBlock = !inCodeBlock;
      continue;
    }
    if (inCodeBlock) continue;

    // Keep lines that look like field definitions or descriptive text
    // Skip "Example:" markers and blank preamble
    if (/^\s*"(\w+)":/.test(line) || (inferenceLines.length > 0 && line.trim() !== '')) {
      inferenceLines.push(line);
    }
  }

  return inferenceLines.join('\n').trim();
}

// ── Derive category from filename ─────────────────────────────────────────
// "animal_inferences.md" → "ANIMAL"
// "animal_group_inferences.md" → "ANIMAL GROUP"
function categoryFromFilename(filename) {
  return filename
    .replace(/_inferences\.md$/i, '')
    .replace(/_/g, ' ')
    .toUpperCase();
}

// ── Parse a markdown file → EntityEntry[] ─────────────────────────────────
function parseMarkdown(content, filename) {
  const category = categoryFromFilename(filename);
  const baseLink  = `https://github.com/${OWNER}/${REPO}/blob/${BRANCH}/${ENTITIES_PATH}/${filename}`;
  const entities  = [];

  // Match section headings: ## 1. Animal  /  ### 1. Animal  /  ## Animal
  // Also handles plain numbered headings without markdown markers
  const headingRe = /^#{1,4}\s+(?:\d+\.\s+)?(.+)$/gm;
  const matches   = [];
  let m;

  while ((m = headingRe.exec(content)) !== null) {
    const title = m[1].trim();
    // Skip the document title (first heading, usually "List of X Inferences")
    if (/^list of/i.test(title)) continue;
    matches.push({ name: title, index: m.index + m[0].length });
  }

  // Fallback: plain numbered sections  "1. Animal"  at the start of a line
  if (matches.length === 0) {
    const plainRe = /^(\d+\.\s+(.+))$/gm;
    while ((m = plainRe.exec(content)) !== null) {
      matches.push({ name: m[2].trim(), index: m.index + m[0].length });
    }
  }

  for (let i = 0; i < matches.length; i++) {
    const { name, index } = matches[i];
    const end     = matches[i + 1]?.index ?? content.length;
    const section = content.slice(index, end);

    const fields     = extractFields(section);
    const inferences = extractInferences(section);
    const example    = extractExample(section);
    const entity     = name.toLowerCase().replace(/\s+/g, '_');

    entities.push({
      name,
      entity,
      category,
      link: baseLink,
      fields,
      inferences,
      example,
    });
  }

  return entities;
}

// ── Main ───────────────────────────────────────────────────────────────────
async function main() {
  if (!TOKEN) {
    console.warn('⚠  TOKEN not set — requests may be rate-limited or fail for private repos.');
  }

  const listUrl = `https://api.github.com/repos/${OWNER}/${REPO}/contents/${ENTITIES_PATH}?ref=${BRANCH}`;
  console.log('Fetching file list…');
  const entries = await get(listUrl);

  const mdFiles = entries.filter((f) => f.type === 'file' && f.name.endsWith('.md'));
  console.log(`Found ${mdFiles.length} markdown file(s)\n`);

  const allEntities = [];

  for (const file of mdFiles) {
    process.stdout.write(`  ${file.name} … `);
    const fileData = await get(file.url);
    const content  = Buffer.from(fileData.content, 'base64').toString('utf-8');
    const entities = parseMarkdown(content, file.name);
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
