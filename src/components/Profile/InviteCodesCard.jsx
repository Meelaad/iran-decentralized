import { useState } from 'react';

export default function InviteCodesCard({ profile, codes, isRTL, monoFont, onGenerate }) {
    const [copiedCode, setCopiedCode] = useState('');
    const [generateError, setGenerateError] = useState('');

    const unusedCodes = codes.filter(c => !c.used_by);
    const usedCodes = codes.filter(c => c.used_by);

    function copyCode(code) {
        navigator.clipboard.writeText(code);
        setCopiedCode(code);
        setTimeout(() => setCopiedCode(''), 1500);
    }

    function handleGenerate() {
        setGenerateError('');
        onGenerate(undefined, {
            onError: () => setGenerateError(isRTL ? 'ساخت کد ناموفق بود.' : 'Failed to generate code.'),
        });
    }

    return (
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
                    <button className="prof-generate-btn" onClick={handleGenerate} style={monoFont}>
                        {isRTL ? 'ساخت کد' : 'GENERATE CODE'}
                    </button>
                    <span className="prof-remaining" style={monoFont}>
                        {profile.invite_codes_remaining} {isRTL ? 'باقیمانده' : 'remaining'}
                    </span>
                </div>
            ) : (
                <div className="prof-no-codes" style={monoFont}>
                    {isRTL ? 'سهمیه دعوت تمام شده است.' : 'No invite slots remaining.'}
                </div>
            )}
            {generateError && <div className="prof-error" style={monoFont}>{generateError}</div>}
        </div>
    );
}
