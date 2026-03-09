import React, { useEffect, useRef } from "react";
import { NavLink, Outlet, Link } from "react-router-dom";
import { LangProvider, useLang } from '../../contexts/LangContext';
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary';
import './Layout.css';

export { useLang };

function NavContent() {
    const { lang, setLang, isRTL } = useLang();
    const [mobileNavOpen, setMobileNavOpen] = React.useState(false);
    const navRef = useRef(null);

    useEffect(() => {
        if (!mobileNavOpen) return;
        function handleOutsideClick(e) {
            if (navRef.current && !navRef.current.contains(e.target)) {
                setMobileNavOpen(false);
            }
        }
        document.addEventListener('mousedown', handleOutsideClick);
        document.addEventListener('touchstart', handleOutsideClick);
        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
            document.removeEventListener('touchstart', handleOutsideClick);
        };
    }, [mobileNavOpen]);

    return (
        <div
            dir={isRTL ? "rtl" : "ltr"}
            style={{ fontFamily: isRTL ? "'Vazirmatn', sans-serif" : "'Inter', sans-serif" }}
        >
            <nav className="site-nav" ref={navRef} onMouseDown={e => e.preventDefault()}>
                <div className="site-nav-left">
                    <NavLink to="/" className="site-nav-logo">
                        <img src="/logo.svg" alt="logo" />
                        <span style={{ fontFamily: "'Inter', sans-serif" }}>
                            {isRTL ? "ایران دائو" : "IranDAO"}
                        </span>
                    </NavLink>

                    <div className="site-nav-links">
                        <NavLink to="/" end className={({ isActive }) => `site-nav-link ${isActive ? "is-active" : ""}`}>
                            {isRTL ? "نقشه" : "MAP"}
                        </NavLink>
                        <NavLink to="/sectors" className={({ isActive }) => `site-nav-link ${isActive ? "is-active" : ""}`}>
                            {isRTL ? "بخش‌ها" : "SECTORS"}
                        </NavLink>
                        <NavLink to="/layers" className={({ isActive }) => `site-nav-link ${isActive ? "is-active" : ""}`}>
                            {isRTL ? "لایه‌ها" : "LAYERS"}
                        </NavLink>
                        <NavLink to="/roadmap" className={({ isActive }) => `site-nav-link ${isActive ? "is-active" : ""}`}>
                            {isRTL ? "نقشه راه" : "ROADMAP"}
                        </NavLink>
                        <NavLink to="/about" className={({ isActive }) => `site-nav-link ${isActive ? "is-active" : ""}`}>
                            {isRTL ? "درباره" : "ABOUT"}
                        </NavLink>
                    </div>
                </div>

                <div className="site-nav-right">
                    <Link to="/register" className="site-nav-register-btn">
                        {isRTL ? "ثبت‌نام" : "REGISTER"}
                    </Link>
                    <div className="site-nav-lang">
                        <button
                            className={`site-nav-lang-btn ${lang === "fa" ? "is-active" : ""}`}
                            style={{ fontFamily: "'Vazirmatn', sans-serif" }}
                            onClick={() => setLang("fa")}
                        >فارسی</button>
                        <button
                            className={`site-nav-lang-btn ${lang === "en" ? "is-active" : ""}`}
                            style={{ fontFamily: "'Inter', sans-serif" }}
                            onClick={() => setLang("en")}
                        >EN</button>
                    </div>
                    <button
                        className="hamburger-nav-btn"
                        onClick={() => setMobileNavOpen(!mobileNavOpen)}
                        aria-label="Menu"
                    >
                        <span className={`hamburger-nav-icon${mobileNavOpen ? " is-open" : ""}`}>
                            <span /><span /><span />
                        </span>
                    </button>
                </div>

                {mobileNavOpen && (
                    <div className="mobile-nav-dropdown">
                        <NavLink to="/" end className={({ isActive }) => `site-nav-link ${isActive ? "is-active" : ""}`} onClick={() => setMobileNavOpen(false)}>
                            {isRTL ? "نقشه" : "MAP"}
                        </NavLink>
                        <NavLink to="/sectors" className={({ isActive }) => `site-nav-link ${isActive ? "is-active" : ""}`} onClick={() => setMobileNavOpen(false)}>
                            {isRTL ? "بخش‌ها" : "SECTORS"}
                        </NavLink>
                        <NavLink to="/layers" className={({ isActive }) => `site-nav-link ${isActive ? "is-active" : ""}`} onClick={() => setMobileNavOpen(false)}>
                            {isRTL ? "لایه‌ها" : "LAYERS"}
                        </NavLink>
                        <NavLink to="/roadmap" className={({ isActive }) => `site-nav-link ${isActive ? "is-active" : ""}`} onClick={() => setMobileNavOpen(false)}>
                            {isRTL ? "نقشه راه" : "ROADMAP"}
                        </NavLink>
                        <NavLink to="/about" className={({ isActive }) => `site-nav-link ${isActive ? "is-active" : ""}`} onClick={() => setMobileNavOpen(false)}>
                            {isRTL ? "درباره" : "ABOUT"}
                        </NavLink>
                        <NavLink to="/register" className={({ isActive }) => `site-nav-link ${isActive ? "is-active" : ""}`} onClick={() => setMobileNavOpen(false)}>
                            {isRTL ? "ثبت‌نام" : "REGISTER"}
                        </NavLink>
                    </div>
                )}
            </nav>

            <div className="site-layout-content">
                <ErrorBoundary>
                    <Outlet />
                </ErrorBoundary>
            </div>
        </div>
    );
}

export default function Layout() {
    return (
        <LangProvider>
            <NavContent />
        </LangProvider>
    );
}
