import { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams, Link, NavLink } from 'react-router-dom';
import { useLang } from '../../contexts/LangContext';
import { useAuth } from '../../hooks/useAuth';
import { useProfile, useInviteCodes, useUpdateProfile, useCastVote, useGenerateCode } from '../../hooks/useProfile';
import { BLUEPRINTS } from '../../data';
import { calcAge } from '../../lib/utils';
import BirthDatePicker from '../../components/BirthDatePicker/BirthDatePicker';
import ContributionGrid from '../../components/ContributionGrid/ContributionGrid';
import StatsRow from '../../components/Charts/StatsRow';
import BadgesShelf from '../../components/Achievements/BadgesShelf';
import { ThemeSwitch } from '../../components/ThemeSwitch/ThemeSwitch';
import CONTENT from '../../locales/pages/profile.json';
import './ProfilePage.css';
import './pd-dashboard.css';

// ── Inline SVG icon set ────────────────────────────────────────────────────
const I = {
    Dashboard:    () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></svg>,
    Activity:     () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
    Award:        () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></svg>,
    Users:        () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
    Vote:         () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 12 2 2 4-4"/><path d="M5 7c0-1.1.9-2 2-2h10a2 2 0 0 1 2 2v12H5V7z"/><path d="M22 19H2"/></svg>,
    Zap:          () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
    List:         () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>,
    Columns:      () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="8" height="18" rx="1"/><rect x="13" y="3" width="8" height="18" rx="1"/></svg>,
    Globe:        () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>,
    Info:         () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>,
    Settings:     () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 1 1.4 13.5M4.93 4.93a10 10 0 0 0-1.4 13.5M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>,
    Shield:       () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
    HelpCircle:   () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
    Destination:  () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>,
    ChevronLeft:  () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>,
    Menu:         () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>,
    LogOut:       () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
    ChevronDown:  () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>,
    X:            () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
    PanelLeft:    () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v18"/></svg>,
};

// ── Nav structure ─────────────────────────────────────────────────────────
const NAV_GROUPS = [
    {
        label: CONTENT.navGroupLabels[0],
        items: [
            { id: 'overview',     Icon: I.Dashboard,   en: 'Overview',       fa: 'نمای کلی' },
            { id: 'achievements', Icon: I.Award,        en: 'Achievements',   fa: 'دستاوردها' },
            { id: 'invite',       Icon: I.Users,        en: 'Invite Codes',   fa: 'کدهای دعوت', badge: true },
            { id: 'vote',         Icon: I.Vote,         en: 'Blueprint Vote', fa: 'رأی طرح' },
        ],
    },
    {
        label: CONTENT.navGroupLabels[1],
        items: [
            { id: 'nav-arena',       Icon: I.Zap,         en: 'The Arena',      fa: 'آرنا',        href: '/arena' },
            { id: 'nav-plans',       Icon: I.List,        en: 'Plans',          fa: 'طرح‌ها',       href: '/plans' },
            { id: 'nav-compare',     Icon: I.Columns,     en: 'Compare',        fa: 'مقایسه',       href: '/compare' },
            { id: 'nav-vote',        Icon: I.Vote,        en: 'Vote',           fa: 'رأی‌گیری',    href: '/vote' },
            { id: 'nav-destination', Icon: I.Destination, en: 'Destination',    fa: 'مقصد',         href: '/destination' },
            { id: 'nav-global',      Icon: I.Globe,       en: 'Global Map',     fa: 'نقشه جهانی',   href: '/global' },
            { id: 'nav-about',       Icon: I.Info,        en: 'About',          fa: 'درباره',       href: '/about' },
            { id: 'nav-faq',         Icon: I.HelpCircle,  en: 'Help & FAQ',     fa: 'راهنما',        href: '/faq' },
        ],
    },
    {
        label: CONTENT.navGroupLabels[2],
        items: [
            { id: 'settings', Icon: I.Settings,   en: 'Account Settings', fa: 'تنظیمات حساب' },
            { id: 'verify',   Icon: I.Shield,     en: 'Verify Identity',  fa: 'تأیید هویت',   accent: true },
            { id: 'help',     Icon: I.HelpCircle, en: 'Help & FAQ',       fa: 'راهنما و سؤالات', href: '/faq' },
        ],
    },
];

const TITLES   = ['', 'Mr', 'Ms', 'Dr', 'Prof', 'Eng', 'Haj', 'Hajj'];
const PRONOUNS = ['', 'He/Him', 'She/Her', 'They/Them', 'Other'];

const BLUEPRINT_COLORS = {
    decentralized:       '#8B5CF6',
    constMonarchy:       '#ffd54f',
    secularLiberal:      '#81c784',
    federalDemocratic:   '#ff8a65',
    democraticSocialist: '#ce93d8',
    absoluteMonarchy:    '#ef9a9a',
};

function formatDate(dateStr) {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
}

function timeRemaining(expiresAt) {
    if (!expiresAt) return '';
    const diff = new Date(expiresAt) - Date.now();
    if (diff <= 0) return 'EXPIRED';
    return `${Math.floor(diff / 3600000)}h ${Math.floor((diff % 3600000) / 60000)}m`;
}

function AdditionalInfoForm({ title, setTitle, pronouns, setPronouns, city, setCity, bio, setBio, handleSave, isPending, saved, saveError, isRTL, monoFont }) {
    return (
        <form onSubmit={handleSave} className="prof-form">
            <div className="prof-field">
                <label className="prof-label" style={{ fontFamily: monoFont }}>{isRTL ? CONTENT.formTitleLabel.fa : CONTENT.formTitleLabel.en}</label>
                <select className="prof-select" value={title} onChange={e => setTitle(e.target.value)}>
                    {TITLES.map(v => <option key={v} value={v}>{v || (isRTL ? CONTENT.formSelectPlaceholder.fa : CONTENT.formSelectPlaceholder.en)}</option>)}
                </select>
            </div>
            <div className="prof-field">
                <label className="prof-label" style={{ fontFamily: monoFont }}>{isRTL ? CONTENT.formPronounsLabel.fa : CONTENT.formPronounsLabel.en}</label>
                <select className="prof-select" value={pronouns} onChange={e => setPronouns(e.target.value)}>
                    {PRONOUNS.map(v => <option key={v} value={v}>{v || (isRTL ? CONTENT.formSelectPlaceholder.fa : CONTENT.formSelectPlaceholder.en)}</option>)}
                </select>
            </div>
            <div className="prof-field">
                <label className="prof-label" style={{ fontFamily: monoFont }}>{isRTL ? CONTENT.formCityLabel.fa : CONTENT.formCityLabel.en}</label>
                <input className="prof-input" type="text" value={city} onChange={e => setCity(e.target.value)} maxLength={80} placeholder={isRTL ? CONTENT.formCityPlaceholder.fa : CONTENT.formCityPlaceholder.en} />
            </div>
            <div className="prof-field">
                <label className="prof-label" style={{ fontFamily: monoFont }}>{isRTL ? CONTENT.formBioLabel.fa : CONTENT.formBioLabel.en}</label>
                <textarea className="prof-textarea" value={bio} onChange={e => setBio(e.target.value)} maxLength={280} rows={4} placeholder={isRTL ? CONTENT.formBioPlaceholder.fa : CONTENT.formBioPlaceholder.en} />
                <div className="prof-char-count" style={{ fontFamily: monoFont }}>{bio.length}/280</div>
            </div>
            {saveError && <div className="prof-error" style={{ fontFamily: monoFont }}>{saveError}</div>}
            <button type="submit" className="prof-save-btn" disabled={isPending} style={{ fontFamily: monoFont }}>
                {isPending ? '...' : saved ? (isRTL ? CONTENT.formSaved.fa : CONTENT.formSaved.en) : (isRTL ? CONTENT.formSaveChanges.fa : CONTENT.formSaveChanges.en)}
            </button>
        </form>
    );
}

export default function ProfilePage() {
    const { t, isRTL, lang, setLang, monoFont, headFont } = useLang();
    const navigate = useNavigate();
    const memberCardRef = useRef(null);

    // ── Server state ─────────────────────────────────────────────────────────
    const { session, isAdmin, authLoading, logout } = useAuth();
    const [searchParams] = useSearchParams();
    const previewId = isAdmin ? searchParams.get('preview') : null;
    const isPreview = !!previewId;
    const userId = previewId || session?.user?.id;

    const { data: profile, isLoading: profileLoading } = useProfile(userId);
    const { data: codes = [] } = useInviteCodes(userId);

    const nameUpdateMutation     = useUpdateProfile(userId);
    const birthUpdateMutation    = useUpdateProfile(userId);
    const additionalInfoMutation = useUpdateProfile(userId);
    const castVoteMutation       = useCastVote(userId);
    const generateCodeMutation   = useGenerateCode(userId);

    // ── Dashboard state ───────────────────────────────────────────────────────
    const [activeSection,    setActiveSection]    = useState('overview');
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
    const [desktopSidebarOpen, setDesktopSidebarOpen] = useState(true);
    const [userMenuOpen,      setUserMenuOpen]     = useState(false);
    const userMenuRef = useRef(null);

    // ── Form state ────────────────────────────────────────────────────────────
    const [nameEditing, setNameEditing] = useState(false);
    const [nameValue,   setNameValue]   = useState('');
    const [nameError,   setNameError]   = useState('');
    const [birthPickerOpen, setBirthPickerOpen] = useState(false);
    const [birthDateDraft,  setBirthDateDraft]  = useState(null);
    const [birthError,      setBirthError]      = useState('');
    const [birthSaved,      setBirthSaved]      = useState(false);
    const [title,     setTitle]     = useState('');
    const [pronouns,  setPronouns]  = useState('');
    const [city,      setCity]      = useState('');
    const [bio,       setBio]       = useState('');
    const [saved,     setSaved]     = useState(false);
    const [saveError, setSaveError] = useState('');
    const [copiedCode,    setCopiedCode]    = useState('');
    const [generateError, setGenerateError] = useState('');
    const [preferredBlueprint, setPreferredBlueprint] = useState('');
    const [voteSaved,  setVoteSaved]  = useState(false);
    const [voteError,  setVoteError]  = useState('');

    useEffect(() => {
        if (!profile) return;
        setTitle(profile.title || '');
        setPronouns(profile.pronouns || '');
        setCity(profile.city || '');
        setBio(profile.bio || '');
        setPreferredBlueprint(profile.preferred_blueprint || '');
    }, [profile]);

    // close user menu on outside click
    useEffect(() => {
        function handler(e) {
            if (userMenuRef.current && !userMenuRef.current.contains(e.target)) setUserMenuOpen(false);
        }
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    // ── Handlers ─────────────────────────────────────────────────────────────
    function handleNameSave() {
        const trimmed = nameValue.trim();
        if (!trimmed) { setNameError(isRTL ? CONTENT.nameEmptyError.fa : CONTENT.nameEmptyError.en); return; }
        setNameError('');
        nameUpdateMutation.mutate({ full_name: trimmed, name_locked: true }, {
            onSuccess: () => setNameEditing(false),
            onError:   () => setNameError(isRTL ? CONTENT.saveFailedError.fa : CONTENT.saveFailedError.en),
        });
    }

    function handleBirthSave() {
        if (!birthDateDraft) { setBirthError(isRTL ? CONTENT.selectDateError.fa : CONTENT.selectDateError.en); return; }
        const age = calcAge(birthDateDraft);
        if (age === null || age > 99) { setBirthError(isRTL ? CONTENT.invalidDateError.fa : CONTENT.invalidDateError.en); return; }
        setBirthError('');
        birthUpdateMutation.mutate({ birth_date: birthDateDraft }, {
            onSuccess: () => {
                if (age >= 18) sessionStorage.setItem('irdao_age_ok', 'true');
                setBirthPickerOpen(false); setBirthSaved(true);
                setTimeout(() => setBirthSaved(false), 3000);
            },
            onError: () => setBirthError(isRTL ? CONTENT.saveFailedError.fa : CONTENT.saveFailedError.en),
        });
    }

    function handleSave(e) {
        e.preventDefault(); setSaveError(''); setSaved(false);
        additionalInfoMutation.mutate(
            { title: title || null, pronouns: pronouns || null, city: city.trim() || null, bio: bio.trim() || null },
            {
                onSuccess: () => { setSaved(true); setTimeout(() => setSaved(false), 2500); },
                onError:   () => setSaveError(isRTL ? CONTENT.saveFailedError.fa : CONTENT.saveFailedError.en),
            }
        );
    }

    function handleVote(blueprintId) {
        if (blueprintId === preferredBlueprint || castVoteMutation.isPending) return;
        setVoteError(''); setVoteSaved(false);
        castVoteMutation.mutate(blueprintId, {
            onSuccess: () => { setPreferredBlueprint(blueprintId); setVoteSaved(true); setTimeout(() => setVoteSaved(false), 2500); },
            onError: err => setVoteError(err?.error === 'age_unverified'
                ? (isRTL ? CONTENT.voteErrorAge.fa : CONTENT.voteErrorAge.en)
                : (isRTL ? CONTENT.voteErrorGeneric.fa : CONTENT.voteErrorGeneric.en)),
        });
    }

    function copyCode(code) {
        navigator.clipboard.writeText(code);
        setCopiedCode(code); setTimeout(() => setCopiedCode(''), 1500);
    }

    function handleGenerate() {
        setGenerateError('');
        generateCodeMutation.mutate(undefined, { onError: () => setGenerateError(isRTL ? CONTENT.generateError.fa : CONTENT.generateError.en) });
    }

    function goSection(id) { setActiveSection(id); setMobileSidebarOpen(false); }

    // ── Loading / auth ────────────────────────────────────────────────────────
    const loading = authLoading || (!!userId && profileLoading);

    if (loading) return (
        <div className="pd-fullscreen" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span className="prof-spinner" />
        </div>
    );

    if (!session) return (
        <div className="pd-fullscreen" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
            <div style={{ color: '#71717a', fontSize: 13 }}>{isRTL ? CONTENT.notLoggedIn.fa : CONTENT.notLoggedIn.en}</div>
            <button className="pd-btn-primary" onClick={() => navigate('/register')} style={{ fontFamily: monoFont }}>
                {isRTL ? CONTENT.register.fa : CONTENT.register.en}
            </button>
            <button className="pd-btn-ghost" onClick={() => navigate(-1)} style={{ fontFamily: monoFont }}>
                {isRTL ? CONTENT.back.fa : CONTENT.back.en}
            </button>
        </div>
    );

    // ── Derived ───────────────────────────────────────────────────────────────
    const joinedDate       = profile?.created_at ? new Date(profile.created_at).toLocaleDateString('en-GB', { year: 'numeric', month: 'long' }) : '';
    const unusedCodes      = codes.filter(c => !c.used_by);
    const usedCodes        = codes.filter(c => c.used_by);
    const age              = calcAge(profile?.birth_date);
    const voteEligible     = age !== null && age >= 18 && age <= 99;
    const currentBp        = preferredBlueprint ? BLUEPRINTS[preferredBlueprint] : null;
    const currentBpColor   = BLUEPRINT_COLORS[preferredBlueprint] || '#8B5CF6';
    const profileComplete  = !!(profile?.title && profile?.pronouns && profile?.city && profile?.bio);
    const initials         = profile?.full_name ? profile.full_name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase() : '??';
    const additionalInfoProps = { title, setTitle, pronouns, setPronouns, city, setCity, bio, setBio, handleSave, isPending: additionalInfoMutation.isPending, saved, saveError, isRTL, monoFont };

    // find active nav label for breadcrumb
    const activeItem = NAV_GROUPS.flatMap(g => g.items).find(i => i.id === activeSection);

    // ── Sidebar content (shared between desktop + mobile drawer) ─────────────
    function SidebarContent({ onClose }) {
        return (
            <>
                {/* Logo */}
                <div className="pd-sidebar-logo">
                    <img src="/logo.svg" alt="IranDAO" className="pd-sidebar-logo-img" />
                    <span className="pd-sidebar-logo-text" style={{ fontFamily: "'Inter', sans-serif" }}>IranDAO</span>
                    {onClose && (
                        <button className="pd-sidebar-close" onClick={onClose}><I.X /></button>
                    )}
                </div>

                {/* Nav groups */}
                <nav className="pd-sidebar-nav">
                    {NAV_GROUPS.map(group => (
                        <div key={group.label.en} className="pd-nav-group">
                            <div className="pd-nav-group-label">{isRTL ? group.label.fa : group.label.en}</div>
                            {group.items.map(item => {
                                if (item.href) {
                                    return (
                                        <NavLink
                                            key={item.id}
                                            to={item.href}
                                            className="pd-nav-item pd-nav-item--link"
                                        >
                                            <item.Icon />
                                            <span>{isRTL ? item.fa : item.en}</span>
                                        </NavLink>
                                    );
                                }
                                return (
                                    <button
                                        key={item.id}
                                        className={`pd-nav-item${activeSection === item.id ? ' is-active' : ''}${item.accent ? ' is-accent' : ''}${item.placeholder ? ' is-placeholder' : ''}`}
                                        onClick={() => !item.placeholder && goSection(item.id)}
                                        disabled={item.placeholder}
                                    >
                                        <item.Icon />
                                        <span>{isRTL ? item.fa : item.en}</span>
                                        {item.badge && unusedCodes.length > 0 && (
                                            <span className="pd-nav-badge">{unusedCodes.length}</span>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    ))}
                </nav>

                {/* Theme + Language */}
                <div className="pd-sidebar-prefs">
                    <ThemeSwitch />
                    <div className="pd-sidebar-lang">
                        <button className={`pd-lang-btn${lang === 'fa' ? ' is-active' : ''}`} onClick={() => setLang('fa')} style={{ fontFamily: "'Vazirmatn', sans-serif" }}>FA</button>
                        <button className={`pd-lang-btn${lang === 'en' ? ' is-active' : ''}`} onClick={() => setLang('en')}>EN</button>
                    </div>
                </div>

                {/* User card */}
                <div className="pd-sidebar-user" ref={userMenuRef}>
                    {userMenuOpen && (
                        <div className="pd-user-menu">
                            {isAdmin && (
                                <Link to="/admin" className="pd-user-menu-item" onClick={() => setUserMenuOpen(false)}>
                                    {isRTL ? CONTENT.adminPanel.fa : CONTENT.adminPanel.en}
                                </Link>
                            )}
                            <button className="pd-user-menu-item pd-user-menu-item--danger" onClick={() => { setUserMenuOpen(false); logout(); }}>
                                <I.LogOut /> {isRTL ? CONTENT.logOut.fa : CONTENT.logOut.en}
                            </button>
                        </div>
                    )}
                    <button className="pd-user-card" onClick={() => setUserMenuOpen(o => !o)}>
                        <div className="pd-user-avatar">{initials}</div>
                        <div className="pd-user-details">
                            <div className="pd-user-name">{profile?.full_name || session?.user?.email?.split('@')[0]}</div>
                            <div className="pd-user-email">{session?.user?.email}</div>
                        </div>
                        <I.ChevronDown />
                    </button>
                </div>
            </>
        );
    }

    return (
        <div className="pd-fullscreen" dir={isRTL ? 'rtl' : 'ltr'} style={{ fontFamily: headFont }}>

            {/* Admin preview banner */}
            {isPreview && (
                <div className="pd-preview-bar" style={{ fontFamily: monoFont }}>
                    <span>ADMIN PREVIEW — {profile?.full_name || previewId}</span>
                    <button onClick={() => navigate('/admin')}>← {isRTL ? CONTENT.backToAdmin.fa : CONTENT.backToAdmin.en}</button>
                </div>
            )}

            <div className="pd-layout">

                {/* ── Desktop Sidebar ── */}
                <aside className={`pd-sidebar${desktopSidebarOpen ? '' : ' pd-sidebar--hidden'}`}>
                    <SidebarContent />
                </aside>

                {/* ── Mobile drawer + overlay ── */}
                {mobileSidebarOpen && (
                    <>
                        <div className="pd-drawer-overlay" onClick={() => setMobileSidebarOpen(false)} />
                        <aside className="pd-drawer">
                            <SidebarContent onClose={() => setMobileSidebarOpen(false)} />
                        </aside>
                    </>
                )}

                {/* ── Main ── */}
                <div className="pd-main">

                    {/* Header */}
                    <header className="pd-header">
                        <div className="pd-header-left">
                            {/* Desktop sidebar toggle */}
                            <button className="pd-sidebar-toggle" onClick={() => setDesktopSidebarOpen(o => !o)} title={desktopSidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}>
                                <I.PanelLeft />
                            </button>
                            {/* Mobile hamburger */}
                            <button className="pd-hamburger" onClick={() => setMobileSidebarOpen(true)}>
                                <I.Menu />
                            </button>
                            <div className="pd-breadcrumb">
                                <span className="pd-breadcrumb-root">{isRTL ? CONTENT.breadcrumbRoot.fa : CONTENT.breadcrumbRoot.en}</span>
                                {activeItem && (
                                    <>
                                        <span className="pd-breadcrumb-sep">/</span>
                                        <span className="pd-breadcrumb-page">{isRTL ? activeItem.fa : activeItem.en}</span>
                                    </>
                                )}
                            </div>
                        </div>
                        <div className="pd-header-right">
                            <ThemeSwitch />
                            {/* Language toggle */}
                            <div className="pd-lang-toggle">
                                <button className={`pd-lang-btn${lang === 'fa' ? ' is-active' : ''}`} onClick={() => setLang('fa')} style={{ fontFamily: "'Vazirmatn', sans-serif" }}>FA</button>
                                <button className={`pd-lang-btn${lang === 'en' ? ' is-active' : ''}`} onClick={() => setLang('en')}>EN</button>
                            </div>
                            {/* Nav back button */}
                            <button className="pd-btn-ghost pd-btn-sm" onClick={() => navigate(-1)} style={{ fontFamily: monoFont }}>
                                <I.ChevronLeft />
                                {isRTL ? CONTENT.headerBack.fa : CONTENT.headerBack.en}
                            </button>
                        </div>
                    </header>

                    {/* ── Page content ── */}
                    <div className="pd-page">

                        {/* ══════════════════ OVERVIEW ══════════════════ */}
                        {activeSection === 'overview' && (
                            <div className="pd-section">
                                {/* Page title */}
                                <div className="pd-page-header">
                                    <div className="pd-page-avatar">{initials}</div>
                                    <div>
                                        <h1 className="pd-page-title" style={{ fontFamily: headFont }}>{profile?.full_name}</h1>
                                        <div className="pd-page-meta" style={{ fontFamily: monoFont }}>
                                            <span className={`prof-type-badge prof-type-badge--${profile?.user_type}`}>
                                                {profile?.user_type === 'citizen' ? (isRTL ? CONTENT.citizen.fa : CONTENT.citizen.en) : (isRTL ? CONTENT.diaspora.fa : CONTENT.diaspora.en)}
                                            </span>
                                            {profile?.country && <><span className="pd-dot">·</span><span>{profile.country}</span></>}
                                            {joinedDate && <><span className="pd-dot">·</span><span>{isRTL ? `${CONTENT.memberSince.fa} ${joinedDate}` : `${CONTENT.memberSince.en} ${joinedDate}`}</span></>}
                                        </div>
                                    </div>
                                </div>

                                <StatsRow
                                    civicScore={profile?.civic_score}
                                    participationScore={profile?.participation_score}
                                    streakDays={profile?.streak_days}
                                    trustTier={profile?.trust_tier?.toUpperCase()}
                                />

                                <div className="pd-card pd-mt">
                                    <ContributionGrid grid={profile?.contribution_grid || {}} />
                                </div>

                                <div className="pd-mt">
                                    <BadgesShelf userId={userId} />
                                </div>

                                {!profileComplete && (
                                    <div className="pd-card pd-mt pd-card--warn">
                                        <div className="pd-card-header">
                                            <span className="pd-status-dot" />
                                            <div>
                                                <div className="pd-card-title" style={{ fontFamily: monoFont }}>{isRTL ? CONTENT.completeProfileTitle.fa : CONTENT.completeProfileTitle.en}</div>
                                                <div className="pd-card-sub">{isRTL ? CONTENT.completeProfileSub.fa : CONTENT.completeProfileSub.en}</div>
                                            </div>
                                        </div>
                                        <div className="pd-divider" />
                                        <AdditionalInfoForm {...additionalInfoProps} />
                                    </div>
                                )}
                            </div>
                        )}

                        {/* ══════════════════ ACHIEVEMENTS ══════════════════ */}
                        {activeSection === 'achievements' && (
                            <div className="pd-section">
                                <div className="pd-section-heading" style={{ fontFamily: headFont }}>{isRTL ? CONTENT.achievementsHeading.fa : CONTENT.achievementsHeading.en}</div>
                                <BadgesShelf userId={userId} />
                            </div>
                        )}

                        {/* ══════════════════ INVITE CODES ══════════════════ */}
                        {activeSection === 'invite' && (
                            <div className="pd-section">
                                <div className="pd-section-heading" style={{ fontFamily: headFont }}>{isRTL ? CONTENT.inviteCodesHeading.fa : CONTENT.inviteCodesHeading.en}</div>
                                <div className="pd-card">
                                    <p className="prof-hint" style={{ fontFamily: monoFont }}>
                                        {isRTL ? CONTENT.inviteCodesHint.fa : CONTENT.inviteCodesHint.en}
                                    </p>
                                    <div className="prof-codes-list">
                                        {unusedCodes.map(c => (
                                            <button key={c.code} className="prof-code-chip prof-code-chip--unused" onClick={() => copyCode(c.code)} title={isRTL ? CONTENT.clickToCopy.fa : CONTENT.clickToCopy.en} style={{ fontFamily: monoFont }}>
                                                {copiedCode === c.code ? (isRTL ? CONTENT.copied.fa : CONTENT.copied.en) : c.code}
                                                <span className="prof-code-expiry">{timeRemaining(c.expires_at)}</span>
                                            </button>
                                        ))}
                                        {usedCodes.map(c => (
                                            <span key={c.code} className="prof-code-chip prof-code-chip--used" style={{ fontFamily: monoFont }}>{c.code}</span>
                                        ))}
                                    </div>
                                    {profile?.invite_codes_remaining > 0 ? (
                                        <div className="prof-generate-row">
                                            <button className="prof-generate-btn" onClick={handleGenerate} disabled={generateCodeMutation.isPending} style={{ fontFamily: monoFont }}>
                                                {generateCodeMutation.isPending ? '...' : (isRTL ? CONTENT.generateCode.fa : CONTENT.generateCode.en)}
                                            </button>
                                            <span className="prof-remaining" style={{ fontFamily: monoFont }}>{profile.invite_codes_remaining} {isRTL ? CONTENT.remaining.fa : CONTENT.remaining.en}</span>
                                        </div>
                                    ) : (
                                        <div className="prof-no-codes" style={{ fontFamily: monoFont }}>{isRTL ? CONTENT.noInviteSlots.fa : CONTENT.noInviteSlots.en}</div>
                                    )}
                                    {generateError && <div className="prof-error" style={{ fontFamily: monoFont }}>{generateError}</div>}
                                </div>
                            </div>
                        )}

                        {/* ══════════════════ BLUEPRINT VOTE ══════════════════ */}
                        {activeSection === 'vote' && (
                            <div className="pd-section">
                                <div className="pd-section-heading" style={{ fontFamily: headFont }}>{isRTL ? CONTENT.blueprintVoteHeading.fa : CONTENT.blueprintVoteHeading.en}</div>
                                <div className="pd-card prof-card--vote-wrap">
                                    <div className={`prof-vote-content${!voteEligible ? ' prof-vote-content--blurred' : ''}`}>
                                        {currentBp && (
                                            <div className="prof-current-vote" style={{ '--bp-color': currentBpColor }}>
                                                <div className="prof-current-vote-label" style={{ fontFamily: monoFont }}>{isRTL ? CONTENT.yourVote.fa : CONTENT.yourVote.en}</div>
                                                <div className="prof-current-vote-name" style={{ fontFamily: headFont, color: currentBpColor }}>{t(currentBp.name)}</div>
                                                <div className="prof-current-vote-bar" />
                                            </div>
                                        )}
                                        <p className="prof-hint" style={{ fontFamily: monoFont }}>{isRTL ? CONTENT.blueprintVoteHint.fa : CONTENT.blueprintVoteHint.en}</p>
                                        <div className="prof-blueprint-options">
                                            {Object.values(BLUEPRINTS).map(bp => (
                                                <button key={bp.id} className={`prof-blueprint-btn${preferredBlueprint === bp.id ? ' is-active' : ''}`} onClick={() => handleVote(bp.id)} disabled={castVoteMutation.isPending} style={{ fontFamily: monoFont, '--btn-color': BLUEPRINT_COLORS[bp.id] || '#8B5CF6' }}>
                                                    {t(bp.name)}
                                                </button>
                                            ))}
                                        </div>
                                        {voteError  && <div className="prof-error"      style={{ fontFamily: monoFont }}>{voteError}</div>}
                                        {voteSaved  && <div className="prof-vote-saved" style={{ fontFamily: monoFont }}>{isRTL ? CONTENT.voteSaved.fa : CONTENT.voteSaved.en}</div>}
                                    </div>
                                    {!voteEligible && (
                                        <div className="prof-vote-gate">
                                            <div className="prof-vote-gate-inner">
                                                <div className="prof-vote-gate-icon">⚿</div>
                                                <p className="prof-vote-gate-msg" style={{ fontFamily: monoFont }}>{isRTL ? CONTENT.verifyBirthdayMsg.fa : CONTENT.verifyBirthdayMsg.en}</p>
                                                <button className="prof-vote-gate-btn" style={{ fontFamily: monoFont }} onClick={() => { goSection('settings'); setTimeout(() => setBirthPickerOpen(true), 200); }}>
                                                    {isRTL ? CONTENT.verifyAge.fa : CONTENT.verifyAge.en}
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* ══════════════════ ACCOUNT SETTINGS ══════════════════ */}
                        {activeSection === 'settings' && (
                            <div className="pd-section">
                                <div className="pd-section-heading" style={{ fontFamily: headFont }}>{isRTL ? CONTENT.accountSettingsHeading.fa : CONTENT.accountSettingsHeading.en}</div>

                                {/* Member Info */}
                                <div className="pd-card" ref={memberCardRef}>
                                    <div className="pd-card-section-title" style={{ fontFamily: monoFont }}>{isRTL ? CONTENT.memberInformation.fa : CONTENT.memberInformation.en}</div>
                                    <div className="prof-info-table">

                                        <div className="prof-info-row">
                                            <span className="prof-info-label" style={{ fontFamily: monoFont }}>{isRTL ? CONTENT.fullNameLabel.fa : CONTENT.fullNameLabel.en}</span>
                                            <div className="prof-info-value-col">
                                                {nameEditing ? (
                                                    <div className="prof-inline-edit">
                                                        <div className="prof-once-warn" style={{ fontFamily: monoFont }}>⚠ {isRTL ? CONTENT.nameChangeOnce.fa : CONTENT.nameChangeOnce.en}</div>
                                                        <input className="prof-input prof-input--sm" value={nameValue} onChange={e => setNameValue(e.target.value)} maxLength={80} autoFocus style={{ fontFamily: monoFont }} />
                                                        {nameError && <div className="prof-inline-error" style={{ fontFamily: monoFont }}>{nameError}</div>}
                                                        <div className="prof-inline-btns">
                                                            <button className="prof-action-btn prof-action-btn--confirm" onClick={handleNameSave} disabled={nameUpdateMutation.isPending} style={{ fontFamily: monoFont }}>{nameUpdateMutation.isPending ? '...' : (isRTL ? CONTENT.confirmBtn.fa : CONTENT.confirmBtn.en)}</button>
                                                            <button className="prof-action-btn" onClick={() => { setNameEditing(false); setNameError(''); }} style={{ fontFamily: monoFont }}>{isRTL ? CONTENT.cancelBtn.fa : CONTENT.cancelBtn.en}</button>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="prof-info-value-row">
                                                        <span className="prof-info-value" style={{ fontFamily: monoFont }}>{profile?.full_name || '—'}</span>
                                                        {!profile?.name_locked ? (
                                                            <button className="prof-chip-btn" onClick={() => { setNameValue(profile?.full_name || ''); setNameEditing(true); }} style={{ fontFamily: monoFont }}>{isRTL ? CONTENT.editBtn.fa : CONTENT.editBtn.en}</button>
                                                        ) : (
                                                            <span className="prof-lock-icon" title={isRTL ? CONTENT.lockedTitle.fa : CONTENT.lockedTitle.en}>🔒</span>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="prof-info-row">
                                            <span className="prof-info-label" style={{ fontFamily: monoFont }}>{isRTL ? CONTENT.dobLabel.fa : CONTENT.dobLabel.en}</span>
                                            <div className="prof-info-value-col">
                                                {profile?.birth_date ? (
                                                    <div className="prof-info-value-row">
                                                        <span className="prof-info-value" style={{ fontFamily: monoFont }}>{formatDate(profile.birth_date)}</span>
                                                        <span className="prof-lock-icon" title="Locked">🔒</span>
                                                        {voteEligible && <span className="prof-verified-badge" style={{ fontFamily: monoFont }}>{isRTL ? CONTENT.verified.fa : CONTENT.verified.en}</span>}
                                                    </div>
                                                ) : (
                                                    <>
                                                        <div className="prof-info-value-row">
                                                            <span className="prof-info-value prof-info-value--empty" style={{ fontFamily: monoFont }}>{isRTL ? CONTENT.notSet.fa : CONTENT.notSet.en}</span>
                                                            {!birthPickerOpen && <button className="prof-chip-btn prof-chip-btn--green" onClick={() => setBirthPickerOpen(true)} style={{ fontFamily: monoFont }}>{isRTL ? CONTENT.verifyAgeBtnGreen.fa : CONTENT.verifyAgeBtnGreen.en}</button>}
                                                        </div>
                                                        {birthPickerOpen && (
                                                            <div className="prof-birth-picker-wrap">
                                                                <div className="prof-once-warn" style={{ fontFamily: monoFont }}>⚠ {isRTL ? CONTENT.birthdayOnce.fa : CONTENT.birthdayOnce.en}</div>
                                                                <BirthDatePicker onChange={d => { setBirthDateDraft(d); setBirthError(''); }} isRTL={isRTL} />
                                                                {birthError && <div className="prof-inline-error" style={{ fontFamily: monoFont }}>{birthError}</div>}
                                                                <div className="prof-inline-btns">
                                                                    <button className="prof-action-btn prof-action-btn--confirm" onClick={handleBirthSave} disabled={birthUpdateMutation.isPending || !birthDateDraft} style={{ fontFamily: monoFont }}>{birthUpdateMutation.isPending ? '...' : (isRTL ? CONTENT.confirmDateBtn.fa : CONTENT.confirmDateBtn.en)}</button>
                                                                    <button className="prof-action-btn" onClick={() => { setBirthPickerOpen(false); setBirthError(''); }} style={{ fontFamily: monoFont }}>{isRTL ? CONTENT.cancelBtn.fa : CONTENT.cancelBtn.en}</button>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </>
                                                )}
                                                {birthSaved && <div className="prof-inline-success" style={{ fontFamily: monoFont }}>{isRTL ? CONTENT.ageVerifiedSuccess.fa : CONTENT.ageVerifiedSuccess.en}</div>}
                                            </div>
                                        </div>

                                        <div className="prof-info-row">
                                            <span className="prof-info-label" style={{ fontFamily: monoFont }}>{isRTL ? CONTENT.emailLabel.fa : CONTENT.emailLabel.en}</span>
                                            <div className="prof-info-value-col">
                                                <div className="prof-info-value-row">
                                                    <span className="prof-info-value prof-info-value--muted" style={{ fontFamily: monoFont }}>{session?.user?.email || '—'}</span>
                                                    <span className="prof-lock-icon">🔒</span>
                                                </div>
                                            </div>
                                        </div>

                                        {profile?.country && (
                                            <div className="prof-info-row">
                                                <span className="prof-info-label" style={{ fontFamily: monoFont }}>{isRTL ? CONTENT.countryLabel.fa : CONTENT.countryLabel.en}</span>
                                                <div className="prof-info-value-col">
                                                    <span className="prof-info-value prof-info-value--muted" style={{ fontFamily: monoFont }}>{profile.country}</span>
                                                </div>
                                            </div>
                                        )}

                                        <div className="prof-info-row">
                                            <span className="prof-info-label" style={{ fontFamily: monoFont }}>{isRTL ? CONTENT.accountTypeLabel.fa : CONTENT.accountTypeLabel.en}</span>
                                            <div className="prof-info-value-col">
                                                <span className={`prof-type-badge prof-type-badge--${profile?.user_type}`}>
                                                    {profile?.user_type === 'citizen' ? (isRTL ? CONTENT.citizen.fa : CONTENT.citizen.en) : (isRTL ? CONTENT.diaspora.fa : CONTENT.diaspora.en)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Additional info */}
                                <div className="pd-card pd-mt">
                                    <div className="pd-card-section-title" style={{ fontFamily: monoFont }}>{isRTL ? CONTENT.additionalInfo.fa : CONTENT.additionalInfo.en}</div>
                                    <AdditionalInfoForm {...additionalInfoProps} />
                                </div>

                                {/* Verify Identity */}
                                <div className="pd-card pd-mt prof-card--verify">
                                    <div className="pd-card-section-title" style={{ fontFamily: monoFont }}>{isRTL ? CONTENT.verifyIdentityTitle.fa : CONTENT.verifyIdentityTitle.en}</div>
                                    <p className="prof-hint" style={{ fontFamily: monoFont }}>{isRTL ? CONTENT.verifyIdentityHint.fa : CONTENT.verifyIdentityHint.en}</p>
                                    <Link to="/verify" className="prof-verify-link" style={{ fontFamily: monoFont }}>{isRTL ? CONTENT.goToVerification.fa : CONTENT.goToVerification.en}</Link>
                                </div>
                            </div>
                        )}

                        {/* ══════════════════ VERIFY ══════════════════ */}
                        {activeSection === 'verify' && (
                            <div className="pd-section">
                                <div className="pd-section-heading" style={{ fontFamily: headFont }}>{isRTL ? CONTENT.verifyIdentityTitle.fa : CONTENT.verifyIdentityTitle.en}</div>
                                <div className="pd-card prof-card--verify">
                                    <p className="prof-hint" style={{ fontFamily: monoFont }}>{isRTL ? CONTENT.verifyIdentityHint.fa : CONTENT.verifyIdentityHint.en}</p>
                                    <Link to="/verify" className="prof-verify-link" style={{ fontFamily: monoFont }}>{isRTL ? CONTENT.goToVerification.fa : CONTENT.goToVerification.en}</Link>
                                </div>
                            </div>
                        )}

                        {/* ══════════════════ HELP ══════════════════ */}
                        {activeSection === 'help' && (
                            <div className="pd-section">
                                <div className="pd-card pd-card--placeholder">
                                    <I.HelpCircle />
                                    <div style={{ color: '#4a5568', fontSize: 13 }}>{isRTL ? CONTENT.helpComingSoon.fa : CONTENT.helpComingSoon.en}</div>
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </div>
    );
}
