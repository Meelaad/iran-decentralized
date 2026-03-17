import React, { useEffect, useRef, useState } from "react";
import { NavLink, Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { useLang } from '../../contexts/LangContext';
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary';
import { useAuth } from '../../hooks/useAuth';
import { ThemeSwitch } from '../ThemeSwitch/ThemeSwitch';
import { BLUEPRINTS } from '../../data';
import './Layout.css';

export { useLang };

function DevLinks() {
    const { isAdmin } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [pos, setPos] = useState({ x: 20, y: 20 }); // distance from bottom-left
    const dragging = React.useRef(false);
    const offset   = React.useRef({ x: 0, y: 0 });
    const widgetRef = React.useRef(null);

    const links = [
        { to: "/transition/main-stage", label: "Main Stage" },
        { to: "/transition/incubator", label: "Incubator" },
        { to: "/transition/amendment-floor", label: "Amendment Floor" },
        { to: "/transition/shadow-cabinet", label: "Shadow Cabinet" },
        { to: "/destination", label: "Destination" },
    ];

    function onMouseDown(e) {
        if (e.button !== 0) return;
        dragging.current = true;
        const rect = widgetRef.current.getBoundingClientRect();
        offset.current = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        };
        e.preventDefault();
    }

    React.useEffect(() => {
        function onMouseMove(e) {
            if (!dragging.current) return;
            const x = e.clientX - offset.current.x;
            const y = e.clientY - offset.current.y;
            widgetRef.current.style.left   = `${x}px`;
            widgetRef.current.style.top    = `${y}px`;
            widgetRef.current.style.bottom = 'auto';
            widgetRef.current.style.right  = 'auto';
        }
        function onMouseUp() { dragging.current = false; }
        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);
        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseup', onMouseUp);
        };
    }, []);

    if (!isAdmin) return null;

    return (
        <div
            ref={widgetRef}
            className={`dev-links-widget ${isOpen ? 'is-open' : ''}`}
            style={{ bottom: pos.y, left: pos.x }}
        >
            <button
                className="dev-links-toggle"
                onMouseDown={onMouseDown}
                onClick={() => setIsOpen(!isOpen)}
                style={{ cursor: 'grab' }}
            >
                Dev
            </button>
            {isOpen && (
                <div className="dev-links-list">
                    {links.map(link => (
                        <NavLink key={link.to} to={link.to} className="dev-link" onClick={() => setIsOpen(false)}>
                            {link.label}
                        </NavLink>
                    ))}
                </div>
            )}
        </div>
    );
}

function NavContent() {
    const { lang, setLang, isRTL, t, tKey, monoFont, headFont } = useLang();
    const [mobileNavOpen, setMobileNavOpen] = React.useState(false);
    const [blueprintOpen, setBlueprintOpen] = useState(false);
    const { session, isAdmin, profileName, logout } = useAuth();

    const navRef = useRef(null);
    const blueprintRef = useRef(null);
    const navigate = useNavigate();
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

    const handleBlueprintChange = (id) => {
        setBlueprintOpen(false);
        const subpath = location.pathname.match(/\/blueprint\/gov\/[^/]+(\/.*)?/)?.[1] || '';
        navigate(`/blueprint/gov/${id}${subpath}`);
    };

    const handleMobileLinkClick = () => setMobileNavOpen(false);

    const handleMobileLogout = () => {
        setMobileNavOpen(false);
        logout();
    };

    const isTransitionZone  = /^\/(arena|transitional|plans|compare\/transition|pre|global)/.test(location.pathname);
    const isDestinationZone = !isTransitionZone && /^\/(destination|blueprints|blueprint\/gov|compare)/.test(location.pathname);

    // General links — always shown regardless of zone
    const generalNavLinks = [
        { to: '/vote',  labelKey: 'nav.vote' },
        { to: '/about', labelKey: 'nav.about' },
    ];

    // Zone-specific links (empty on neutral pages like /contact, /privacy, etc.)
    const transitionZoneLinks = [
        { to: '/arena',              labelKey: 'nav.arena' },
        { to: '/plans',              labelKey: 'nav.plans' },
        { to: '/compare/transition', labelKey: 'nav.comparePlans' },
        { to: '/global',             labelKey: 'nav.global' },
    ];

    const destinationZoneLinks = [
        { to: '/destination',                                                      labelKey: 'nav.destination' },
        { to: '/blueprints',                                                       labelKey: 'nav.blueprints' },
        { to: `/blueprint/gov/${activeBlueprintId || 'decentralized'}`,            labelKey: 'nav.map' },
        { to: `/blueprint/gov/${activeBlueprintId || 'decentralized'}/sectors`,    labelKey: 'nav.sectors' },
        { to: `/blueprint/gov/${activeBlueprintId || 'decentralized'}/layers`,     labelKey: 'nav.layers' },
        { to: `/blueprint/gov/${activeBlueprintId || 'decentralized'}/roadmap`,    labelKey: 'nav.roadmap' },
        { to: '/compare',                                                          labelKey: 'nav.compare' },
    ];

    const zoneLinks = isTransitionZone ? transitionZoneLinks : isDestinationZone ? destinationZoneLinks : [];
    const hasSeparator = zoneLinks.length > 0;

    return (
        <div
            dir={isRTL ? "rtl" : "ltr"}
            style={{ fontFamily: headFont }}
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
                        {zoneLinks.map(link => (
                            <NavLink
                                key={link.to}
                                to={link.to}
                                className={({ isActive }) => `site-nav-link ${isActive ? "is-active" : ""}`}
                            >
                                {tKey(link.labelKey)}
                            </NavLink>
                        ))}
                        {hasSeparator && <span className="site-nav-sep" />}
                        {generalNavLinks.map(link => (
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

                    <ThemeSwitch />

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
                            <Link to="/profile" className="site-nav-username-mobile" style={{ fontFamily: monoFont }}>
                                {profileName || tKey('nav.profile')}
                            </Link>
                        </div>
                    )}
                    <button
                        className="hamburger-nav-btn"
                        onClick={() => setMobileNavOpen(!mobileNavOpen)}
                        aria-label="Menu"
                        aria-expanded={mobileNavOpen}
                    >
                        {mobileNavOpen ? (
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                                <path d="M3.72 3.72a.75.75 0 0 1 1.06 0L8 6.94l3.22-3.22a.749.749 0 0 1 1.275.326.749.749 0 0 1-.215.734L9.06 8l3.22 3.22a.749.749 0 0 1-.326 1.275.749.749 0 0 1-.734-.215L8 9.06l-3.22 3.22a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042L6.94 8 3.72 4.78a.75.75 0 0 1 0-1.06Z" />
                            </svg>
                        ) : (
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                                <path d="M1 2.75A.75.75 0 0 1 1.75 2h12.5a.75.75 0 0 1 0 1.5H1.75A.75.75 0 0 1 1 2.75Zm0 5A.75.75 0 0 1 1.75 7h12.5a.75.75 0 0 1 0 1.5H1.75A.75.75 0 0 1 1 7.75ZM1.75 12h12.5a.75.75 0 0 1 0 1.5H1.75a.75.75 0 0 1 0-1.5Z" />
                            </svg>
                        )}
                    </button>
                </div>


                {mobileNavOpen && (
                    <div className="mobile-nav-dropdown">
                        {zoneLinks.map(link => (
                            <NavLink
                                key={link.to}
                                to={link.to}
                                className={({ isActive }) => `site-nav-link ${isActive ? "is-active" : ""}`}
                                onClick={handleMobileLinkClick}
                            >
                                {tKey(link.labelKey)}
                            </NavLink>
                        ))}
                        {hasSeparator && <div className="mobile-nav-sep" />}
                        {generalNavLinks.map(link => (
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
                        <div className="mobile-nav-lang">
                            <button
                                className={`mobile-nav-lang-btn ${lang === "fa" ? "is-active" : ""}`}
                                style={{ fontFamily: "'Vazirmatn', sans-serif" }}
                                onClick={() => { setLang("fa"); setMobileNavOpen(false); }}
                            >فارسی</button>
                            <button
                                className={`mobile-nav-lang-btn ${lang === "en" ? "is-active" : ""}`}
                                style={{ fontFamily: "'Inter', sans-serif" }}
                                onClick={() => { setLang("en"); setMobileNavOpen(false); }}
                            >EN</button>
                        </div>
                    </div>
                )}
            </nav>

            <div className="site-layout-content">
                <ErrorBoundary>
                    <Outlet />
                </ErrorBoundary>
                <footer className="site-footer">
                    <Link to="/privacy" className="site-footer-link" style={{ fontFamily: headFont }}>
                        {tKey('common.privacyPolicy')}
                    </Link>
                    <span className="site-footer-sep">·</span>
                    <Link to="/terms" className="site-footer-link" style={{ fontFamily: headFont }}>
                        {tKey('common.termsOfUse')}
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
