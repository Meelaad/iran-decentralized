import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLang } from '../../contexts/LangContext';
import { supabase } from '../../lib/supabase';
import { collectMetadata } from '../../lib/collectMetadata';
import { BLUEPRINTS } from '../../data';
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
    labelBlueprint: { en: "PREFERRED GOVERNANCE MODEL", fa: "مدل حاکمیتی مورد نظر" },
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
    inviteOnly: {
        en: "Registration is currently by invitation only.",
        fa: "ثبت‌نام در حال حاضر فقط با دعوت‌نامه امکان‌پذیر است.",
    },
    labelInvite:       { en: "INVITE CODE", fa: "کد دعوت" },
    placeholderInvite: { en: "Enter your 8-character invite code", fa: "کد دعوت ۸ کاراکتری خود را وارد کنید" },
    errors: {
        inviteRequired: { en: "An invite code is required.", fa: "کد دعوت الزامی است." },
        inviteInvalid:  { en: "Invalid invite code format. Codes are 8 characters (letters and numbers).", fa: "فرمت کد دعوت نامعتبر است. کدها ۸ کاراکتر هستند." },
        inviteNotFound: { en: "Invite code not found. Please check and try again.", fa: "کد دعوت یافت نشد. لطفاً دوباره بررسی کنید." },
        inviteUsed:     { en: "This invite code has already been used.", fa: "این کد دعوت قبلاً استفاده شده است." },
        nameRequired:    { en: "Full name is required.",        fa: "نام کامل الزامی است." },
        nameInvalid:     { en: "Please enter your name correctly.", fa: "لطفاً نام خود را به درستی وارد کنید." },
        countryRequired:     { en: "Please select your country.",      fa: "لطفاً کشور خود را انتخاب کنید." },
        countryNameInvalid:  { en: "Please enter a valid country name.", fa: "لطفاً یک نام کشور معتبر وارد کنید." },
        emailRequired:       { en: "Email address is required.",         fa: "آدرس ایمیل الزامی است." },
        emailInvalid:        { en: "Please use a valid email address.",  fa: "لطفاً یک آدرس ایمیل معتبر وارد کنید." },
        emailDomain:     { en: "Please use a recognised email provider or institutional address.", fa: "لطفاً از یک ارائه‌دهنده ایمیل شناخته‌شده یا آدرس ایمیل دانشگاهی استفاده کنید." },
        otpIncomplete:   { en: "Please enter the full 6-digit code.", fa: "لطفاً کد ۶ رقمی را کامل وارد کنید." },
        generic:         { en: "Something went wrong. Please try again.", fa: "خطایی رخ داد. لطفاً دوباره تلاش کنید." },
        rateLimit:       { en: "We are currently experiencing a high volume of requests. Please try again in an hour.", fa: "در حال حاضر با حجم بالایی از درخواست‌ها مواجه هستیم. لطفاً یک ساعت دیگر دوباره تلاش کنید." },
        otpInvalid:      { en: "The code you entered is incorrect or has expired. Please check and try again, or request a new code.", fa: "کد واردشده اشتباه است یا منقضی شده. لطفاً دوباره بررسی کنید یا کد جدیدی درخواست دهید." },
        serverError:     { en: "A system error occurred. If this keeps happening, please contact support.", fa: "خطای سیستمی رخ داد. اگر مشکل ادامه دارد، لطفاً با پشتیبانی تماس بگیرید." },
    },
    contactSupport: { en: "Contact Support", fa: "تماس با پشتیبانی" },
};

// ── Country list ─────────────────────────────────────────────────────────────

// Estimated Iranian diaspora population per country.
// Update these values independently without touching the country list order or labels.
// Sources: UN migration data, Iranian MFA 2021, Wikipedia Iranian diaspora article.
// Keys must exactly match the `en` value in COUNTRIES below.
const DIASPORA_ESTIMATES = {
    "United States":        "1,000,000–1,500,000",
    "Iraq":                 "500,000–1,000,000+",
    "Turkey":               "600,000–800,000",
    "United Arab Emirates": "500,000–600,000",
    "Kuwait":               "~438,000",
    "United Kingdom":       "450,000–500,000",
    "Germany":              "336,000–400,000",
    "Canada":               "550,000–600,000",
    "Israel":               "200,000–250,000",
    "Azerbaijan":           "~248,000",
    "Bahrain":              "100,000–225,000",
    "Saudi Arabia":         "110,000–219,000",
    "Sweden":               "127,000–150,000",
    "Australia":            "125,000–135,000",
    "France":               "90,000–118,000",
    "Netherlands":          "~52,000",
    "Austria":              "~40,000",
    "Denmark":              "~32,700",
    "Italy":                "~30,500",
    "Qatar":                "~30,000",
    "Malaysia":             "~30,000",
    "Norway":               "~20,000",
    "Switzerland":          "~20,000",
    "Belgium":              "~20,000",
    "Russia":               "~30,000",
    "Spain":                "~20,000",
    "Georgia":              "~15,000",
    "Armenia":              "~15,000",
    "Greece":               "~12,000",
    "Tajikistan":           "~12,000",
    "Finland":              "~10,000",
    "Pakistan":             "~10,000",
    "India":                "~8,000",
    "Oman":                 "~7,000",
    "Brazil":               "~7,000",
    "Japan":                "~5,000",
    "Argentina":            "~5,000",
    "New Zealand":          "~5,000",
    "Ireland":              "~4,000",
    "Portugal":             "~4,000",
    "South Korea":          "~3,000",
    "Czech Republic":       "~3,000",
    "Poland":               "~3,000",
    "Hungary":              "~2,500",
    "Romania":              "~2,000",
    "Afghanistan":          "~1,000",
};

// Translation map — order here does not matter, sorting is derived from DIASPORA_ESTIMATES.
// Iran is pinned first; Other is pinned last.
const COUNTRIES = [
    { en: "Iran",                 fa: "ایران" },          // home country — always first
    { en: "United States",        fa: "ایالات متحده" },   // ~1,000,000+
    { en: "United Arab Emirates", fa: "امارات متحده عربی" }, // ~400,000–500,000
    { en: "Germany",              fa: "آلمان" },           // ~150,000–200,000
    { en: "Canada",               fa: "کانادا" },          // ~163,000–400,000
    { en: "Sweden",               fa: "سوئد" },            // ~100,000–200,000
    { en: "United Kingdom",       fa: "بریتانیا" },        // ~90,000–150,000
    { en: "Australia",            fa: "استرالیا" },        // ~60,000–140,000
    { en: "Turkey",               fa: "ترکیه" },           // ~83,000–100,000
    { en: "Israel",               fa: "اسرائیل" },         // ~100,000 (Iranian-Jewish community)
    { en: "France",               fa: "فرانسه" },          // ~40,000–70,000
    { en: "Netherlands",          fa: "هلند" },            // ~40,000–80,000
    { en: "Norway",               fa: "نروژ" },            // ~40,000–60,000
    { en: "Azerbaijan",           fa: "آذربایجان" },       // ~30,000–60,000
    { en: "Austria",              fa: "اتریش" },           // ~30,000–50,000
    { en: "Denmark",              fa: "دانمارک" },         // ~25,000–40,000
    { en: "Switzerland",          fa: "سوئیس" },           // ~20,000–40,000
    { en: "Russia",               fa: "روسیه" },           // ~20,000–50,000
    { en: "Belgium",              fa: "بلژیک" },           // ~20,000–40,000
    { en: "Iraq",                 fa: "عراق" },            // ~15,000–30,000
    { en: "Spain",                fa: "اسپانیا" },         // ~15,000–25,000
    { en: "Italy",                fa: "ایتالیا" },         // ~10,000–20,000
    { en: "Georgia",              fa: "گرجستان" },         // ~10,000–20,000
    { en: "Armenia",              fa: "ارمنستان" },        // ~10,000–20,000
    { en: "Greece",               fa: "یونان" },           // ~10,000–15,000
    { en: "Bahrain",              fa: "بحرین" },           // ~10,000–20,000
    { en: "Tajikistan",           fa: "تاجیکستان" },       // ~10,000–15,000
    { en: "Malaysia",             fa: "مالزی" },           // ~8,000–15,000
    { en: "Finland",              fa: "فنلاند" },          // ~5,000–15,000
    { en: "Pakistan",             fa: "پاکستان" },         // ~5,000–15,000
    { en: "India",                fa: "هند" },             // ~5,000–10,000
    { en: "Kuwait",               fa: "کویت" },            // ~5,000–10,000
    { en: "Qatar",                fa: "قطر" },             // ~5,000–10,000
    { en: "Saudi Arabia",         fa: "عربستان سعودی" },  // ~5,000–10,000
    { en: "Oman",                 fa: "عمان" },            // ~5,000–10,000
    { en: "Japan",                fa: "ژاپن" },            // ~3,000–8,000
    { en: "Brazil",               fa: "برزیل" },           // ~5,000–10,000
    { en: "Argentina",            fa: "آرژانتین" },        // ~3,000–8,000
    { en: "New Zealand",          fa: "نیوزیلند" },        // ~3,000–8,000
    { en: "South Korea",          fa: "کره جنوبی" },       // ~2,000–5,000
    { en: "Ireland",              fa: "ایرلند" },          // ~3,000–6,000
    { en: "Portugal",             fa: "پرتغال" },          // ~3,000–6,000
    { en: "Czech Republic",       fa: "جمهوری چک" },       // ~2,000–5,000
    { en: "Poland",               fa: "لهستان" },          // ~2,000–4,000
    { en: "Hungary",              fa: "مجارستان" },        // ~2,000–4,000
    { en: "Romania",              fa: "رومانی" },          // ~1,000–3,000
    { en: "Afghanistan",          fa: "افغانستان" },       // small (not a typical destination)
    { en: "Other",                fa: "سایر" },            // always last
];

// Extracts the lower-bound number from estimate strings like "1,000,000–1,500,000", "~438,000", "500,000+"
function parseEstimate(str) {
    if (!str) return 0;
    const match = str.replace(/,/g, '').match(/\d+/);
    return match ? parseInt(match[0], 10) : 0;
}

// Sorted at module load time by DIASPORA_ESTIMATES lower bound.
// Update an estimate value → sort order updates automatically on next build/reload.
const SORTED_COUNTRIES = [
    COUNTRIES.find(c => c.en === 'Iran'),
    ...COUNTRIES
        .filter(c => c.en !== 'Iran' && c.en !== 'Other')
        .sort((a, b) => parseEstimate(DIASPORA_ESTIMATES[b.en]) - parseEstimate(DIASPORA_ESTIMATES[a.en])),
    COUNTRIES.find(c => c.en === 'Other'),
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
    const monoFont    = { fontFamily: isRTL ? "'Irancell', sans-serif" : "'IBM Plex Mono', monospace" };
    const headingFont = { fontFamily: isRTL ? "'Irancell', sans-serif" : "'Inter', sans-serif" };
    const labelStyle  = { ...monoFont, textAlign: isRTL ? 'right' : 'left' };

    // Session check
    const [sessionUser, setSessionUser] = useState(undefined); // undefined = loading, null = none, object = user

    useEffect(() => {
        supabase.auth.getSession().then(async ({ data }) => {
            const user = data.session?.user ?? null;
            setSessionUser(user);
            if (user) {
                const { data: prof } = await supabase.from('profiles').select('is_admin').eq('id', user.id).single();
                if (prof?.is_admin) setIsAdmin(true);
            }
        });
    }, []);

    // Form state
    const [step, setStep] = useState('form');          // 'form' | 'verify' | 'success'
    const [inviteCode, setInviteCode] = useState('');
    const [userType, setUserType] = useState('citizen');
    const [preferredBlueprint, setPreferredBlueprint] = useState('decentralized');
    const [fullName, setFullName] = useState('');
    const [country, setCountry] = useState('');
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showSupport, setShowSupport] = useState(false);
    const [customCountry, setCustomCountry] = useState('');
    const [cooldown, setCooldown] = useState(0);
    const [resendCount, setResendCount] = useState(0);
    const [isAdmin, setIsAdmin] = useState(false);

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

        // Invite code validation
        if (!inviteCode.trim()) {
            errs.push(t(CONTENT.errors.inviteRequired));
        } else if (!/^[A-Z0-9]{8}$/i.test(inviteCode.trim())) {
            errs.push(t(CONTENT.errors.inviteInvalid));
        }

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
            // Check if email is already registered
            const { data: existingProfile } = await supabase
                .from('profiles')
                .select('id')
                .eq('email', email.trim())
                .maybeSingle();
            if (existingProfile) {
                setStep('already-registered');
                setLoading(false);
                return;
            }

            // Validate invite code server-side before sending OTP
            let inviteRes;
            try {
                inviteRes = await fetch('/api/validate-invite', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ code: inviteCode.trim().toUpperCase() }),
                });
            } catch {
                setError(t(CONTENT.errors.generic));
                setLoading(false);
                return;
            }
            if (!inviteRes.ok) {
                let inviteErr = {};
                try { inviteErr = await inviteRes.json(); } catch { /* ignore parse error */ }
                if (inviteRes.status === 404) setError(t(CONTENT.errors.inviteNotFound));
                else if (inviteRes.status === 409) setError(t(CONTENT.errors.inviteUsed));
                else setError(inviteErr.error || t(CONTENT.errors.generic));
                setLoading(false);
                return;
            }

            const { error: supaErr } = await supabase.auth.signInWithOtp({
                email: email.trim(),
                options: {
                    shouldCreateUser: true,
                    data: {
                        full_name: fullName.trim(),
                        country: country === 'Other' ? customCountry.trim() : country,
                        user_type: userType,
                        preferred_blueprint: preferredBlueprint,
                    },
                },
            });
            if (supaErr) throw supaErr;
            setStep('verify');
        } catch (err) {
            const msg = err.message?.toLowerCase() || '';
            if (msg.includes('rate limit') || msg.includes('email rate')) {
                setError(t(CONTENT.errors.rateLimit));
            } else if (msg.includes('database error') || msg.includes('saving new user')) {
                setError(t(CONTENT.errors.serverError));
                setShowSupport(true);
            } else {
                setError(t(CONTENT.errors.generic));
            }
        } finally {
            setLoading(false);
        }
    }

    // ── Step 2: Verify OTP ─────────────────────────────────────────────────

    async function handleVerifyOtp(e) {
        e.preventDefault();
        if (otp.replace(/\D/g, '').length < 6) { setError(t(CONTENT.errors.otpIncomplete)); setShowSupport(false); return; }
        setError(null);
        setShowSupport(false);
        setLoading(true);
        try {
            const { error: supaErr } = await supabase.auth.verifyOtp({
                email: email.trim(),
                token: otp,
                type: 'email',
            });
            if (supaErr) throw supaErr;
            setStep('success');

            // Collect metadata and complete registration (best-effort, non-blocking)
            try {
                const { data: { session } } = await supabase.auth.getSession();
                // Check admin status for dashboard redirect
                if (session) {
                    const { data: prof } = await supabase.from('profiles').select('is_admin').eq('id', session.user.id).single();
                    if (prof?.is_admin) setIsAdmin(true);
                }
                const metadata = await collectMetadata();
                await fetch('/api/register-complete', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${session?.access_token}`,
                    },
                    body: JSON.stringify({
                        invite_code: inviteCode.trim().toUpperCase(),
                        full_name: fullName.trim(),
                        country: country === 'Other' ? customCountry.trim() : country,
                        user_type: userType,
                        preferred_blueprint: preferredBlueprint,
                        metadata,
                    }),
                });
            } catch { /* silent — registration succeeded, metadata is best-effort */ }
        } catch (err) {
            const msg = err.message?.toLowerCase() || '';
            const isInvalidToken = msg.includes('token') || msg.includes('otp') || msg.includes('expired') || msg.includes('invalid');
            if (isInvalidToken) {
                setError(t(CONTENT.errors.otpInvalid));
                setShowSupport(false);
            } else {
                setError(t(CONTENT.errors.serverError));
                setShowSupport(true);
            }
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
            const msg = err.message?.toLowerCase() || '';
            setError(msg.includes('rate limit') || msg.includes('email rate')
                ? t(CONTENT.errors.rateLimit)
                : err.message || t(CONTENT.errors.generic));
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
                        <Link
                            to={isAdmin ? '/admin' : '/profile'}
                            className="reg-submit-btn"
                            style={{ ...monoFont, marginTop: 20, textDecoration: 'none', display: 'inline-flex', justifyContent: 'center' }}
                        >
                            {isAdmin
                                ? (isRTL ? 'پنل مدیریت ←' : 'ADMIN PANEL →')
                                : (isRTL ? 'رفتن به داشبورد ←' : 'GO TO DASHBOARD →')}
                        </Link>
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
                <div className="reg-scanline" />
                <div className="reg-inner">
                    <div className="reg-header">
                        <div className="reg-eyebrow" style={monoFont}>{t(CONTENT.eyebrow)}</div>
                        <h1 className="reg-title" style={headingFont}>{t(CONTENT.title)}</h1>
                        <p className="reg-subtitle">{t(CONTENT.subtitle)}</p>
                    </div>
                    <div className="reg-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 180 }}>
                        <span className="reg-spinner" style={{ width: 22, height: 22 }} />
                    </div>
                </div>
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
                            <div className="reg-error-body">
                                <ul className="reg-error-list">
                                    {(Array.isArray(error) ? error : [error]).map((e, i) => (
                                        <li key={i}>{e}</li>
                                    ))}
                                </ul>
                                {showSupport && (
                                    <Link
                                        to="/contact?subject=Registration+Issue"
                                        className="reg-support-link"
                                        style={monoFont}
                                    >
                                        {t(CONTENT.contactSupport)} →
                                    </Link>
                                )}
                            </div>
                        </div>
                    )}

                    {/* ══ STEP 1: Registration form ══ */}
                    {step === 'form' && (
                        <form onSubmit={handleSendOtp} noValidate dir={isRTL ? "rtl" : "ltr"}>

                            {/* Invite-only notice */}
                            <div className="reg-invite-notice" style={monoFont}>
                                <span className="reg-invite-notice-icon">⬡</span>
                                {t(CONTENT.inviteOnly)}
                            </div>

                            {/* Invite code field */}
                            <div className="reg-field">
                                <label className="reg-label" style={labelStyle} htmlFor="reg-invite">
                                    {t(CONTENT.labelInvite)}
                                </label>
                                <input
                                    id="reg-invite"
                                    className="reg-input reg-input--mono"
                                    type="text"
                                    placeholder={t(CONTENT.placeholderInvite)}
                                    value={inviteCode}
                                    onChange={e => setInviteCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 8))}
                                    disabled={loading}
                                    dir="ltr"
                                    maxLength={8}
                                    autoComplete="off"
                                    spellCheck={false}
                                />
                            </div>

                            {/* User type toggle */}
                            <div className="reg-type-toggle" role="group" aria-label={isRTL ? "نوع کاربر" : "User type"} style={monoFont}>
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

                            {/* Preferred blueprint */}
                            <div className="reg-field">
                                <label className="reg-label" style={labelStyle}>
                                    {t(CONTENT.labelBlueprint)}
                                </label>
                                <div className="reg-blueprint-group">
                                    {Object.values(BLUEPRINTS).map(bp => (
                                        <button
                                            key={bp.id}
                                            type="button"
                                            className={`reg-blueprint-btn${preferredBlueprint === bp.id ? ' is-active' : ''}`}
                                            onClick={() => setPreferredBlueprint(bp.id)}
                                            disabled={loading}
                                            style={{ fontFamily: isRTL ? "'Vazirmatn', sans-serif" : "'Inter', sans-serif" }}
                                        >
                                            {t(bp.name)}
                                        </button>
                                    ))}
                                </div>
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
                                    <option value="" disabled>
                                        {t(CONTENT.selectCountry)}{isRTL ? ' (جمعیت)' : ' (Population)'}
                                    </option>
                                    {SORTED_COUNTRIES.map(c => {
                                        const est = DIASPORA_ESTIMATES[c.en];
                                        return (
                                            <option key={c.en} value={c.en}>
                                                {t(c)}{est ? ` (${est})` : ''}
                                            </option>
                                        );
                                    })}
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
                            <Link
                                to={isAdmin ? '/admin' : '/profile'}
                                className="reg-submit-btn"
                                style={{ ...monoFont, marginTop: 16, textDecoration: 'none', display: 'inline-flex', justifyContent: 'center' }}
                            >
                                {isAdmin
                                    ? (isRTL ? 'پنل مدیریت ←' : 'ADMIN PANEL →')
                                    : (isRTL ? 'رفتن به داشبورد ←' : 'GO TO DASHBOARD →')}
                            </Link>
                        </div>
                    )}

                    {step === 'already-registered' && (
                        <div className="reg-success">
                            <span className="reg-success-icon" style={{ fontSize: 36 }}>👤</span>
                            <h2 className="reg-success-title" style={headingFont}>
                                {isRTL ? 'قبلاً ثبت‌نام کرده‌اید' : 'Already Registered'}
                            </h2>
                            <p className="reg-success-body">
                                {isRTL
                                    ? `حسابی با ایمیل ${email} در ایران‌دائو وجود دارد.`
                                    : `An account with ${email} already exists on IranDAO.`}
                            </p>
                            <Link to="/login" className="reg-submit-btn" style={{ ...monoFont, textDecoration: 'none', display: 'inline-flex', justifyContent: 'center' }}>
                                {isRTL ? 'ورود به حساب ←' : 'Sign In →'}
                            </Link>
                        </div>
                    )}
                </div>

                <p className="reg-footnote" style={monoFont}>{t(CONTENT.footnote)}</p>
            </div>
        </div>
    );
}