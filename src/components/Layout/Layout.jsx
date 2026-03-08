import React, { createContext, useContext, useState, useCallback } from "react";
import { NavLink, Outlet } from "react-router-dom";
import './Layout.css';

const LangContext = createContext({ lang: "fa", setLang: () => {}, t: (obj) => obj.en, isRTL: true });

// eslint-disable-next-line react-refresh/only-export-components
export function useLang() {
    return useContext(LangContext);
}

export default function Layout() {
    const [lang, setLang] = useState("fa");
    const [mobileNavOpen, setMobileNavOpen] = useState(false);
    const t = useCallback((obj) => (obj ? obj[lang] || obj.en : ""), [lang]);
    const isRTL = lang === "fa";

    return (
        <LangContext.Provider value={{ lang, setLang, t, isRTL }}>
            <div
                dir={isRTL ? "rtl" : "ltr"}
                style={{ fontFamily: isRTL ? "'Vazirmatn', sans-serif" : "'Inter', sans-serif" }}
            >
                <nav className="site-nav" onMouseDown={e => e.preventDefault()}>
                    <div className="site-nav-left">
                        <NavLink to="/" className="site-nav-logo">
                            <img src="/logo.svg" alt="logo" />
                            <span style={{ fontFamily: "'Inter', sans-serif" }}>
                                {isRTL ? "ایران دائو" : "IranDAO"}
                            </span>
                        </NavLink>

                        <div className="site-nav-links">
                            <NavLink
                                to="/"
                                end
                                className={({ isActive }) => `site-nav-link ${isActive ? "is-active" : ""}`}
                            >
                                {isRTL ? "نقشه" : "MAP"}
                            </NavLink>
                            <NavLink
                                to="/sectors"
                                className={({ isActive }) => `site-nav-link ${isActive ? "is-active" : ""}`}
                            >
                                {isRTL ? "بخش‌ها" : "SECTORS"}
                            </NavLink>
                            <NavLink
                                to="/layers"
                                className={({ isActive }) => `site-nav-link ${isActive ? "is-active" : ""}`}
                            >
                                {isRTL ? "لایه‌ها" : "LAYERS"}
                            </NavLink>
                            <NavLink
                                to="/roadmap"
                                className={({ isActive }) => `site-nav-link ${isActive ? "is-active" : ""}`}
                            >
                                {isRTL ? "نقشه راه" : "ROADMAP"}
                            </NavLink>
                            <NavLink
                                to="/about"
                                className={({ isActive }) => `site-nav-link ${isActive ? "is-active" : ""}`}
                            >
                                {isRTL ? "درباره" : "ABOUT"}
                            </NavLink>
                        </div>
                    </div>

                    <div className="site-nav-right">
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
                        </div>
                    )}
                </nav>

                <div className="site-layout-content">
                    <Outlet />
                </div>
            </div>
        </LangContext.Provider>
    );
}
