import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLang } from '../../contexts/LangContext';
import { supabase } from '../../lib/supabase';
import { BLUEPRINTS } from '../../data';
import BirthDatePicker from '../../components/BirthDatePicker/BirthDatePicker';
import './ProfilePage.css';

const TITLES   = ['', 'Mr', 'Ms', 'Dr', 'Prof', 'Eng', 'Haj', 'Hajj'];
const PRONOUNS = ['', 'He/Him', 'She/Her', 'They/Them', 'Other'];

const BLUEPRINT_COLORS = {
    decentralized:       '#4fc3f7',
    constMonarchy:       '#ffd54f',
    secularLiberal:      '#81c784',
    federalDemocratic:   '#ff8a65',
    democraticSocialist: '#ce93d8',
    absoluteMonarchy:    '#ef9a9a',
};

function calcAge(dateStr) {
    if (!dateStr) return null;
    const birth = new Date(dateStr);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    return age;
}

function formatDate(dateStr) {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-GB', {
        day: 'numeric', month: 'long', year: 'numeric',
    });
}

export default function ProfilePage() {
    const { t, isRTL } = useLang();
    const navigate = useNavigate();
    const monoFont    = { fontFamily: isRTL ? "'Irancell', sans-serif" : "'IBM Plex Mono', monospace" };
    const headingFont = { fontFamily: isRTL ? "'Irancell', sans-serif" : "'Inter', sans-serif" };

    const memberCardRef = useRef(null);

    const [session, setSession]   = useState(null);
    const [profile, setProfile]   = useState(null);
    const [codes,   setCodes]     = useState([]);
    const [loading, setLoading]   = useState(true);

    // ── Name editing ──────────────────────────────────────────────────────────
    const [nameEditing, setNameEditing] = useState(false);
    const [nameValue,   setNameValue]   = useState('');
    const [nameSaving,  setNameSaving]  = useState(false);
    const [nameError,   setNameError]   = useState('');

    // ── Birthday ──────────────────────────────────────────────────────────────
    const [birthPickerOpen, setBirthPickerOpen] = useState(false);
    const [birthDateDraft,  setBirthDateDraft]  = useState(null);
    const [birthSaving,     setBirthSaving]     = useState(false);
    const [birthError,      setBirthError]      = useState('');
    const [birthSaved,      setBirthSaved]      = useState(false);

    // ── Additional info ───────────────────────────────────────────────────────
    const [title,     setTitle]     = useState('');
    const [pronouns,  setPronouns]  = useState('');
    const [city,      setCity]      = useState('');
    const [bio,       setBio]       = useState('');
    const [saving,    setSaving]    = useState(false);
    const [saved,     setSaved]     = useState(false);
    const [saveError, setSaveError] = useState('');

    // ── Invite codes ──────────────────────────────────────────────────────────
    const [copiedCode,     setCopiedCode]     = useState('');
    const [generating,     setGenerating]     = useState(false);
    const [generateError,  setGenerateError]  = useState('');

    // ── Vote ──────────────────────────────────────────────────────────────────
    const [preferredBlueprint, setPreferredBlueprint] = useState('');
    const [voteSaving,  setVoteSaving]  = useState(false);
    const [voteSaved,   setVoteSaved]   = useState(false);
    const [voteError,   setVoteError]   = useState('');

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
            setPreferredBlueprint(prof.preferred_blueprint || '');
        }
        if (inviteCodes) setCodes(inviteCodes);
        setLoading(false);
    }

    // ── Handlers ──────────────────────────────────────────────────────────────

    async function handleNameSave() {
        const trimmed = nameValue.trim();
        if (!trimmed) {
            setNameError(isRTL ? 'نام نمی‌تواند خالی باشد.' : 'Name cannot be empty.');
            return;
        }
        setNameSaving(true);
        setNameError('');
        const { error } = await supabase
            .from('profiles')
            .update({ full_name: trimmed, name_locked: true })
            .eq('id', session.user.id);
        setNameSaving(false);
        if (error) { setNameError(isRTL ? 'ذخیره ناموفق بود.' : 'Failed to save.'); return; }
        setProfile(p => ({ ...p, full_name: trimmed, name_locked: true }));
        setNameEditing(false);
    }

    async function handleBirthSave() {
        if (!birthDateDraft) {
            setBirthError(isRTL ? 'لطفاً تاریخ را انتخاب کنید.' : 'Please select a date.');
            return;
        }
        const age = calcAge(birthDateDraft);
        if (age === null || age > 99) {
            setBirthError(isRTL ? 'تاریخ نامعتبر.' : 'Invalid date.');
            return;
        }
        setBirthSaving(true);
        setBirthError('');
        const { error } = await supabase
            .from('profiles')
            .update({ birth_date: birthDateDraft })
            .eq('id', session.user.id);
        setBirthSaving(false);
        if (error) { setBirthError(isRTL ? 'ذخیره ناموفق بود.' : 'Failed to save.'); return; }
        setProfile(p => ({ ...p, birth_date: birthDateDraft }));
        if (age >= 18) sessionStorage.setItem('irdao_age_ok', 'true');
        setBirthPickerOpen(false);
        setBirthSaved(true);
        setTimeout(() => setBirthSaved(false), 3000);
    }

    async function handleSave(e) {
        e.preventDefault();
        setSaving(true); setSaveError(''); setSaved(false);
        const { error } = await supabase
            .from('profiles')
            .update({ title: title || null, pronouns: pronouns || null, city: city.trim() || null, bio: bio.trim() || null })
            .eq('id', session.user.id);
        setSaving(false);
        if (error) { setSaveError(isRTL ? 'ذخیره ناموفق بود.' : 'Failed to save.'); return; }
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
    }

    async function handleVote(blueprintId) {
        if (blueprintId === preferredBlueprint || voteSaving) return;
        setVoteSaving(true); setVoteError(''); setVoteSaved(false);
        try {
            const { data: { session: s } } = await supabase.auth.getSession();
            const res = await fetch('/api/cast-vote', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${s.access_token}`,
                },
                body: JSON.stringify({ blueprintId }),
            });
            const json = await res.json();
            if (!res.ok) {
                const msg = json.error === 'age_unverified'
                    ? (isRTL ? 'ابتدا سن خود را تأیید کنید.' : 'Please verify your age first.')
                    : (isRTL ? 'خطا در ثبت رأی.' : 'Failed to cast vote.');
                setVoteError(msg);
                return;
            }
            setPreferredBlueprint(blueprintId);
            setProfile(p => ({ ...p, preferred_blueprint: blueprintId }));
            setVoteSaved(true);
            setTimeout(() => setVoteSaved(false), 2500);
        } catch {
            setVoteError(isRTL ? 'خطایی رخ داد.' : 'Something went wrong.');
        } finally {
            setVoteSaving(false);
        }
    }

    function copyCode(code) {
        navigator.clipboard.writeText(code);
        setCopiedCode(code);
        setTimeout(() => setCopiedCode(''), 1500);
    }

    async function handleGenerate() {
        setGenerating(true); setGenerateError('');
        try {
            const { data: { session: s } } = await supabase.auth.getSession();
            const res = await fetch('/api/generate-code', {
                method: 'POST',
                headers: { Authorization: `Bearer ${s.access_token}` },
            });
            if (!res.ok) {
                setGenerateError(isRTL ? 'ساخت کد ناموفق بود.' : 'Failed to generate code.');
                return;
            }
            await loadProfile(session.user.id);
        } catch {
            setGenerateError(isRTL ? 'خطایی رخ داد.' : 'Something went wrong.');
        } finally {
            setGenerating(false);
        }
    }

    // ── Loading / no session ───────────────────────────────────────────────────
    if (loading) return (
        <div className="prof-page">
            <div className="prof-loading"><span className="prof-spinner" /></div>
        </div>
    );

    if (!session) return (
        <div className="prof-page">
            <div className="prof-no-session" style={monoFont}>
                {isRTL ? 'شما وارد نشده‌اید.' : 'You are not logged in.'}{' '}
                <button className="prof-link-btn" onClick={() => navigate('/register')} style={monoFont}>
                    {isRTL ? 'ثبت‌نام' : 'Register →'}
                </button>
            </div>
        </div>
    );

    // ── Derived ───────────────────────────────────────────────────────────────
    const joinedDate = profile?.created_at
        ? new Date(profile.created_at).toLocaleDateString('en-GB', { year: 'numeric', month: 'long' })
        : '';
    const unusedCodes    = codes.filter(c => !c.used_by);
    const usedCodes      = codes.filter(c => c.used_by);
    const age            = calcAge(profile?.birth_date);
    const voteEligible   = age !== null && age >= 18 && age <= 99;
    const currentBp      = preferredBlueprint ? BLUEPRINTS[preferredBlueprint] : null;
    const currentBpColor = BLUEPRINT_COLORS[preferredBlueprint] || '#4fc3f7';

    return (
        <div className="prof-page" dir={isRTL ? 'rtl' : 'ltr'}>
            <div className="prof-bg-grid" />
            <div className="prof-scanline" />

            <div className="prof-inner">

                {/* ── Header ── */}
                <div className="prof-header">
                    <div className="prof-eyebrow" style={monoFont}>{isRTL ? 'پروفایل عضو' : 'MEMBER PROFILE'}</div>
                    <h1 className="prof-name" style={headingFont}>{profile?.full_name}</h1>
                    <div className="prof-meta" style={monoFont}>
                        <span className={`prof-type-badge prof-type-badge--${profile?.user_type}`}>
                            {profile?.user_type === 'citizen' ? (isRTL ? 'شهروند' : 'Citizen') : (isRTL ? 'دیاسپورا' : 'Diaspora')}
                        </span>
                        {profile?.country && <span className="prof-meta-sep">·</span>}
                        {profile?.country && <span>{profile.country}</span>}
                        {joinedDate && <span className="prof-meta-sep">·</span>}
                        {joinedDate && <span>{isRTL ? `عضو از ${joinedDate}` : `Member since ${joinedDate}`}</span>}
                    </div>
                </div>

                {/* ── Member Information ── */}
                <div className="prof-card prof-card--member-info" ref={memberCardRef}>
                    <div className="prof-section-title" style={monoFont}>
                        {isRTL ? 'اطلاعات عضو' : 'MEMBER INFORMATION'}
                    </div>

                    <div className="prof-info-table">

                        {/* Full Name */}
                        <div className="prof-info-row">
                            <span className="prof-info-label" style={monoFont}>{isRTL ? 'نام کامل' : 'FULL NAME'}</span>
                            <div className="prof-info-value-col">
                                {nameEditing ? (
                                    <div className="prof-inline-edit">
                                        <div className="prof-once-warn" style={monoFont}>
                                            ⚠ {isRTL ? 'این تغییر فقط یک بار مجاز است.' : 'This can only be changed once.'}
                                        </div>
                                        <input
                                            className="prof-input prof-input--sm"
                                            value={nameValue}
                                            onChange={e => setNameValue(e.target.value)}
                                            maxLength={80}
                                            autoFocus
                                            style={monoFont}
                                        />
                                        {nameError && <div className="prof-inline-error" style={monoFont}>{nameError}</div>}
                                        <div className="prof-inline-btns">
                                            <button className="prof-action-btn prof-action-btn--confirm" onClick={handleNameSave} disabled={nameSaving} style={monoFont}>
                                                {nameSaving ? '...' : (isRTL ? 'تأیید' : 'CONFIRM')}
                                            </button>
                                            <button className="prof-action-btn" onClick={() => { setNameEditing(false); setNameError(''); }} style={monoFont}>
                                                {isRTL ? 'انصراف' : 'CANCEL'}
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="prof-info-value-row">
                                        <span className="prof-info-value" style={monoFont}>{profile?.full_name || '—'}</span>
                                        {!profile?.name_locked ? (
                                            <button
                                                className="prof-chip-btn"
                                                onClick={() => { setNameValue(profile?.full_name || ''); setNameEditing(true); }}
                                                style={monoFont}
                                            >
                                                {isRTL ? 'ویرایش' : 'EDIT'}
                                            </button>
                                        ) : (
                                            <span className="prof-lock-icon" title={isRTL ? 'قابل تغییر نیست' : 'Locked'}>🔒</span>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Date of Birth */}
                        <div className="prof-info-row">
                            <span className="prof-info-label" style={monoFont}>{isRTL ? 'تاریخ تولد' : 'DATE OF BIRTH'}</span>
                            <div className="prof-info-value-col">
                                {profile?.birth_date ? (
                                    <div className="prof-info-value-row">
                                        <span className="prof-info-value" style={monoFont}>{formatDate(profile.birth_date)}</span>
                                        <span className="prof-lock-icon" title={isRTL ? 'قابل تغییر نیست' : 'Locked'}>🔒</span>
                                        {voteEligible && (
                                            <span className="prof-verified-badge" style={monoFont}>
                                                {isRTL ? '✓ تأیید شده' : '✓ VERIFIED'}
                                            </span>
                                        )}
                                    </div>
                                ) : (
                                    <>
                                        <div className="prof-info-value-row">
                                            <span className="prof-info-value prof-info-value--empty" style={monoFont}>
                                                {isRTL ? 'تنظیم نشده' : 'Not set'}
                                            </span>
                                            {!birthPickerOpen && (
                                                <button className="prof-chip-btn prof-chip-btn--green" onClick={() => setBirthPickerOpen(true)} style={monoFont}>
                                                    {isRTL ? 'تأیید سن' : 'VERIFY AGE'}
                                                </button>
                                            )}
                                        </div>
                                        {birthPickerOpen && (
                                            <div className="prof-birth-picker-wrap">
                                                <div className="prof-once-warn" style={monoFont}>
                                                    ⚠ {isRTL ? 'تاریخ تولد فقط یک بار قابل ثبت است.' : 'Birthday can only be set once.'}
                                                </div>
                                                <BirthDatePicker
                                                    onChange={d => { setBirthDateDraft(d); setBirthError(''); }}
                                                    isRTL={isRTL}
                                                />
                                                {birthError && <div className="prof-inline-error" style={monoFont}>{birthError}</div>}
                                                <div className="prof-inline-btns">
                                                    <button className="prof-action-btn prof-action-btn--confirm" onClick={handleBirthSave} disabled={birthSaving || !birthDateDraft} style={monoFont}>
                                                        {birthSaving ? '...' : (isRTL ? 'تأیید تاریخ' : 'CONFIRM DATE')}
                                                    </button>
                                                    <button className="prof-action-btn" onClick={() => { setBirthPickerOpen(false); setBirthError(''); }} style={monoFont}>
                                                        {isRTL ? 'انصراف' : 'CANCEL'}
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </>
                                )}
                                {birthSaved && (
                                    <div className="prof-inline-success" style={monoFont}>
                                        {isRTL ? '✓ سن تأیید شد' : '✓ Age verified'}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Email */}
                        <div className="prof-info-row">
                            <span className="prof-info-label" style={monoFont}>{isRTL ? 'ایمیل' : 'EMAIL'}</span>
                            <div className="prof-info-value-col">
                                <div className="prof-info-value-row">
                                    <span className="prof-info-value prof-info-value--muted" style={monoFont}>{session?.user?.email || '—'}</span>
                                    <span className="prof-lock-icon">🔒</span>
                                </div>
                            </div>
                        </div>

                        {/* Country */}
                        {profile?.country && (
                            <div className="prof-info-row">
                                <span className="prof-info-label" style={monoFont}>{isRTL ? 'کشور' : 'COUNTRY'}</span>
                                <div className="prof-info-value-col">
                                    <span className="prof-info-value prof-info-value--muted" style={monoFont}>{profile.country}</span>
                                </div>
                            </div>
                        )}

                        {/* Account Type */}
                        <div className="prof-info-row">
                            <span className="prof-info-label" style={monoFont}>{isRTL ? 'نوع حساب' : 'ACCOUNT TYPE'}</span>
                            <div className="prof-info-value-col">
                                <span className={`prof-type-badge prof-type-badge--${profile?.user_type}`}>
                                    {profile?.user_type === 'citizen' ? (isRTL ? 'شهروند' : 'Citizen') : (isRTL ? 'دیاسپورا' : 'Diaspora')}
                                </span>
                            </div>
                        </div>

                    </div>
                </div>

                {/* ── Two-column grid ── */}
                <div className="prof-grid">

                    {/* ── Additional Info ── */}
                    <div className="prof-card">
                        <div className="prof-section-title" style={monoFont}>{isRTL ? 'اطلاعات تکمیلی' : 'ADDITIONAL INFO'}</div>
                        <form onSubmit={handleSave} className="prof-form">
                            <div className="prof-field">
                                <label className="prof-label" style={monoFont}>{isRTL ? 'عنوان' : 'TITLE'}</label>
                                <select className="prof-select" value={title} onChange={e => setTitle(e.target.value)} style={{ fontFamily: 'inherit' }}>
                                    {TITLES.map(v => <option key={v} value={v}>{v || (isRTL ? '— انتخاب کنید —' : '— Select —')}</option>)}
                                </select>
                            </div>
                            <div className="prof-field">
                                <label className="prof-label" style={monoFont}>{isRTL ? 'ضمیر' : 'PRONOUNS'}</label>
                                <select className="prof-select" value={pronouns} onChange={e => setPronouns(e.target.value)} style={{ fontFamily: 'inherit' }}>
                                    {PRONOUNS.map(v => <option key={v} value={v}>{v || (isRTL ? '— انتخاب کنید —' : '— Select —')}</option>)}
                                </select>
                            </div>
                            <div className="prof-field">
                                <label className="prof-label" style={monoFont}>{isRTL ? 'شهر' : 'CITY'}</label>
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
                                <label className="prof-label" style={monoFont}>{isRTL ? 'درباره من' : 'BIO'}</label>
                                <textarea
                                    className="prof-textarea"
                                    value={bio}
                                    onChange={e => setBio(e.target.value)}
                                    maxLength={280}
                                    rows={4}
                                    placeholder={isRTL ? 'اختیاری — درباره پیشینه یا علاقه‌تان بنویسید.' : 'Optional — briefly describe your background or interest in IranDAO.'}
                                    style={{ fontFamily: 'inherit' }}
                                />
                                <div className="prof-char-count" style={monoFont}>{bio.length}/280</div>
                            </div>
                            {saveError && <div className="prof-error" style={monoFont}>{saveError}</div>}
                            <button type="submit" className="prof-save-btn" disabled={saving} style={monoFont}>
                                {saving ? '...' : saved ? (isRTL ? 'ذخیره شد' : 'SAVED') : (isRTL ? 'ذخیره تغییرات' : 'SAVE CHANGES')}
                            </button>
                        </form>
                    </div>

                    <div className="prof-right-col">

                        {/* ── Invite Codes ── */}
                        <div className="prof-card">
                            <div className="prof-section-title" style={monoFont}>{isRTL ? 'کدهای دعوت' : 'INVITE CODES'}</div>
                            <p className="prof-hint" style={monoFont}>
                                {isRTL
                                    ? 'این کدها را برای دعوت اعضای جدید به اشتراک بگذارید. هر کد فقط یک بار قابل استفاده است.'
                                    : 'Share these codes to invite new members. Each code can only be used once.'}
                            </p>
                            <div className="prof-codes-list">
                                {unusedCodes.map(c => (
                                    <button
                                        key={c.code}
                                        className="prof-code-chip prof-code-chip--unused"
                                        onClick={() => copyCode(c.code)}
                                        title={isRTL ? 'کلیک کنید تا کپی شود' : 'Click to copy'}
                                        style={monoFont}
                                    >
                                        {copiedCode === c.code ? (isRTL ? 'کپی شد!' : 'Copied!') : c.code}
                                    </button>
                                ))}
                                {usedCodes.map(c => (
                                    <span key={c.code} className="prof-code-chip prof-code-chip--used" style={monoFont}>{c.code}</span>
                                ))}
                            </div>
                            {profile?.invite_codes_remaining > 0 ? (
                                <div className="prof-generate-row">
                                    <button className="prof-generate-btn" onClick={handleGenerate} disabled={generating} style={monoFont}>
                                        {generating ? '...' : (isRTL ? 'ساخت کد' : 'GENERATE CODE')}
                                    </button>
                                    <span className="prof-remaining" style={monoFont}>
                                        {profile.invite_codes_remaining} {isRTL ? 'باقی‌مانده' : 'remaining'}
                                    </span>
                                </div>
                            ) : (
                                <div className="prof-no-codes" style={monoFont}>
                                    {isRTL ? 'سهمیه دعوت تمام شده است.' : 'No invite slots remaining.'}
                                </div>
                            )}
                            {generateError && <div className="prof-error" style={monoFont}>{generateError}</div>}
                        </div>

                        {/* ── Blueprint Vote ── */}
                        <div className="prof-card prof-card--vote-wrap">
                            <div className="prof-section-title" style={monoFont}>{isRTL ? 'رأی به طرح حاکمیتی' : 'BLUEPRINT VOTE'}</div>

                            {/* Content — blurred when not eligible */}
                            <div className={`prof-vote-content${!voteEligible ? ' prof-vote-content--blurred' : ''}`}>

                                {/* Current vote display */}
                                {currentBp && (
                                    <div className="prof-current-vote" style={{ '--bp-color': currentBpColor }}>
                                        <div className="prof-current-vote-label" style={monoFont}>
                                            {isRTL ? 'رأی شما' : 'YOUR VOTE'}
                                        </div>
                                        <div className="prof-current-vote-name" style={{ ...headingFont, color: currentBpColor }}>
                                            {t(currentBp.name)}
                                        </div>
                                        <div className="prof-current-vote-bar" />
                                    </div>
                                )}

                                <p className="prof-hint" style={monoFont}>
                                    {isRTL
                                        ? 'طرح حاکمیتی مورد نظر خود را انتخاب یا تغییر دهید.'
                                        : 'Select or change your preferred governance blueprint.'}
                                </p>

                                <div className="prof-blueprint-options">
                                    {Object.values(BLUEPRINTS).map(bp => (
                                        <button
                                            key={bp.id}
                                            className={`prof-blueprint-btn${preferredBlueprint === bp.id ? ' is-active' : ''}`}
                                            onClick={() => handleVote(bp.id)}
                                            disabled={voteSaving}
                                            style={{ ...monoFont, '--btn-color': BLUEPRINT_COLORS[bp.id] || '#4fc3f7' }}
                                        >
                                            {t(bp.name)}
                                        </button>
                                    ))}
                                </div>

                                {voteError && <div className="prof-error" style={monoFont}>{voteError}</div>}
                                {voteSaved && <div className="prof-vote-saved" style={monoFont}>{isRTL ? 'رأی ذخیره شد' : 'Vote saved'}</div>}
                            </div>

                            {/* Blur overlay gate */}
                            {!voteEligible && (
                                <div className="prof-vote-gate">
                                    <div className="prof-vote-gate-inner">
                                        <div className="prof-vote-gate-icon">⚿</div>
                                        <p className="prof-vote-gate-msg" style={monoFont}>
                                            {isRTL
                                                ? 'تاریخ تولد خود را برای رأی‌دهی تأیید نکرده‌اید.'
                                                : 'You have not verified your birthday for voting yet.'}
                                        </p>
                                        <button
                                            className="prof-vote-gate-btn"
                                            style={monoFont}
                                            onClick={() => {
                                                memberCardRef.current?.scrollIntoView({ behavior: 'smooth' });
                                                setTimeout(() => setBirthPickerOpen(true), 400);
                                            }}
                                        >
                                            {isRTL ? '← تأیید سن' : 'VERIFY AGE →'}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}
