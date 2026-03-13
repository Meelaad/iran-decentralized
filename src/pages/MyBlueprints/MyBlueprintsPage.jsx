import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLang } from '../../contexts/LangContext';
import { useAuth } from '../../hooks/useAuth';
import { useMyBlueprints, useForkBlueprint } from '../../hooks/useMyBlueprints';
import { Spinner } from '../../components/ui';
import { BLUEPRINTS } from '../../data';
import './MyBlueprintsPage.css';

const BLUEPRINT_COLORS = {
    decentralized:      '#4fc3f7',
    constMonarchy:      '#ffa726',
    secularLiberal:     '#66bb6a',
    federalDemocratic:  '#26c6da',
    democraticSocialist:'#ef5350',
    absoluteMonarchy:   '#ffd54f',
};

function getAccentColor(bp) {
    return BLUEPRINT_COLORS[bp.forkedFrom] || BLUEPRINT_COLORS[bp.id] || '#4fc3f7';
}

export default function MyBlueprintsPage() {
    const { t, tKey, isRTL } = useLang();
    const navigate = useNavigate();
    const monoFont = { fontFamily: isRTL ? "'Vazirmatn', sans-serif" : "'intelone-mono', monospace" };

    const { session, authLoading } = useAuth();
    const userId = session?.user?.id;

    const { data: myForks = [], isLoading: forksLoading } = useMyBlueprints(userId);
    const forkMutation = useForkBlueprint(userId);

    const [forkError, setForkError] = useState('');

    async function handleFork(blueprintId) {
        setForkError('');
        forkMutation.mutate(blueprintId, {
            onSuccess: (json) => navigate(`/blueprint-editor/${json.forkId}`),
            onError: (err) => setForkError(err?.error || 'Fork failed.'),
        });
    }

    const loading = authLoading || (!!userId && forksLoading);

    if (loading) return (
        <div className="myblue-page">
            <div className="myblue-loading"><Spinner size="md" /></div>
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
                                            to={`/blueprint/gov/${bp.id}`}
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
                                    disabled={forkMutation.isPending || myForks.length >= 10}
                                    style={monoFont}
                                >
                                    {forkMutation.isPending ? '...' : tKey('myBlueprints.fork')}
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
