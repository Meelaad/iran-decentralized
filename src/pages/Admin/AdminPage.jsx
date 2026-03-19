import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLang } from '../../contexts/LangContext';
import { useAuth } from '../../hooks/useAuth';
import {
    useAdminUsers, useAdminBlueprints,
    useGenerateCodes, useDeleteCode, useSetInvites, useSeedBlueprints,
    useAdminPlans, usePromotePlan, useArchivePlan,
    useVerificationQueue, useReviewVerification,
    useAdminCivicLeaderboard,
    useMapMarkers, useAddMapMarker, useUpdateMapMarker, useDeleteMapMarker,
} from '../../hooks/useAdmin';
import { Spinner } from '../../components/ui';
import { BLUEPRINTS } from '../../data';
import WorldDotMap from '../../components/WorldDotMap/WorldDotMap';
import './AdminPage.css';

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatDate(iso) {
    if (!iso) return '—';
    return new Date(iso).toLocaleDateString('en-GB', {
        day: '2-digit', month: 'short', year: 'numeric',
    });
}

function buildTree(users) {
    // Returns an array of root nodes, each with a children array (recursively)
    const map = {};
    for (const u of users) map[u.id] = { ...u, children: [] };
    const roots = [];
    for (const u of users) {
        if (u.invited_by && map[u.invited_by]) {
            map[u.invited_by].children.push(map[u.id]);
        } else {
            roots.push(map[u.id]);
        }
    }
    return roots;
}

function TreeNode({ node, depth }) {
    const indent = '  '.repeat(depth);
    const prefix = depth === 0 ? '◆ ' : '└─ ';
    return (
        <>
            <div className={`admin-tree-node${depth === 0 ? ' admin-tree-node--root' : ''}`}>
                {indent}{prefix}<span className="admin-tree-name">{node.full_name || node.email || node.id}</span>
                {node.email && depth > 0 && <span style={{ color: '#3a4a5e', marginLeft: 8 }}>{node.email}</span>}
            </div>
            {node.children.map(child => (
                <TreeNode key={child.id} node={child} depth={depth + 1} />
            ))}
        </>
    );
}

// ── User row ──────────────────────────────────────────────────────────────────

function CopyButton({ code }) {
    const [copied, setCopied] = useState(false);

    function handleCopy() {
        navigator.clipboard.writeText(code).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        });
    }

    return (
        <button
            className={`admin-copy-btn${copied ? ' is-copied' : ''}`}
            onClick={handleCopy}
            title="Copy code"
        >
            {copied
                ? <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><polyline points="2,7 5,10 11,3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                : <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                    <rect x="4.5" y="1" width="7" height="8.5" rx="1" stroke="currentColor" strokeWidth="1.2"/>
                    <rect x="1" y="3.5" width="7" height="8.5" rx="1" stroke="currentColor" strokeWidth="1.2" fill="rgba(1,3,3,0.92)"/>
                  </svg>
            }
        </button>
    );
}

function UserRow({ user, nameMap, onGenerateCodes, onSetInvites, onDeleteCode }) {
    const [expanded, setExpanded] = useState(false);
    const [inviteInput, setInviteInput] = useState(String(user.invite_codes_remaining ?? 0));
    const [working, setWorking] = useState(false);
    const navigate = useNavigate();

    const unusedCodes = user.invite_codes?.filter(c => !c.used_by) || [];
    const usedCodes   = user.invite_codes?.filter(c => c.used_by)  || [];
    const meta        = user.metadata;

    async function handleGenerate() {
        setWorking(true);
        await onGenerateCodes(user.id, 5);
        setWorking(false);
    }

    async function handleSetInvites() {
        const n = parseInt(inviteInput, 10);
        if (isNaN(n) || n < 0 || n > 100) return;
        setWorking(true);
        await onSetInvites(user.id, n);
        setWorking(false);
    }

    return (
        <>
            <tr>
                <td className="admin-td-name">{user.full_name || '—'}</td>
                <td className="admin-td-email">{user.email || '—'}</td>
                <td>{user.country || '—'}</td>
                <td>{user.user_type || '—'}</td>
                <td>{user.invited_by ? (nameMap[user.invited_by] || user.invited_by.slice(0, 8) + '…') : <span style={{ color: '#3a4a5e' }}>seed</span>}</td>
                <td className="admin-td-mono" style={{ color: user.invite_codes_remaining === 0 ? '#3a4a5e' : '#8B5CF6' }}>
                    {user.invite_codes_remaining}
                </td>
                <td>{formatDate(user.created_at)}</td>
                <td>
                    <div className="admin-actions-cell">
                        <button
                            className="admin-action-btn admin-action-btn--view"
                            onClick={() => navigate(`/profile?preview=${user.id}`)}
                        >
                            View Profile
                        </button>
                        <button
                            className="admin-action-btn"
                            onClick={handleGenerate}
                            disabled={working}
                        >
                            + Generate 5 Codes
                        </button>
                        <div className="admin-set-invites-row">
                            <input
                                className="admin-invites-input"
                                type="number"
                                min={0}
                                max={100}
                                value={inviteInput}
                                onChange={e => setInviteInput(e.target.value)}
                            />
                            <button
                                className="admin-action-btn"
                                onClick={handleSetInvites}
                                disabled={working}
                            >
                                Set
                            </button>
                        </div>
                        <button
                            className="admin-expand-btn"
                            onClick={() => setExpanded(x => !x)}
                        >
                            {expanded ? 'Collapse' : 'Details'}
                        </button>
                    </div>
                </td>
            </tr>

            {expanded && (
                <tr className="admin-expand-row">
                    <td colSpan={8}>
                        {/* Invite codes */}
                        <div className="admin-expand-key" style={{ marginBottom: 8 }}>Invite Codes</div>
                        <div className="admin-codes-row">
                            {user.invite_codes?.length === 0 && <span style={{ color: '#3a4a5e', fontSize: 11 }}>No codes generated yet.</span>}
                            {unusedCodes.map(c => (
                                <span key={c.id} className="admin-code-chip-wrap">
                                    <span className="admin-code-chip admin-code-chip--unused">
                                        {c.code}
                                    </span>
                                    <CopyButton code={c.code} />
                                    <button
                                        className="admin-delete-code-btn"
                                        title="Remove code"
                                        onClick={() => onDeleteCode(c.id)}
                                    >
                                        <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                                            <line x1="1" y1="1" x2="10" y2="10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                                            <line x1="10" y1="1" x2="1" y2="10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                                        </svg>
                                    </button>
                                </span>
                            ))}
                            {usedCodes.map(c => (
                                <span
                                    key={c.id}
                                    className="admin-code-chip admin-code-chip--used"
                                    title={`Used by ${nameMap[c.used_by] || c.used_by} on ${formatDate(c.used_at)}`}
                                >
                                    {c.code}
                                </span>
                            ))}
                        </div>

                        {/* Registration metadata */}
                        {meta ? (
                            <>
                                <div className="admin-expand-key" style={{ marginTop: 16, marginBottom: 8 }}>Registration Metadata</div>
                                <div className="admin-expand-grid">
                                    {[
                                        ['IP Address',      meta.ip_address],
                                        ['Timezone',        meta.timezone],
                                        ['Language',        meta.language],
                                        ['Screen',          meta.screen],
                                        ['Color Depth',     meta.color_depth != null ? `${meta.color_depth}-bit` : null],
                                        ['CPU Cores',       meta.hardware_cores],
                                        ['Device Memory',   meta.device_memory != null ? `${meta.device_memory} GB` : null],
                                        ['Platform',        meta.platform],
                                        ['Touch Points',    meta.touch_points],
                                        ['Canvas Hash',     meta.canvas_hash],
                                        ['Audio Hash',      meta.audio_hash],
                                        ['WebGL Vendor',    meta.webgl_vendor],
                                        ['WebGL Renderer',  meta.webgl_renderer],
                                        ['Registered At',   meta.registered_at ? new Date(meta.registered_at).toLocaleString() : null],
                                    ].map(([key, val]) => val != null && (
                                        <div className="admin-expand-field" key={key}>
                                            <span className="admin-expand-key">{key}</span>
                                            <span className="admin-expand-val">{String(val)}</span>
                                        </div>
                                    ))}
                                </div>

                                {/* User agent on its own line — long string */}
                                {meta.user_agent && (
                                    <div className="admin-expand-field" style={{ marginTop: 8 }}>
                                        <span className="admin-expand-key">User Agent</span>
                                        <span className="admin-expand-val" style={{ fontSize: 10 }}>{meta.user_agent}</span>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div style={{ color: '#3a4a5e', fontFamily: 'intelone-mono, monospace', fontSize: 11, marginTop: 16 }}>
                                No metadata recorded.
                            </div>
                        )}
                    </td>
                </tr>
            )}
        </>
    );
}

// ── Map Editor ────────────────────────────────────────────────────────────────

const MAP_PALETTE = ['#26DEC2', '#e8507a', '#FFCE00', '#4fc3f7', '#8B5CF6', '#ffffff', '#f59e0b', '#15803d'];

function MarkerForm({ title, initial = {}, coords, onSave, onDelete, onClose, isPending, error, monoFont }) {
    const [type, setType] = useState(initial.type || 'triangle');
    const [color, setColor] = useState(initial.color || '#26DEC2');
    const [label, setLabel] = useState(initial.label || '');
    const [region, setRegion] = useState(initial.region || '');
    const [popEst, setPopEst] = useState(initial.pop_estimate || '');
    const [desc, setDesc] = useState(initial.description || '');

    const lon = coords ? coords.lon : (initial.lon != null ? Number(initial.lon) : '—');
    const lat = coords ? coords.lat : (initial.lat != null ? Number(initial.lat) : '—');

    async function handleSave() {
        await onSave({ type, color, label, region, pop_estimate: popEst, description: desc });
    }

    return (
        <div className="admin-map-form">
            <div className="admin-map-form-header">
                <span style={{ fontFamily: monoFont }}>{title}</span>
                <button className="admin-map-form-close" onClick={onClose}>✕</button>
            </div>
            <div className="admin-map-form-coords" style={{ fontFamily: monoFont }}>
                {typeof lon === 'number' ? lon.toFixed(4) : lon}, {typeof lat === 'number' ? lat.toFixed(4) : lat}
            </div>

            <div className="admin-map-form-field">
                <label>Type</label>
                <div className="admin-map-type-row">
                    {['triangle', 'circle', 'circle_blink'].map(t => (
                        <button
                            key={t}
                            className={`admin-map-type-btn${type === t ? ' is-active' : ''}`}
                            onClick={() => setType(t)}
                        >
                            {t}
                        </button>
                    ))}
                </div>
            </div>

            <div className="admin-map-form-field">
                <label>Color</label>
                <div className="admin-map-palette">
                    {MAP_PALETTE.map(c => (
                        <button
                            key={c}
                            className={`admin-map-swatch${color === c ? ' is-active' : ''}`}
                            style={{ background: c }}
                            onClick={() => setColor(c)}
                            title={c}
                        />
                    ))}
                </div>
            </div>

            <div className="admin-map-form-field">
                <label>Label</label>
                <input
                    className="admin-map-input"
                    value={label}
                    onChange={e => setLabel(e.target.value)}
                    placeholder="City or location name"
                />
            </div>

            <div className="admin-map-form-field">
                <label>Region</label>
                <input
                    className="admin-map-input"
                    value={region}
                    onChange={e => setRegion(e.target.value)}
                    placeholder="e.g. North America"
                />
            </div>

            <div className="admin-map-form-field">
                <label>Population Estimate</label>
                <input
                    className="admin-map-input"
                    value={popEst}
                    onChange={e => setPopEst(e.target.value)}
                    placeholder="e.g. ~50,000"
                />
            </div>

            <div className="admin-map-form-field">
                <label>Description</label>
                <textarea
                    className="admin-map-input admin-map-textarea"
                    value={desc}
                    onChange={e => setDesc(e.target.value)}
                    placeholder="Notes about this diaspora location"
                    rows={3}
                />
            </div>

            {error && (
                <div className="admin-map-form-error" style={{ fontFamily: monoFont }}>{error}</div>
            )}

            <div className="admin-map-form-actions">
                <button
                    className="admin-action-btn"
                    onClick={handleSave}
                    disabled={isPending}
                >
                    {isPending ? '…' : 'Save'}
                </button>
                {onDelete && (
                    <button
                        className="admin-action-btn admin-action-btn--danger"
                        onClick={onDelete}
                        disabled={isPending}
                    >
                        Delete
                    </button>
                )}
            </div>
        </div>
    );
}

function MapEditorTab({ monoFont }) {
    const { data: markers = [], isLoading } = useMapMarkers();
    const addMarker = useAddMapMarker();
    const updateMarker = useUpdateMapMarker();
    const deleteMarker = useDeleteMapMarker();

    const [editMode, setEditMode] = useState(false);
    const [selectedMarkerId, setSelectedMarkerId] = useState(null);
    const [addCoords, setAddCoords] = useState(null);     // { lon, lat }
    const [editMarker, setEditMarker] = useState(null);   // marker object

    function handleMapClick(lon, lat) {
        if (!editMode) return;
        setEditMarker(null);
        setSelectedMarkerId(null);
        setAddCoords({ lon, lat });
    }

    function handleMarkerClick(marker) {
        if (editMode) {
            setAddCoords(null);
            setEditMarker(marker);
            setSelectedMarkerId(marker.id);
        }
    }

    const [saveError, setSaveError] = useState(null);

    function closePanel() {
        setAddCoords(null);
        setEditMarker(null);
        setSelectedMarkerId(null);
        setSaveError(null);
    }

    async function handleAdd(fields) {
        setSaveError(null);
        try {
            await addMarker.mutateAsync({ ...fields, lon: addCoords.lon, lat: addCoords.lat });
            closePanel();
        } catch (e) {
            setSaveError(e?.message || 'Failed to save marker');
        }
    }

    async function handleUpdate(fields) {
        setSaveError(null);
        try {
            await updateMarker.mutateAsync({ id: editMarker.id, ...fields });
            closePanel();
        } catch (e) {
            setSaveError(e?.message || 'Failed to save marker');
        }
    }

    async function handleDelete() {
        if (!window.confirm(`Delete marker "${editMarker.label}"?`)) return;
        try {
            await deleteMarker.mutateAsync(editMarker.id);
            closePanel();
        } catch (e) {
            setSaveError(e?.message || 'Failed to delete marker');
        }
    }

    async function handleDeleteRow(marker, e) {
        e.stopPropagation();
        if (!window.confirm(`Delete marker "${marker.label || marker.type}"?`)) return;
        await deleteMarker.mutateAsync(marker.id);
    }

    const panelOpen = editMode && (addCoords || editMarker);

    return (
        <div className="admin-map-editor">
            <div className="admin-map-editor-toolbar">
                <button
                    className={`admin-map-edit-toggle${editMode ? ' is-on' : ''}`}
                    style={{ fontFamily: monoFont }}
                    onClick={() => { setEditMode(e => !e); closePanel(); }}
                >
                    {editMode ? '● EDIT MODE ON' : '○ EDIT MODE OFF'}
                </button>
                <span className="admin-map-editor-hint" style={{ fontFamily: monoFont }}>
                    {editMode
                        ? 'Click map to place marker · Click existing marker to edit'
                        : 'Toggle edit mode to add / edit markers'}
                </span>
                <span className="admin-map-editor-count" style={{ fontFamily: monoFont }}>
                    {isLoading ? '…' : `${markers.length} markers`}
                </span>
            </div>

            <div className="admin-map-editor-body">
                <div className="admin-map-editor-map">
                    <WorldDotMap
                        markers={markers}
                        onMarkerClick={handleMarkerClick}
                        editMode={editMode}
                        onMapClick={handleMapClick}
                        selectedMarkerId={selectedMarkerId}
                    />
                </div>

                {panelOpen && (
                    <div className="admin-map-editor-panel">
                        {addCoords && (
                            <MarkerForm
                                title="ADD MARKER"
                                coords={addCoords}
                                onSave={handleAdd}
                                onClose={closePanel}
                                isPending={addMarker.isPending}
                                error={saveError}
                                monoFont={monoFont}
                            />
                        )}
                        {editMarker && (
                            <MarkerForm
                                title="EDIT MARKER"
                                initial={editMarker}
                                onSave={handleUpdate}
                                onDelete={handleDelete}
                                onClose={closePanel}
                                isPending={updateMarker.isPending || deleteMarker.isPending}
                                error={saveError}
                                monoFont={monoFont}
                            />
                        )}
                    </div>
                )}
            </div>

            {/* Read-only marker list */}
            <div className="admin-map-marker-list">
                <div className="admin-section-title" style={{ marginTop: 32 }}>All Markers ({markers.length})</div>
                {markers.length === 0 && !isLoading && (
                    <div style={{ color: '#3a4a5e', fontFamily: monoFont, fontSize: 12, padding: '16px 0' }}>
                        No markers yet. Toggle Edit Mode and click the map to add one.
                    </div>
                )}
                {markers.map(m => (
                    <div
                        key={m.id}
                        className={`admin-map-marker-row${selectedMarkerId === m.id ? ' is-selected' : ''}`}
                        onClick={() => editMode && handleMarkerClick(m)}
                    >
                        <span className="admin-map-marker-swatch" style={{ background: m.color }} />
                        <span className="admin-map-marker-type" style={{ fontFamily: monoFont }}>{m.type}</span>
                        <span className="admin-map-marker-label">{m.label || '(no label)'}</span>
                        <span className="admin-map-marker-coords" style={{ fontFamily: monoFont }}>
                            {Number(m.lon).toFixed(2)}, {Number(m.lat).toFixed(2)}
                        </span>
                        {m.region && <span className="admin-map-marker-region">{m.region}</span>}
                        {editMode && (
                            <button
                                className="admin-map-marker-del"
                                onClick={(e) => handleDeleteRow(m, e)}
                                title="Delete marker"
                                disabled={deleteMarker.isPending}
                            >
                                ✕
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function AdminPage() {
    const { isRTL, monoFont, headFont } = useLang();

    const { session, authLoading } = useAuth();
    const myEmail = session?.user?.email || '';

    const [activeTab, setActiveTab] = useState('users');

    const { data: users = [], isLoading: usersLoading, isError: usersError } = useAdminUsers();
    const { data: dbBlueprints = [] } = useAdminBlueprints();
    const { data: plans = [] } = useAdminPlans();
    const { data: verificationQueue = [] } = useVerificationQueue();
    const { data: civicLeaderboard = [] } = useAdminCivicLeaderboard();

    const generateCodesMutation = useGenerateCodes();
    const deleteCodeMutation    = useDeleteCode();
    const setInvitesMutation    = useSetInvites();
    const seedMutation          = useSeedBlueprints();
    const promotePlanMutation   = usePromotePlan();
    const archivePlanMutation   = useArchivePlan();
    const reviewVerificationMutation = useReviewVerification();

    const [blueprintSeedMsg, setBlueprintSeedMsg] = useState('');

    async function handleGenerateCodes(userId, count) {
        await generateCodesMutation.mutateAsync({ userId, count });
    }

    async function handleDeleteCode(codeId) {
        await deleteCodeMutation.mutateAsync(codeId);
    }

    async function handleSetInvites(userId, remaining) {
        await setInvitesMutation.mutateAsync({ userId, remaining });
    }

    async function handleSeedBlueprints() {
        setBlueprintSeedMsg('');
        try {
            const json = await seedMutation.mutateAsync(Object.values(BLUEPRINTS));
            setBlueprintSeedMsg(`✓ Seeded ${json.seeded} blueprints`);
        } catch (err) {
            setBlueprintSeedMsg(`Error: ${err.message}`);
        }
    }

    // Derived stats
    const totalUsers    = users.length;
    const totalUsed     = users.reduce((acc, u) => acc + (u.invite_codes?.filter(c => c.used_by).length || 0), 0);
    const totalUnused   = users.reduce((acc, u) => acc + (u.invite_codes?.filter(c => !c.used_by).length || 0), 0);

    // Name map for display
    const nameMap = {};
    for (const u of users) {
        nameMap[u.id] = u.full_name || u.email || u.id;
    }

    // Invite tree
    const treeRoots = buildTree(users);

    // ── Render states ──

    if (authLoading || usersLoading) {
        return (
            <div className="admin-page">
                <div className="admin-loading">
                    <Spinner size="lg" />
                </div>
            </div>
        );
    }

    if (!session || usersError) {
        return (
            <div className="admin-page">
                <div className="admin-inner">
                    <div className="admin-denied">
                        <div className="admin-denied-code">403</div>
                        <div className="admin-denied-msg">Access Denied — Admin only</div>
                    </div>
                </div>
            </div>
        );
    }

    const TIER_COLORS = { LOW: '#5a6a7e', MID: '#8B5CF6', HIGH: '#ffd54f' };
    const STATUS_COLORS = { incubator: '#ffd54f', arena: '#66bb6a', archived: '#5a6a7e' };

    return (
        <div className="admin-page">
            <div className="admin-inner">

                {/* Header */}
                <div className="admin-header">
                    <div className="admin-eyebrow">Admin Panel</div>
                    <h1 className="admin-title" style={{ fontFamily: headFont }}>IranDAO Admin</h1>
                    <div className="admin-meta" style={{ fontFamily: monoFont }}>Logged in as: {myEmail}</div>
                </div>

                {/* Stats */}
                <div className="admin-stats-bar">
                    <div className="admin-stat-card">
                        <div className="admin-stat-label">Total Users</div>
                        <div className="admin-stat-value">{totalUsers}</div>
                    </div>
                    <div className="admin-stat-card">
                        <div className="admin-stat-label">Used Codes</div>
                        <div className="admin-stat-value">{totalUsed}</div>
                    </div>
                    <div className="admin-stat-card">
                        <div className="admin-stat-label">Unused Codes</div>
                        <div className="admin-stat-value">{totalUnused}</div>
                    </div>
                </div>

                {/* Tab bar */}
                <div className="admin-tab-bar">
                    {['users', 'blueprints', 'plans', 'verification', 'civic', 'map'].map(tab => (
                        <button
                            key={tab}
                            className={`admin-tab-btn${activeTab === tab ? ' admin-tab-btn--active' : ''}`}
                            onClick={() => setActiveTab(tab)}
                        >
                            {tab === 'users' && 'USERS'}
                            {tab === 'blueprints' && 'BLUEPRINTS'}
                            {tab === 'plans' && 'PLANS'}
                            {tab === 'verification' && 'VERIFICATION'}
                            {tab === 'civic' && 'CIVIC SCORES'}
                            {tab === 'map' && 'MAP'}
                        </button>
                    ))}
                </div>

                {/* ── USERS TAB ── */}
                {activeTab === 'users' && (
                    <>
                        <div className="admin-section-title">Registered Users</div>
                        <div className="admin-table-wrap">
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Country</th>
                                        <th>Type</th>
                                        <th>Invited By</th>
                                        <th>Codes Left</th>
                                        <th>Registered</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.length === 0 && (
                                        <tr>
                                            <td colSpan={8} style={{ textAlign: 'center', color: '#3a4a5e', padding: '32px' }}>
                                                No users registered yet.
                                            </td>
                                        </tr>
                                    )}
                                    {users.map(user => (
                                        <UserRow
                                            key={user.id}
                                            user={user}
                                            nameMap={nameMap}
                                            onGenerateCodes={handleGenerateCodes}
                                            onSetInvites={handleSetInvites}
                                            onDeleteCode={handleDeleteCode}
                                        />
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="admin-section-title">Invite Tree</div>
                        <div className="admin-tree">
                            {treeRoots.length === 0 && (
                                <div style={{ color: '#3a4a5e', fontFamily: 'intelone-mono, monospace', fontSize: 12 }}>
                                    No users yet.
                                </div>
                            )}
                            {treeRoots.map(node => (
                                <TreeNode key={node.id} node={node} depth={0} />
                            ))}
                        </div>
                    </>
                )}

                {/* ── BLUEPRINTS TAB ── */}
                {activeTab === 'blueprints' && (
                    <>
                        <div className="admin-section-title" style={{ marginTop: 40 }}>Blueprints</div>
                        <div className="admin-blueprints-bar">
                            <button
                                className="admin-action-btn"
                                onClick={handleSeedBlueprints}
                                disabled={seedMutation.isPending}
                                style={{ fontFamily: monoFont }}
                            >
                                {seedMutation.isPending ? '...' : '↑ Sync official blueprints from data.js'}
                            </button>
                            {blueprintSeedMsg && (
                                <span className="admin-seed-msg" style={{ fontFamily: monoFont }}>{blueprintSeedMsg}</span>
                            )}
                        </div>
                        <div className="admin-table-wrap">
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Name (EN)</th>
                                        <th>Official</th>
                                        <th>Sectors</th>
                                        <th>Connections</th>
                                        <th>Force Layout</th>
                                        <th>Owner</th>
                                        <th>Forked From</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {dbBlueprints.length === 0 && (
                                        <tr>
                                            <td colSpan={8} style={{ textAlign: 'center', color: '#3a4a5e', padding: '32px' }}>
                                                No blueprints in DB. Click "Sync" to seed official blueprints.
                                            </td>
                                        </tr>
                                    )}
                                    {dbBlueprints.map(bp => (
                                        <tr key={bp.id}>
                                            <td className="admin-td-mono" style={{ fontSize: 11 }}>{bp.id}</td>
                                            <td>{bp.name?.en || '—'}</td>
                                            <td style={{ color: bp.isOfficial ? '#8B5CF6' : '#3a4a5e' }}>
                                                {bp.isOfficial ? '✓' : 'fork'}
                                            </td>
                                            <td>{bp.sectors?.length ?? 0}</td>
                                            <td>{bp.connections?.length ?? 0}</td>
                                            <td style={{ color: bp.useForceLayout ? '#66bb6a' : '#3a4a5e' }}>
                                                {bp.useForceLayout ? 'yes' : 'no'}
                                            </td>
                                            <td style={{ color: '#3a4a5e', fontSize: 10 }}>
                                                {bp.ownerId ? bp.ownerId.slice(0, 8) + '…' : '—'}
                                            </td>
                                            <td style={{ color: '#3a4a5e', fontSize: 10 }}>
                                                {bp.forkedFrom || '—'}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}

                {/* ── PLANS TAB ── */}
                {activeTab === 'plans' && (
                    <>
                        <div className="admin-section-title" style={{ marginTop: 40 }}>Transitional Plans</div>
                        <div className="admin-table-wrap">
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>Title</th>
                                        <th>Status</th>
                                        <th>Endorsements</th>
                                        <th>Created</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {plans.length === 0 && (
                                        <tr>
                                            <td colSpan={5} style={{ textAlign: 'center', color: '#3a4a5e', padding: '32px' }}>
                                                No plans found.
                                            </td>
                                        </tr>
                                    )}
                                    {plans.map(plan => (
                                        <tr key={plan.id}>
                                            <td className="admin-td-name">{plan.title || '—'}</td>
                                            <td>
                                                <span className="admin-status-badge" style={{ color: STATUS_COLORS[plan.status] ?? '#8a9bb0', borderColor: STATUS_COLORS[plan.status] ?? '#8a9bb0' }}>
                                                    {plan.status}
                                                </span>
                                            </td>
                                            <td className="admin-td-mono">{plan.endorsement_count ?? 0}</td>
                                            <td>{formatDate(plan.created_at)}</td>
                                            <td>
                                                <div className="admin-actions-cell">
                                                    {plan.status === 'incubator' && (
                                                        <button
                                                            className="admin-action-btn"
                                                            disabled={promotePlanMutation.isPending}
                                                            onClick={() => promotePlanMutation.mutate(plan.id)}
                                                        >
                                                            Promote
                                                        </button>
                                                    )}
                                                    {plan.status !== 'archived' && (
                                                        <button
                                                            className="admin-action-btn admin-action-btn--danger"
                                                            disabled={archivePlanMutation.isPending}
                                                            onClick={() => archivePlanMutation.mutate(plan.id)}
                                                        >
                                                            Archive
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}

                {/* ── VERIFICATION TAB ── */}
                {activeTab === 'verification' && (
                    <>
                        <div className="admin-section-title" style={{ marginTop: 40 }}>Verification Queue</div>
                        <div className="admin-table-wrap">
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>User</th>
                                        <th>Type</th>
                                        <th>File</th>
                                        <th>Submitted</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {verificationQueue.length === 0 && (
                                        <tr>
                                            <td colSpan={5} style={{ textAlign: 'center', color: '#3a4a5e', padding: '32px' }}>
                                                No pending verifications.
                                            </td>
                                        </tr>
                                    )}
                                    {verificationQueue.map(item => (
                                        <tr key={item.id}>
                                            <td>
                                                <div className="admin-td-name">{item.profiles?.full_name || '—'}</div>
                                                <div className="admin-td-email">{item.profiles?.email || '—'}</div>
                                            </td>
                                            <td>
                                                <span className="admin-status-badge" style={{ color: '#8B5CF6', borderColor: 'rgba(139,92,246,0.3)' }}>
                                                    {item.type === 'id_document' ? 'ID' : item.type?.toUpperCase()}
                                                </span>
                                            </td>
                                            <td>
                                                {item.file_url
                                                    ? <a href={item.file_url} target="_blank" rel="noopener noreferrer" className="admin-link">VIEW</a>
                                                    : '—'}
                                            </td>
                                            <td>{formatDate(item.created_at)}</td>
                                            <td>
                                                <div className="admin-actions-cell">
                                                    <button
                                                        className="admin-action-btn"
                                                        disabled={reviewVerificationMutation.isPending}
                                                        onClick={() => reviewVerificationMutation.mutate({ queueId: item.id, action: 'approved' })}
                                                    >
                                                        Approve
                                                    </button>
                                                    <button
                                                        className="admin-action-btn admin-action-btn--danger"
                                                        disabled={reviewVerificationMutation.isPending}
                                                        onClick={() => reviewVerificationMutation.mutate({ queueId: item.id, action: 'rejected' })}
                                                    >
                                                        Reject
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}

                {/* ── MAP TAB ── */}
                {activeTab === 'map' && (
                    <MapEditorTab monoFont={monoFont} />
                )}

                {/* ── CIVIC SCORES TAB ── */}
                {activeTab === 'civic' && (
                    <>
                        <div className="admin-section-title" style={{ marginTop: 40 }}>Civic Score Leaderboard</div>
                        <div className="admin-table-wrap">
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>Rank</th>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Civic Score</th>
                                        <th>Trust Tier</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {civicLeaderboard.length === 0 && (
                                        <tr>
                                            <td colSpan={5} style={{ textAlign: 'center', color: '#3a4a5e', padding: '32px' }}>
                                                No scores recorded yet.
                                            </td>
                                        </tr>
                                    )}
                                    {civicLeaderboard.map((entry, idx) => (
                                        <tr key={entry.id}>
                                            <td className="admin-td-mono" style={{ color: idx < 3 ? '#ffd54f' : '#5a6a7e' }}>
                                                #{idx + 1}
                                            </td>
                                            <td className="admin-td-name">{entry.full_name || '—'}</td>
                                            <td className="admin-td-email">{entry.email || '—'}</td>
                                            <td className="admin-td-mono" style={{ color: '#8B5CF6' }}>{entry.civic_score ?? 0}</td>
                                            <td>
                                                <span className="admin-status-badge" style={{ color: TIER_COLORS[entry.trust_tier] ?? '#5a6a7e', borderColor: TIER_COLORS[entry.trust_tier] ?? '#5a6a7e' }}>
                                                    {entry.trust_tier || 'LOW'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}

            </div>
        </div>
    );
}
