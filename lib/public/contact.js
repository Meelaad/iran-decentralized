import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

const RATE_LIMIT_MAX = 3;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const CLEANUP_AGE_MS = 24 * 60 * 60 * 1000;

function getSupabase() {
    return createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
}

async function isRateLimited(ip) {
    const supabase = getSupabase();
    const windowStart = new Date(Date.now() - RATE_LIMIT_WINDOW_MS).toISOString();

    const { count, error } = await supabase
        .from('contact_attempts')
        .select('*', { count: 'exact', head: true })
        .eq('ip', ip)
        .gte('created_at', windowStart);

    if (error) {
        console.error('contact rate limit check error:', error.message);
        return false; // fail open
    }

    if (count >= RATE_LIMIT_MAX) return true;

    await supabase.from('contact_attempts').insert([{ ip }]);

    // Fire-and-forget: trim rows older than 24h
    const cutoff = new Date(Date.now() - CLEANUP_AGE_MS).toISOString();
    supabase.from('contact_attempts').delete().lt('created_at', cutoff).then(() => {});

    return false;
}

const NAME_REGEX = /^[\u0600-\u06FFa-zA-Z\s'-]+$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

export async function sendContactEmail(req) {
    const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket?.remoteAddress || 'unknown';
    if (await isRateLimited(ip)) {
        throw { status: 429, error: 'Too many requests. Please wait a few minutes before trying again.' };
    }

    const { name, email, subject, message, captchaToken } = req.body || {};

    const captchaOk = await verifyTurnstile(captchaToken || '', ip);
    if (!captchaOk) {
        throw { status: 400, error: 'Captcha verification failed. Please try again.' };
    }

    const errors = [];

    if (name !== undefined && name !== '') {
        const trimmedName = String(name).trim();
        if (trimmedName.length < 2 || trimmedName.length > 80 || !NAME_REGEX.test(trimmedName)) {
            errors.push('Invalid name format.');
        }
    }

    const trimmedEmail = String(email || '').trim();
    if (!trimmedEmail) {
        errors.push('Email is required.');
    } else if (!EMAIL_REGEX.test(trimmedEmail) || trimmedEmail.length > 254) {
        errors.push('Invalid email address.');
    }

    const trimmedSubject = String(subject || '').trim();
    if (!trimmedSubject || trimmedSubject.length < 4 || trimmedSubject.length > 120) {
        errors.push('Subject must be between 4 and 120 characters.');
    }

    const trimmedMessage = String(message || '').trim();
    if (!trimmedMessage || trimmedMessage.length < 50 || trimmedMessage.length > 2000) {
        errors.push('Message must be between 50 and 2000 characters.');
    }

    if (errors.length > 0) {
        throw { status: 400, error: errors.join(' ') };
    }

    try {
        const resend = new Resend(process.env.RESEND_EMAIL_API_KEY);

        await resend.emails.send({
            from: 'IranDAO Contact <noreply@auth.irandao.org>',
            to: process.env.CONTACT_RECIPIENT,
            reply_to: trimmedEmail,
            subject: `[IranDAO Support] ${trimmedSubject}`,
            text: [
                `Name:    ${name ? String(name).trim() : 'Not provided'}`,
                `Email:   ${trimmedEmail}`,
                `Subject: ${trimmedSubject}`,
                '',
                trimmedMessage,
                '',
                '---',
                'Sent from IranDAO Contact Form',
            ].join('\n'),
        });

        return { ok: true };
    } catch (err) {
        console.error('Contact Resend error:', err?.message || err);
        throw { status: 500, error: 'Failed to send message. Please try again later.' };
    }
}
