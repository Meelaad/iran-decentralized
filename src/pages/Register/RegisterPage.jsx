import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useLang } from '../../components/Layout/Layout';
import { supabase } from '../../lib/supabase';
import './RegisterPage.css';

// ── Bilingual content ────────────────────────────────────────────────────────

const CONTENT = {
    eyebrow:       { en: "CITIZEN PORTAL",          fa: "پورتال شهروندی" },
    title:         { en: "Join IranDAO",             fa: "به ایران‌دائو بپیوندید" },
    subtitle: {
        en: "Register your sovereign digital identity. No passwords. Your email is your key.",
        fa: "هویت دیجیتال مستقل خود را ثبت کنید. بدون رمز عبور. ایمیل شما کلید شماست.",
    },
    stepLabels:    [
        { en: "DETAILS",  fa: "اطلاعات" },
        { en: "VERIFY",   fa: "تأیید" },
    ],
    typeCitizen:   { en: "Citizen",   fa: "شهروند داخلی" },
    typeDiaspora:  { en: "Diaspora",  fa: "دیاسپورا" },
    labelName:     { en: "FULL NAME", fa: "نام و نام خانوادگی" },
    labelCountry:  { en: "COUNTRY",   fa: "کشور" },
    labelEmail:    { en: "EMAIL",      fa: "ایمیل" },
    placeholderName:    { en: "Your full name",    fa: "نام کامل شما" },
    placeholderEmail:   { en: "you@example.com",   fa: "you@example.com" },
    selectCountry:      { en: "Select your country", fa: "کشور خود را انتخاب کنید" },
    btnSend:   { en: "SEND VERIFICATION CODE", fa: "ارسال کد تأیید" },
    btnVerify: { en: "VERIFY & JOIN",           fa: "تأیید و پیوستن" },
    btnBack:   { en: "← BACK",                  fa: "← بازگشت" },
    btnResend: { en: "Resend code",              fa: "ارسال مجدد کد" },
    verifyText: {
        en: "We sent a 6-digit code to",
        fa: "یک کد ۶ رقمی به این آدرس ارسال شد",
    },
    verifyHint: {
        en: "Enter the 6-digit code from your email. Check spam if you don't see it.",
        fa: "کد ۶ رقمی را از ایمیل خود وارد کنید. اگر آن را نمی‌بینید پوشه اسپم را بررسی کنید.",
    },
    otpLabel: { en: "VERIFICATION CODE", fa: "کد تأیید" },
    successTitle:  { en: "Identity Registered",       fa: "هویت ثبت شد" },
    successBody:   {
        en: "Your sovereign digital identity has been created. Welcome to IranDAO.",
        fa: "هویت دیجیتال مستقل شما ایجاد شد. به ایران‌دائو خوش آمدید.",
    },
    successTag:    { en: "ACCESS GRANTED",  fa: "دسترسی تأیید شد" },
    footnote: {
        en: "No passwords stored. No seed phrases. Your email verifies your identity.",
        fa: "هیچ رمز عبوری ذخیره نمی‌شود. بدون عبارت بازیابی. ایمیل شما هویت شما را تأیید می‌کند.",
    },
    errors: {
        nameRequired:    { en: "Full name is required.",        fa: "نام کامل الزامی است." },
        nameInvalid:     { en: "Please enter your name correctly.", fa: "لطفاً نام خود را به درستی وارد کنید." },
        countryRequired:     { en: "Please select your country.",      fa: "لطفاً کشور خود را انتخاب کنید." },
        countryNameInvalid:  { en: "Please enter a valid country name.", fa: "لطفاً یک نام کشور معتبر وارد کنید." },
        emailRequired:       { en: "Email address is required.",         fa: "آدرس ایمیل الزامی است." },
        emailInvalid:        { en: "Please use a valid email address.",  fa: "لطفاً یک آدرس ایمیل معتبر وارد کنید." },
        emailDomain:     { en: "Please use a recognised email provider or institutional address.", fa: "لطفاً از یک ارائه‌دهنده ایمیل شناخته‌شده یا آدرس ایمیل دانشگاهی استفاده کنید." },
        otpIncomplete:   { en: "Please enter the full 6-digit code.", fa: "لطفاً کد ۶ رقمی را کامل وارد کنید." },
        generic:         { en: "Something went wrong. Please try again.", fa: "خطایی رخ داد. لطفاً دوباره تلاش کنید." },
    },
};

// ── Country list ─────────────────────────────────────────────────────────────

const COUNTRIES = [
    "Iran",
    "United States", "Germany", "United Kingdom", "Canada", "Sweden",
    "France", "Netherlands", "United Arab Emirates", "Turkey", "Australia",
    "Norway", "Italy", "Denmark", "Switzerland", "Austria", "Belgium",
    "Spain", "Greece", "Finland", "Japan", "South Korea", "Malaysia",
    "Georgia", "Armenia", "Azerbaijan", "Russia", "Tajikistan",
    "Afghanistan", "Pakistan", "India", "Iraq", "Israel",
    "Qatar", "Kuwait", "Bahrain", "Oman", "Saudi Arabia",
    "Brazil", "Argentina", "New Zealand", "Ireland", "Portugal",
    "Czech Republic", "Poland", "Hungary", "Romania",
    "Other",
];

// ── Validation constants ──────────────────────────────────────────────────────

// Letters only: Latin + Persian/Arabic Unicode block + spaces
const NAME_REGEX = /^[\u0600-\u06FFa-zA-Z\s]+$/;

// Custom country: English letters, spaces, hyphens only — must start and end with a letter
const COUNTRY_NAME_REGEX = /^[a-zA-Z][a-zA-Z\s-]*[a-zA-Z]$/;

// Common personal email providers
const ALLOWED_DOMAINS = new Set([
    // Google
    'gmail.com', 'googlemail.com',
    // Microsoft
    'hotmail.com', 'hotmail.co.uk', 'hotmail.fr', 'hotmail.de', 'hotmail.es',
    'hotmail.it', 'hotmail.ca', 'hotmail.com.au', 'hotmail.be', 'hotmail.nl',
    'outlook.com', 'outlook.co.uk', 'outlook.fr', 'outlook.de', 'outlook.es',
    'live.com', 'live.co.uk', 'live.fr', 'live.de', 'live.ca', 'live.com.au',
    'msn.com',
    // Yahoo
    'yahoo.com', 'yahoo.co.uk', 'yahoo.fr', 'yahoo.de', 'yahoo.es', 'yahoo.it',
    'yahoo.ca', 'yahoo.com.au', 'yahoo.co.jp', 'yahoo.co.in', 'ymail.com',
    // Apple
    'icloud.com', 'me.com', 'mac.com',
    // Privacy-focused
    'protonmail.com', 'proton.me', 'pm.me', 'tutanota.com', 'tuta.io',
    // Other mainstream
    'aol.com', 'zoho.com', 'fastmail.com', 'fastmail.fm',
    'gmx.com', 'gmx.net', 'gmx.de', 'gmx.at', 'gmx.ch', 'mail.com',
    'yandex.com', 'yandex.ru',
    // Iran-specific
    'chmail.ir', 'iran.ir',
]);

// Academic/institutional domain suffixes — covers universities worldwide
const ACADEMIC_SUFFIXES = [
    '.edu',       // United States
    '.ac.uk',     // United Kingdom
    '.ac.ir',     // Iran
    '.edu.au',    // Australia
    '.ac.nz',     // New Zealand
    '.ac.za',     // South Africa
    '.edu.tr',    // Turkey
    '.ac.jp',     // Japan
    '.edu.cn',    // China
    '.ac.in',     // India
    '.edu.pk',    // Pakistan
    '.edu.se',    // Sweden
    '.edu.sg',    // Singapore
    '.edu.my',    // Malaysia
    '.ac.ae',     // UAE
    '.edu.de',    // Germany (some institutions)
];

function capitalizeName(val) {
    if (/[\u0600-\u06FF]/.test(val)) return val;
    return val.replace(/(^|\s)([a-zA-Z])/g, (_, space, ch) => space + ch.toUpperCase());
}

function isAllowedDomain(email) {
    const domain = email.split('@')[1]?.toLowerCase();
    if (!domain) return false;
    if (ALLOWED_DOMAINS.has(domain)) return true;
    return ACADEMIC_SUFFIXES.some(suffix => domain.endsWith(suffix));
}

// ── OTP digit boxes ───────────────────────────────────────────────────────────

function OtpInput({ value, onChange, disabled }) {
    const refs = useRef([]);
    const digits = Array.from({ length: 6 }, (_, i) => value[i] || '');

    const updateDigit = useCallback((index, char) => {
        const newDigits = [...digits];
        newDigits[index] = char;
        onChange(newDigits.join(''));
    }, [digits, onChange]);

    const handleChange = (e, index) => {
        const char = e.target.value.replace(/\D/g, '').slice(-1);
        updateDigit(index, char);
        if (char && index < 5) refs.current[index + 1]?.focus();
    };

    const handleKeyDown = (e, index) => {
        if (e.key === 'Backspace') {
            if (digits[index]) {
                updateDigit(index, '');
            } else if (index > 0) {
                refs.current[index - 1]?.focus();
                updateDigit(index - 1, '');
            }
        } else if (e.key === 'ArrowLeft' && index > 0) {
            refs.current[index - 1]?.focus();
        } else if (e.key === 'ArrowRight' && index < 5) {
            refs.current[index + 1]?.focus();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
        onChange(pasted.padEnd(6, '').slice(0, 6).trimEnd());
        const focusIndex = Math.min(pasted.length, 5);
        refs.current[focusIndex]?.focus();
    };

    return (
        <div className="reg-otp-boxes">
            {digits.map((d, i) => (
                <input
                    key={i}
                    ref={el => refs.current[i] = el}
                    className={`reg-otp-digit${d ? ' is-filled' : ''}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={d}
                    disabled={disabled}
                    onChange={e => handleChange(e, i)}
                    onKeyDown={e => handleKeyDown(e, i)}
                    onPaste={handlePaste}
                    autoComplete="one-time-code"
                    aria-label={`Digit ${i + 1}`}
                />
            ))}
        </div>
    );
}

// Progressive cooldowns: initial → 1 min, 1st resend → 5 min, 2nd+ resend → 10 min
const COOLDOWN_SCHEDULE = [60, 300, 600];

function getCooldown(attempt) {
    return COOLDOWN_SCHEDULE[Math.min(attempt, COOLDOWN_SCHEDULE.length - 1)];
}

function formatCooldown(seconds) {
    if (seconds < 60) return `${seconds}s`;
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
}

// ── Main component ────────────────────────────────────────────────────────────

export default function RegisterPage() {
    const { t, isRTL } = useLang();
    const monoFont   = { fontFamily: "'IBM Plex Mono', monospace" };
    const headingFont = { fontFamily: isRTL ? "'Vazirmatn', sans-serif" : "'Inter', sans-serif" };
    const labelStyle  = { ...monoFont, textAlign: isRTL ? 'right' : 'left' };

    // Session check
    const [sessionUser, setSessionUser] = useState(undefined); // undefined = loading, null = none, object = user

    useEffect(() => {
        supabase.auth.getSession().then(({ data }) => {
            setSessionUser(data.session?.user ?? null);
        });
    }, []);

    // Form state
    const [step, setStep] = useState('form');          // 'form' | 'verify' | 'success'
    const [userType, setUserType] = useState('citizen');
    const [fullName, setFullName] = useState('');
    const [country, setCountry] = useState('');
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [customCountry, setCustomCountry] = useState('');
    const [cooldown, setCooldown] = useState(0);
    const [resendCount, setResendCount] = useState(0);

    // Start cooldown whenever the verify step is entered
    useEffect(() => {
        if (step === 'verify') setCooldown(getCooldown(0));
    }, [step]);


    // Tick the cooldown down every second
    useEffect(() => {
        if (cooldown <= 0) return;
        const timer = setTimeout(() => setCooldown(c => c - 1), 1000);
        return () => clearTimeout(timer);
    }, [cooldown]);

    // ── Validation ─────────────────────────────────────────────────────────

    function validateForm() {
        const errs = [];

        const name = fullName.trim();
        if (!name) {
            errs.push(t(CONTENT.errors.nameRequired));
        } else {
            const parts = name.split(/\s+/);
            const hasPersian = /[\u0600-\u06FF]/.test(name);
            const hasLatin   = /[a-zA-Z]/.test(name);
            if (!NAME_REGEX.test(name) || parts.length < 2 || parts.some(p => p.length < 3) || (hasPersian && hasLatin))
                errs.push(t(CONTENT.errors.nameInvalid));
        }

        if (!country) {
            errs.push(t(CONTENT.errors.countryRequired));
        } else if (country === 'Other') {
            const cn = customCountry.trim();
            if (!cn || !COUNTRY_NAME_REGEX.test(cn) || cn.length < 3 || cn.length > 50)
                errs.push(t(CONTENT.errors.countryNameInvalid));
        }

        const mail = email.trim();
        if (!mail) {
            errs.push(t(CONTENT.errors.emailRequired));
        } else {
            const localPart = mail.split('@')[0];
            if (localPart.length < 3 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail))
                errs.push(t(CONTENT.errors.emailInvalid));
            else if (!isAllowedDomain(mail))
                errs.push(t(CONTENT.errors.emailDomain));
        }

        return errs;
    }

    // ── Step 1: Send OTP ───────────────────────────────────────────────────

    async function handleSendOtp(e) {
        e.preventDefault();
        const errs = validateForm();
        if (errs.length) { setError(errs); return; }
        setError(null);
        setLoading(true);
        try {
            const { error: supaErr } = await supabase.auth.signInWithOtp({
                email: email.trim(),
                options: {
                    shouldCreateUser: true,
                    data: {
                        full_name: fullName.trim(),
                        country: country === 'Other' ? customCountry.trim() : country,
                        user_type: userType,
                    },
                },
            });
            if (supaErr) throw supaErr;
            setStep('verify');
        } catch (err) {
            setError(err.message || t(CONTENT.errors.generic));
        } finally {
            setLoading(false);
        }
    }

    // ── Step 2: Verify OTP ─────────────────────────────────────────────────

    async function handleVerifyOtp(e) {
        e.preventDefault();
        if (otp.replace(/\D/g, '').length < 6) { setError(t(CONTENT.errors.otpIncomplete)); return; }
        setError(null);
        setLoading(true);
        try {
            const { error: supaErr } = await supabase.auth.verifyOtp({
                email: email.trim(),
                token: otp,
                type: 'email',
            });
            if (supaErr) throw supaErr;
            setStep('success');
        } catch (err) {
            setError(err.message || t(CONTENT.errors.generic));
        } finally {
            setLoading(false);
        }
    }

    // ── Resend ─────────────────────────────────────────────────────────────

    async function handleResend() {
        setError(null);
        setOtp('');
        setLoading(true);
        const nextCount = resendCount + 1;
        setResendCount(nextCount);
        setCooldown(getCooldown(nextCount));
        try {
            const { error: supaErr } = await supabase.auth.signInWithOtp({
                email: email.trim(),
                options: { shouldCreateUser: true },
            });
            if (supaErr) throw supaErr;
        } catch (err) {
            setError(err.message || t(CONTENT.errors.generic));
        } finally {
            setLoading(false);
        }
    }

    // ── Render ─────────────────────────────────────────────────────────────

    // Already authenticated — show welcome instead of form
    if (sessionUser) {
        const fullNameMeta = sessionUser.user_metadata?.full_name || '';
        const firstName = fullNameMeta.trim().split(/\s+/)[0] || '';
        const isPersianName = /[\u0600-\u06FF]/.test(firstName);

        return (
            <div className="reg-page">
                <div className="reg-bg-grid" />
                <div className="reg-scanline" />
                <div className="reg-inner">
                    <div className="reg-card" style={{ textAlign: 'center', padding: '48px 32px' }}>
                        <span className="reg-success-icon">⬡</span>
                        <h2 className="reg-success-title" style={headingFont}>
                            {isRTL
                                ? `${isPersianName ? firstName : ''} خوش آمدید${!isPersianName && firstName ? ` ${firstName}` : ''}`
                                : `Welcome back${firstName ? `, ${firstName}` : ''}`}
                        </h2>
                        <p className="reg-success-body">
                            {isRTL
                                ? 'شما قبلاً ثبت‌نام کرده‌اید. هویت دیجیتال شما فعال است.'
                                : 'You are already registered. Your digital identity is active.'}
                        </p>
                        <span className="reg-success-tag" style={monoFont}>
                            {isRTL ? 'دسترسی تأیید شد' : 'ACCESS GRANTED'}
                        </span>
                    </div>
                    <p className="reg-footnote" style={monoFont}>{t(CONTENT.footnote)}</p>
                </div>
            </div>
        );
    }

    // Session still loading
    if (sessionUser === undefined) {
        return (
            <div className="reg-page">
                <div className="reg-bg-grid" />
            </div>
        );
    }

    return (
        <div className="reg-page">
            <div className="reg-bg-grid" />
            <div className="reg-scanline" />

            <div className="reg-inner">
                <div className="reg-header">
                    <div className="reg-eyebrow" style={monoFont}>{t(CONTENT.eyebrow)}</div>
                    <h1 className="reg-title" style={headingFont}>{t(CONTENT.title)}</h1>
                    <p className="reg-subtitle">{t(CONTENT.subtitle)}</p>
                </div>

                <div className="reg-card">

                    {/* Step indicator */}
                    {step !== 'success' && (
                        <div className="reg-steps" aria-hidden="true">
                            {CONTENT.stepLabels.map((label, i) => {
                                const stepName = i === 0 ? 'form' : 'verify';
                                const isActive = step === stepName;
                                const isDone = (i === 0 && step === 'verify');
                                return (
                                    <React.Fragment key={i}>
                                        <div className={`reg-step-item${isActive ? ' is-active' : ''}${isDone ? ' is-done' : ''}`} style={monoFont}>
                                            <span className="reg-step-num">{isDone ? '✓' : i + 1}</span>
                                            {t(label)}
                                        </div>
                                        {i < CONTENT.stepLabels.length - 1 && <div className="reg-step-sep" />}
                                    </React.Fragment>
                                );
                            })}
                        </div>
                    )}

                    {/* ── Error banner ── */}
                    {error && (
                        <div className="reg-error" role="alert">
                            <span className="reg-error-icon">⚠</span>
                            <ul className="reg-error-list">
                                {(Array.isArray(error) ? error : [error]).map((e, i) => (
                                    <li key={i}>{e}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* ══ STEP 1: Registration form ══ */}
                    {step === 'form' && (
                        <form onSubmit={handleSendOtp} noValidate dir={isRTL ? "rtl" : "ltr"}>

                            {/* User type toggle */}
                            <div className="reg-type-toggle" role="group" aria-label={isRTL ? "نوع کاربر" : "User type"}>
                                <button
                                    type="button"
                                    className={`reg-type-btn${userType === 'citizen' ? ' is-active' : ''}`}
                                    data-type="citizen"
                                    onClick={() => setUserType('citizen')}
                                >
                                    <span className="reg-type-icon">🇮🇷</span>
                                    {t(CONTENT.typeCitizen)}
                                </button>
                                <button
                                    type="button"
                                    className={`reg-type-btn${userType === 'diaspora' ? ' is-active' : ''}`}
                                    data-type="diaspora"
                                    onClick={() => setUserType('diaspora')}
                                >
                                    <span className="reg-type-icon">🌍</span>
                                    {t(CONTENT.typeDiaspora)}
                                </button>
                            </div>

                            {/* Full name */}
                            <div className="reg-field">
                                <label className="reg-label" style={labelStyle} htmlFor="reg-name">
                                    {t(CONTENT.labelName)}
                                </label>
                                <input
                                    id="reg-name"
                                    className="reg-input"
                                    type="text"
                                    autoComplete="name"
                                    placeholder={t(CONTENT.placeholderName)}
                                    value={fullName}
                                    onChange={e => setFullName(e.target.value)}
                                    onBlur={e => setFullName(capitalizeName(e.target.value))}
                                    disabled={loading}
                                    dir={isRTL ? "rtl" : "auto"}
                                />
                            </div>

                            {/* Country */}
                            <div className="reg-field">
                                <label className="reg-label" style={labelStyle} htmlFor="reg-country">
                                    {t(CONTENT.labelCountry)}
                                </label>
                                <select
                                    id="reg-country"
                                    className="reg-select"
                                    value={country}
                                    onChange={e => { setCountry(e.target.value); setCustomCountry(''); }}
                                    disabled={loading}
                                >
                                    <option value="" disabled>{t(CONTENT.selectCountry)}</option>
                                    {COUNTRIES.map(c => (
                                        <option key={c} value={c}>{c}</option>
                                    ))}
                                </select>
                                {country === 'Other' && (
                                    <input
                                        className="reg-input reg-input--other-country"
                                        type="text"
                                        placeholder={isRTL ? "نام کشور به انگلیسی" : "Enter country name in English"}
                                        value={customCountry}
                                        onChange={e => setCustomCountry(e.target.value)}
                                        disabled={loading}
                                        maxLength={50}
                                        dir="ltr"
                                        autoFocus
                                    />
                                )}
                            </div>

                            {/* Email */}
                            <div className="reg-field">
                                <label className="reg-label" style={labelStyle} htmlFor="reg-email">
                                    {t(CONTENT.labelEmail)}
                                </label>
                                <input
                                    id="reg-email"
                                    className="reg-input"
                                    type="email"
                                    inputMode="email"
                                    autoComplete="email"
                                    placeholder={t(CONTENT.placeholderEmail)}
                                    value={email}
                                    onChange={e => setEmail(e.target.value.replace(/[^\x00-\x7F]/g, ''))}
                                    disabled={loading}
                                    dir="ltr"
                                />
                            </div>

                            <button
                                type="submit"
                                className="reg-submit-btn"
                                disabled={loading}
                                style={monoFont}
                            >
                                {loading && <span className="reg-spinner" />}
                                {t(CONTENT.btnSend)}
                            </button>
                        </form>
                    )}

                    {/* ══ STEP 2: OTP verification ══ */}
                    {step === 'verify' && (
                        <form onSubmit={handleVerifyOtp} noValidate dir={isRTL ? "rtl" : "ltr"}>
                            <div className="reg-verify-info">
                                <p className="reg-verify-text">{t(CONTENT.verifyText)}</p>
                                <p className="reg-verify-email" dir="ltr">{email}</p>
                                <p className="reg-verify-text" style={{ marginTop: 10, fontSize: 12, color: '#3a4a5e' }}>
                                    {t(CONTENT.verifyHint)}
                                </p>
                            </div>

                            <div className="reg-field">
                                <label className="reg-label" style={labelStyle}>{t(CONTENT.otpLabel)}</label>
                                <OtpInput value={otp} onChange={setOtp} disabled={loading} />
                            </div>

                            <button
                                type="submit"
                                className="reg-submit-btn"
                                disabled={loading || otp.replace(/\D/g, '').length < 6}
                                style={monoFont}
                            >
                                {loading && <span className="reg-spinner" />}
                                {t(CONTENT.btnVerify)}
                            </button>

                            <div className="reg-resend-row">
                                <button
                                    type="button"
                                    className="reg-back-btn"
                                    onClick={() => { setStep('form'); setOtp(''); setError(null); }}
                                    disabled={loading}
                                    style={monoFont}
                                >
                                    {t(CONTENT.btnBack)}
                                </button>

                                {cooldown > 0 ? (
                                    <div className="reg-cooldown" style={monoFont}>
                                        <div className="reg-cooldown-bar-track">
                                            <div
                                                className="reg-cooldown-bar-fill"
                                                style={{ width: `${(cooldown / getCooldown(resendCount)) * 100}%` }}
                                            />
                                        </div>
                                        <span className="reg-cooldown-label">
                                            {isRTL ? `ارسال مجدد در ${formatCooldown(cooldown)}` : `RESEND IN ${formatCooldown(cooldown)}`}
                                        </span>
                                    </div>
                                ) : (
                                    <button
                                        type="button"
                                        className="reg-resend-btn"
                                        onClick={handleResend}
                                        disabled={loading}
                                    >
                                        {t(CONTENT.btnResend)}
                                    </button>
                                )}
                            </div>
                        </form>
                    )}

                    {/* ══ STEP 3: Success ══ */}
                    {step === 'success' && (
                        <div className="reg-success">
                            <span className="reg-success-icon">⬡</span>
                            <h2 className="reg-success-title" style={headingFont}>
                                {t(CONTENT.successTitle)}
                            </h2>
                            <p className="reg-success-body">{t(CONTENT.successBody)}</p>
                            <span className="reg-success-tag" style={monoFont}>
                                {t(CONTENT.successTag)}
                            </span>
                        </div>
                    )}
                </div>

                <p className="reg-footnote" style={monoFont}>{t(CONTENT.footnote)}</p>
            </div>
        </div>
    );
}