// scripts/merge-manifest.js
// ESM — matches package.json "type": "module"
//
// Merges generator-authoritative mechanical fields into the canonical site-manifest.json
// without touching human-authored descriptive fields (id, summary, pageLayout, keyComponents,
// primaryDataSources, navVisible, layout, notes, langNote, etc.).
//
// Workflow:
//   1. node scripts/generate-manifest.js          → produces site-manifest.generated.json
//   2. node scripts/merge-manifest.js             → merges into site-manifest.json
//   3. inspect site-manifest.json, then commit
//
// What this script updates from generated → canonical:
//   • blueprintIds  — authoritative (from src/data.js BLUEPRINTS keys)
//   • sectorIds     — authoritative (from src/data.js SECTORS); replaces coreSectorIds_from_SECTORS
//   • per route:
//       - componentName  (added if missing)
//       - dynamicParams  (replaced; authoritative from route path)
//       - redirectTo     (added/updated if generator has it)
//       - requiresAuth   (added if generator sets it true)
//   • new routes in generated that don't exist in canonical are appended with a TODO comment
//
// What this script NEVER touches:
//   id, summary, pageLayout, keyComponents, primaryDataSources, navVisible, layout,
//   component (canonical uses "redirect" for Navigate routes — cleaner than "react-router-dom"),
//   suggestedContentFiles (canonical has content/ prefix + richer list),
//   notes, langNote, and any other descriptive field not listed above.

import fs from 'fs/promises';
import path from 'path';

const root          = process.cwd();
const genPath       = path.join(root, 'site-manifest.generated.json');
const canonicalPath = path.join(root, 'site-manifest.json');

// ── Helpers ───────────────────────────────────────────────────────────────────

async function readJSON(p) {
    try { return JSON.parse(await fs.readFile(p, 'utf8')); }
    catch { return null; }
}

async function writeJSON(p, obj) {
    await fs.writeFile(p, JSON.stringify(obj, null, 2) + '\n', 'utf8');
}

// Normalize path: ensure leading slash, except wildcard
function normalizePath(p) {
    if (!p || p === '*') return p;
    return p.startsWith('/') ? p : '/' + p;
}

// Index routes by normalized path → { normalizedPath: routeObject }
function indexByPath(routes = []) {
    const map = new Map();
    for (const r of routes) {
        if (!r?.path) continue;
        map.set(normalizePath(r.path), r);
    }
    return map;
}

// ── Merge logic ───────────────────────────────────────────────────────────────

function mergeRoute(canonical, generated) {
    const out = { ...canonical };

    // componentName: add if canonical lacks it
    if ('componentName' in generated && !('componentName' in out)) {
        out.componentName = generated.componentName;
    }

    // dynamicParams: always replace — authoritative from route path string
    if (Array.isArray(generated.dynamicParams)) {
        out.dynamicParams = generated.dynamicParams;
    }

    // redirectTo: add/update if generator provides it
    if (generated.redirectTo != null) {
        out.redirectTo = generated.redirectTo;
    }

    // requiresAuth: add only if generator marks it true (never remove if canonical has it)
    if (generated.requiresAuth === true) {
        out.requiresAuth = true;
    }

    return out;
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
    const gen = await readJSON(genPath);
    if (!gen) {
        console.error('[merge-manifest] Generated manifest not found:', genPath);
        console.error('Run  node scripts/generate-manifest.js  first.');
        process.exit(2);
    }

    const canonical = await readJSON(canonicalPath);
    if (!canonical) {
        console.error('[merge-manifest] Canonical manifest not found:', canonicalPath);
        console.error('Nothing to merge into — commit an initial site-manifest.json first.');
        process.exit(2);
    }

    const merged = { ...canonical };

    // blueprintIds — authoritative from generator
    if (Array.isArray(gen.blueprintIds)) {
        merged.blueprintIds = gen.blueprintIds.slice();
    }

    // sectorIds — authoritative from generator; replace old coreSectorIds_from_SECTORS key if present
    if (Array.isArray(gen.sectorIds)) {
        delete merged.coreSectorIds_from_SECTORS;
        merged.sectorIds = gen.sectorIds.slice();
    }

    // Routes — merge by normalized path
    const canonRoutes = Array.isArray(canonical.routes) ? canonical.routes.slice() : [];
    const genRoutes   = Array.isArray(gen.routes)       ? gen.routes.slice()       : [];

    const canonMap = indexByPath(canonRoutes);
    let updated = 0;
    let appended = 0;

    for (const gr of genRoutes) {
        const np = normalizePath(gr.path);
        if (!np) continue;

        if (canonMap.has(np)) {
            const cr  = canonMap.get(np);
            const idx = canonRoutes.findIndex(r => normalizePath(r.path) === np);
            canonRoutes[idx] = mergeRoute(cr, gr);
            updated++;
        } else {
            // New route not in canonical — append with marker so author can add descriptive fields
            canonRoutes.push({
                ...gr,
                _TODO: 'New route — add id, summary, pageLayout, keyComponents, primaryDataSources',
            });
            appended++;
            console.log(`  [merge-manifest] New route appended: ${np}`);
        }
    }

    merged.routes    = canonRoutes;
    merged.mergedAt  = new Date().toISOString();

    await writeJSON(canonicalPath, merged);

    console.log(`[merge-manifest] Done.`);
    console.log(`  Updated : ${updated} existing routes`);
    console.log(`  Appended: ${appended} new routes`);
    if (appended > 0) {
        console.log('  ↳ New routes have a _TODO field — add descriptive metadata and remove _TODO before committing.');
    }
    console.log(`  Inspect ${path.relative(root, canonicalPath)} and commit when satisfied.`);
}

main().catch(err => { console.error('[merge-manifest]', err); process.exit(2); });
