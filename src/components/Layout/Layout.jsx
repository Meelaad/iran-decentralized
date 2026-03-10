import React, { useEffect, useRef, useState } from "react";
import { NavLink, Outlet, Link, useNavigate } from "react-router-dom";
import { useLang } from '../../contexts/LangContext';
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary';
import { supabase } from '../../lib/supabase';
import './Layout.css';

export { useLang };

function NavContent() {
    const { lang, setLang, isRTL } = useLang();
    const [mobileNavOpen, setMobileNavOpen] = React.useState(false);
    const [session, setSession] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [profileName, setProfileName] = useState('');
    const navRef = useRef(null);
    const navigate = useNavigate();

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
                    {isAdmin && (
                        <Link to="/admin" className="site-nav-admin-btn">
                            {isRTL ? "پنل مدیریت" : "ADMIN"}
                        </Link>
                    )}
                    {session ? (
                        <>
                            <Link to="/profile" className="site-nav-profile-btn">
                                {profileName || (isRTL ? "پروفایل" : "PROFILE")}
                            </Link>
                            <button className="site-nav-logout-btn" onClick={handleLogout}>
                                {isRTL ? "خروج" : "LOGOUT"}
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="site-nav-login-btn">
                                {isRTL ? "ورود" : "LOGIN"}
                            </Link>
                            <Link to="/register" className="site-nav-register-btn">
                                {isRTL ? "ثبت‌نام" : "REGISTER"}
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
                        {session ? (
                            <>
                                {isAdmin && (
                                    <NavLink to="/admin" className={({ isActive }) => `site-nav-link ${isActive ? "is-active" : ""}`} onClick={() => setMobileNavOpen(false)}>
                                        {isRTL ? "پنل مدیریت" : "ADMIN"}
                                    </NavLink>
                                )}
                                <NavLink to="/profile" className={({ isActive }) => `site-nav-link ${isActive ? "is-active" : ""}`} onClick={() => setMobileNavOpen(false)}>
                                    {profileName || (isRTL ? "پروفایل" : "PROFILE")}
                                </NavLink>
                                <button
                                    className="site-nav-link mobile-nav-logout"
                                    onClick={() => { setMobileNavOpen(false); handleLogout(); }}
                                >
                                    {isRTL ? 'خروج' : 'LOGOUT'}
                                </button>
                            </>
                        ) : (
                            <>
                                <NavLink to="/login" className={({ isActive }) => `site-nav-link ${isActive ? "is-active" : ""}`} onClick={() => setMobileNavOpen(false)}>
                                    {isRTL ? 'ورود' : 'LOGIN'}
                                </NavLink>
                                <NavLink to="/register" className={({ isActive }) => `site-nav-link ${isActive ? "is-active" : ""}`} onClick={() => setMobileNavOpen(false)}>
                                    {isRTL ? 'ثبت‌نام' : 'REGISTER'}
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
                        {isRTL ? 'سیاست حریم خصوصی' : 'Privacy Policy'}
                    </Link>
                </footer>
            </div>
        </div>
    );
}

export default function Layout() {
    return <NavContent />;
}
