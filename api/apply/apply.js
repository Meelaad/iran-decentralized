import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

const resend = new Resend(process.env.RESEND_EMAIL_API_KEY);
const RATE_LIMIT_MAX = 3;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;

async function isRateLimited(ip) {
    const tenMinutesAgo = new Date(Date.now() - RATE_LIMIT_WINDOW_MS).toISOString();
    const { count, error } = await supabase
        .from('contact_attempts')
        .select('*', { count: 'exact', head: true })
        .eq('ip', ip)
        .gte('created_at', tenMinutesAgo);

    if (error) return false; // Fail open
    if (count >= RATE_LIMIT_MAX) return true;

    await supabase.from('contact_attempts').insert([{ ip }]);
    return false;
}

async function verifyTurnstile(token, ip) {
    const secret = process.env.TURNSTILE_CONTACT_SECRET_KEY;
    if (!secret) return true;
    const body = new URLSearchParams({ secret, response: token, remoteip: ip });
    try {
        const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: body.toString(),
        });
        const data = await res.json();
        return data.success === true;
    } catch {
        return false;
    }
}

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket?.remoteAddress || 'unknown';

    if (await isRateLimited(ip)) {
        return res.status(429).json({ error: 'Rate limit exceeded. Too many transmissions.' });
    }

    const { role, alias, contact, proof, message, captchaToken } = req.body;

    const captchaOk = await verifyTurnstile(captchaToken || '', ip);
    if (!captchaOk) return res.status(400).json({ error: 'Security verification failed.' });

    // Strict validation to prevent enormous payloads
    if (!alias || alias.length > 50) return res.status(400).json({ error: 'Invalid alias.' });
    if (!contact || contact.length > 100) return res.status(400).json({ error: 'Invalid contact.' });
    if (!proof || proof.length > 200 || !proof.includes('.')) return res.status(400).json({ error: 'Invalid proof of work link.' });
    if (!message || message.length > 3000) return res.status(400).json({ error: 'Message payload too large.' });

    try {
        await resend.emails.send({
            from: 'IranDAO Core <noreply@auth.irandao.org>', // Must match your verified domain
            to: process.env.CONTACT_RECIPIENT,
            subject: `[CLEARANCE REQUEST] Role: ${role} | Alias: ${alias}`,
            text: `
[NEW SOVEREIGN CONTRIBUTION DOSSIER]

ROLE TARGETED: ${role}
ALIAS/IDENTITY: ${alias}
SECURE COMMS: ${contact}
PROOF OF WORK: ${proof}

--- DECRYPTED INTENT ---
${message}
            `.trim(),
        });

        return res.status(200).json({ ok: true });
    } catch (err) {
        console.error('Apply Resend error:', err);
        return res.status(500).json({ error: 'Transmission failed at the network layer.' });
    }
}