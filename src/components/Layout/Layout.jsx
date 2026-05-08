import React, { useEffect, useRef, useState, useCallback } from "react";
import { NavLink, Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { useLang } from '../../contexts/LangContext';
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary';
import { useAuth } from '../../hooks/useAuth';
import { ThemeSwitch } from '../ThemeSwitch/ThemeSwitch';
import { BrandMark } from '../BrandMark/BrandMark';
import { BLUEPRINTS } from '../../data';
import FAQ_CONTENT from '../../locales/pages/faq.json';
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

// ── Transition dropdown items ──────────────────────────────────────────────
const TRANSITION_ITEMS = [
    { to: '/arena',              icon: '⚔',  labelKey: 'nav.arena',       descKey: 'nav.arenaDesc' },
    { to: '/plans',              icon: '📋', labelKey: 'nav.plans',       descKey: 'nav.plansDesc' },
    { to: '/pre',                icon: '🗺', labelKey: 'nav.preTransGuide', descKey: 'nav.preTransDesc' },
    { to: '/global',             icon: '🌐', labelKey: 'nav.global',      descKey: 'nav.globalDesc' },
    { to: '/compare/transition', icon: '⚖',  labelKey: 'nav.comparePlans', descKey: 'nav.comparePlansDesc' },
    { to: '/vote',               icon: '🗳',  labelKey: 'nav.vote',        descKey: 'nav.voteDesc' },
];

// ── Destination dropdown items ─────────────────────────────────────────────
function buildDestinationItems(bpId) {
    const id = bpId || 'decentralized';
    return [
        { to: '/destination',                     icon: '🏛',  labelKey: 'nav.destination', descKey: 'nav.destinationDesc' },
        { to: '/blueprints',                      icon: '📐',  labelKey: 'nav.blueprints',  descKey: 'nav.blueprintsDesc' },
        { to: `/blueprint/gov/${id}`,             icon: '🗺',  labelKey: 'nav.map',         descKey: 'nav.mapDesc' },
        { to: `/blueprint/gov/${id}/sectors`,     icon: '🔷',  labelKey: 'nav.sectors',     descKey: 'nav.sectorsDesc' },
        { to: `/blueprint/gov/${id}/layers`,      icon: '🔧',  labelKey: 'nav.layers',      descKey: 'nav.layersDesc' },
        { to: `/blueprint/gov/${id}/roadmap`,     icon: '🛤',  labelKey: 'nav.roadmap',     descKey: 'nav.roadmapDesc' },
        { to: '/compare',                         icon: '⚖',   labelKey: 'nav.compare',     descKey: 'nav.compareDesc' },
    ];
}

// ── Mega dropdown panel ────────────────────────────────────────────────────
function MegaDropdown({ items, title, onClose, tKey }) {
    return (
        <div className="mega-dropdown" onMouseDown={e => e.stopPropagation()}>
            <div className="mega-dropdown-title">{title}</div>
            <div className="mega-dropdown-grid">
                {items.map(item => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        className="mega-dropdown-item"
                        onClick={onClose}
                    >
                        <span className="mega-dropdown-icon">{item.icon}</span>
                        <span className="mega-dropdown-text">
                            <span className="mega-dropdown-label">{tKey(item.labelKey)}</span>
                            <span className="mega-dropdown-desc">{tKey(item.descKey)}</span>
                        </span>
                    </NavLink>
                ))}
            </div>
        </div>
    );
}

// ── Concierge FAQ accordion item ────────────────────────────────────────────
function ConciergeAccordionItem({ item, isRTL }) {
    const [open, setOpen] = useState(false);
    return (
        <div className={`concierge-faq-item${open ? ' is-open' : ''}`}>
            <button className="concierge-faq-q" onClick={() => setOpen(o => !o)}>
                <span>{isRTL ? item.q.fa : item.q.en}</span>
                <span className="concierge-faq-chevron">{open ? '▲' : '▼'}</span>
            </button>
            {open && <div className="concierge-faq-a">{isRTL ? item.a.fa : item.a.en}</div>}
        </div>
    );
}

// ── Concierge panel ────────────────────────────────────────────────────────
function ConciergePanel({ isRTL, tKey, location }) {
    const { headFont } = useLang();
    const [open, setOpen]   = useState(false);
    const [modal, setModal] = useState(false);
    const [tab, setTab]     = useState('info');
    const [feedback, setFeedback] = useState('');
    const navigate = useNavigate();

    function handleClose() { setOpen(false); setModal(false); }
    function handleDock()  { setModal(false); }
    function handleModal() { setModal(true); }

    const handleFeedbackSubmit = (e) => {
        e.preventDefault();
        const params = new URLSearchParams();
        if (feedback.trim()) params.set('message', feedback.trim());
        navigate(`/contact${params.toString() ? '?' + params.toString() : ''}`);
    };

    const pageInfoMap = {
        '/': { title: 'IranDAO', desc: 'Decentralized governance platform for Iran' },
        '/arena': { title: 'Arena', desc: 'Democratic debate arena for transitional plans' },
        '/plans': { title: 'Plans', desc: 'Transitional governance plans' },
        '/destination': { title: 'Destination', desc: 'Future governance destination hub' },
        '/blueprints': { title: 'Blueprints', desc: 'Government system blueprints' },
        '/vote': { title: 'Vote', desc: 'Cast your governance vote' },
        '/about': { title: 'About', desc: 'About IranDAO' },
    };
    const pageInfo = pageInfoMap[location.pathname] || { title: 'IranDAO', desc: 'Decentralized governance platform for Iran' };

    return (
        <>
            {/* Edge toggle strip — hidden when modal */}
            {!modal && (
                <button
                    className={`concierge-toggle ${open ? 'is-open' : ''} ${isRTL ? 'is-rtl' : ''}`}
                    onClick={() => setOpen(v => !v)}
                    aria-label={open ? tKey('concierge.closePanel') : tKey('concierge.expandPanel')}
                    title={open ? tKey('concierge.closePanel') : tKey('concierge.expandPanel')}
                >
                    <span className="concierge-toggle-chevron">{open ? (isRTL ? '❯' : '❮') : (isRTL ? '❮' : '❯')}</span>
                </button>
            )}

            {/* Modal overlay — wraps panel when detached */}
            {open && modal && (
                <div className="concierge-modal-overlay" onClick={handleClose} aria-modal="true" role="dialog" />
            )}

            {/* Sliding / floating panel */}
            <div className={`concierge-panel ${open ? 'is-open' : ''} ${modal ? 'is-modal' : ''} ${isRTL ? 'is-rtl' : ''}`} style={{ fontFamily: headFont }}>
                {/* Panel header */}
                <div className="concierge-header">
                    <div className="concierge-tabs">
                        <button className={`concierge-tab ${tab === 'info'     ? 'is-active' : ''}`} onClick={() => setTab('info')}     title={tKey('concierge.pageInfo')}>ℹ</button>
                        <button className={`concierge-tab ${tab === 'feedback' ? 'is-active' : ''}`} onClick={() => setTab('feedback')} title={tKey('concierge.feedback')}>💬</button>
                        <button className={`concierge-tab ${tab === 'help'     ? 'is-active' : ''}`} onClick={() => setTab('help')}     title={tKey('concierge.help')}>?</button>
                    </div>
                    <div className="concierge-header-actions">
                        {/* Fullscreen / dock button — matching Google devsite icons */}
                        {!modal ? (
                            <button
                                className="concierge-expand-btn"
                                onClick={handleModal}
                                title={isRTL ? 'نمایش در مرکز صفحه' : 'Open in center'}
                                aria-label="Open panel in center"
                            >
                                {/* fullscreen icon */}
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/>
                                </svg>
                            </button>
                        ) : (
                            <button
                                className="concierge-expand-btn is-docked"
                                onClick={handleDock}
                                title={isRTL ? 'بازگشت به کنار صفحه' : 'Dock to side'}
                                aria-label="Dock panel to side"
                            >
                                {/* close_fullscreen icon */}
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M22 3.41 16.71 8.7 20 12h-8V4l3.29 3.29L20.59 2 22 3.41zM3.41 22l5.29-5.29L12 20v-8H4l3.29 3.29L2 20.59 3.41 22z"/>
                                </svg>
                            </button>
                        )}
                        <button className="concierge-close" onClick={handleClose} title={tKey('concierge.closePanel')}>✕</button>
                    </div>
                </div>

                {/* Panel body */}
                <div className="concierge-body">
                    {tab === 'info' && (
                        <div className="concierge-info">
                            <div className="concierge-page-title">{pageInfo.title}</div>
                            <div className="concierge-page-desc">{pageInfo.desc}</div>
                        </div>
                    )}
                    {tab === 'feedback' && (
                        <div className="concierge-feedback">
                            <div className="concierge-section-title">{tKey('concierge.feedbackTitle')}</div>
                            <form onSubmit={handleFeedbackSubmit}>
                                <textarea
                                    className="concierge-textarea"
                                    placeholder={tKey('concierge.feedbackPlaceholder')}
                                    value={feedback}
                                    onChange={e => setFeedback(e.target.value)}
                                    rows={5}
                                />
                                <button type="submit" className="concierge-send-btn">{tKey('concierge.feedbackSend')}</button>
                            </form>
                        </div>
                    )}
                    {tab === 'help' && (
                        <div className="concierge-help">
                            <div className="concierge-section-title">{tKey('concierge.helpTitle')}</div>
                            {FAQ_CONTENT.sections.map((section, si) => (
                                <div key={si}>
                                    <div className="concierge-faq-section-label">{isRTL ? section.title.fa : section.title.en}</div>
                                    {section.items.map((item, ii) => (
                                        <ConciergeAccordionItem key={ii} item={item} isRTL={isRTL} />
                                    ))}
                                </div>
                            ))}
                            <Link to="/faq" className="concierge-faq-link" onClick={handleClose}>
                                {isRTL ? 'مشاهده همه سوالات ←' : 'View full FAQ →'}
                            </Link>
                        </div>
                    )}
                </div>
            </div>

            {/* Mobile backdrop (side-panel mode only) */}
            {open && !modal && <div className="concierge-backdrop" onClick={handleClose} />}
        </>
    );
}

// ── Scrollable secondary nav bar ──────────────────────────────────────────
function SubnavBar({ links, tKey }) {
    const scrollRef = useRef(null);
    const [canLeft, setCanLeft] = useState(false);
    const [canRight, setCanRight] = useState(false);

    const updateArrows = useCallback(() => {
        const el = scrollRef.current;
        if (!el) return;
        setCanLeft(el.scrollLeft > 4);
        setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
    }, []);

    useEffect(() => {
        const el = scrollRef.current;
        if (!el) return;
        updateArrows();
        el.addEventListener('scroll', updateArrows, { passive: true });
        window.addEventListener('resize', updateArrows, { passive: true });
        return () => {
            el.removeEventListener('scroll', updateArrows);
            window.removeEventListener('resize', updateArrows);
        };
    }, [links, updateArrows]);

    const scroll = (dir) => {
        const el = scrollRef.current;
        if (el) el.scrollBy({ left: dir * 120, behavior: 'smooth' });
    };

    return (
        <div className="site-subnav">
            {canLeft && (
                <button className="subnav-arrow subnav-arrow--left" onClick={() => scroll(-1)} aria-label="Scroll left">‹</button>
            )}
            <div className="site-subnav-inner" ref={scrollRef}>
                {links.map(link => (
                    <NavLink
                        key={link.to}
                        to={link.to}
                        className={({ isActive }) => `subnav-tab ${isActive ? 'is-active' : ''}`}
                    >
                        {tKey(link.labelKey)}
                    </NavLink>
                ))}
            </div>
            {canRight && (
                <button className="subnav-arrow subnav-arrow--right" onClick={() => scroll(1)} aria-label="Scroll right">›</button>
            )}
        </div>
    );
}

// ── Priority nav hook ──────────────────────────────────────────────────────
// .site-nav-center has flex:1 so container.offsetWidth == available space (stable).
// Priority nav runs at all widths ≥768px (hamburger threshold); items collapse
// progressively into "More ▾" with no hard desktop breakpoint — same as developers.google.com.
const MORE_BTN_W = 82; // approx width of "More ▾" / "بیشتر ▾" button
const MOBILE_BP = 768; // hamburger breakpoint

function usePriorityNav(containerRef, totalItems) {
    const [visibleCount, setVisibleCount] = useState(totalItems);
    const storedWidths = useRef([]);
    const wasMobile = useRef(typeof window !== 'undefined' && window.innerWidth < MOBILE_BP);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        function getItemWidths() {
            return Array.from(container.querySelectorAll('[data-nav-idx]'))
                .map(el => el.getBoundingClientRect().width);
        }

        function recalculate() {
            // Below hamburger breakpoint: all items show via CSS rules (zone buttons only)
            if (window.innerWidth < MOBILE_BP) {
                setVisibleCount(totalItems);
                return;
            }
            const widths = storedWidths.current;
            if (!widths.length) return;
            // container.offsetWidth == available space because .site-nav-center has flex:1
            const available = container.offsetWidth;
            let used = 0;
            let count = widths.length;
            for (let i = 0; i < widths.length; i++) {
                const needsMore = i < widths.length - 1;
                if (used + widths[i] + (needsMore ? MORE_BTN_W : 0) <= available) {
                    used += widths[i];
                } else {
                    count = i;
                    break;
                }
            }
            setVisibleCount(count);
        }

        // First measurement: all items are visible (visibleCount starts at totalItems)
        const raf = requestAnimationFrame(() => {
            if (window.innerWidth >= MOBILE_BP) {
                storedWidths.current = getItemWidths();
            }
            recalculate();
        });

        const ro = new ResizeObserver(() => {
            const nowMobile = window.innerWidth < MOBILE_BP;
            const crossedToDesktop = wasMobile.current && !nowMobile;
            wasMobile.current = nowMobile;

            // Re-measure when crossing from mobile to desktop (items newly visible in CSS)
            if (crossedToDesktop || (nowMobile === false && storedWidths.current.some(w => w === 0))) {
                const measured = getItemWidths();
                if (measured.every(w => w > 0)) storedWidths.current = measured;
            }
            recalculate();
        });
        ro.observe(container);

        return () => {
            cancelAnimationFrame(raf);
            ro.disconnect();
        };
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return visibleCount;
}

// ── Nav dropdown hook ──────────────────────────────────────────────────────
function useDropdown() {
    const [open, setOpen] = useState(false);
    const closeTimer = useRef(null);

    const onMouseEnter = useCallback(() => {
        if (closeTimer.current) clearTimeout(closeTimer.current);
        setOpen(true);
    }, []);

    const onMouseLeave = useCallback(() => {
        closeTimer.current = setTimeout(() => setOpen(false), 120);
    }, []);

    const close = useCallback(() => setOpen(false), []);
    const onToggle = useCallback(() => {
        if (closeTimer.current) clearTimeout(closeTimer.current);
        setOpen(v => !v);
    }, []);

    useEffect(() => () => { if (closeTimer.current) clearTimeout(closeTimer.current); }, []);

    return { open, onMouseEnter, onMouseLeave, close, onToggle };
}

// ── Main NavContent ────────────────────────────────────────────────────────
function NavContent() {
    const { lang, setLang, isRTL, tKey, monoFont, headFont } = useLang();
    const [mobileNavOpen, setMobileNavOpen] = React.useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [dotMenuOpen, setDotMenuOpen] = useState(false);

    const { session, isAdmin, profileName, logout } = useAuth();

    const navRef = useRef(null);
    const searchInputRef = useRef(null);
    const dotMenuRef = useRef(null);
    const centerRef = useRef(null);
    const moreRef = useRef(null);
    const [moreOpen, setMoreOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const transDropdown = useDropdown();
    const destDropdown = useDropdown();

    const match = location.pathname.match(/\/blueprint\/gov\/([^/]+)(\/.*)?/);
    const activeBlueprintId = match ? match[1] : null;

    const destinationItems = buildDestinationItems(activeBlueprintId);

    // Close mobile nav on outside click
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

    // Auto-focus search input when opened
    useEffect(() => {
        if (searchOpen && searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, [searchOpen]);

    // Close dot menu on outside click
    useEffect(() => {
        if (!dotMenuOpen) return;
        function handleOutside(e) {
            if (dotMenuRef.current && !dotMenuRef.current.contains(e.target)) {
                setDotMenuOpen(false);
            }
        }
        document.addEventListener('mousedown', handleOutside);
        return () => document.removeEventListener('mousedown', handleOutside);
    }, [dotMenuOpen]);

    // Close "More" dropdown on outside click
    useEffect(() => {
        if (!moreOpen) return;
        function handleOutside(e) {
            if (moreRef.current && !moreRef.current.contains(e.target)) {
                setMoreOpen(false);
            }
        }
        document.addEventListener('mousedown', handleOutside);
        return () => document.removeEventListener('mousedown', handleOutside);
    }, [moreOpen]);

    // Priority nav: how many center items fit in the container
    const visibleCount = usePriorityNav(centerRef, 5);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
            setSearchOpen(false);
            setMobileNavOpen(false);
            setSearchQuery('');
        }
    };

    const handleSearchKeyDown = (e) => {
        if (e.key === 'Escape') {
            setSearchOpen(false);
            setSearchQuery('');
        }
    };

    const handleMobileLinkClick = () => setMobileNavOpen(false);

    const handleMobileLogout = () => {
        setMobileNavOpen(false);
        logout();
    };

    const isTransitionZone  = /^\/(arena|transitional|plans|compare\/transition|pre|global)/.test(location.pathname);
    const isDestinationZone = !isTransitionZone && /^\/(destination|blueprints|blueprint\/gov|compare)/.test(location.pathname);

    // Secondary nav links (context-sensitive)
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

    // Is current path in transition or destination zone for active state on top nav
    const isInTransition = isTransitionZone;
    const isInDestination = isDestinationZone;

    return (
        <div dir={isRTL ? "rtl" : "ltr"} style={{ fontFamily: headFont }}>

            {/* ── Sticky nav wrapper (primary + secondary bars) ────── */}
            <div className="site-nav-wrapper">

            {/* ── Primary nav bar ──────────────────────────────────── */}
            <nav className="site-nav" ref={navRef} onMouseDown={e => e.preventDefault()}>

                {/* Left: Logo + primary nav links */}
                <div className="site-nav-left">
                    <NavLink to="/" className="site-nav-logo">
                        <img src="/logo.svg" alt="logo" />
                        <BrandMark size="nav" />
                    </NavLink>

                {/* Primary links with mega dropdowns (desktop only) */}
                <div className="site-nav-center" ref={centerRef}>

                    {/* TRANSITION dropdown — item 0 */}
                    <div
                        data-nav-idx="0"
                        className={`primary-nav-item ${isInTransition ? 'is-active' : ''}`}
                        style={visibleCount <= 0 ? { display: 'none' } : undefined}
                        onMouseEnter={transDropdown.onMouseEnter}
                        onMouseLeave={transDropdown.onMouseLeave}
                    >
                        <button className={`site-nav-link primary-nav-btn ${isInTransition ? 'is-active' : ''}`} onClick={transDropdown.onMouseEnter}>
                            {tKey('nav.transitionMenu')}
                            <span className="primary-nav-caret">▾</span>
                        </button>
                        {transDropdown.open && (
                            <MegaDropdown
                                items={TRANSITION_ITEMS}
                                title={tKey('nav.transitionMenu')}
                                onClose={transDropdown.close}
                                tKey={tKey}
                            />
                        )}
                    </div>

                    {/* DESTINATION dropdown — item 1 */}
                    <div
                        data-nav-idx="1"
                        className={`primary-nav-item ${isInDestination ? 'is-active' : ''}`}
                        style={visibleCount <= 1 ? { display: 'none' } : undefined}
                        onMouseEnter={destDropdown.onMouseEnter}
                        onMouseLeave={destDropdown.onMouseLeave}
                    >
                        <button className={`site-nav-link primary-nav-btn ${isInDestination ? 'is-active' : ''}`} onClick={destDropdown.onMouseEnter}>
                            {tKey('nav.destinationMenu')}
                            <span className="primary-nav-caret">▾</span>
                        </button>
                        {destDropdown.open && (
                            <MegaDropdown
                                items={destinationItems}
                                title={tKey('nav.destinationMenu')}
                                onClose={destDropdown.close}
                                tKey={tKey}
                            />
                        )}
                    </div>

                    {/* VOTE plain link — item 2 */}
                    <NavLink
                        data-nav-idx="2"
                        to="/vote"
                        style={visibleCount <= 2 ? { display: 'none' } : undefined}
                        className={({ isActive }) => `site-nav-link ${isActive ? 'is-active' : ''}`}
                    >
                        {tKey('nav.vote')}
                    </NavLink>

                    {/* FAQ plain link — item 3 */}
                    <NavLink
                        data-nav-idx="3"
                        to="/faq"
                        style={visibleCount <= 3 ? { display: 'none' } : undefined}
                        className={({ isActive }) => `site-nav-link ${isActive ? 'is-active' : ''}`}
                    >
                        {tKey('nav.faq')}
                    </NavLink>

                    {/* ABOUT plain link — item 4 */}
                    <NavLink
                        data-nav-idx="4"
                        to="/about"
                        style={visibleCount <= 4 ? { display: 'none' } : undefined}
                        className={({ isActive }) => `site-nav-link ${isActive ? 'is-active' : ''}`}
                    >
                        {tKey('nav.about')}
                    </NavLink>

                    {/* MORE button — shown when not all items fit */}
                    {visibleCount < 5 && (
                        <div className="site-nav-more" ref={moreRef}>
                            <button
                                className={`site-nav-more-btn ${moreOpen ? 'is-open' : ''}`}
                                onClick={() => setMoreOpen(v => !v)}
                            >
                                {tKey('nav.more')}
                                <span className="primary-nav-caret">▾</span>
                            </button>
                            {moreOpen && (
                                <div className="site-nav-overflow-dropdown">
                                    {/* Show overflow items */}
                                    {visibleCount <= 0 && (
                                        <>
                                            <div className="overflow-section-label">{tKey('nav.transitionMenu')}</div>
                                            {TRANSITION_ITEMS.map(item => (
                                                <NavLink
                                                    key={item.to}
                                                    to={item.to}
                                                    className={({ isActive }) => `overflow-nav-link ${isActive ? 'is-active' : ''}`}
                                                    onClick={() => setMoreOpen(false)}
                                                >
                                                    <span className="overflow-nav-icon">{item.icon}</span>
                                                    {tKey(item.labelKey)}
                                                </NavLink>
                                            ))}
                                        </>
                                    )}
                                    {visibleCount <= 1 && (
                                        <>
                                            <div className="overflow-section-label">{tKey('nav.destinationMenu')}</div>
                                            {destinationItems.map(item => (
                                                <NavLink
                                                    key={item.to}
                                                    to={item.to}
                                                    className={({ isActive }) => `overflow-nav-link ${isActive ? 'is-active' : ''}`}
                                                    onClick={() => setMoreOpen(false)}
                                                >
                                                    <span className="overflow-nav-icon">{item.icon}</span>
                                                    {tKey(item.labelKey)}
                                                </NavLink>
                                            ))}
                                        </>
                                    )}
                                    {visibleCount <= 2 && (
                                        <NavLink
                                            to="/vote"
                                            className={({ isActive }) => `overflow-nav-link ${isActive ? 'is-active' : ''}`}
                                            onClick={() => setMoreOpen(false)}
                                        >
                                            {tKey('nav.vote')}
                                        </NavLink>
                                    )}
                                    {visibleCount <= 3 && (
                                        <NavLink
                                            to="/faq"
                                            className={({ isActive }) => `overflow-nav-link ${isActive ? 'is-active' : ''}`}
                                            onClick={() => setMoreOpen(false)}
                                        >
                                            {tKey('nav.faq')}
                                        </NavLink>
                                    )}
                                    {visibleCount <= 4 && (
                                        <NavLink
                                            to="/about"
                                            className={({ isActive }) => `overflow-nav-link ${isActive ? 'is-active' : ''}`}
                                            onClick={() => setMoreOpen(false)}
                                        >
                                            {tKey('nav.about')}
                                        </NavLink>
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                </div>
                </div>{/* end site-nav-left */}

                {/* Right: search, auth, settings */}
                <div className="site-nav-right">

                    {/* Search */}
                    <div className={`site-nav-search ${searchOpen ? 'is-open' : ''}`}>
                        {searchOpen ? (
                            <form onSubmit={handleSearchSubmit} className="site-nav-search-form">
                                <input
                                    ref={searchInputRef}
                                    type="text"
                                    className="site-nav-search-input"
                                    placeholder={tKey('nav.searchPlaceholder')}
                                    value={searchQuery}
                                    onChange={e => setSearchQuery(e.target.value)}
                                    onBlur={() => { setSearchOpen(false); setSearchQuery(''); }}
                                    onKeyDown={handleSearchKeyDown}
                                />
                            </form>
                        ) : (
                            <button
                                className="site-nav-search-btn"
                                onClick={() => setSearchOpen(true)}
                                aria-label={tKey('nav.search')}
                                title={tKey('nav.search')}
                            >
                                <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                                    <path d="M10.68 11.74a6 6 0 0 1-7.922-8.982 6 6 0 0 1 8.982 7.922l3.04 3.04a.749.749 0 0 1-.326 1.275.749.749 0 0 1-.734-.215ZM11.5 7a4.499 4.499 0 1 0-8.997 0A4.499 4.499 0 0 0 11.5 7Z" />
                                </svg>
                            </button>
                        )}
                    </div>

                    {/* Admin link */}
                    {isAdmin && (
                        <Link to="/admin" className="site-nav-admin-btn">
                            {tKey('nav.admin')}
                        </Link>
                    )}

                    {/* Auth section */}
                    {session ? (
                        <>
                            {/* Username pill */}
                            <Link to="/profile" className="site-nav-profile-btn">
                                {profileName || tKey('nav.profile')}
                            </Link>

                            {/* 3-dot vertical menu */}
                            <div className="site-nav-dot-menu" ref={dotMenuRef}>
                                <button
                                    className="site-nav-dot-btn"
                                    onClick={() => setDotMenuOpen(v => !v)}
                                    aria-label={tKey('nav.moreOptions')}
                                    title={tKey('nav.moreOptions')}
                                >
                                    ⋮
                                </button>
                                {dotMenuOpen && (
                                    <div className="site-nav-dot-dropdown">
                                        <Link to="/profile" className="dot-menu-item" onClick={() => setDotMenuOpen(false)}>
                                            {tKey('nav.profile')}
                                        </Link>
                                        <div className="dot-menu-sep" />
                                        <div className="dot-menu-item dot-menu-lang">
                                            <button
                                                className={`dot-lang-btn ${lang === 'fa' ? 'is-active' : ''}`}
                                                style={{ fontFamily: "'Vazirmatn', sans-serif" }}
                                                onClick={() => { setLang('fa'); setDotMenuOpen(false); }}
                                            >فارسی</button>
                                            <button
                                                className={`dot-lang-btn ${lang === 'en' ? 'is-active' : ''}`}
                                                style={{ fontFamily: "'Inter', sans-serif" }}
                                                onClick={() => { setLang('en'); setDotMenuOpen(false); }}
                                            >EN</button>
                                        </div>
                                        <div className="dot-menu-item dot-menu-theme">
                                            <ThemeSwitch />
                                        </div>
                                        <div className="dot-menu-sep" />
                                        <button
                                            className="dot-menu-item dot-menu-logout"
                                            onClick={() => { setDotMenuOpen(false); logout(); }}
                                        >
                                            {tKey('nav.logout')}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="site-nav-login-btn">
                                {tKey('nav.login')}
                            </Link>
                            <Link to="/register" className="site-nav-register-btn">
                                {tKey('nav.register')}
                            </Link>

                            {/* Desktop theme + lang for logged-out */}
                            <div className="site-nav-theme-desktop">
                                <ThemeSwitch />
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
                        </>
                    )}

                    {/* Username next to hamburger on small screens */}
                    {session && (
                        <Link to="/profile" className="site-nav-username-mobile" style={{ fontFamily: monoFont }}>
                            {profileName || tKey('nav.profile')}
                        </Link>
                    )}

                    {/* Hamburger */}
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

                {/* Mobile dropdown (auth + simple links — zones handled by zone bar below) */}
                {mobileNavOpen && (
                    <div className="mobile-nav-dropdown">

                        {/* Search — mobile only */}
                        <form onSubmit={handleSearchSubmit} className="mobile-nav-search-form">
                            <input
                                type="text"
                                className="mobile-nav-search-input"
                                placeholder={tKey('nav.searchPlaceholder')}
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                            />
                            <button type="submit" className="mobile-nav-search-btn" aria-label={tKey('nav.search')}>
                                <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                                    <path d="M10.68 11.74a6 6 0 0 1-7.922-8.982 6 6 0 0 1 8.982 7.922l3.04 3.04a.749.749 0 0 1-.326 1.275.749.749 0 0 1-.734-.215ZM11.5 7a4.499 4.499 0 1 0-8.997 0A4.499 4.499 0 0 0 11.5 7Z" />
                                </svg>
                            </button>
                        </form>


                        {/* Vote / FAQ / About */}
                        <NavLink to="/vote" className={({ isActive }) => `site-nav-link ${isActive ? 'is-active' : ''}`} onClick={handleMobileLinkClick}>
                            {tKey('nav.vote')}
                        </NavLink>
                        <NavLink to="/faq" className={({ isActive }) => `site-nav-link ${isActive ? 'is-active' : ''}`} onClick={handleMobileLinkClick}>
                            {tKey('nav.faq')}
                        </NavLink>
                        <NavLink to="/about" className={({ isActive }) => `site-nav-link ${isActive ? 'is-active' : ''}`} onClick={handleMobileLinkClick}>
                            {tKey('nav.about')}
                        </NavLink>

                        {isAdmin && (
                            <>
                                <div className="mobile-nav-sep" />
                                <NavLink to="/admin" className={({ isActive }) => `site-nav-link ${isActive ? 'is-active' : ''}`} onClick={handleMobileLinkClick}>
                                    {tKey('nav.admin')}
                                </NavLink>
                            </>
                        )}

                        <div className="mobile-nav-theme">
                            <ThemeSwitch />
                        </div>
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

            {/* ── Mobile zone bar (Transition ▾ / Destination ▾ on ≤767px) */}
            <div className="mobile-zone-bar">
                <div
                    className={`mobile-zone-item${isInTransition ? ' is-active' : ''}`}
                    onMouseEnter={transDropdown.onMouseEnter}
                    onMouseLeave={transDropdown.onMouseLeave}
                >
                    <button
                        className={`mobile-zone-btn${isInTransition ? ' is-active' : ''}`}
                        onClick={transDropdown.onToggle}
                    >
                        {tKey('nav.transitionMenu')}
                        <span className="primary-nav-caret">▾</span>
                    </button>
                    {transDropdown.open && (
                        <MegaDropdown
                            items={TRANSITION_ITEMS}
                            title={tKey('nav.transitionMenu')}
                            onClose={transDropdown.close}
                            tKey={tKey}
                        />
                    )}
                </div>
                <div
                    className={`mobile-zone-item${isInDestination ? ' is-active' : ''}`}
                    onMouseEnter={destDropdown.onMouseEnter}
                    onMouseLeave={destDropdown.onMouseLeave}
                >
                    <button
                        className={`mobile-zone-btn${isInDestination ? ' is-active' : ''}`}
                        onClick={destDropdown.onToggle}
                    >
                        {tKey('nav.destinationMenu')}
                        <span className="primary-nav-caret">▾</span>
                    </button>
                    {destDropdown.open && (
                        <MegaDropdown
                            items={destinationItems}
                            title={tKey('nav.destinationMenu')}
                            onClose={destDropdown.close}
                            tKey={tKey}
                        />
                    )}
                </div>
            </div>

            {/* ── Secondary nav bar (context-sensitive tabs) ────────── */}
            {zoneLinks.length > 0 && <SubnavBar links={zoneLinks} tKey={tKey} />}

            </div>{/* end site-nav-wrapper */}

            {/* ── Page content ─────────────────────────────────────── */}
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
                    <span className="site-footer-sep">·</span>
                    <Link to="/careers" className="site-footer-link">
                        {tKey('common.careers')}
                    </Link>
                </footer>
            </div>

            {/* ── Concierge panel (right side) ──────────────────────── */}
            <ConciergePanel isRTL={isRTL} tKey={tKey} location={location} />

            <DevLinks />
        </div>
    );
}

export default function Layout() {
    return <NavContent />;
}
