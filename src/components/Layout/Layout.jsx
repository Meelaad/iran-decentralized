import React, { useEffect, useRef, useState } from "react";
import { NavLink, Outlet, Link, useNavigate, useMatch } from "react-router-dom";
import { useLang } from '../../contexts/LangContext';
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary';
import { BLUEPRINTS } from '../../data';
import { useAuth } from '../../hooks/useAuth';
import './Layout.css';

export { useLang };

function NavContent() {
    const { lang, setLang, isRTL, t, tKey } = useLang();
    const [mobileNavOpen, setMobileNavOpen] = React.useState(false);
    const [blueprintOpen, setBlueprintOpen] = useState(false);
    const { session, isAdmin, profileName, logout } = useAuth();

    const navRef = useRef(null);
    const blueprintRef = useRef(null);
    const navigate = useNavigate();
    const blueprintMatch = useMatch('/blueprint/:blueprintId');
    const activeBlueprintId = blueprintMatch?.params?.blueprintId || null;

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

    useEffect(() => {
        if (!blueprintOpen) return;
        function handleOutsideClick(e) {
            if (blueprintRef.current && !blueprintRef.current.contains(e.target)) {
                setBlueprintOpen(false);
            }
        }
        document.addEventListener('mousedown', handleOutsideClick);
        return () => document.removeEventListener('mousedown', handleOutsideClick);
    }, [blueprintOpen]);

    const handleMobileLinkClick = () => setMobileNavOpen(false);

    const handleMobileLogout = () => {
        setMobileNavOpen(false);
        logout();
    };

    const navLinks = [
        { to: `/blueprint/${activeBlueprintId || 'decentralized'}`, labelKey: 'nav.map' },
        { to: `/blueprint/${activeBlueprintId || 'decentralized'}/sectors`, labelKey: 'nav.sectors' },
        { to: "/layers", labelKey: 'nav.layers' },
        { to: "/roadmap", labelKey: 'nav.roadmap' },
        { to: "/compare", labelKey: 'nav.compare' },
        { to: "/vote", labelKey: 'nav.vote' },
        { to: "/about", labelKey: 'nav.about' },
    ];

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
                            {tKey('brand.name')}
                        </span>
                    </NavLink>

                    <div className="site-nav-links">
                        {navLinks.map(link => (
                            <NavLink
                                key={link.to}
                                to={link.to}
                                className={({ isActive }) => `site-nav-link ${isActive ? "is-active" : ""}`}
                            >
                                {tKey(link.labelKey)}
                            </NavLink>
                        ))}
                    </div>
                </div>

                <div className="site-nav-right">
                    {isAdmin && (
                        <Link to="/admin" className="site-nav-admin-btn">
                            {tKey('nav.admin')}
                        </Link>
                    )}
                    {session ? (
                        <>
                            <Link to="/profile" className="site-nav-profile-btn">
                                {profileName || tKey('nav.profile')}
                            </Link>
                            <button className="site-nav-logout-btn" onClick={logout}>
                                {tKey('nav.logout')}
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="site-nav-login-btn">
                                {tKey('nav.login')}
                            </Link>
                            <Link to="/register" className="site-nav-register-btn">
                                {tKey('nav.register')}
                            </Link>
                        </>
                    )}

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
                    {session && (
                        <Link to="/profile" className="site-nav-username-mobile" style={{ fontFamily: isRTL ? "'Vazirmatn', sans-serif" : "'IBM Plex Mono', monospace" }}>
                            {profileName || tKey('nav.profile')}
                        </Link>
                    )}
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


                <div className="site-nav-subrow" ref={blueprintRef}>
                    <div className="site-nav-blueprint">
                        <button
                            className={`site-nav-blueprint-btn${activeBlueprintId ? " is-active" : ""}`}
                            onClick={() => setBlueprintOpen(o => !o)}
                            style={{ fontFamily: isRTL ? "'Vazirmatn', sans-serif" : "'Inter', sans-serif" }}
                        >
                            <span className="site-nav-blueprint-btn-text">
                                {activeBlueprintId && BLUEPRINTS[activeBlueprintId]
                                    ? t(BLUEPRINTS[activeBlueprintId].name)
                                    : tKey('nav.blueprints')}
                            </span>
                            <span className="site-nav-blueprint-caret">{blueprintOpen ? "▲" : "▼"}</span>
                        </button>
                        {blueprintOpen && (
                            <div className="site-nav-blueprint-dropdown">
                                <div className="site-nav-blueprint-header">{tKey('nav.blueprints')}</div>
                                {Object.values(BLUEPRINTS).map(bp => (
                                    <button
                                        key={bp.id}
                                        className={`site-nav-blueprint-option${activeBlueprintId === bp.id ? " is-active" : ""}`}
                                        style={{ fontFamily: isRTL ? "'Vazirmatn', sans-serif" : "'Inter', sans-serif" }}
                                        onClick={() => { navigate(`/blueprint/${bp.id}`); setBlueprintOpen(false); }}
                                    >
                                        {t(bp.name)}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {mobileNavOpen && (
                    <div className="mobile-nav-dropdown">
                        {navLinks.map(link => (
                            <NavLink
                                key={link.to}
                                to={link.to}
                                className={({ isActive }) => `site-nav-link ${isActive ? "is-active" : ""}`}
                                onClick={handleMobileLinkClick}
                            >
                                {tKey(link.labelKey)}
                            </NavLink>
                        ))}
                        {session ? (
                            <>
                                {isAdmin && (
                                    <NavLink to="/admin" className={({ isActive }) => `site-nav-link ${isActive ? "is-active" : ""}`} onClick={handleMobileLinkClick}>
                                        {tKey('nav.admin')}
                                    </NavLink>
                                )}
                                <NavLink to="/profile" className={({ isActive }) => `site-nav-link ${isActive ? "is-active" : ""}`} onClick={handleMobileLinkClick}>
                                    {profileName || tKey('nav.profile')}
                                </NavLink>
                                <button className="site-nav-link mobile-nav-logout" onClick={handleMobileLogout}>
                                    {tKey('nav.logout')}
                                </button>
                            </>
                        ) : (
                            <>
                                <NavLink to="/login" className={({ isActive }) => `site-nav-link ${isActive ? "is-active" : ""}`} onClick={handleMobileLinkClick}>
                                    {tKey('nav.login')}
                                </NavLink>
                                <NavLink to="/register" className={({ isActive }) => `site-nav-link ${isActive ? "is-active" : ""}`} onClick={handleMobileLinkClick}>
                                    {tKey('nav.register')}
                                </NavLink>
                            </>
                        )}
                    </div>
                )}
            </nav>

            <div className="site-layout-content">
                <ErrorBoundary>
                    <Outlet />
                </ErrorBoundary>
                <footer className="site-footer">
                    <Link to="/privacy" className="site-footer-link" style={{ fontFamily: isRTL ? "'Vazirmatn', sans-serif" : "'Inter', sans-serif" }}>
                        {tKey('common.privacyPolicy')}
                    </Link>
                </footer>
            </div>
        </div>
    );
}

export default function Layout() {
    return <NavContent />;
}
