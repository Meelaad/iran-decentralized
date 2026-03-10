import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLang } from '../../contexts/LangContext';
import { supabase } from '../../lib/supabase';
import '../Register/RegisterPage.css';

const CONTENT = {
    eyebrow:    { en: 'CITIZEN PORTAL',            fa: 'پورتال شهروندی' },
    title:      { en: 'Sign In',                   fa: 'ورود به حساب' },
    subtitle:   { en: 'Enter your registered email. We\'ll send you a one-time code to sign in.', fa: 'ایمیل ثبت‌شده خود را وارد کنید. یک کد یکبار مصرف برای ورود ارسال می‌کنیم.' },
    labelEmail: { en: 'EMAIL',                     fa: 'ایمیل' },
    btnSend:    { en: 'SEND CODE',                 fa: 'ارسال کد' },
    btnVerify:  { en: 'SIGN IN',                   fa: 'ورود' },
    btnBack:    { en: '← BACK',                    fa: '← بازگشت' },
    btnResend:  { en: 'Resend code',               fa: 'ارسال مجدد کد' },
    verifyText: { en: 'We sent a 6-digit code to', fa: 'یک کد ۶ رقمی به این آدرس ارسال شد' },
    noAccount:  { en: "Don't have an account?",    fa: 'حساب ندارید؟' },
    registerLink:{ en: 'Register',                 fa: 'ثبت‌نام' },
    errors: {
        emailRequired: { en: 'Email address is required.',             fa: 'آدرس ایمیل الزامی است.' },
        emailInvalid:  { en: 'Please enter a valid email address.',    fa: 'لطفاً یک آدرس ایمیل معتبر وارد کنید.' },
        notRegistered: { en: 'No account found with this email. Please register first.', fa: 'هیچ حسابی با این ایمیل یافت نشد. لطفاً ابتدا ثبت‌نام کنید.' },
        otpIncomplete: { en: 'Please enter the full 6-digit code.',    fa: 'لطفاً کد ۶ رقمی را کامل وارد کنید.' },
        otpInvalid:    { en: 'The code is incorrect or has expired. Try again or request a new code.', fa: 'کد اشتباه است یا منقضی شده. دوباره تلاش کنید یا کد جدید بخواهید.' },
        generic:       { en: 'Something went wrong. Please try again.', fa: 'خطایی رخ داد. لطفاً دوباره تلاش کنید.' },
        rateLimit:     { en: 'Too many requests. Please wait a minute.', fa: 'درخواست‌های زیاد. لطفاً یک دقیقه صبر کنید.' },
    },
};

function getCooldown(resendCount) {
    if (resendCount === 0) return 60;
    if (resendCount === 1) return 90;
    return 120;
}

export default function LoginPage() {
    const { t, isRTL } = useLang();
    const navigate = useNavigate();
    const monoFont    = { fontFamily: isRTL ? "'Irancell', sans-serif" : "'IBM Plex Mono', monospace" };
    const headingFont = { fontFamily: isRTL ? "'Irancell', sans-serif" : "'Inter', sans-serif" };

    const [step, setStep] = useState('form');
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [cooldown, setCooldown] = useState(0);
    const [resendCount, setResendCount] = useState(0);
    const otpRefs = useRef([]);

    // Redirect if already logged in
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
        const t = setTimeout(() => setCooldown(c => c - 1), 1000);
        return () => clearTimeout(t);
    }, [cooldown]);

    async function handleSendCode(e) {
        e.preventDefault();
        const mail = email.trim();
        if (!mail) { setError(t(CONTENT.errors.emailRequired)); return; }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail)) { setError(t(CONTENT.errors.emailInvalid)); return; }
        setError(null);
        setLoading(true);
        try {
            // Check if email has a profile
            const { data: prof } = await supabase
                .from('profiles')
                .select('id')
                .eq('email', mail)
                .maybeSingle();
            if (!prof) {
                setError(t(CONTENT.errors.notRegistered));
                setLoading(false);
                return;
            }
            const { error: supaErr } = await supabase.auth.signInWithOtp({ email: mail });
            if (supaErr) throw supaErr;
            setStep('verify');
        } catch (err) {
            const msg = err.message?.toLowerCase() || '';
            setError(msg.includes('rate') ? t(CONTENT.errors.rateLimit) : t(CONTENT.errors.generic));
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
        await supabase.auth.signInWithOtp({ email: email.trim() });
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
            <div className="reg-inner">
                <div className="reg-header">
                    <div className="reg-eyebrow" style={monoFont}>{t(CONTENT.eyebrow)}</div>
                    <h1 className="reg-title" style={headingFont}>{t(CONTENT.title)}</h1>
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
                                            <Link to="/register" className="reg-support-link" style={monoFont}>
                                                {isRTL ? 'ثبت‌نام ←' : 'Register →'}
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            )}
                            <div className="reg-field">
                                <label className="reg-label" style={{ ...monoFont, textAlign: isRTL ? 'right' : 'left' }}>
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
                            <button type="submit" className="reg-submit-btn" disabled={loading} style={monoFont}>
                                {loading && <span className="reg-spinner" />}
                                {t(CONTENT.btnSend)}
                            </button>
                        </form>
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
                                <label className="reg-label" style={{ ...monoFont, textAlign: isRTL ? 'right' : 'left' }}>
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
                            <button type="submit" className="reg-submit-btn" disabled={loading} style={monoFont}>
                                {loading && <span className="reg-spinner" />}
                                {t(CONTENT.btnVerify)}
                            </button>
                            <div className="reg-resend-row">
                                <button type="button" className="reg-back-btn" style={monoFont} onClick={() => { setStep('form'); setOtp(['','','','','','']); setError(null); }}>
                                    {t(CONTENT.btnBack)}
                                </button>
                                {cooldown > 0 ? (
                                    <div className="reg-cooldown">
                                        <div className="reg-cooldown-bar-track">
                                            <div className="reg-cooldown-bar-fill" style={{ width: `${((getCooldown(resendCount) - cooldown) / getCooldown(resendCount)) * 100}%` }} />
                                        </div>
                                        <span className="reg-cooldown-label" style={monoFont}>{cooldown}s</span>
                                    </div>
                                ) : (
                                    <button type="button" className="reg-resend-btn" onClick={handleResend}>{t(CONTENT.btnResend)}</button>
                                )}
                            </div>
                        </form>
                    )}
                </div>

                <p className="reg-footnote" style={monoFont}>
                    {t(CONTENT.noAccount)}{' '}
                    <Link to="/register" style={{ color: '#4fc3f7', textDecoration: 'underline', textUnderlineOffset: '3px' }}>
                        {t(CONTENT.registerLink)}
                    </Link>
                </p>
            </div>
        </div>
    );
}
