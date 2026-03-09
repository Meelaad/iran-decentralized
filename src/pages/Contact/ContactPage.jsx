import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useLang } from '../../contexts/LangContext';
import './ContactPage.css';

const CONTENT = {
    eyebrow:  { en: 'SUPPORT',          fa: 'پشتیبانی' },
    title:    { en: 'Contact Us',        fa: 'تماس با ما' },
    subtitle: {
        en: 'Having an issue? Send us a message and we\'ll get back to you.',
        fa: 'مشکلی دارید؟ پیامی بفرستید تا در اسرع وقت پاسخ دهیم.',
    },
    labelName:    { en: 'NAME (OPTIONAL)',    fa: 'نام (اختیاری)' },
    labelEmail:   { en: 'EMAIL',             fa: 'ایمیل' },
    labelSubject: { en: 'SUBJECT',           fa: 'موضوع' },
    labelMessage: { en: 'MESSAGE',           fa: 'پیام' },
    placeholderName:    { en: 'Your name',               fa: 'نام شما' },
    placeholderEmail:   { en: 'you@example.com',         fa: 'you@example.com' },
    placeholderSubject: { en: 'What is this about?',     fa: 'موضوع پیام شما چیست؟' },
    placeholderMessage: {
        en: 'Please describe your issue in detail...',
        fa: 'لطفاً مشکل خود را با جزئیات توضیح دهید...',
    },
    btnSend: { en: 'SEND MESSAGE', fa: 'ارسال پیام' },
    successTitle: { en: 'Message Sent',      fa: 'پیام ارسال شد' },
    successBody:  {
        en: 'We received your message and will respond to your email shortly.',
        fa: 'پیام شما دریافت شد. به زودی از طریق ایمیل پاسخ خواهیم داد.',
    },
    successTag: { en: 'RECEIVED', fa: 'دریافت شد' },
    errors: {
        nameInvalid:      { en: 'Name may only contain letters and spaces.',        fa: 'نام فقط می‌تواند شامل حروف و فاصله باشد.' },
        emailRequired:    { en: 'Email address is required.',                       fa: 'آدرس ایمیل الزامی است.' },
        emailInvalid:     { en: 'Please enter a valid email address.',              fa: 'لطفاً یک آدرس ایمیل معتبر وارد کنید.' },
        subjectRequired:  { en: 'Subject is required.',                             fa: 'موضوع الزامی است.' },
        subjectShort:     { en: 'Subject must be at least 4 characters.',           fa: 'موضوع باید حداقل ۴ کاراکتر باشد.' },
        subjectLong:      { en: 'Subject must be under 120 characters.',            fa: 'موضوع باید کمتر از ۱۲۰ کاراکتر باشد.' },
        messageRequired:  { en: 'Message is required.',                             fa: 'پیام الزامی است.' },
        messageShort:     { en: 'Please write at least a sentence (50 characters).', fa: 'لطفاً حداقل یک جمله بنویسید (۵۰ کاراکتر).' },
        messageLong:      { en: 'Message must be under 2000 characters.',           fa: 'پیام باید کمتر از ۲۰۰۰ کاراکتر باشد.' },
        generic:          { en: 'Failed to send. Please try again.',                fa: 'ارسال ناموفق بود. لطفاً دوباره تلاش کنید.' },
        rateLimit:        { en: 'Too many requests. Please wait a few minutes.',    fa: 'درخواست‌های زیادی ارسال شده. لطفاً چند دقیقه صبر کنید.' },
    },
};

const NAME_REGEX  = /^[\u0600-\u06FFa-zA-Z\s'-]+$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MSG_MIN = 50;
const MSG_MAX = 2000;

export default function ContactPage() {
    const { t, isRTL } = useLang();
    const [searchParams] = useSearchParams();
    const monoFont    = { fontFamily: "'IBM Plex Mono', monospace" };
    const headingFont = { fontFamily: isRTL ? "'Vazirmatn', sans-serif" : "'Inter', sans-serif" };
    const labelStyle  = { ...monoFont, textAlign: isRTL ? 'right' : 'left' };

    const [name,    setName]    = useState('');
    const [email,   setEmail]   = useState('');
    const [subject, setSubject] = useState(searchParams.get('subject') || '');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [error,   setError]   = useState(null);
    const [success, setSuccess] = useState(false);

    // If subject pre-fill changes (unlikely but safe)
    useEffect(() => {
        const pre = searchParams.get('subject');
        if (pre) setSubject(pre);
    }, []); // eslint-disable-line

    function validate() {
        const errs = [];

        if (name.trim()) {
            if (name.trim().length < 2 || name.trim().length > 80 || !NAME_REGEX.test(name.trim()))
                errs.push(t(CONTENT.errors.nameInvalid));
        }

        if (!email.trim()) {
            errs.push(t(CONTENT.errors.emailRequired));
        } else if (!EMAIL_REGEX.test(email.trim()) || email.trim().length > 254) {
            errs.push(t(CONTENT.errors.emailInvalid));
        }

        if (!subject.trim()) {
            errs.push(t(CONTENT.errors.subjectRequired));
        } else if (subject.trim().length < 4) {
            errs.push(t(CONTENT.errors.subjectShort));
        } else if (subject.trim().length > 120) {
            errs.push(t(CONTENT.errors.subjectLong));
        }

        if (!message.trim()) {
            errs.push(t(CONTENT.errors.messageRequired));
        } else if (message.trim().length < MSG_MIN) {
            errs.push(t(CONTENT.errors.messageShort));
        } else if (message.trim().length > MSG_MAX) {
            errs.push(t(CONTENT.errors.messageLong));
        }

        return errs;
    }

    async function handleSubmit(e) {
        e.preventDefault();
        const errs = validate();
        if (errs.length) { setError(errs); return; }
        setError(null);
        setLoading(true);
        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name:    name.trim() || undefined,
                    email:   email.trim(),
                    subject: subject.trim(),
                    message: message.trim(),
                }),
            });
            const data = await res.json();
            if (!res.ok) {
                const msg = data.error?.toLowerCase() || '';
                setError(msg.includes('too many') || msg.includes('rate')
                    ? t(CONTENT.errors.rateLimit)
                    : t(CONTENT.errors.generic));
                return;
            }
            setSuccess(true);
        } catch {
            setError(t(CONTENT.errors.generic));
        } finally {
            setLoading(false);
        }
    }

    const msgLen = message.length;
    const msgNearLimit = msgLen > MSG_MAX * 0.85;

    return (
        <div className="contact-page">
            <div className="contact-bg-grid" />
            <div className="contact-scanline" />

            <div className="contact-inner">
                <div className="contact-header">
                    <div className="contact-eyebrow" style={monoFont}>{t(CONTENT.eyebrow)}</div>
                    <h1 className="contact-title" style={headingFont}>{t(CONTENT.title)}</h1>
                    <p className="contact-subtitle">{t(CONTENT.subtitle)}</p>
                </div>

                <div className="contact-card">
                    {error && (
                        <div className="contact-error" role="alert">
                            <span className="contact-error-icon">⚠</span>
                            <ul className="contact-error-list">
                                {(Array.isArray(error) ? error : [error]).map((e, i) => (
                                    <li key={i}>{e}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {success ? (
                        <div className="contact-success">
                            <span className="contact-success-icon">⬡</span>
                            <h2 className="contact-success-title" style={headingFont}>
                                {t(CONTENT.successTitle)}
                            </h2>
                            <p className="contact-success-body">{t(CONTENT.successBody)}</p>
                            <span className="contact-success-tag" style={monoFont}>
                                {t(CONTENT.successTag)}
                            </span>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} noValidate dir={isRTL ? 'rtl' : 'ltr'}>

                            {/* Name */}
                            <div className="contact-field">
                                <label className="contact-label" style={labelStyle} htmlFor="ct-name">
                                    {t(CONTENT.labelName)}
                                </label>
                                <input
                                    id="ct-name"
                                    className="contact-input"
                                    type="text"
                                    autoComplete="name"
                                    placeholder={t(CONTENT.placeholderName)}
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    disabled={loading}
                                    maxLength={80}
                                    dir={isRTL ? 'rtl' : 'auto'}
                                />
                            </div>

                            {/* Email */}
                            <div className="contact-field">
                                <label className="contact-label" style={labelStyle} htmlFor="ct-email">
                                    {t(CONTENT.labelEmail)}
                                </label>
                                <input
                                    id="ct-email"
                                    className="contact-input"
                                    type="email"
                                    inputMode="email"
                                    autoComplete="email"
                                    placeholder={t(CONTENT.placeholderEmail)}
                                    value={email}
                                    onChange={e => setEmail(e.target.value.replace(/[^\x00-\x7F]/g, ''))}
                                    disabled={loading}
                                    maxLength={254}
                                    dir="ltr"
                                />
                            </div>

                            {/* Subject */}
                            <div className="contact-field">
                                <label className="contact-label" style={labelStyle} htmlFor="ct-subject">
                                    {t(CONTENT.labelSubject)}
                                </label>
                                <input
                                    id="ct-subject"
                                    className="contact-input"
                                    type="text"
                                    placeholder={t(CONTENT.placeholderSubject)}
                                    value={subject}
                                    onChange={e => setSubject(e.target.value)}
                                    disabled={loading}
                                    maxLength={120}
                                    dir={isRTL ? 'rtl' : 'ltr'}
                                />
                            </div>

                            {/* Message */}
                            <div className="contact-field">
                                <div className="contact-label-row">
                                    <label className="contact-label" style={labelStyle} htmlFor="ct-message">
                                        {t(CONTENT.labelMessage)}
                                    </label>
                                    <span
                                        className="contact-char-count"
                                        style={{ ...monoFont, color: msgNearLimit ? '#ffa726' : undefined }}
                                    >
                                        {msgLen}/{MSG_MAX}
                                    </span>
                                </div>
                                <textarea
                                    id="ct-message"
                                    className="contact-textarea"
                                    placeholder={t(CONTENT.placeholderMessage)}
                                    value={message}
                                    onChange={e => setMessage(e.target.value)}
                                    disabled={loading}
                                    maxLength={MSG_MAX}
                                    rows={6}
                                    dir={isRTL ? 'rtl' : 'ltr'}
                                />
                                {message.trim().length > 0 && message.trim().length < MSG_MIN && (
                                    <div className="contact-msg-hint" style={monoFont}>
                                        {isRTL
                                            ? `${MSG_MIN - message.trim().length} کاراکتر دیگر لازم است`
                                            : `${MSG_MIN - message.trim().length} more characters needed`}
                                    </div>
                                )}
                            </div>

                            <button
                                type="submit"
                                className="contact-submit-btn"
                                disabled={loading}
                                style={monoFont}
                            >
                                {loading && <span className="contact-spinner" />}
                                {t(CONTENT.btnSend)}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}