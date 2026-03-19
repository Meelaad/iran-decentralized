const rateLimitStore = new Map();

const RATE_LIMITS = {
    auth: { max: 5, window: 15 * 60 * 1000 },
    api: { max: 100, window: 60 * 1000 },
    admin: { max: 20, window: 60 * 1000 },
    strict: { max: 3, window: 10 * 60 * 1000 },
};

function cleanupOldEntries() {
    const now = Date.now();
    for (const [key, entry] of rateLimitStore.entries()) {
        if (now - entry.start > entry.window) {
            rateLimitStore.delete(key);
        }
    }
}

setInterval(cleanupOldEntries, 5 * 60 * 1000).unref();

export function rateLimit(req, type = 'api') {
    const config = RATE_LIMITS[type] || RATE_LIMITS.api;
    const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket?.remoteAddress || 'unknown';
    const key = `${type}:ip:${ip}`;
    const now = Date.now();
    
    const entry = rateLimitStore.get(key);
    if (!entry) {
        rateLimitStore.set(key, { count: 1, start: now, window: config.window });
        return true;
    }
    
    if (now - entry.start > config.window) {
        rateLimitStore.set(key, { count: 1, start: now, window: config.window });
        return true;
    }
    
    if (entry.count >= config.max) {
        throw { status: 429, error: 'Too many requests. Please try again later.' };
    }
    
    entry.count++;
    return true;
}

// Per-user rate limiting — call AFTER authenticating the user.
// Keyed on user ID so multi-IP attackers are still throttled per account.
export function rateLimitUser(userId, type = 'strict') {
    const config = RATE_LIMITS[type] || RATE_LIMITS.strict;
    const key = `${type}:user:${userId}`;
    const now = Date.now();

    const entry = rateLimitStore.get(key);
    if (!entry) {
        rateLimitStore.set(key, { count: 1, start: now, window: config.window });
        return true;
    }

    if (now - entry.start > config.window) {
        rateLimitStore.set(key, { count: 1, start: now, window: config.window });
        return true;
    }

    if (entry.count >= config.max) {
        throw { status: 429, error: 'Too many requests. Please try again later.' };
    }

    entry.count++;
    return true;
}

export function validateRequestSize(req, maxBytes = 100 * 1024) {
    const contentLength = parseInt(req.headers['content-length'] || '0', 10);
    if (contentLength > maxBytes) {
        throw { status: 413, error: 'Request payload too large.' };
    }
}

export function sanitizeInput(input, maxLength = 1000) {
    if (typeof input !== 'string') return input;
    return input.slice(0, maxLength).trim();
}

export function setSecurityHeaders(res) {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
    res.setHeader('Content-Security-Policy', "default-src 'none'; frame-ancestors 'none'");
}
