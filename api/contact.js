import nodemailer from 'nodemailer';

// Basic in-memory rate limit: max 3 submissions per IP per 10 minutes
const rateLimitMap = new Map();
const RATE_LIMIT_MAX = 3;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;

function isRateLimited(ip) {
    const now = Date.now();
    const entry = rateLimitMap.get(ip);
    if (!entry) { rateLimitMap.set(ip, { count: 1, start: now }); return false; }
    if (now - entry.start > RATE_LIMIT_WINDOW_MS) { rateLimitMap.set(ip, { count: 1, start: now }); return false; }
    if (entry.count >= RATE_LIMIT_MAX) return true;
    entry.count++;
    return false;
}

const NAME_REGEX = /^[\u0600-\u06FFa-zA-Z\s'-]+$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket?.remoteAddress || 'unknown';
    if (isRateLimited(ip)) {
        return res.status(429).json({ error: 'Too many requests. Please wait a few minutes before trying again.' });
    }

    const { name, email, subject, message } = req.body || {};

    // Server-side validation
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
        return res.status(400).json({ error: errors.join(' ') });
    }

    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_APP_PASSWORD,
            },
        });

        await transporter.sendMail({
            from: `"IranDAO Contact" <${process.env.GMAIL_USER}>`,
            to: process.env.CONTACT_RECIPIENT,
            replyTo: trimmedEmail,
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

        return res.status(200).json({ ok: true });
    } catch {
        return res.status(500).json({ error: 'Failed to send message. Please try again later.' });
    }
}