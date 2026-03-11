import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLang } from '../../contexts/LangContext';
import { supabase } from '../../lib/supabase';
import { BLUEPRINTS } from '../../data';
import './MyBlueprintsPage.css';

const BLUEPRINT_COLORS = {
    decentralized:  '#4fc3f7',
    constMonarchy:  '#ffa726',
    secularLiberal: '#66bb6a',
};

function getAccentColor(bp) {
    return BLUEPRINT_COLORS[bp.forkedFrom] || BLUEPRINT_COLORS[bp.id] || '#4fc3f7';
}

export default function MyBlueprintsPage() {
    const { t, tKey, isRTL } = useLang();
    const navigate = useNavigate();
    const monoFont = { fontFamily: isRTL ? "'Vazirmatn', sans-serif" : "'IBM Plex Mono', monospace" };

    const [session, setSession] = useState(null);
    const [myForks, setMyForks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [forking, setForking] = useState(null); // blueprintId being forked
    const [forkError, setForkError] = useState('');

    useEffect(() => {
        supabase.auth.getSession().then(({ data }) => {
            if (!data.session) { setLoading(false); return; }
            setSession(data.session);
            loadMyForks(data.session.access_token);
        });
    }, []);

    async function loadMyForks(token) {
        const res = await fetch('/api/blueprints', {
            headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
            const all = await res.json();
            setMyForks(all.filter(bp => !bp.isOfficial));
        }
        setLoading(false);
    }

    async function handleFork(blueprintId) {
        setForking(blueprintId);
        setForkError('');
        const { data: { session: s } } = await supabase.auth.getSession();
        const res = await fetch('/api/blueprint-fork', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${s.access_token}`,
            },
            body: JSON.stringify({ blueprintId }),
        });
        const json = await res.json();
        setForking(null);
        if (!res.ok) {
            setForkError(json.error || 'Fork failed.');
            return;
        }
        navigate(`/blueprint-editor/${json.forkId}`);
    }

    if (loading) return (
        <div className="myblue-page">
            <div className="myblue-loading"><span className="prof-spinner" /></div>
        </div>
    );

    if (!session) return (
        <div className="myblue-page">
            <div className="myblue-nosession" style={monoFont}>
                {tKey('myBlueprints.loginPrompt')}{' '}
                <Link to="/login" className="myblue-link">{tKey('nav.login')}</Link>
            </div>
        </div>
    );

    const officialList = Object.values(BLUEPRINTS);

    return (
        <div className="myblue-page" dir={isRTL ? 'rtl' : 'ltr'}>
            <div className="myblue-bg-grid" />
            <div className="myblue-inner">

                <div className="myblue-header">
                    <div className="myblue-kicker" style={monoFont}>{tKey('myBlueprints.kicker')}</div>
                    <h1 className="myblue-title" style={{ fontFamily: isRTL ? "'Vazirmatn', sans-serif" : "'Inter', sans-serif" }}>
                        {tKey('myBlueprints.title')}
                    </h1>
                    <p className="myblue-subtitle" style={monoFont}>{tKey('myBlueprints.subtitle')}</p>
                </div>

                {/* My forks */}
                {myForks.length > 0 && (
                    <section className="myblue-section">
                        <div className="myblue-section-title" style={monoFont}>{tKey('myBlueprints.myForks')}</div>
                        <div className="myblue-grid">
                            {myForks.map(bp => (
                                <div key={bp.id} className="myblue-card" style={{ '--accent': getAccentColor(bp) }}>
                                    <div className="myblue-card-name" style={{ fontFamily: isRTL ? "'Vazirmatn', sans-serif" : "'Inter', sans-serif" }}>
                                        {bp.name?.[isRTL ? 'fa' : 'en'] || bp.name?.en}
                                    </div>
                                    {bp.forkedFrom && (
                                        <div className="myblue-card-source" style={monoFont}>
                                            {tKey('myBlueprints.forkedFrom')}: {BLUEPRINTS[bp.forkedFrom]
                                                ? t(BLUEPRINTS[bp.forkedFrom].name)
                                                : bp.forkedFrom}
                                        </div>
                                    )}
                                    <div className="myblue-card-stats" style={monoFont}>
                                        {bp.sectors?.length || 0} {tKey('myBlueprints.sectors')}
                                        {' · '}
                                        {bp.connections?.length || 0} {tKey('myBlueprints.connections')}
                                    </div>
                                    <div className="myblue-card-actions">
                                        <Link
                                            to={`/blueprint-editor/${bp.id}`}
                                            className="myblue-edit-btn"
                                            style={monoFont}
                                        >
                                            {tKey('myBlueprints.edit')}
                                        </Link>
                                        <Link
                                            to={`/blueprint/${bp.id}`}
                                            className="myblue-view-btn"
                                            style={monoFont}
                                        >
                                            {tKey('blueprint.learnMore')}
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Fork an official blueprint */}
                <section className="myblue-section">
                    <div className="myblue-section-title" style={monoFont}>{tKey('myBlueprints.forkOfficial')}</div>
                    {forkError && <div className="myblue-error" style={monoFont}>{forkError}</div>}
                    <div className="myblue-grid">
                        {officialList.map(bp => (
                            <div key={bp.id} className="myblue-card myblue-card--official"
                                 style={{ '--accent': BLUEPRINT_COLORS[bp.id] || '#4fc3f7' }}>
                                <div className="myblue-card-name" style={{ fontFamily: isRTL ? "'Vazirmatn', sans-serif" : "'Inter', sans-serif" }}>
                                    {t(bp.name)}
                                </div>
                                <div className="myblue-card-stats" style={monoFont}>
                                    {bp.sectors?.length || 0} {tKey('myBlueprints.sectors')}
                                    {' · '}
                                    {bp.connections?.length || 0} {tKey('myBlueprints.connections')}
                                </div>
                                <button
                                    className="myblue-fork-btn"
                                    onClick={() => handleFork(bp.id)}
                                    disabled={forking === bp.id || myForks.length >= 10}
                                    style={monoFont}
                                >
                                    {forking === bp.id ? '...' : tKey('myBlueprints.fork')}
                                </button>
                            </div>
                        ))}
                    </div>
                    {myForks.length >= 10 && (
                        <div className="myblue-limit" style={monoFont}>{tKey('myBlueprints.limitReached')}</div>
                    )}
                </section>

            </div>
        </div>
    );
}
