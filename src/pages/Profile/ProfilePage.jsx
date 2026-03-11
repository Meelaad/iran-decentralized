import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLang } from '../../contexts/LangContext';
import { supabase } from '../../lib/supabase';
import { BLUEPRINTS } from '../../data';
import './ProfilePage.css';

const TITLES = ['', 'Mr', 'Ms', 'Dr', 'Prof', 'Eng', 'Haj', 'Hajj'];
const PRONOUNS = ['', 'He/Him', 'She/Her', 'They/Them', 'Other'];

const CONTENT = {
    eyebrow:      { en: 'MEMBER PROFILE',     fa: 'پروفایل عضو' },
    editSection:  { en: 'PROFILE DETAILS',    fa: 'جزئیات پروفایل' },
    labelTitle:   { en: 'TITLE',              fa: 'عنوان' },
    labelPronouns:{ en: 'PRONOUNS',           fa: 'ضمیر' },
    labelCity:    { en: 'CITY',               fa: 'شهر' },
    labelBio:     { en: 'BIO',                fa: 'درباره من' },
    bioHint:      { en: 'Optional — briefly describe your background or interest in IranDAO.', fa: 'اختیاری — درباره پیشینه یا علاقه‌تان به ایران‌دائو بنویسید.' },
    saveBtn:      { en: 'SAVE CHANGES',       fa: 'ذخیره تغییرات' },
    saved:        { en: 'SAVED',              fa: 'ذخیره شد' },
    inviteSection:{ en: 'INVITE CODES',       fa: 'کدهای دعوت' },
    inviteHint:   { en: 'Share these codes to invite new members. Each code can only be used once.', fa: 'این کدها را برای دعوت اعضای جدید به اشتراک بگذارید. هر کد فقط یک بار قابل استفاده است.' },
    codeUnused:   { en: 'Available',          fa: 'موجود' },
    codeUsed:     { en: 'Used',               fa: 'استفاده شده' },
    generateBtn:  { en: 'GENERATE CODE',      fa: 'ساخت کد' },
    noQuota:      { en: 'No invite slots remaining.', fa: 'سهمیه دعوت تمام شده است.' },
    votingSection:{ en: 'BLUEPRINT VOTE',     fa: 'رأی به طرح حاکمیتی' },
    voteHint:     { en: 'Select your preferred governance blueprint. You can change this at any time.', fa: 'طرح حاکمیتی مورد نظر خود را انتخاب کنید. می‌توانید هر زمان تغییر دهید.' },
    voteSaved:    { en: 'Vote saved',          fa: 'رأی ذخیره شد' },
    noSession:    { en: 'You are not logged in.', fa: 'شما وارد نشده‌اید.' },
    copied:       { en: 'Copied!',            fa: 'کپی شد!' },
};

export default function ProfilePage() {
    const { t, isRTL } = useLang();
    const navigate = useNavigate();
    const monoFont    = { fontFamily: isRTL ? "'Irancell', sans-serif" : "'IBM Plex Mono', monospace" };
    const headingFont = { fontFamily: isRTL ? "'Irancell', sans-serif" : "'Inter', sans-serif" };

    const [session, setSession] = useState(null);
    const [profile, setProfile] = useState(null);
    const [codes, setCodes] = useState([]);
    const [loading, setLoading] = useState(true);

    // Editable fields
    const [title, setTitle] = useState('');
    const [pronouns, setPronouns] = useState('');
    const [city, setCity] = useState('');
    const [bio, setBio] = useState('');
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [saveError, setSaveError] = useState('');
    const [copiedCode, setCopiedCode] = useState('');
    const [generating, setGenerating] = useState(false);
    const [generateError, setGenerateError] = useState('');
    const [preferredBlueprint, setPreferredBlueprint] = useState('decentralized');
    const [voteSaving, setVoteSaving] = useState(false);
    const [voteSaved, setVoteSaved] = useState(false);

    useEffect(() => {
        supabase.auth.getSession().then(({ data }) => {
            if (!data.session) { setLoading(false); return; }
            setSession(data.session);
            loadProfile(data.session.user.id);
        });
    }, []);

    async function loadProfile(userId) {
        const [{ data: prof }, { data: inviteCodes }] = await Promise.all([
            supabase.from('profiles').select('*').eq('id', userId).single(),
            supabase.from('invite_codes').select('code, used_by, used_at').eq('owner_id', userId).order('created_at'),
        ]);
        if (prof) {
            setProfile(prof);
            setTitle(prof.title || '');
            setPronouns(prof.pronouns || '');
            setCity(prof.city || '');
            setBio(prof.bio || '');
            setPreferredBlueprint(prof.preferred_blueprint || 'decentralized');
        }
        if (inviteCodes) setCodes(inviteCodes);
        setLoading(false);
    }

    async function handleSave(e) {
        e.preventDefault();
        setSaving(true);
        setSaveError('');
        setSaved(false);
        const { error } = await supabase
            .from('profiles')
            .update({ title: title || null, pronouns: pronouns || null, city: city.trim() || null, bio: bio.trim() || null })
            .eq('id', session.user.id);
        setSaving(false);
        if (error) {
            const msg = error.message?.toLowerCase() || '';
            if (msg.includes('schema cache') || msg.includes('could not find')) {
                setSaveError(isRTL
                    ? 'خطای پیکربندی پایگاه داده. لطفاً با پشتیبانی تماس بگیرید.'
                    : 'A database configuration error occurred. Please contact support.');
            } else {
                setSaveError(isRTL
                    ? 'ذخیره‌سازی ناموفق بود. لطفاً دوباره تلاش کنید.'
                    : 'Failed to save. Please try again.');
            }
            return;
        }
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
    }

    function copyCode(code) {
        navigator.clipboard.writeText(code);
        setCopiedCode(code);
        setTimeout(() => setCopiedCode(''), 1500);
    }

    async function handleVote(blueprintId) {
        if (blueprintId === preferredBlueprint || voteSaving) return;
        setVoteSaving(true);
        setVoteSaved(false);
        const { error } = await supabase
            .from('profiles')
            .update({ preferred_blueprint: blueprintId })
            .eq('id', session.user.id);
        setVoteSaving(false);
        if (!error) {
            setPreferredBlueprint(blueprintId);
            setVoteSaved(true);
            setTimeout(() => setVoteSaved(false), 2500);
        }
    }

    async function handleGenerate() {
        setGenerating(true);
        setGenerateError('');
        try {
            const { data: { session: s } } = await supabase.auth.getSession();
            const res = await fetch('/api/generate-code', {
                method: 'POST',
                headers: { Authorization: `Bearer ${s.access_token}` },
            });
            const json = await res.json();
            if (!res.ok) {
                setGenerateError(isRTL
                    ? 'ساخت کد ناموفق بود. لطفاً دوباره تلاش کنید.'
                    : 'Failed to generate code. Please try again.');
                return;
            }
            await loadProfile(session.user.id);
        } catch {
            setGenerateError(isRTL
                ? 'خطایی رخ داد. لطفاً دوباره تلاش کنید.'
                : 'Something went wrong. Please try again.');
        } finally {
            setGenerating(false);
        }
    }

    if (loading) return (
        <div className="prof-page">
            <div className="prof-loading"><span className="prof-spinner" /></div>
        </div>
    );

    if (!session) return (
        <div className="prof-page">
            <div className="prof-no-session" style={monoFont}>
                {t(CONTENT.noSession)}{' '}
                <button className="prof-link-btn" onClick={() => navigate('/register')} style={monoFont}>
                    {isRTL ? 'ثبت‌نام' : 'Register →'}
                </button>
            </div>
        </div>
    );

    const joinedDate = profile?.created_at
        ? new Date(profile.created_at).toLocaleDateString('en-GB', { year: 'numeric', month: 'long' })
        : '';

    const unusedCodes = codes.filter(c => !c.used_by);
    const usedCodes   = codes.filter(c => c.used_by);

    return (
        <div className="prof-page" dir={isRTL ? 'rtl' : 'ltr'}>
            <div className="prof-bg-grid" />
            <div className="prof-scanline" />

            <div className="prof-inner">
                {/* ── Header ── */}
                <div className="prof-header">
                    <div className="prof-eyebrow" style={monoFont}>{t(CONTENT.eyebrow)}</div>
                    <h1 className="prof-name" style={headingFont}>{profile?.full_name}</h1>
                    <div className="prof-meta" style={monoFont}>
                        <span className={`prof-type-badge prof-type-badge--${profile?.user_type}`}>
                            {profile?.user_type === 'citizen'
                                ? (isRTL ? 'شهروند' : 'Citizen')
                                : (isRTL ? 'دیاسپورا' : 'Diaspora')}
                        </span>
                        {profile?.country && <span className="prof-meta-sep">·</span>}
                        {profile?.country && <span>{profile.country}</span>}
                        {joinedDate && <span className="prof-meta-sep">·</span>}
                        {joinedDate && <span>{isRTL ? `عضو از ${joinedDate}` : `Member since ${joinedDate}`}</span>}
                    </div>
                </div>

                <div className="prof-grid">
                    {/* ── Edit Profile ── */}
                    <div className="prof-card">
                        <div className="prof-section-title" style={monoFont}>{t(CONTENT.editSection)}</div>
                        <form onSubmit={handleSave} className="prof-form">
                            <div className="prof-field">
                                <label className="prof-label" style={monoFont}>{t(CONTENT.labelTitle)}</label>
                                <select className="prof-select" value={title} onChange={e => setTitle(e.target.value)} style={{ fontFamily: 'inherit' }}>
                                    {TITLES.map(t => <option key={t} value={t}>{t || (isRTL ? '— انتخاب کنید —' : '— Select —')}</option>)}
                                </select>
                            </div>
                            <div className="prof-field">
                                <label className="prof-label" style={monoFont}>{t(CONTENT.labelPronouns)}</label>
                                <select className="prof-select" value={pronouns} onChange={e => setPronouns(e.target.value)} style={{ fontFamily: 'inherit' }}>
                                    {PRONOUNS.map(p => <option key={p} value={p}>{p || (isRTL ? '— انتخاب کنید —' : '— Select —')}</option>)}
                                </select>
                            </div>
                            <div className="prof-field">
                                <label className="prof-label" style={monoFont}>{t(CONTENT.labelCity)}</label>
                                <input
                                    className="prof-input"
                                    type="text"
                                    value={city}
                                    onChange={e => setCity(e.target.value)}
                                    maxLength={80}
                                    placeholder={isRTL ? 'شهر شما' : 'Your city'}
                                    style={{ fontFamily: 'inherit' }}
                                />
                            </div>
                            <div className="prof-field">
                                <label className="prof-label" style={monoFont}>{t(CONTENT.labelBio)}</label>
                                <textarea
                                    className="prof-textarea"
                                    value={bio}
                                    onChange={e => setBio(e.target.value)}
                                    maxLength={280}
                                    rows={4}
                                    placeholder={t(CONTENT.bioHint)}
                                    style={{ fontFamily: 'inherit' }}
                                />
                                <div className="prof-char-count" style={monoFont}>{bio.length}/280</div>
                            </div>
                            {saveError && <div className="prof-error" style={monoFont}>{saveError}</div>}
                            <button type="submit" className="prof-save-btn" disabled={saving} style={monoFont}>
                                {saving ? '...' : saved ? t(CONTENT.saved) : t(CONTENT.saveBtn)}
                            </button>
                        </form>
                    </div>

                    <div className="prof-right-col">
                        {/* ── Invite Codes ── */}
                        <div className="prof-card">
                            <div className="prof-section-title" style={monoFont}>{t(CONTENT.inviteSection)}</div>
                            <p className="prof-hint" style={monoFont}>{t(CONTENT.inviteHint)}</p>
                            <div className="prof-codes-list">
                                {unusedCodes.map(c => (
                                    <button
                                        key={c.code}
                                        className="prof-code-chip prof-code-chip--unused"
                                        onClick={() => copyCode(c.code)}
                                        title={isRTL ? 'کلیک کنید تا کپی شود' : 'Click to copy'}
                                        style={monoFont}
                                    >
                                        {copiedCode === c.code ? t(CONTENT.copied) : c.code}
                                    </button>
                                ))}
                                {usedCodes.map(c => (
                                    <span key={c.code} className="prof-code-chip prof-code-chip--used" style={monoFont}>
                                        {c.code}
                                    </span>
                                ))}
                            </div>
                            {profile?.invite_codes_remaining > 0 ? (
                                <div className="prof-generate-row">
                                    <button
                                        className="prof-generate-btn"
                                        onClick={handleGenerate}
                                        disabled={generating}
                                        style={monoFont}
                                    >
                                        {generating ? '...' : t(CONTENT.generateBtn)}
                                    </button>
                                    <span className="prof-remaining" style={monoFont}>
                                        {profile.invite_codes_remaining} {isRTL ? 'باقی‌مانده' : 'remaining'}
                                    </span>
                                </div>
                            ) : (
                                <div className="prof-no-codes" style={monoFont}>{t(CONTENT.noQuota)}</div>
                            )}
                            {generateError && <div className="prof-error" style={monoFont}>{generateError}</div>}
                        </div>

                        {/* ── Blueprint Vote ── */}
                        <div className="prof-card">
                            <div className="prof-section-title" style={monoFont}>{t(CONTENT.votingSection)}</div>
                            <p className="prof-hint" style={monoFont}>{t(CONTENT.voteHint)}</p>
                            <div className="prof-blueprint-options">
                                {Object.values(BLUEPRINTS).map(bp => (
                                    <button
                                        key={bp.id}
                                        className={`prof-blueprint-btn${preferredBlueprint === bp.id ? ' is-active' : ''}`}
                                        onClick={() => handleVote(bp.id)}
                                        disabled={voteSaving}
                                        style={monoFont}
                                    >
                                        {t(bp.name)}
                                    </button>
                                ))}
                            </div>
                            {voteSaved && <div className="prof-vote-saved" style={monoFont}>{t(CONTENT.voteSaved)}</div>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
