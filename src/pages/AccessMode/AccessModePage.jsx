import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useLang } from '../../contexts/LangContext';
import { ThemeSwitch } from '../../components/ThemeSwitch/ThemeSwitch';
import { BrandMark } from '../../components/BrandMark/BrandMark';
import { FeatureSlider, RIGHT_FEATURES } from '../../components/FeatureSlider/FeatureSlider';
import './AccessModePage.css';

export default function AccessModePage() {
    const { isRTL, lang, setLang, monoFont, headFont } = useLang();
    const navigate = useNavigate();
    const [easyClicked, setEasyClicked] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <div className="am-root" dir={isRTL ? 'rtl' : 'ltr'} style={{ fontFamily: headFont }}>
            <div className="am-bg-grid" style={{ viewTransitionName: 'standalone-bg' }} />

            {/* Top bar */}
            {/* <div className="am-topbar" style={{ viewTransitionName: 'standalone-topbar' }}>
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
            </div> */}

            {/* Mobile menu button */}
            {/* <div className="am-mobile-menu">
                <button className="am-mobile-menu-btn" onClick={() => setMenuOpen(o => !o)} aria-label="Menu">
                    {menuOpen
                        ? <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M3.72 3.72a.75.75 0 0 1 1.06 0L8 6.94l3.22-3.22a.749.749 0 0 1 1.275.326.749.749 0 0 1-.215.734L9.06 8l3.22 3.22a.749.749 0 0 1-.326 1.275.749.749 0 0 1-.734-.215L8 9.06l-3.22 3.22a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042L6.94 8 3.72 4.78a.75.75 0 0 1 0-1.06Z" /></svg>
                        : <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M1 2.75A.75.75 0 0 1 1.75 2h12.5a.75.75 0 0 1 0 1.5H1.75A.75.75 0 0 1 1 2.75Zm0 5A.75.75 0 0 1 1.75 7h12.5a.75.75 0 0 1 0 1.5H1.75A.75.75 0 0 1 1 7.75ZM1.75 12h12.5a.75.75 0 0 1 0 1.5H1.75a.75.75 0 0 1 0-1.5Z" /></svg>
                    }
                </button>
                {menuOpen && (
                    <div className="am-mobile-menu-dropdown">
                        <ThemeSwitch />
                        <div className="am-mobile-lang">
                            <button className={`am-lang-btn${lang === 'fa' ? ' is-active' : ''}`} onClick={() => { setLang('fa'); setMenuOpen(false); }} style={{ fontFamily: "'Vazirmatn', sans-serif" }}>فارسی</button>
                            <button className={`am-lang-btn${lang === 'en' ? ' is-active' : ''}`} onClick={() => { setLang('en'); setMenuOpen(false); }}>EN</button>
                        </div>
                    </div>
                )}
            </div> */}

            <div className="am-inner">
                <header className="am-header">
                    <BrandMark size="lg" />
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
                        onClick={() => { if (document.startViewTransition) { document.startViewTransition(() => navigate('/choose')); } else { navigate('/choose'); } }}
                        role="button"
                        tabIndex={0}
                        onKeyDown={e => { if (e.key === 'Enter') { if (document.startViewTransition) { document.startViewTransition(() => navigate('/choose')); } else { navigate('/choose'); } } }}
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
                                ? 'تمام قابلیت‌های پلتفرم — طرح‌های انتقالی، رأی‌گیری، آرنا، دولت سایه، نقشه جهانی و بیشتر.'
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

            <FeatureSlider items={RIGHT_FEATURES} />
        </div>
    );
}
