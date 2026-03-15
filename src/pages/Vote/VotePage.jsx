import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLang } from '../../contexts/LangContext';
import { supabase } from '../../lib/supabase';
import { calcAge } from '../../lib/utils';
import { BLUEPRINTS } from '../../data';
import BirthDatePicker from '../../components/BirthDatePicker/BirthDatePicker';
import './VotePage.css';

const BLUEPRINT_COLORS = {
    decentralized:       '#4fc3f7',
    constMonarchy:       '#ffa726',
    secularLiberal:      '#66bb6a',
    federalDemocratic:   '#26c6da',
    democraticSocialist: '#ef5350',
    absoluteMonarchy:    '#ffd54f',
};

export default function VotePage() {
    const { t, tKey, isRTL } = useLang();
    const monoFont = { fontFamily: isRTL ? "'Vazirmatn', sans-serif" : "'intelone-mono', monospace" };
    const headingFont = { fontFamily: isRTL ? "'Vazirmatn', sans-serif" : "'Inter', sans-serif" };

    // Age gate: 'loading' | 'gate' | 'too-young' | 'ok'
    const [ageStatus, setAgeStatus] = useState('loading');
    const [birthDateInput, setBirthDateInput] = useState('');
    const [ageError, setAgeError] = useState(null);
    const [ageSubmitting, setAgeSubmitting] = useState(false);

    // Vote data
    const [votes, setVotes] = useState({});
    const [total, setTotal] = useState(0);
    const [votesLoading, setVotesLoading] = useState(true);
    const [userVote, setUserVote] = useState(null);
    const [session, setSession] = useState(null);

    // Weighted vote toggle
    const [viewMode, setViewMode] = useState('raw');
    const [weightedVotes, setWeightedVotes] = useState({});
    const [weightedTotal, setWeightedTotal] = useState(0);

    useEffect(() => {
        // Always load public vote counts regardless of age gate
        loadVotes();
        loadWeightedVotes();

        // Age gate check
        if (sessionStorage.getItem('irdao_age_ok') === 'true') {
            setAgeStatus('ok');
            supabase.auth.getSession().then(({ data }) => {
                setSession(data.session);
                if (data.session) loadUserVote(data.session.user.id);
            });
            return;
        }

        supabase.auth.getSession().then(async ({ data }) => {
            const sess = data.session;
            setSession(sess);
            if (sess) {
                loadUserVote(sess.user.id);
                // Check if birth_date already stored
                const { data: prof } = await supabase
                    .from('profiles')
                    .select('birth_date')
                    .eq('id', sess.user.id)
                    .single();
                if (prof?.birth_date) {
                    if (calcAge(prof.birth_date) >= 18) {
                        sessionStorage.setItem('irdao_age_ok', 'true');
                        setAgeStatus('ok');
                    } else {
                        setAgeStatus('too-young');
                    }
                    return;
                }
            }
            setAgeStatus('gate');
        });
    }, []);

    async function loadVotes() {
        const { data } = await supabase.rpc('get_blueprint_vote_counts');
        if (data) {
            const map = {};
            let sum = 0;
            for (const row of data) {
                map[row.blueprint_id] = Number(row.votes);
                sum += Number(row.votes);
            }
            setVotes(map);
            setTotal(sum);
        }
        setVotesLoading(false);
    }

    async function loadWeightedVotes() {
        const { data } = await supabase.rpc('get_blueprint_vote_counts_weighted');
        if (data) {
            const wMap = {};
            let wTotal = 0;
            for (const row of data) {
                wMap[row.blueprint_id] = Number(row.weighted_votes);
                wTotal += Number(row.weighted_votes);
            }
            setWeightedVotes(wMap);
            setWeightedTotal(wTotal);
        }
    }

    async function loadUserVote(userId) {
        const { data } = await supabase
            .from('profiles')
            .select('preferred_blueprint')
            .eq('id', userId)
            .single();
        if (data) setUserVote(data.preferred_blueprint);
    }

    async function handleAgeSubmit(e) {
        e.preventDefault();
        const age = calcAge(birthDateInput);
        if (isNaN(age) || age < 0 || age > 99) {
            setAgeError(isRTL ? 'تاریخ نامعتبر.' : 'Invalid date.');
            return;
        }
        if (age < 18) {
            setAgeStatus('too-young');
            // Still save birth_date to DB if logged in
            if (session) {
                await supabase.from('profiles').update({ birth_date: birthDateInput }).eq('id', session.user.id);
            }
            return;
        }
        setAgeSubmitting(true);
        sessionStorage.setItem('irdao_age_ok', 'true');
        if (session) {
            await supabase.from('profiles').update({ birth_date: birthDateInput }).eq('id', session.user.id);
        }
        setAgeStatus('ok');
        setAgeSubmitting(false);
    }


    // ── Age gate ──────────────────────────────────────────────────────────────
    if (ageStatus === 'loading') {
        return (
            <div className="vote-page" dir={isRTL ? 'rtl' : 'ltr'}>
                <div className="vote-bg-grid" />
                <div className="vote-inner" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 300 }}>
                    <span style={{ color: '#3a4a5e', fontFamily: "'intelone-mono', monospace", fontSize: 12 }}>...</span>
                </div>
            </div>
        );
    }

    if (ageStatus === 'gate') {
        return (
            <div className="vote-page" dir={isRTL ? 'rtl' : 'ltr'}>
                <div className="vote-bg-grid" />
                <div className="vote-scanline" />
                <div className="vote-inner">
                    <div className="vote-age-gate">
                        <div className="vote-age-kicker" style={monoFont}>{tKey('vote.ageGateKicker')}</div>
                        <h1 className="vote-age-title" style={headingFont}>{tKey('vote.ageGateTitle')}</h1>
                        <div className="vote-age-warning" style={monoFont}>
                            {tKey('vote.ageGateWarning')}
                        </div>
                        <form className="vote-age-form" onSubmit={handleAgeSubmit}>
                            <label className="vote-age-label" style={monoFont}>
                                {tKey('vote.ageGateDateLabel')}
                            </label>
                            <BirthDatePicker
                                onChange={dateStr => { setBirthDateInput(dateStr); setAgeError(null); }}
                                isRTL={isRTL}
                            />
                            {ageError && (
                                <div className="vote-age-error" style={monoFont}>{ageError}</div>
                            )}
                            <button
                                className="vote-age-submit"
                                type="submit"
                                style={monoFont}
                                disabled={ageSubmitting}
                            >
                                {tKey('vote.ageGateSubmit')}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        );
    }

    if (ageStatus === 'too-young') {
        return (
            <div className="vote-page" dir={isRTL ? 'rtl' : 'ltr'}>
                <div className="vote-bg-grid" />
                <div className="vote-scanline" />
                <div className="vote-inner">
                    <div className="vote-age-gate">
                        <div className="vote-age-kicker" style={monoFont}>{tKey('vote.ageGateKicker')}</div>
                        <h1 className="vote-age-title" style={headingFont}>{tKey('vote.ageTooYoungTitle')}</h1>
                        <p className="vote-age-too-young-body">{tKey('vote.ageTooYoung')}</p>
                        <Link to="/blueprint/gov/decentralized" className="vote-age-explore-link" style={monoFont}>
                            {isRTL ? 'کاوش طرح‌ها ←' : 'EXPLORE BLUEPRINTS →'}
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    // ── Normal vote page (ageStatus === 'ok') ──────────────────────────────────
    return (
        <div className="vote-page" dir={isRTL ? 'rtl' : 'ltr'}>
            <div className="vote-bg-grid" />
            <div className="vote-scanline" />

            <div className="vote-inner">
                <div className="vote-header">
                    <div className="vote-kicker" style={monoFont}>{tKey('vote.kicker')}</div>
                    <h1 className="vote-title" style={headingFont}>
                        {tKey('vote.title')}
                    </h1>
                    <div className="vote-total" style={monoFont}>
                        {votesLoading ? '...' : `${total} ${tKey('vote.totalVotes')}`}
                    </div>
                    <div className="vote-view-toggle">
                        <button
                            className={`vote-toggle-btn${viewMode === 'raw' ? ' is-active' : ''}`}
                            onClick={() => setViewMode('raw')}
                            style={monoFont}
                        >
                            {isRTL ? 'رأی خام' : 'RAW VOTES'}
                        </button>
                        <button
                            className={`vote-toggle-btn${viewMode === 'weighted' ? ' is-active' : ''}`}
                            onClick={() => setViewMode('weighted')}
                            style={monoFont}
                        >
                            {isRTL ? 'رأی وزن‌دار' : 'WEIGHTED VOTES'}
                        </button>
                        {viewMode === 'weighted' && (
                            <span className="vote-weight-info" style={monoFont}>
                                {isRTL ? 'LOW×1  MID×2  HIGH×3' : 'LOW×1  MID×2  HIGH×3'}
                            </span>
                        )}
                    </div>
                </div>

                <div className="vote-cards">
                    {Object.values(BLUEPRINTS).map(bp => {
                        const displayCount = viewMode === 'weighted'
                            ? (weightedVotes[bp.id] || 0)
                            : (votes[bp.id] || 0);
                        const displayTotal = viewMode === 'weighted' ? weightedTotal : total;
                        const pct = displayTotal > 0 ? (displayCount / displayTotal) * 100 : 0;
                        const color = BLUEPRINT_COLORS[bp.id] || '#4fc3f7';
                        const isUserVote = userVote === bp.id;

                        return (
                            <div
                                key={bp.id}
                                className={`vote-card${isUserVote ? ' vote-card--yours' : ''}`}
                                style={{ '--accent': color }}
                            >
                                <div className="vote-card-top">
                                    <div className="vote-card-name" style={headingFont}>
                                        {t(bp.name)}
                                    </div>
                                    {isUserVote && (
                                        <div className="vote-your-badge" style={monoFont}>
                                            {tKey('vote.yourVote')}
                                        </div>
                                    )}
                                </div>

                                <div className="vote-bar-track">
                                    <div
                                        className="vote-bar-fill"
                                        style={{ width: `${pct}%`, background: color }}
                                    />
                                </div>

                                <div className="vote-card-stats" style={monoFont}>
                                    <span className="vote-pct">{Math.round(pct)}%</span>
                                    <span className="vote-count">{displayCount} {tKey('vote.votes')}</span>
                                </div>

                                <Link
                                    to={`/blueprint/gov/${bp.id}`}
                                    className="vote-card-link"
                                    style={monoFont}
                                >
                                    {tKey('blueprint.learnMore')}
                                </Link>
                            </div>
                        );
                    })}
                </div>

                <div className="vote-cta" style={monoFont}>
                    {session ? (
                        <Link to="/profile" className="vote-cta-link">
                            {tKey('vote.changeVote')}
                        </Link>
                    ) : (
                        <Link to="/login" className="vote-cta-link">
                            {tKey('vote.loginPrompt')}
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
}
