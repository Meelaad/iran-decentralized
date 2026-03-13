// scripts/validate-manifest.js
// Node 18+ recommended. Run: node scripts/validate-manifest.js
import fs from 'fs';
import path from 'path';

const root = process.cwd();
const manifestPath = path.join(root, 'site-manifest.json');

function log(...args){ console.log(...args); }
function warn(...args){ console.warn(...args); }

if (!fs.existsSync(manifestPath)) {
    console.error('ERROR: site-manifest.json not found at repo root.');
    process.exit(2);
}

let manifest;
try {
    manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
} catch (e) {
    console.error('ERROR: Failed to parse site-manifest.json:', e.message);
    process.exit(2);
}

let problems = 0;

// Helper: if file pattern contains placeholders like {blueprintId} or {sectorId},
// check that the parent directory exists, otherwise check exact file exists.
function checkSuggestedPath(pattern) {
    const containsPlaceholder = /\{[^}]+\}/.test(pattern);
    const resolved = pattern.replace(/\{[^}]+\}/g, '');
    const candidate = path.join(root, resolved);
    if (containsPlaceholder) {
        // If resolved ends with path separator or empty, check the directory exists
        const dir = path.dirname(candidate) === '.' ? candidate : path.dirname(candidate);
        if (!fs.existsSync(path.join(root, dir))) {
            problems++;
            warn(`MISSING: directory for pattern "${pattern}" → expected dir: ${path.join(root, dir)}`);
            return false;
        }
        // Directory exists — acceptable; placeholder expected
        return true;
    } else {
        if (!fs.existsSync(candidate)) {
            problems++;
            warn(`MISSING: file expected by manifest: ${candidate}`);
            return false;
        }
        return true;
    }
}

// Validate suggested content files listed in manifest routes
if (Array.isArray(manifest.routes)) {
    for (const route of manifest.routes) {
        if (!route.suggestedContentFiles) continue;
        for (const f of route.suggestedContentFiles) {
            checkSuggestedPath(f);
        }
    }
} else {
    warn('Manifest has no routes array to validate.');
}

// Check blueprintIds in manifest exist in src/data.js BLUEPRINTS export
const dataJsPath = path.join(root, 'src', 'data.js');
if (fs.existsSync(dataJsPath)) {
    const dataJs = fs.readFileSync(dataJsPath, 'utf8');
    // Try to extract the BLUEPRINTS object keys
    // Find "export const BLUEPRINTS = {" and capture until closing "};"
    const start = dataJs.indexOf('export const BLUEPRINTS');
    if (start !== -1) {
        const after = dataJs.slice(start);
        const braceIdx = after.indexOf('{');
        if (braceIdx !== -1) {
            // naive balanced-brace scan
            let i = braceIdx;
            let depth = 0;
            let endIdx = -1;
            for (; i < after.length; i++) {
                const ch = after[i];
                if (ch === '{') depth++;
                if (ch === '}') {
                    depth--;
                    if (depth === 0) { endIdx = i; break; }
                }
            }
            if (endIdx !== -1) {
                const body = after.slice(braceIdx + 1, endIdx);
                // find unquoted keys like "id:" or keyName:
                const keys = Array.from(body.matchAll(/([A-Za-z0-9_]+)\s*:/g)).map(m => m[1]);
                if (manifest.blueprintIds && Array.isArray(manifest.blueprintIds)) {
                    const missing = manifest.blueprintIds.filter(id => !keys.includes(id));
                    if (missing.length) {
                        problems++;
                        warn('Manifest blueprintIds not found in src/data.js BLUEPRINTS:', missing.join(', '));
                    } else {
                        log('OK: manifest blueprintIds found in src/data.js');
                    }
                } else {
                    warn('Manifest has no blueprintIds array to validate.');
                }
            } else {
                warn('Unable to locate end of BLUEPRINTS object in src/data.js for validation.');
            }
        } else {
            warn('Could not locate "{" after export const BLUEPRINTS in src/data.js.');
        }
    } else {
        warn('src/data.js does not contain "export const BLUEPRINTS" — cannot validate blueprint IDs.');
    }
} else {
    warn('src/data.js not found; skipping blueprint ID validation.');
}

// Check content loader presence
const contentLoaderPath = path.join(root, 'src', 'lib', 'contentLoader.js');
if (!fs.existsSync(contentLoaderPath)) {
    problems++;
    warn('Missing content loader: expected', contentLoaderPath);
} else {
    log('OK: content loader found at src/lib/contentLoader.js');
}

// Report result and set exit code
if (problems === 0) {
    log('VALIDATION OK: No missing files detected (placeholders allowed).');
    process.exit(0);
} else {
    console.error(`VALIDATION FAILED: ${problems} problem(s) found.`);
    process.exit(2);
}