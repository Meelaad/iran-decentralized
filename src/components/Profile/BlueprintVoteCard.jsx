import { useState } from 'react';
import { BLUEPRINTS } from '../../data';
import { calcAge } from '../../lib/utils';

const BLUEPRINT_COLORS = {
    decentralized: '#8B5CF6',
    constMonarchy: '#ffd54f',
    secularLiberal: '#81c784',
    federalDemocratic: '#ff8a65',
    democraticSocialist: '#ce93d8',
    absoluteMonarchy: '#ef9a9a',
};

export default function BlueprintVoteCard({ profile, preferredBlueprint, isRTL, monoFont, headFont, t, onVote, onScrollToMemberCard }) {
    const [voteError, setVoteError] = useState('');
    const [voteSaved, setVoteSaved] = useState(false);

    const age = calcAge(profile?.birth_date);
    const voteEligible = age !== null && age >= 18 && age <= 99;
    const currentBp = preferredBlueprint ? BLUEPRINTS[preferredBlueprint] : null;
    const currentBpColor = BLUEPRINT_COLORS[preferredBlueprint] || '#8B5CF6';

    function handleVote(blueprintId) {
        if (blueprintId === preferredBlueprint) return;
        setVoteError('');
        setVoteSaved(false);
        onVote(blueprintId, {
            onSuccess: () => {
                setVoteSaved(true);
                setTimeout(() => setVoteSaved(false), 2500);
            },
            onError: (err) => {
                const msg = err?.error === 'age_unverified'
                    ? (isRTL ? 'ابتدا سن خود را تأیید کنید.' : 'Please verify your age first.')
                    : (isRTL ? 'خطا در ثبت رأی.' : 'Failed to cast vote.');
                setVoteError(msg);
            },
        });
    }

    return (
        <div className="prof-card prof-card--vote-wrap">
            <div className="prof-section-title" style={{ fontFamily: monoFont }}>{isRTL ? 'رأی به طرح حاکمیتی' : 'BLUEPRINT VOTE'}</div>

            <div className={`prof-vote-content${!voteEligible ? ' prof-vote-content--blurred' : ''}`}>
                {currentBp && (
                    <div className="prof-current-vote" style={{ '--bp-color': currentBpColor }}>
                        <div className="prof-current-vote-label" style={{ fontFamily: monoFont }}>
                            {isRTL ? 'رأی شما' : 'YOUR VOTE'}
                        </div>
                        <div className="prof-current-vote-name" style={{ fontFamily: headFont, color: currentBpColor }}>
                            {t(currentBp.name)}
                        </div>
                        <div className="prof-current-vote-bar" />
                    </div>
                )}

                <p className="prof-hint" style={{ fontFamily: monoFont }}>
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
                            style={{ fontFamily: monoFont, '--btn-color': BLUEPRINT_COLORS[bp.id] || '#8B5CF6' }}
                        >
                            {t(bp.name)}
                        </button>
                    ))}
                </div>

                {voteError && <div className="prof-error" style={{ fontFamily: monoFont }}>{voteError}</div>}
                {voteSaved && <div className="prof-vote-saved" style={{ fontFamily: monoFont }}>{isRTL ? 'رأی ذخیره شد' : 'Vote saved'}</div>}
            </div>

            {!voteEligible && (
                <div className="prof-vote-gate">
                    <div className="prof-vote-gate-inner">
                        <div className="prof-vote-gate-icon">⚿</div>
                        <p className="prof-vote-gate-msg" style={{ fontFamily: monoFont }}>
                            {isRTL
                                ? 'تاریخ تولد خود را برای رأیدهی تأیید نکردهاید.'
                                : 'You have not verified your birthday for voting yet.'}
                        </p>
                        <button className="prof-vote-gate-btn" style={{ fontFamily: monoFont }} onClick={onScrollToMemberCard}>
                            {isRTL ? '← تأیید سن' : 'VERIFY AGE →'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
