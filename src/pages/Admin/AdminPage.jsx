import React, { useEffect, useState, useCallback } from 'react';
import { supabase } from '../../lib/supabase';
import { useLang } from '../../contexts/LangContext';
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
                    <rect x="1" y="3.5" width="7" height="8.5" rx="1" stroke="currentColor" strokeWidth="1.2" fill="rgba(2,4,8,0.92)"/>
                  </svg>
            }
        </button>
    );
}

function UserRow({ user, nameMap, onGenerateCodes, onSetInvites, onDeleteCode }) {
    const [expanded, setExpanded] = useState(false);
    const [inviteInput, setInviteInput] = useState(String(user.invite_codes_remaining ?? 0));
    const [working, setWorking] = useState(false);

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
                <td className="admin-td-mono" style={{ color: user.invite_codes_remaining === 0 ? '#3a4a5e' : '#4fc3f7' }}>
                    {user.invite_codes_remaining}
                </td>
                <td>{formatDate(user.created_at)}</td>
                <td>
                    <div className="admin-actions-cell">
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
                            <div style={{ color: '#3a4a5e', fontFamily: 'IBM Plex Mono, monospace', fontSize: 11, marginTop: 16 }}>
                                No metadata recorded.
                            </div>
                        )}
                    </td>
                </tr>
            )}
        </>
    );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function AdminPage() {
    const { isRTL } = useLang();
    const monoFont   = { fontFamily: "'IBM Plex Mono', monospace" };
    const headingFont = { fontFamily: isRTL ? "'Vazirmatn', sans-serif" : "'Inter', sans-serif" };

    const [status, setStatus]   = useState('loading'); // 'loading' | 'denied' | 'ok'
    const [users, setUsers]     = useState([]);
    const [myEmail, setMyEmail] = useState('');
    const [token, setToken]     = useState('');

    const fetchUsers = useCallback(async (bearerToken) => {
        const res = await fetch('/api/admin/users', {
            headers: { Authorization: `Bearer ${bearerToken}` },
        });
        if (res.status === 401 || res.status === 403) {
            setStatus('denied');
            return;
        }
        if (!res.ok) {
            setStatus('denied');
            return;
        }
        const data = await res.json();
        setUsers(data);
        setStatus('ok');
    }, []);

    useEffect(() => {
        supabase.auth.getSession().then(({ data }) => {
            const session = data.session;
            if (!session) { setStatus('denied'); return; }
            setMyEmail(session.user.email || '');
            setToken(session.access_token);
            fetchUsers(session.access_token);
        });
    }, [fetchUsers]);

    async function handleGenerateCodes(userId, count) {
        await fetch('/api/admin/generate-codes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ user_id: userId, count }),
        });
        await fetchUsers(token);
    }

    async function handleDeleteCode(codeId) {
        await fetch('/api/admin/delete-code', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ code_id: codeId }),
        });
        await fetchUsers(token);
    }

    async function handleSetInvites(userId, remaining) {
        await fetch('/api/admin/update-invites', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ user_id: userId, remaining }),
        });
        await fetchUsers(token);
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

    if (status === 'loading') {
        return (
            <div className="admin-page">
                <div className="admin-loading">
                    <div className="admin-spinner" />
                </div>
            </div>
        );
    }

    if (status === 'denied') {
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

    return (
        <div className="admin-page">
            <div className="admin-inner">

                {/* Header */}
                <div className="admin-header">
                    <div className="admin-eyebrow">Admin Panel</div>
                    <h1 className="admin-title" style={headingFont}>IranDAO Admin</h1>
                    <div className="admin-meta" style={monoFont}>Logged in as: {myEmail}</div>
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

                {/* User table */}
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

                {/* Invite tree */}
                <div className="admin-section-title">Invite Tree</div>
                <div className="admin-tree">
                    {treeRoots.length === 0 && (
                        <div style={{ color: '#3a4a5e', fontFamily: 'IBM Plex Mono, monospace', fontSize: 12 }}>
                            No users yet.
                        </div>
                    )}
                    {treeRoots.map(node => (
                        <TreeNode key={node.id} node={node} depth={0} />
                    ))}
                </div>

            </div>
        </div>
    );
}
