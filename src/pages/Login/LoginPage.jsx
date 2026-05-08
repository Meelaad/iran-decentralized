import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLang } from '../../contexts/LangContext';
import { supabase } from '../../lib/supabase';
import { Turnstile } from '@marsidev/react-turnstile';
import { ThemeSwitch } from '../../components/ThemeSwitch/ThemeSwitch';
import '../Register/RegisterPage.css';
import './LoginPage.css';
import CONTENT from '../../locales/pages/login.json';

function getCooldown(resendCount) {
    if (resendCount === 0) return 60;
    if (resendCount === 1) return 90;
    return 120;
}

export default function LoginPage() {
    const { t, lang, setLang, isRTL, monoFont, headFont } = useLang();
    const navigate = useNavigate();

    const [step, setStep] = useState('form');
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [cooldown, setCooldown] = useState(0);
    const [resendCount, setResendCount] = useState(0);
    const [turnstileToken, setTurnstileToken] = useState('');
    const otpRefs = useRef([]);
    const turnstileRef = useRef(null);

    useEffect(() => {
        supabase.auth.getSession().then(({ data }) => {
            if (data.session) navigate('/profile', { replace: true });
        });
    }, [navigate]);

    useEffect(() => {
        if (step === 'verify') setCooldown(getCooldown(0));
    }, [step]);

    useEffect(() => {
        if (cooldown <= 0) return;
        const timer = setTimeout(() => setCooldown(c => c - 1), 1000);
        return () => clearTimeout(timer);
    }, [cooldown]);

    async function handleSendCode(e) {
        e.preventDefault();
        const mail = email.trim();
        if (!mail) { setError(t(CONTENT.errors.emailRequired)); return; }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail)) { setError(t(CONTENT.errors.emailInvalid)); return; }
        setError(null);
        setLoading(true);
        try {
            const { error: supaErr } = await supabase.auth.signInWithOtp({
                email: mail,
                options: { shouldCreateUser: false, captchaToken: turnstileToken || undefined },
            });
            if (supaErr) throw supaErr;
            setStep('verify');
            setTurnstileToken('');
            turnstileRef.current?.reset();
        } catch (err) {
            const msg = err.message?.toLowerCase() || '';
            if (msg.includes('rate')) setError(t(CONTENT.errors.rateLimit));
            else if (msg.includes('not found') || msg.includes('no user') || msg.includes('signups not allowed')) setError(t(CONTENT.errors.notRegistered));
            else setError(t(CONTENT.errors.generic));
        } finally {
            setLoading(false);
        }
    }

    async function handleVerify(e) {
        e.preventDefault();
        const code = otp.join('');
        if (code.length < 6) { setError(t(CONTENT.errors.otpIncomplete)); return; }
        setError(null);
        setLoading(true);
        try {
            const { error: supaErr } = await supabase.auth.verifyOtp({
                email: email.trim(),
                token: code,
                type: 'email',
            });
            if (supaErr) throw supaErr;
            navigate('/profile', { replace: true });
        } catch (err) {
            const msg = err.message?.toLowerCase() || '';
            setError(msg.includes('invalid') || msg.includes('expired')
                ? t(CONTENT.errors.otpInvalid)
                : t(CONTENT.errors.generic));
        } finally {
            setLoading(false);
        }
    }

    async function handleResend() {
        setError(null);
        const count = resendCount + 1;
        setResendCount(count);
        setCooldown(getCooldown(count));
        await supabase.auth.signInWithOtp({
            email: email.trim(),
            options: { shouldCreateUser: false, captchaToken: turnstileToken || undefined },
        });
        setTurnstileToken('');
        turnstileRef.current?.reset();
    }

    function handleOtpInput(i, val) {
        const digits = val.replace(/\D/g, '');
        if (digits.length > 1) {
            const filled = digits.slice(0, 6).split('');
            const next = [...otp];
            filled.forEach((d, idx) => { if (idx < 6) next[idx] = d; });
            setOtp(next);
            otpRefs.current[Math.min(5, filled.length - 1)]?.focus();
            return;
        }
        const next = [...otp];
        next[i] = digits;
        setOtp(next);
        if (digits && i < 5) otpRefs.current[i + 1]?.focus();
    }

    function handleOtpKeyDown(i, e) {
        if (e.key === 'Backspace' && !otp[i] && i > 0) otpRefs.current[i - 1]?.focus();
    }

    return (
        <div className="reg-page">
            <div className="reg-bg-grid" />
            <div className="reg-scanline" />

            <div className="login-topbar">
                <ThemeSwitch />
                <button
                    className={`gate-lang-btn${lang === 'fa' ? ' is-active' : ''}`}
                    style={{ fontFamily: "'Vazirmatn', sans-serif" }}
                    onClick={() => setLang('fa')}
                >فارسی</button>
                <span className="gate-lang-sep">|</span>
                <button
                    className={`gate-lang-btn${lang === 'en' ? ' is-active' : ''}`}
                    style={{ fontFamily: monoFont }}
                    onClick={() => setLang('en')}
                >EN</button>
            </div>

            <div className="reg-inner" dir={isRTL ? 'rtl' : 'ltr'}>
                <div className="reg-header">
                    <div className="reg-eyebrow" style={{ fontFamily: monoFont }}>{t(CONTENT.eyebrow)}</div>
                    <h1 className="reg-title" style={{ fontFamily: headFont }}>{t(CONTENT.title)}</h1>
                    <p className="reg-subtitle">{t(CONTENT.subtitle)}</p>
                </div>

                <div className="reg-card">
                    {step === 'form' && (
                        <form onSubmit={handleSendCode} noValidate>
                            {error && (
                                <div className="reg-error">
                                    <span className="reg-error-icon">⚠</span>
                                    <div className="reg-error-body">
                                        <span>{error}</span>
                                        {typeof error === 'string' && error.includes('register') && (
                                            <Link to="/register" className="reg-support-link" style={{ fontFamily: monoFont }}>
                                                {isRTL ? 'ثبت‌نام ←' : 'Register →'}
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            )}
                            <div className="reg-field">
                                <label className="reg-label" style={{ fontFamily: monoFont }}>
                                    {t(CONTENT.labelEmail)}
                                </label>
                                <input
                                    className="reg-input"
                                    type="email"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    placeholder="you@example.com"
                                    autoComplete="email"
                                    dir="ltr"
                                />
                            </div>
                            <button
                                type="submit"
                                className="reg-submit-btn"
                                disabled={loading || (import.meta.env.VITE_TURNSTILE_SITE_KEY && !turnstileToken)}
                                style={{ fontFamily: monoFont }}
                            >
                                {loading && <span className="reg-spinner" />}
                                {t(CONTENT.btnSend)}
                            </button>
                        </form>
                    )}

                    {import.meta.env.VITE_TURNSTILE_SITE_KEY && (
                        <div style={{ display: step === 'form' ? 'block' : 'none', marginTop: '12px' }}>
                            <Turnstile
                                ref={turnstileRef}
                                siteKey={import.meta.env.VITE_TURNSTILE_SITE_KEY}
                                onSuccess={token => setTurnstileToken(token)}
                                onExpire={() => setTurnstileToken('')}
                                options={{ theme: 'dark', size: 'flexible' }}
                            />
                        </div>
                    )}

                    {step === 'verify' && (
                        <form onSubmit={handleVerify} noValidate>
                            <div className="reg-verify-info">
                                <p className="reg-verify-text">{t(CONTENT.verifyText)}</p>
                                <div className="reg-verify-email">{email}</div>
                            </div>
                            {error && (
                                <div className="reg-error">
                                    <span className="reg-error-icon">⚠</span>
                                    <span>{error}</span>
                                </div>
                            )}
                            <div className="reg-field">
                                <label className="reg-label" style={{ fontFamily: monoFont }}>
                                    {isRTL ? 'کد تأیید' : 'VERIFICATION CODE'}
                                </label>
                                <div className="reg-otp-boxes">
                                    {otp.map((d, i) => (
                                        <input
                                            key={i}
                                            ref={el => otpRefs.current[i] = el}
                                            className={`reg-otp-digit${d ? ' is-filled' : ''}`}
                                            type="text"
                                            inputMode="numeric"
                                            maxLength={6}
                                            value={d}
                                            onChange={e => handleOtpInput(i, e.target.value)}
                                            onKeyDown={e => handleOtpKeyDown(i, e)}
                                        />
                                    ))}
                                </div>
                            </div>
                            <button
                                type="submit"
                                className="reg-submit-btn"
                                disabled={loading}
                                style={{ fontFamily: monoFont }}
                            >
                                {loading && <span className="reg-spinner" />}
                                {t(CONTENT.btnVerify)}
                            </button>
                            <div className="reg-resend-row">
                                <button
                                    type="button"
                                    className="reg-back-btn"
                                    style={{ fontFamily: monoFont }}
                                    onClick={() => { setStep('form'); setOtp(['','','','','','']); setError(null); }}
                                >
                                    {t(CONTENT.btnBack)}
                                </button>
                                {cooldown > 0 ? (
                                    <div className="reg-cooldown">
                                        <div className="reg-cooldown-bar-track">
                                            <div
                                                className="reg-cooldown-bar-fill"
                                                style={{ width: `${((getCooldown(resendCount) - cooldown) / getCooldown(resendCount)) * 100}%` }}
                                            />
                                        </div>
                                        <span className="reg-cooldown-label" style={{ fontFamily: monoFont }}>{cooldown}s</span>
                                    </div>
                                ) : (
                                    <button type="button" className="reg-resend-btn" onClick={handleResend}>
                                        {t(CONTENT.btnResend)}
                                    </button>
                                )}
                            </div>
                        </form>
                    )}
                </div>

                <p className="reg-footnote" style={{ fontFamily: monoFont }}>
                    {t(CONTENT.noAccount)}{' '}
                    <Link to="/register" style={{ color: 'var(--clr-accent)', textDecoration: 'underline', textUnderlineOffset: '3px' }}>
                        {t(CONTENT.registerLink)}
                    </Link>
                </p>
            </div>
        </div>
    );
}
