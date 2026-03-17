import { useState, useEffect } from 'react';

const TITLES = ['', 'Mr', 'Ms', 'Dr', 'Prof', 'Eng', 'Haj', 'Hajj'];
const PRONOUNS = ['', 'He/Him', 'She/Her', 'They/Them', 'Other'];

export default function AdditionalInfoForm({ profile, isRTL, monoFont, onSave }) {
    const [title, setTitle] = useState('');
    const [pronouns, setPronouns] = useState('');
    const [city, setCity] = useState('');
    const [bio, setBio] = useState('');
    const [saved, setSaved] = useState(false);
    const [saveError, setSaveError] = useState('');

    useEffect(() => {
        if (!profile) return;
        setTitle(profile.title || '');
        setPronouns(profile.pronouns || '');
        setCity(profile.city || '');
        setBio(profile.bio || '');
    }, [profile]);

    function handleSave(e) {
        e.preventDefault();
        setSaveError('');
        setSaved(false);
        onSave(
            { title: title || null, pronouns: pronouns || null, city: city.trim() || null, bio: bio.trim() || null },
            {
                onSuccess: () => {
                    setSaved(true);
                    setTimeout(() => setSaved(false), 2500);
                },
                onError: () => setSaveError(isRTL ? 'ذخیره ناموفق بود.' : 'Failed to save.'),
            }
        );
    }

    return (
        <div className="prof-card">
            <div className="prof-section-title" style={{ fontFamily: monoFont }}>{isRTL ? 'اطلاعات تکمیلی' : 'ADDITIONAL INFO'}</div>
            <form onSubmit={handleSave} className="prof-form">
                <div className="prof-field">
                    <label className="prof-label" style={{ fontFamily: monoFont }}>{isRTL ? 'عنوان' : 'TITLE'}</label>
                    <select className="prof-select" value={title} onChange={e => setTitle(e.target.value)} style={{ fontFamily: 'inherit' }}>
                        {TITLES.map(v => <option key={v} value={v}>{v || (isRTL ? '— انتخاب کنید —' : '— Select —')}</option>)}
                    </select>
                </div>
                <div className="prof-field">
                    <label className="prof-label" style={{ fontFamily: monoFont }}>{isRTL ? 'ضمیر' : 'PRONOUNS'}</label>
                    <select className="prof-select" value={pronouns} onChange={e => setPronouns(e.target.value)} style={{ fontFamily: 'inherit' }}>
                        {PRONOUNS.map(v => <option key={v} value={v}>{v || (isRTL ? '— انتخاب کنید —' : '— Select —')}</option>)}
                    </select>
                </div>
                <div className="prof-field">
                    <label className="prof-label" style={{ fontFamily: monoFont }}>{isRTL ? 'شهر' : 'CITY'}</label>
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
                    <label className="prof-label" style={{ fontFamily: monoFont }}>{isRTL ? 'درباره من' : 'BIO'}</label>
                    <textarea
                        className="prof-textarea"
                        value={bio}
                        onChange={e => setBio(e.target.value)}
                        maxLength={280}
                        rows={4}
                        placeholder={isRTL ? 'اختیاری — درباره پیشینه یا علاقهتان بنویسید.' : 'Optional — briefly describe your background or interest in IranDAO.'}
                        style={{ fontFamily: 'inherit' }}
                    />
                    <div className="prof-char-count" style={{ fontFamily: monoFont }}>{bio.length}/280</div>
                </div>
                {saveError && <div className="prof-error" style={{ fontFamily: monoFont }}>{saveError}</div>}
                <button type="submit" className="prof-save-btn" style={{ fontFamily: monoFont }}>
                    {saved ? (isRTL ? 'ذخیره شد' : 'SAVED') : (isRTL ? 'ذخیره تغییرات' : 'SAVE CHANGES')}
                </button>
            </form>
        </div>
    );
}
