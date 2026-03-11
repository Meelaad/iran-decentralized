import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useLang } from '../../contexts/LangContext';
import { supabase } from '../../lib/supabase';
import { BLUEPRINTS } from '../../data';
import './BlueprintEditorPage.css';

const TIER_OPTIONS = ['core', 'primary', 'secondary', 'tertiary'];
const BORDER_COLORS = ['#4fc3f7', '#66bb6a', '#ffa726', '#ab47bc', '#ef5350', '#26c6da'];

export default function BlueprintEditorPage() {
    const { blueprintId } = useParams();
    const { t, tKey, isRTL } = useLang();
    const navigate = useNavigate();
    const monoFont = { fontFamily: isRTL ? "'Vazirmatn', sans-serif" : "'IBM Plex Mono', monospace" };

    const [loading, setLoading] = useState(true);
    const [blueprint, setBlueprint] = useState(null);
    const [session, setSession] = useState(null);
    const [saving, setSaving] = useState(false);
    const [saveMsg, setSaveMsg] = useState('');
    const [activeTab, setActiveTab] = useState('meta'); // 'meta' | 'sectors' | 'connections' | 'preview'

    // Editable state
    const [nameEn, setNameEn] = useState('');
    const [nameFa, setNameFa] = useState('');
    const [isPublic, setIsPublic] = useState(false);
    const [sectors, setSectors] = useState([]);
    const [connections, setConnections] = useState([]);

    useEffect(() => {
        supabase.auth.getSession().then(async ({ data }) => {
            if (!data.session) { setLoading(false); return; }
            setSession(data.session);
            const res = await fetch(`/api/blueprints?id=${encodeURIComponent(blueprintId)}`, {
                headers: { Authorization: `Bearer ${data.session.access_token}` },
            });
            if (res.ok) {
                const bp = await res.json();
                // Verify ownership
                if (bp.ownerId !== data.session.user.id) {
                    navigate('/my-blueprints');
                    return;
                }
                setBlueprint(bp);
                setNameEn(bp.name?.en || '');
                setNameFa(bp.name?.fa || '');
                setIsPublic(!!bp.isPublic);
                setSectors(bp.sectors || []);
                setConnections(bp.connections || []);
            }
            setLoading(false);
        });
    }, [blueprintId, navigate]);

    async function handleSave() {
        setSaving(true);
        setSaveMsg('');
        const { data: { session: s } } = await supabase.auth.getSession();
        const { error } = await supabase
            .from('blueprints')
            .update({
                name_en: nameEn,
                name_fa: nameFa,
                is_public: isPublic,
                sectors_data: sectors,
                connections_data: connections,
            })
            .eq('id', blueprintId)
            .eq('owner_id', s.user.id);
        setSaving(false);
        setSaveMsg(error ? `Error: ${error.message}` : tKey('editor.saved'));
        if (!error) setTimeout(() => setSaveMsg(''), 3000);
    }

    function addSector() {
        setSectors(prev => [...prev, {
            id: `sector_${Date.now()}`,
            label: { en: 'New Sector', fa: 'بخش جدید' },
            desc: { en: '', fa: '' },
            icon: '⬡',
            tier: 'primary',
            border: '#4fc3f7',
            contents: [],
        }]);
    }

    function updateSector(index, field, value) {
        setSectors(prev => prev.map((s, i) => i === index ? { ...s, [field]: value } : s));
    }

    function updateSectorLang(index, lang, field, value) {
        setSectors(prev => prev.map((s, i) =>
            i === index ? { ...s, [field]: { ...s[field], [lang]: value } } : s
        ));
    }

    function removeSector(index) {
        const removedId = sectors[index]?.id;
        setSectors(prev => prev.filter((_, i) => i !== index));
        if (removedId) {
            setConnections(prev => prev.filter(c => c.from !== removedId && c.to !== removedId));
        }
    }

    function addConnection() {
        if (sectors.length < 2) return;
        setConnections(prev => [...prev, {
            from: sectors[0].id,
            to: sectors[1].id,
            label: { en: 'Connected', fa: 'متصل' },
            strength: 'medium',
        }]);
    }

    function updateConnection(index, field, value) {
        setConnections(prev => prev.map((c, i) => i === index ? { ...c, [field]: value } : c));
    }

    function removeConnection(index) {
        setConnections(prev => prev.filter((_, i) => i !== index));
    }

    if (loading) return (
        <div className="editor-page">
            <div className="editor-loading"><span className="prof-spinner" /></div>
        </div>
    );

    if (!blueprint) return (
        <div className="editor-page">
            <div className="editor-notfound" style={monoFont}>
                {tKey('editor.notFound')} <Link to="/my-blueprints" className="editor-link">←</Link>
            </div>
        </div>
    );

    const sourceBlueprint = BLUEPRINTS[blueprint.forkedFrom];

    return (
        <div className="editor-page" dir={isRTL ? 'rtl' : 'ltr'}>
            <div className="editor-bg-grid" />
            <div className="editor-inner">

                {/* Header */}
                <div className="editor-header">
                    <Link to="/my-blueprints" className="editor-back" style={monoFont}>
                        ← {tKey('myBlueprints.title')}
                    </Link>
                    <div className="editor-header-row">
                        <div>
                            <div className="editor-kicker" style={monoFont}>{tKey('editor.kicker')}</div>
                            <h1 className="editor-title" style={{ fontFamily: isRTL ? "'Vazirmatn', sans-serif" : "'Inter', sans-serif" }}>
                                {nameEn || blueprint.name?.en}
                            </h1>
                            {blueprint.forkedFrom && sourceBlueprint && (
                                <div className="editor-source" style={monoFont}>
                                    {tKey('myBlueprints.forkedFrom')}: {t(sourceBlueprint.name)}
                                </div>
                            )}
                        </div>
                        <div className="editor-actions">
                            <Link to={`/blueprint/${blueprintId}`} className="editor-preview-btn" style={monoFont}>
                                {tKey('editor.preview')}
                            </Link>
                            <button
                                className="editor-save-btn"
                                onClick={handleSave}
                                disabled={saving}
                                style={monoFont}
                            >
                                {saving ? '...' : tKey('editor.save')}
                            </button>
                        </div>
                    </div>
                    {saveMsg && <div className="editor-save-msg" style={monoFont}>{saveMsg}</div>}
                </div>

                {/* Tabs */}
                <div className="editor-tabs" style={monoFont}>
                    {['meta', 'sectors', 'connections'].map(tab => (
                        <button
                            key={tab}
                            className={`editor-tab${activeTab === tab ? ' is-active' : ''}`}
                            onClick={() => setActiveTab(tab)}
                        >
                            {tKey(`editor.tab.${tab}`)}
                        </button>
                    ))}
                </div>

                {/* Tab: Meta */}
                {activeTab === 'meta' && (
                    <div className="editor-panel">
                        <div className="editor-field">
                            <label className="editor-label" style={monoFont}>{tKey('editor.nameen')}</label>
                            <input
                                className="editor-input"
                                value={nameEn}
                                onChange={e => setNameEn(e.target.value)}
                                maxLength={80}
                                style={monoFont}
                            />
                        </div>
                        <div className="editor-field">
                            <label className="editor-label" style={monoFont}>{tKey('editor.namefa')}</label>
                            <input
                                className="editor-input"
                                value={nameFa}
                                onChange={e => setNameFa(e.target.value)}
                                maxLength={80}
                                dir="rtl"
                                style={{ fontFamily: "'Vazirmatn', sans-serif" }}
                            />
                        </div>
                        <div className="editor-field">
                            <label className="editor-label" style={monoFont}>{tKey('editor.visibility')}</label>
                            <div className="editor-toggle-row">
                                <button
                                    className={`editor-toggle-btn${!isPublic ? ' is-active' : ''}`}
                                    onClick={() => setIsPublic(false)}
                                    style={monoFont}
                                >
                                    {tKey('editor.private')}
                                </button>
                                <button
                                    className={`editor-toggle-btn${isPublic ? ' is-active' : ''}`}
                                    onClick={() => setIsPublic(true)}
                                    style={monoFont}
                                >
                                    {tKey('editor.public')}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Tab: Sectors */}
                {activeTab === 'sectors' && (
                    <div className="editor-panel">
                        <div className="editor-panel-toolbar">
                            <button className="editor-add-btn" onClick={addSector} style={monoFont}>
                                + {tKey('editor.addSector')}
                            </button>
                            <span className="editor-count" style={monoFont}>{sectors.length} {tKey('myBlueprints.sectors')}</span>
                        </div>
                        <div className="editor-sectors-list">
                            {sectors.map((sector, i) => (
                                <div key={sector.id || i} className="editor-sector-row">
                                    <div className="editor-sector-row-header">
                                        <span className="editor-sector-icon">{sector.icon}</span>
                                        <input
                                            className="editor-input editor-sector-label"
                                            value={sector.label?.en || ''}
                                            onChange={e => updateSectorLang(i, 'en', 'label', e.target.value)}
                                            placeholder="Label (EN)"
                                            style={monoFont}
                                        />
                                        <input
                                            className="editor-input editor-sector-label"
                                            value={sector.label?.fa || ''}
                                            onChange={e => updateSectorLang(i, 'fa', 'label', e.target.value)}
                                            placeholder="برچسب (FA)"
                                            dir="rtl"
                                            style={{ fontFamily: "'Vazirmatn', sans-serif" }}
                                        />
                                        <select
                                            className="editor-select"
                                            value={sector.tier}
                                            onChange={e => updateSector(i, 'tier', e.target.value)}
                                            style={monoFont}
                                        >
                                            {TIER_OPTIONS.map(t => <option key={t} value={t}>{t}</option>)}
                                        </select>
                                        <div className="editor-color-swatches">
                                            {BORDER_COLORS.map(color => (
                                                <button
                                                    key={color}
                                                    className={`editor-swatch${sector.border === color ? ' is-active' : ''}`}
                                                    style={{ background: color }}
                                                    onClick={() => updateSector(i, 'border', color)}
                                                />
                                            ))}
                                        </div>
                                        <button
                                            className="editor-remove-btn"
                                            onClick={() => removeSector(i)}
                                            style={monoFont}
                                        >
                                            ✕
                                        </button>
                                    </div>
                                </div>
                            ))}
                            {sectors.length === 0 && (
                                <div className="editor-empty" style={monoFont}>{tKey('editor.noSectors')}</div>
                            )}
                        </div>
                    </div>
                )}

                {/* Tab: Connections */}
                {activeTab === 'connections' && (
                    <div className="editor-panel">
                        <div className="editor-panel-toolbar">
                            <button
                                className="editor-add-btn"
                                onClick={addConnection}
                                disabled={sectors.length < 2}
                                style={monoFont}
                            >
                                + {tKey('editor.addConnection')}
                            </button>
                            <span className="editor-count" style={monoFont}>{connections.length} {tKey('myBlueprints.connections')}</span>
                        </div>
                        <div className="editor-connections-list">
                            {connections.map((conn, i) => (
                                <div key={i} className="editor-conn-row">
                                    <select
                                        className="editor-select"
                                        value={conn.from}
                                        onChange={e => updateConnection(i, 'from', e.target.value)}
                                        style={monoFont}
                                    >
                                        {sectors.map(s => (
                                            <option key={s.id} value={s.id}>{s.label?.en || s.id}</option>
                                        ))}
                                    </select>
                                    <span className="editor-conn-arrow">→</span>
                                    <select
                                        className="editor-select"
                                        value={conn.to}
                                        onChange={e => updateConnection(i, 'to', e.target.value)}
                                        style={monoFont}
                                    >
                                        {sectors.map(s => (
                                            <option key={s.id} value={s.id}>{s.label?.en || s.id}</option>
                                        ))}
                                    </select>
                                    <select
                                        className="editor-select editor-select--strength"
                                        value={conn.strength || 'medium'}
                                        onChange={e => updateConnection(i, 'strength', e.target.value)}
                                        style={monoFont}
                                    >
                                        <option value="strong">strong</option>
                                        <option value="medium">medium</option>
                                        <option value="weak">weak</option>
                                    </select>
                                    <button
                                        className="editor-remove-btn"
                                        onClick={() => removeConnection(i)}
                                        style={monoFont}
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))}
                            {connections.length === 0 && (
                                <div className="editor-empty" style={monoFont}>{tKey('editor.noConnections')}</div>
                            )}
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}
