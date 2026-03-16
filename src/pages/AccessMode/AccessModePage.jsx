import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useLang } from '../../contexts/LangContext';
import { ThemeSwitch } from '../../components/ThemeSwitch/ThemeSwitch';
import './AccessModePage.css';

export default function AccessModePage() {
    const { isRTL, lang, setLang } = useLang();
    const navigate = useNavigate();
    const [easyClicked, setEasyClicked] = useState(false);

    const dir = isRTL ? 'rtl' : 'ltr';
    const headFont = isRTL ? "'Vazirmatn', sans-serif" : "'Inter', sans-serif";
    const monoFont = isRTL ? "'Vazirmatn', sans-serif" : "'intelone-mono', monospace";

    return (
        <div className="am-root" dir={dir}>
            <div className="am-bg-grid" />

            {/* Top bar */}
            <div className="am-topbar">
                <ThemeSwitch />
                <button
                    className={`am-lang-btn${lang === 'fa' ? ' is-active' : ''}`}
                    onClick={() => setLang('fa')}
                    style={{ fontFamily: "'Vazirmatn', sans-serif" }}
                >فارسی</button>
                <button
                    className={`am-lang-btn${lang === 'en' ? ' is-active' : ''}`}
                    onClick={() => setLang('en')}
                >EN</button>
            </div>

            <div className="am-inner">
                <header className="am-header">
                    <div className="am-eyebrow" style={{ fontFamily: monoFont }}>IRAN · DAO</div>
                    <h1 className="am-title" style={{ fontFamily: headFont }}>
                        {isRTL ? 'نحوه دسترسی را انتخاب کنید' : 'Choose Your Access Mode'}
                    </h1>
                    <p className="am-subtitle">
                        {isRTL
                            ? 'پلتفرم دو نسخه دارد — یکی ساده‌تر، یکی کامل‌تر'
                            : 'The platform has two versions — one simplified, one full'}
                    </p>
                </header>

                <div className="am-cards">

                    {/* ── Easy Access ── */}
                    <div
                        className={`am-card am-card--easy${easyClicked ? ' am-card--revealed' : ''}`}
                        onClick={() => setEasyClicked(true)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={e => e.key === 'Enter' && setEasyClicked(true)}
                    >
                        {!easyClicked ? (
                            <>
                                <div className="am-card-icon">🌿</div>
                                <div className="am-card-badge am-card-badge--easy" style={{ fontFamily: monoFont }}>
                                    {isRTL ? 'دسترسی آسان' : 'EASY ACCESS'}
                                </div>
                                <h2 className="am-card-title" style={{ fontFamily: headFont }}>
                                    {isRTL ? 'نسخه ساده' : 'Simple Version'}
                                </h2>
                                <p className="am-card-desc">
                                    {isRTL
                                        ? 'رابط کاربری ساده‌شده برای افراد مسن‌تر یا کسانی که با فناوری آشنایی کمتری دارند. متن بزرگ‌تر، مراحل کمتر، راهنمایی بیشتر.'
                                        : 'A simplified interface designed for older users or those less comfortable with technology. Larger text, fewer steps, more guidance.'}
                                </p>
                                <ul className="am-card-features">
                                    <li>{isRTL ? 'متن و دکمه‌های بزرگ‌تر' : 'Larger text and buttons'}</li>
                                    <li>{isRTL ? 'راهنمای مرحله به مرحله' : 'Step-by-step guidance'}</li>
                                    <li>{isRTL ? 'امکانات ساده‌شده' : 'Simplified feature set'}</li>
                                    <li>{isRTL ? 'پشتیبانی صوتی (به زودی)' : 'Voice support (coming soon)'}</li>
                                </ul>
                            </>
                        ) : (
                            <div className="am-card-soon">
                                <div className="am-soon-icon">⚙️</div>
                                <div className="am-soon-label" style={{ fontFamily: monoFont }}>
                                    {isRTL ? 'در حال ساخت' : 'UNDER DEVELOPMENT'}
                                </div>
                                <p className="am-soon-text">
                                    {isRTL
                                        ? 'نسخه دسترسی آسان در حال طراحی و ساخت است. به زودی در دسترس خواهد بود.'
                                        : 'The easy access version is being designed and built. It will be available soon.'}
                                </p>
                                <div className="am-soon-pulse">
                                    <span className="am-soon-dot" />
                                    <span style={{ fontFamily: monoFont }}>
                                        {isRTL ? 'توسعه فعال' : 'Active development'}
                                    </span>
                                </div>
                                <button
                                    className="am-soon-back"
                                    onClick={e => { e.stopPropagation(); setEasyClicked(false); }}
                                >
                                    {isRTL ? '← بازگشت' : '← Back'}
                                </button>
                            </div>
                        )}
                    </div>

                    {/* ── Complete Access ── */}
                    <div
                        className="am-card am-card--complete"
                        onClick={() => navigate('/choose')}
                        role="button"
                        tabIndex={0}
                        onKeyDown={e => e.key === 'Enter' && navigate('/choose')}
                    >
                        <div className="am-card-icon">⚡</div>
                        <div className="am-card-badge am-card-badge--complete" style={{ fontFamily: monoFont }}>
                            {isRTL ? 'دسترسی کامل' : 'COMPLETE ACCESS'}
                        </div>
                        <h2 className="am-card-title" style={{ fontFamily: headFont }}>
                            {isRTL ? 'پلتفرم کامل' : 'Full Platform'}
                        </h2>
                        <p className="am-card-desc">
                            {isRTL
                                ? 'تمام قابلیت‌های پلتفرم — طرح‌های انتقالی، رأی‌گیری، آرنا، کابینه سایه، نقشه جهانی و بیشتر.'
                                : 'The full platform experience — transitional plans, voting, the Arena, shadow cabinet, global map, and more.'}
                        </p>
                        <ul className="am-card-features">
                            <li>{isRTL ? 'همه طرح‌های انتقالی' : 'All transitional plans'}</li>
                            <li>{isRTL ? 'رأی‌گیری امن' : 'Secure voting'}</li>
                            <li>{isRTL ? 'آرنا و پیشنهاد طرح' : 'Arena & plan submission'}</li>
                            <li>{isRTL ? 'تحلیل و مقایسه پیشرفته' : 'Advanced compare & analysis'}</li>
                        </ul>
                        <div className="am-card-cta" style={{ fontFamily: monoFont }}>
                            {isRTL ? 'ادامه ←' : 'Continue →'}
                        </div>
                    </div>

                </div>

                <div className="am-footer">
                    <Link to="/" className="am-back" style={{ fontFamily: monoFont }}>
                        {isRTL ? '← بازگشت به صفحه اصلی' : '← Back to home'}
                    </Link>
                </div>
            </div>
        </div>
    );
}
