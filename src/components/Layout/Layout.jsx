import React, { useEffect, useRef, useState } from "react";
import { NavLink, Outlet, Link, useLocation } from "react-router-dom";
import { useLang } from '../../contexts/LangContext';
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary';
import { useAuth } from '../../hooks/useAuth';
import './Layout.css';

export { useLang };

function DevLinks() {
    const [isOpen, setIsOpen] = useState(false);
    const links = [
        { to: "/transition/main-stage", label: "Main Stage" },
        { to: "/transition/incubator", label: "Incubator" },
        { to: "/transition/amendment-floor", label: "Amendment Floor" },
        { to: "/transition/shadow-cabinet", label: "Shadow Cabinet" },
        { to: "/destination", label: "Destination" },
    ];

    return (
        <div className={`dev-links-widget ${isOpen ? 'is-open' : ''}`}>
            <button className="dev-links-toggle" onClick={() => setIsOpen(!isOpen)}>
                Dev
            </button>
            {isOpen && (
                <div className="dev-links-list">
                    {links.map(link => (
                        <NavLink key={link.to} to={link.to} className="dev-link">
                            {link.label}
                        </NavLink>
                    ))}
                </div>
            )}
        </div>
    );
}

function NavContent() {
    const { lang, setLang, isRTL, t, tKey } = useLang();
    const [mobileNavOpen, setMobileNavOpen] = React.useState(false);
    const { session, isAdmin, profileName, logout } = useAuth();

    const navRef = useRef(null);
    const location = useLocation();

    const match = location.pathname.match(/\/blueprint\/gov\/([^/]+)(\/.*)?/);
    const activeBlueprintId = match ? match[1] : null;

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

    const handleMobileLinkClick = () => setMobileNavOpen(false);

    const handleMobileLogout = () => {
        setMobileNavOpen(false);
        logout();
    };

    const isTransitionZone = /^\/(arena|transitional|plans|compare\/transition|pre)/.test(location.pathname);

    const transitionNavLinks = [
        { to: '/arena',              labelKey: 'nav.arena' },
        { to: '/plans',              labelKey: 'nav.plans' },
        { to: '/compare/transition', labelKey: 'nav.comparePlans' },
        { to: '/vote',               labelKey: 'nav.vote' },
        { to: '/about',              labelKey: 'nav.about' },
    ];

    const destinationNavLinks = [
        { to: '/destination',                                                      labelKey: 'nav.destination' },
        { to: '/blueprints',                                                       labelKey: 'nav.blueprints' },
        { to: `/blueprint/gov/${activeBlueprintId || 'decentralized'}`,            labelKey: 'nav.map' },
        { to: `/blueprint/gov/${activeBlueprintId || 'decentralized'}/sectors`,    labelKey: 'nav.sectors' },
        { to: `/blueprint/gov/${activeBlueprintId || 'decentralized'}/layers`,     labelKey: 'nav.layers' },
        { to: `/blueprint/gov/${activeBlueprintId || 'decentralized'}/roadmap`,    labelKey: 'nav.roadmap' },
        { to: '/compare',                                                          labelKey: 'nav.compare' },
        { to: '/vote',                                                             labelKey: 'nav.vote' },
        { to: '/about',                                                            labelKey: 'nav.about' },
    ];

    const navLinks = isTransitionZone ? transitionNavLinks : destinationNavLinks;

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
                        <div style={{display: 'flex', alignItems: 'center', gap: 8}}>
                            <Link to="/profile" className="site-nav-username-mobile" style={{ fontFamily: isRTL ? "'Vazirmatn', sans-serif" : "'intelone-mono', monospace" }}>
                                {profileName || tKey('nav.profile')}
                            </Link>
                        </div>
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
            <DevLinks />
        </div>
    );
}

export default function Layout() {
    return <NavContent />;
}
