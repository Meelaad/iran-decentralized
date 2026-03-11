import React, { useEffect, useRef, useState } from "react";
import { NavLink, Outlet, Link, useNavigate, useMatch } from "react-router-dom";
import { useLang } from '../../contexts/LangContext';
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary';
import { supabase } from '../../lib/supabase';
import { BLUEPRINTS } from '../../data';
import './Layout.css';

export { useLang };

function NavContent() {
    const { lang, setLang, isRTL, t, tKey } = useLang();
    const [mobileNavOpen, setMobileNavOpen] = React.useState(false);
    const [blueprintOpen, setBlueprintOpen] = useState(false);
    const [session, setSession] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [profileName, setProfileName] = useState('');
    const navRef = useRef(null);
    const blueprintRef = useRef(null);
    const navigate = useNavigate();
    const blueprintMatch = useMatch('/blueprint/:blueprintId');
    const activeBlueprintId = blueprintMatch?.params?.blueprintId || null;

    useEffect(() => {
        supabase.auth.getSession().then(({ data }) => {
            setSession(data.session);
            if (data.session) checkAdmin(data.session.user.id);
        });
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            if (session) checkAdmin(session.user.id);
            else setIsAdmin(false);
        });
        return () => subscription.unsubscribe();
    }, []);

    async function checkAdmin(userId) {
        const { data } = await supabase
            .from('profiles')
            .select('is_admin, full_name')
            .eq('id', userId)
            .single();
        setIsAdmin(data?.is_admin === true);
        if (data?.full_name) setProfileName(data.full_name.split(' ')[0]);
    }

    async function handleLogout() {
        await supabase.auth.signOut();
        setIsAdmin(false);
        navigate('/');
    }

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
                        <NavLink to={`/blueprint/${activeBlueprintId || 'decentralized'}`} className={({ isActive }) => `site-nav-link ${isActive ? "is-active" : ""}`}>
                            {tKey('nav.map')}
                        </NavLink>
                        <NavLink to={`/blueprint/${activeBlueprintId || 'decentralized'}/sectors`} className={({ isActive }) => `site-nav-link ${isActive ? "is-active" : ""}`}>
                            {tKey('nav.sectors')}
                        </NavLink>
                        <NavLink to="/layers" className={({ isActive }) => `site-nav-link ${isActive ? "is-active" : ""}`}>
                            {tKey('nav.layers')}
                        </NavLink>
                        <NavLink to="/roadmap" className={({ isActive }) => `site-nav-link ${isActive ? "is-active" : ""}`}>
                            {tKey('nav.roadmap')}
                        </NavLink>
                        <NavLink to="/compare" className={({ isActive }) => `site-nav-link ${isActive ? "is-active" : ""}`}>
                            {tKey('nav.compare')}
                        </NavLink>
                        <NavLink to="/vote" className={({ isActive }) => `site-nav-link ${isActive ? "is-active" : ""}`}>
                            {tKey('nav.vote')}
                        </NavLink>
                        <NavLink to="/about" className={({ isActive }) => `site-nav-link ${isActive ? "is-active" : ""}`}>
                            {tKey('nav.about')}
                        </NavLink>
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
                            <button className="site-nav-logout-btn" onClick={handleLogout}>
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
                    <div className="site-nav-blueprint" ref={blueprintRef}>
                        <button
                            className={`site-nav-blueprint-btn${activeBlueprintId ? " is-active" : ""}`}
                            onClick={() => setBlueprintOpen(o => !o)}
                            style={{ fontFamily: isRTL ? "'Vazirmatn', sans-serif" : "'Inter', sans-serif" }}
                        >
                            {activeBlueprintId ? t(BLUEPRINTS[activeBlueprintId]?.name) : tKey('nav.blueprints')}
                            <span className="site-nav-blueprint-caret">{blueprintOpen ? "▲" : "▼"}</span>
                        </button>
                        {blueprintOpen && (
                            <div className="site-nav-blueprint-dropdown">
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
                        <NavLink to={`/blueprint/${activeBlueprintId || 'decentralized'}`} className={({ isActive }) => `site-nav-link ${isActive ? "is-active" : ""}`} onClick={() => setMobileNavOpen(false)}>
                            {tKey('nav.map')}
                        </NavLink>
                        <NavLink to={`/blueprint/${activeBlueprintId || 'decentralized'}/sectors`} className={({ isActive }) => `site-nav-link ${isActive ? "is-active" : ""}`} onClick={() => setMobileNavOpen(false)}>
                            {tKey('nav.sectors')}
                        </NavLink>
                        <NavLink to="/layers" className={({ isActive }) => `site-nav-link ${isActive ? "is-active" : ""}`} onClick={() => setMobileNavOpen(false)}>
                            {tKey('nav.layers')}
                        </NavLink>
                        <NavLink to="/roadmap" className={({ isActive }) => `site-nav-link ${isActive ? "is-active" : ""}`} onClick={() => setMobileNavOpen(false)}>
                            {tKey('nav.roadmap')}
                        </NavLink>
                        <NavLink to="/compare" className={({ isActive }) => `site-nav-link ${isActive ? "is-active" : ""}`} onClick={() => setMobileNavOpen(false)}>
                            {tKey('nav.compare')}
                        </NavLink>
                        <NavLink to="/vote" className={({ isActive }) => `site-nav-link ${isActive ? "is-active" : ""}`} onClick={() => setMobileNavOpen(false)}>
                            {tKey('nav.vote')}
                        </NavLink>
                        <NavLink to="/about" className={({ isActive }) => `site-nav-link ${isActive ? "is-active" : ""}`} onClick={() => setMobileNavOpen(false)}>
                            {tKey('nav.about')}
                        </NavLink>
                        {session ? (
                            <>
                                {isAdmin && (
                                    <NavLink to="/admin" className={({ isActive }) => `site-nav-link ${isActive ? "is-active" : ""}`} onClick={() => setMobileNavOpen(false)}>
                                        {tKey('nav.admin')}
                                    </NavLink>
                                )}
                                <NavLink to="/profile" className={({ isActive }) => `site-nav-link ${isActive ? "is-active" : ""}`} onClick={() => setMobileNavOpen(false)}>
                                    {profileName || tKey('nav.profile')}
                                </NavLink>
                                <button
                                    className="site-nav-link mobile-nav-logout"
                                    onClick={() => { setMobileNavOpen(false); handleLogout(); }}
                                >
                                    {tKey('nav.logout')}
                                </button>
                            </>
                        ) : (
                            <>
                                <NavLink to="/login" className={({ isActive }) => `site-nav-link ${isActive ? "is-active" : ""}`} onClick={() => setMobileNavOpen(false)}>
                                    {tKey('nav.login')}
                                </NavLink>
                                <NavLink to="/register" className={({ isActive }) => `site-nav-link ${isActive ? "is-active" : ""}`} onClick={() => setMobileNavOpen(false)}>
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
