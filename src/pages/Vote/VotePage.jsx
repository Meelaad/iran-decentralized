import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLang } from '../../contexts/LangContext';
import { supabase } from '../../lib/supabase';
import { BLUEPRINTS } from '../../data';
import './VotePage.css';

const BLUEPRINT_COLORS = {
    decentralized:  '#4fc3f7',
    constMonarchy:  '#ffa726',
    secularLiberal: '#66bb6a',
};

export default function VotePage() {
    const { t, tKey, isRTL } = useLang();
    const monoFont = { fontFamily: isRTL ? "'Vazirmatn', sans-serif" : "'IBM Plex Mono', monospace" };

    const [votes, setVotes] = useState({});
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [userVote, setUserVote] = useState(null);
    const [session, setSession] = useState(null);

    useEffect(() => {
        loadVotes();
        supabase.auth.getSession().then(({ data }) => {
            setSession(data.session);
            if (data.session) loadUserVote(data.session.user.id);
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
        setLoading(false);
    }

    async function loadUserVote(userId) {
        const { data } = await supabase
            .from('profiles')
            .select('preferred_blueprint')
            .eq('id', userId)
            .single();
        if (data) setUserVote(data.preferred_blueprint);
    }

    return (
        <div className="vote-page" dir={isRTL ? 'rtl' : 'ltr'}>
            <div className="vote-bg-grid" />
            <div className="vote-scanline" />

            <div className="vote-inner">
                <div className="vote-header">
                    <div className="vote-kicker" style={monoFont}>{tKey('vote.kicker')}</div>
                    <h1 className="vote-title" style={{ fontFamily: isRTL ? "'Vazirmatn', sans-serif" : "'Inter', sans-serif" }}>
                        {tKey('vote.title')}
                    </h1>
                    <div className="vote-total" style={monoFont}>
                        {loading ? '...' : `${total} ${tKey('vote.totalVotes')}`}
                    </div>
                </div>

                <div className="vote-cards">
                    {Object.values(BLUEPRINTS).map(bp => {
                        const count = votes[bp.id] || 0;
                        const pct = total > 0 ? (count / total) * 100 : 0;
                        const color = BLUEPRINT_COLORS[bp.id] || '#4fc3f7';
                        const isUserVote = userVote === bp.id;

                        return (
                            <div
                                key={bp.id}
                                className={`vote-card${isUserVote ? ' vote-card--yours' : ''}`}
                                style={{ '--accent': color }}
                            >
                                <div className="vote-card-top">
                                    <div className="vote-card-name" style={{ fontFamily: isRTL ? "'Vazirmatn', sans-serif" : "'Inter', sans-serif" }}>
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
                                    <span className="vote-count">{count} {tKey('vote.votes')}</span>
                                </div>

                                <Link
                                    to={`/blueprint/${bp.id}`}
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
