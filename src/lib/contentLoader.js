export async function loadPageMarkdown(slug) {
    const url = `/content/pages/${slug}.en.md`;
    const res = await fetch(url);
    if (!res.ok) return null;
    return await res.text();
}

export async function loadBlueprintJSON(id) {
    const url = `/content/blueprints/${id}.json`;
    const res = await fetch(url);
    if (!res.ok) return null;
    return await res.json();
}

export async function loadSectorJSON(id) {
    const url = `/content/sectors/${id}.json`;
    const res = await fetch(url);
    if (!res.ok) return null;
    return await res.json();
}

export function parseMarkdownFrontmatter(markdown) {
    if (!markdown || !markdown.startsWith('---')) return { frontmatter: {}, content: markdown };
    
    const parts = markdown.split('---');
    if (parts.length < 3) return { frontmatter: {}, content: markdown };
    
    const frontmatterText = parts[1].trim();
    const content = parts.slice(2).join('---').trim();
    
    const frontmatter = {};
    frontmatterText.split('\n').forEach(line => {
        const match = line.match(/^([^:]+):\s*"?([^"]+)"?$/);
        if (match) {
            frontmatter[match[1].trim()] = match[2].trim();
        }
    });
    
    return { frontmatter, content };
}
