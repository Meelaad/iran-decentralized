import { useState } from 'react';
import BirthDatePicker from '../BirthDatePicker/BirthDatePicker';
import { calcAge } from '../../lib/utils';

function formatDate(dateStr) {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-GB', {
        day: 'numeric', month: 'long', year: 'numeric',
    });
}

export default function MemberInfoCard({ profile, session, isRTL, monoFont, onNameUpdate, onBirthUpdate }) {
    const [nameEditing, setNameEditing] = useState(false);
    const [nameValue, setNameValue] = useState('');
    const [nameError, setNameError] = useState('');

    const [birthPickerOpen, setBirthPickerOpen] = useState(false);
    const [birthDateDraft, setBirthDateDraft] = useState(null);
    const [birthError, setBirthError] = useState('');
    const [birthSaved, setBirthSaved] = useState(false);

    const age = calcAge(profile?.birth_date);
    const voteEligible = age !== null && age >= 18 && age <= 99;

    function handleNameSave() {
        const trimmed = nameValue.trim();
        if (!trimmed) {
            setNameError(isRTL ? 'نام نمیتواند خالی باشد.' : 'Name cannot be empty.');
            return;
        }
        setNameError('');
        onNameUpdate({ full_name: trimmed, name_locked: true }, {
            onSuccess: () => setNameEditing(false),
            onError: () => setNameError(isRTL ? 'ذخیره ناموفق بود.' : 'Failed to save.'),
        });
    }

    function handleBirthSave() {
        if (!birthDateDraft) {
            setBirthError(isRTL ? 'لطفاً تاریخ را انتخاب کنید.' : 'Please select a date.');
            return;
        }
        const age = calcAge(birthDateDraft);
        if (age === null || age > 99) {
            setBirthError(isRTL ? 'تاریخ نامعتبر.' : 'Invalid date.');
            return;
        }
        setBirthError('');
        onBirthUpdate({ birth_date: birthDateDraft }, {
            onSuccess: () => {
                if (age >= 18) sessionStorage.setItem('irdao_age_ok', 'true');
                setBirthPickerOpen(false);
                setBirthSaved(true);
                setTimeout(() => setBirthSaved(false), 3000);
            },
            onError: () => setBirthError(isRTL ? 'ذخیره ناموفق بود.' : 'Failed to save.'),
        });
    }

    return (
        <div className="prof-card prof-card--member-info">
            <div className="prof-section-title" style={monoFont}>
                {isRTL ? 'اطلاعات عضو' : 'MEMBER INFORMATION'}
            </div>

            <div className="prof-info-table">
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
                                    <button className="prof-action-btn prof-action-btn--confirm" onClick={handleNameSave} style={monoFont}>
                                        {isRTL ? 'تأیید' : 'CONFIRM'}
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
                                            <button className="prof-action-btn prof-action-btn--confirm" onClick={handleBirthSave} disabled={!birthDateDraft} style={monoFont}>
                                                {isRTL ? 'تأیید تاریخ' : 'CONFIRM DATE'}
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

                <div className="prof-info-row">
                    <span className="prof-info-label" style={monoFont}>{isRTL ? 'ایمیل' : 'EMAIL'}</span>
                    <div className="prof-info-value-col">
                        <div className="prof-info-value-row">
                            <span className="prof-info-value prof-info-value--muted" style={monoFont}>{session?.user?.email || '—'}</span>
                            <span className="prof-lock-icon">🔒</span>
                        </div>
                    </div>
                </div>

                {profile?.country && (
                    <div className="prof-info-row">
                        <span className="prof-info-label" style={monoFont}>{isRTL ? 'کشور' : 'COUNTRY'}</span>
                        <div className="prof-info-value-col">
                            <span className="prof-info-value prof-info-value--muted" style={monoFont}>{profile.country}</span>
                        </div>
                    </div>
                )}

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
    );
}
