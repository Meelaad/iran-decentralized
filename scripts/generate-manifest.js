// scripts/generate-manifest.js
// ESM — matches package.json "type": "module"
//
//   node scripts/generate-manifest.js           → writes site-manifest.generated.json only (safe; never touches canonical)
//   node scripts/generate-manifest.js --update  → also overwrites site-manifest.json (canonical)
//   node scripts/generate-manifest.js --check   → structural comparison vs canonical; exit 2 on mismatch
//
// Structural check compares: blueprintIds, sectorIds, and per-route (path, redirectTo, dynamicParams, requiresAuth).
// Descriptive fields (id, summary, pageLayout, keyComponents, etc.) are canonical-only and ignored by --check.
// To merge generator mechanical fields into canonical without losing descriptive metadata, run merge-manifest.js.

import fs from 'fs/promises';
import path from 'path';
import { pathToFileURL } from 'url';

const root          = process.cwd();
const appPath       = path.join(root, 'src', 'App.jsx');
const dataPath      = path.join(root, 'src', 'data.js');
const generatedPath = path.join(root, 'site-manifest.generated.json');
const committedPath = path.join(root, 'site-manifest.json');

// ── Helpers ───────────────────────────────────────────────────────────────────

async function readFileSafe(p) {
    try { return await fs.readFile(p, 'utf8'); } catch { return null; }
}

function detectParams(pathStr) {
    const re = /:([A-Za-z0-9_]+)/g;
    const out = [];
    let m;
    while ((m = re.exec(pathStr))) out.push(m[1]);
    return out;
}

// Normalize route paths: ensure leading slash, except wildcard "*"
function normalizePath(p) {
    if (!p || p === '*') return p;
    return p.startsWith('/') ? p : '/' + p;
}

// ── Import map ────────────────────────────────────────────────────────────────
// Maps component names → import specifiers (e.g. BlueprintViewer → './BlueprintViewer')

function extractImportMap(src) {
    const map = {};
    const re = /import\s+([A-Za-z0-9_{},\s*]+)\s+from\s+['"](.+?)['"]/g;
    let m;
    while ((m = re.exec(src))) {
        const names = m[1].trim();
        const spec  = m[2];
        const simple = names.match(/^([A-Za-z0-9_]+)$/);
        if (simple) { map[simple[1]] = spec; continue; }
        const named = names.match(/\{([^}]+)\}/);
        if (named) {
            for (const part of named[1].split(',')) {
                const name = part.trim().split(/\s+as\s+/)[0].trim();
                if (name) map[name] = spec;
            }
        }
    }
    return map;
}

// ── Route extraction ──────────────────────────────────────────────────────────
// Two passes:
//   1. Navigate redirects (navRe) — captures redirectTo destination
//   2. Regular component routes (routeRe) — skips Navigate to avoid duplicates

function extractRoutes(src) {
    const routes = [];
    let m;

    // Pass 1: <Navigate to="..." /> redirects
    const navRe = /<Route\s[^>]*path\s*=\s*["']([^"']+)["'][^>]*element\s*=\s*\{\s*<Navigate[^>]*to\s*=\s*["']([^"']+)["'][^>]*\/>/g;
    while ((m = navRe.exec(src))) {
        routes.push({
            path:          normalizePath(m[1]),
            componentName: 'Navigate',
            redirectTo:    m[2],
            dynamicParams: detectParams(m[1]),
        });
    }

    // Pass 2: regular component routes — skip Navigate (already captured) to prevent doubles
    const routeRe = /<Route\s[^>]*path\s*=\s*["']([^"']+)["'][^>]*element\s*=\s*\{\s*<([A-Za-z0-9_]+)[^>]*\/>/g;
    while ((m = routeRe.exec(src))) {
        if (m[2] === 'Navigate') continue;
        routes.push({
            path:          normalizePath(m[1]),
            componentName: m[2],
            redirectTo:    null,
            dynamicParams: detectParams(m[1]),
        });
    }

    // Deduplicate by exact JSON equality
    const seen = new Set();
    return routes.filter(r => {
        const key = JSON.stringify(r);
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
    });
}

// ── Route metadata ────────────────────────────────────────────────────────────
// suggestedContentFiles use content/ prefix to match canonical format

const CONTENT_FILE_RULES = [
    {
        test:  p => p === '/blueprint/gov/:blueprintId',
        files: ['content/blueprints/{blueprintId}.json'],
    },
    {
        test:  p => p === '/blueprint/gov/:blueprintId/sectors/:sectorId',
        files: ['content/sectors/{sectorId}.json'],
    },
    {
        test:  p => p === '/about',
        files: ['content/pages/about.en.md', 'content/pages/about.fa.md'],
    },
];

const AUTH_REQUIRED = new Set([
    '/profile',
    '/admin',
    '/my-blueprints',
    '/blueprint-editor/:blueprintId',
]);

function routeMeta(normalizedPath) {
    const meta = {};
    const cf = CONTENT_FILE_RULES.find(r => r.test(normalizedPath));
    if (cf) meta.suggestedContentFiles = cf.files;
    if (AUTH_REQUIRED.has(normalizedPath)) meta.requiresAuth = true;
    return meta;
}

// ── Data extraction ───────────────────────────────────────────────────────────

async function getDataExports() {
    try {
        const mod = await import(pathToFileURL(dataPath).href);
        const blueprintIds = mod.BLUEPRINTS ? Object.keys(mod.BLUEPRINTS) : [];
        const sectorIds    = mod.SECTORS    ? mod.SECTORS.map(s => s.id).filter(Boolean) : [];
        return { blueprintIds, sectorIds };
    } catch (err) {
        console.warn('[generate-manifest] Could not import src/data.js:', err.message);
        return { blueprintIds: [], sectorIds: [] };
    }
}

// ── Structural check helpers ──────────────────────────────────────────────────
// --check is ONE-DIRECTIONAL:
//   Every route the generator finds must exist in canonical with matching mechanical fields.
//   Extra canonical-only routes (documented history, removed routes) are allowed.
//   blueprintIds and sectorIds must match exactly (they are authoritative from data.js).

function routeKey(r) {
    return JSON.stringify({
        path:          normalizePath(r.path),
        redirectTo:    r.redirectTo    ?? null,
        dynamicParams: [...(r.dynamicParams || [])].sort(),
        requiresAuth:  r.requiresAuth  ?? false,
    });
}

function buildCanonicalRouteIndex(manifest) {
    const index = new Map();
    for (const r of (manifest.routes || [])) {
        if (!r?.path) continue;
        index.set(normalizePath(r.path), r);
    }
    return index;
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
    const args       = process.argv.slice(2);
    const checkMode  = args.includes('--check');
    const updateMode = args.includes('--update');

    const appSrc = await readFileSafe(appPath);
    if (!appSrc) { console.error('[generate-manifest] Cannot read src/App.jsx'); process.exit(2); }

    const importMap                   = extractImportMap(appSrc);
    const rawRoutes                   = extractRoutes(appSrc);
    const { blueprintIds, sectorIds } = await getDataExports();

    const routes = rawRoutes.map(r => ({
        path:          r.path,
        component:     importMap[r.componentName] ?? null,
        componentName: r.componentName,
        redirectTo:    r.redirectTo ?? null,
        dynamicParams: r.dynamicParams,
        ...routeMeta(r.path),
    }));

    const manifest = {
        generatedAt: new Date().toISOString(),
        source:      'generator',
        blueprintIds,
        sectorIds,
        routes,
    };

    const outJson = JSON.stringify(manifest, null, 2);

    // Always write inspection copy (never canonical)
    await fs.writeFile(generatedPath, outJson, 'utf8');
    console.log('[generate-manifest] Wrote', path.relative(root, generatedPath));
    console.log(`  blueprintIds (${blueprintIds.length}): ${blueprintIds.join(', ')}`);
    console.log(`  sectorIds    (${sectorIds.length}): ${sectorIds.join(', ')}`);
    console.log(`  routes       (${routes.length})`);

    if (checkMode) {
        const committed = await readFileSafe(committedPath);
        if (!committed) {
            console.error('[generate-manifest] Committed manifest not found:', committedPath);
            console.error('Run  node scripts/merge-manifest.js  to initialise it from generated output.');
            process.exit(2);
        }
        const canon       = JSON.parse(committed);
        const canonIndex  = buildCanonicalRouteIndex(canon);
        const failures    = [];

        // blueprintIds + sectorIds must match exactly
        const genBpIds  = [...blueprintIds].sort().join(',');
        const canBpIds  = [...(canon.blueprintIds || [])].sort().join(',');
        if (genBpIds !== canBpIds) failures.push(`blueprintIds mismatch: generated [${genBpIds}] vs canonical [${canBpIds}]`);

        const genSIds  = [...sectorIds].sort().join(',');
        const canSIds  = [...(canon.sectorIds || canon.coreSectorIds_from_SECTORS || [])].sort().join(',');
        if (genSIds !== canSIds) failures.push(`sectorIds mismatch: generated [${genSIds}] vs canonical [${canSIds}]`);

        // Every generated route must exist in canonical with matching mechanical fields
        for (const r of routes) {
            const np = normalizePath(r.path);
            if (!canonIndex.has(np)) {
                failures.push(`Route not in canonical: ${np}  →  run  npm run merge:manifest`);
                continue;
            }
            const cr = canonIndex.get(np);
            const genKey = routeKey(r);
            const canKey = routeKey(cr);
            if (genKey !== canKey) {
                failures.push(`Route mechanical fields differ: ${np}\n    generated: ${genKey}\n    canonical: ${canKey}`);
            }
        }

        if (failures.length > 0) {
            console.error('[generate-manifest] STRUCTURAL MISMATCH vs site-manifest.json:');
            for (const f of failures) console.error('  ✗', f);
            console.error('\nRun  npm run merge:manifest  to sync, then commit.');
            process.exit(2);
        }
        console.log('[generate-manifest] Structural check OK — canonical manifest is up to date.');
        process.exit(0);
    }

    if (updateMode) {
        await fs.writeFile(committedPath, outJson, 'utf8');
        console.log('[generate-manifest] --update: overwrote', path.relative(root, committedPath));
        console.log('  WARNING: all descriptive metadata (id, summary, pageLayout, etc.) was replaced.');
        console.log('  Use  node scripts/merge-manifest.js  instead to preserve descriptive fields.');
    } else {
        console.log('[generate-manifest] Canonical site-manifest.json NOT changed (use --update to overwrite or merge-manifest.js to merge).');
    }
}

main().catch(err => { console.error('[generate-manifest]', err); process.exit(2); });