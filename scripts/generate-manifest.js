// scripts/generate-manifest.js
// ESM (project package.json type: "module")
// Usage:
//   node scripts/generate-manifest.js         -> writes site-manifest.json
//   node scripts/generate-manifest.js --check -> compares generated vs committed and exits non-zero on difference

import fs from 'fs/promises';
import path from 'path';

const root = process.cwd();
const appPath = path.join(root, 'src', 'App.jsx');
const dataPath = path.join(root, 'src', 'data.js');
const outPath = path.join(root, 'site-manifest.generated.json'); // temp output
const committedPath = path.join(root, 'site-manifest.json');

function uniq(arr) { return Array.from(new Set(arr)); }
function detectParams(pathStr) {
    const re = /:([A-Za-z0-9_]+)/g;
    const out = [];
    let m;
    while ((m = re.exec(pathStr))) out.push(m[1]);
    return out;
}

async function readFileSafe(p) {
    try {
        return await fs.readFile(p, 'utf8');
    } catch (e) {
        return null;
    }
}

function extractRoutesFromApp(appSource) {
    // Very simple JSX regex-based extractor:
    // Finds <Route path="/..." element={<Comp .../>} ... />
    const routes = [];
    const routeRe = /<Route\s+[^>]*path\s*=\s*["']([^"']+)["'][^>]*element\s*=\s*\{\s*<([A-Za-z0-9_]+)[^>]*\/?>/g;
    let m;
    while ((m = routeRe.exec(appSource))) {
        const pathStr = m[1];
        const comp = m[2];
        routes.push({ path: pathStr, componentName: comp, dynamicParams: detectParams(pathStr) });
    }

    // Capture simple redirects like: <Route path="/blueprint" element={<Navigate to="/blueprint/gov/decentralized" replace />} />
    const navRe = /<Route\s+[^>]*path\s*=\s*["']([^"']+)["'][^>]*element\s*=\s*\{\s*<Navigate[^>]*to\s*=\s*["']([^"']+)["'][^>]*\/?>/g;
    while ((m = navRe.exec(appSource))) {
        const pathStr = m[1];
        const to = m[2];
        routes.push({ path: pathStr, componentName: 'Navigate', redirectTo: to, dynamicParams: detectParams(pathStr) });
    }

    return uniq(routes.map(r => JSON.stringify(r))).map(s => JSON.parse(s));
}

function extractImportMap(appSource) {
    // Map component names to file import specifiers (best-effort)
    const map = {};
    const importRe = /import\s+([A-Za-z0-9_{},\s*]+)\s+from\s+['"](.+?)['"]/g;
    let m;
    while ((m = importRe.exec(appSource))) {
        const names = m[1].trim();
        const spec = m[2];
        // names could be: Component, {X as Y, Z}, * as alias
        // We only map simple default imports and single-names
        const simpleNameMatch = names.match(/^([A-Za-z0-9_]+)$/);
        if (simpleNameMatch) {
            map[simpleNameMatch[1]] = spec;
        } else {
            // try to capture named imports { A, B }
            const named = names.match(/\{([^}]+)\}/);
            if (named) {
                const parts = named[1].split(',').map(p => p.trim().split(/\s+as\s+/)[0].trim());
                for (const p of parts) map[p] = spec;
            }
        }
    }
    return map;
}

function extractBlueprintIdsFromData(dataSource) {
    // Naive regex to find "export const BLUEPRINTS = { <keys> }"
    if (!dataSource) return [];
    const start = dataSource.indexOf('export const BLUEPRINTS');
    if (start === -1) return [];
    const after = dataSource.slice(start);
    const braceIndex = after.indexOf('{');
    if (braceIndex === -1) return [];
    let depth = 0;
    let endIndex = -1;
    for (let i = braceIndex; i < after.length; i++) {
        if (after[i] === '{') depth++;
        if (after[i] === '}') {
            depth--;
            if (depth === 0) { endIndex = i; break; }
        }
    }
    if (endIndex === -1) return [];
    const body = after.slice(braceIndex + 1, endIndex);
    const keys = Array.from(body.matchAll(/([A-Za-z0-9_]+)\s*:/g)).map(m => m[1]);
    return uniq(keys);
}

async function main() {
    const appSrc = await readFileSafe(appPath);
    const dataSrc = await readFileSafe(dataPath);

    const routes = appSrc ? extractRoutesFromApp(appSrc) : [];
    const importMap = appSrc ? extractImportMap(appSrc) : {};
    const blueprintIds = extractBlueprintIdsFromData(dataSrc);

    const manifest = {
        generatedAt: new Date().toISOString(),
        source: 'generator',
        routes: routes.map(r => ({
            path: r.path,
            component: importMap[r.componentName] || r.componentName || null,
            componentName: r.componentName || null,
            redirectTo: r.redirectTo || null,
            dynamicParams: r.dynamicParams || []
        })),
        blueprintIds: blueprintIds,
    };

    const outJson = JSON.stringify(manifest, null, 2);
    await fs.writeFile(outPath, outJson, 'utf8');
    console.log('Generated manifest ->', outPath);

    const args = process.argv.slice(2);
    if (args.includes('--check')) {
        // compare generated to committed
        let committed = null;
        try {
            committed = await fs.readFile(committedPath, 'utf8');
        } catch (e) {
            console.error('Committed manifest not found at', committedPath);
            console.error('Run without --check to overwrite site-manifest.json with generated manifest.');
            process.exit(2);
        }
        // normalize whitespace and compare
        const normA = JSON.stringify(JSON.parse(outJson));
        const normB = JSON.stringify(JSON.parse(committed));
        if (normA !== normB) {
            console.error('Manifest mismatch: generated manifest differs from committed site-manifest.json');
            console.error('Write generated file to', outPath, 'then inspect difference vs', committedPath);
            process.exit(2);
        } else {
            console.log('Manifest check OK: generated manifest matches committed site-manifest.json');
            process.exit(0);
        }
    } else {
        // Default: write to committed path (overwrite)
        try {
            await fs.writeFile(committedPath, outJson, 'utf8');
            console.log('Wrote site-manifest.json to repo root.');
            process.exit(0);
        } catch (e) {
            console.error('Failed to write site-manifest.json:', e.message);
            process.exit(2);
        }
    }
}

main().catch(err => { console.error(err); process.exit(2); });