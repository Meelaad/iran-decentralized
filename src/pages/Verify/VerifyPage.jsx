import React, { useState, useRef } from 'react';
import { useLang } from '../../contexts/LangContext';
import { supabase } from '../../lib/supabase';
import './VerifyPage.css';

async function getAuthHeader() {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return null;
    return { Authorization: `Bearer ${session.access_token}` };
}

async function postJSON(path, body, headers = {}) {
    const res = await fetch(path, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...headers },
        body: JSON.stringify(body),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || res.statusText);
    return json;
}

async function uploadFile(file, bucket, folder) {
    const ext = file.name.split('.').pop();
    const path = `${folder}/${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from(bucket).upload(path, file, { upsert: false });
    if (error) throw new Error(error.message);
    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    return data.publicUrl;
}

function MethodCard({ title, desc, badge, children, done }) {
    return (
        <div className={`vp-card${done ? ' vp-card--done' : ''}`}>
            <div className="vp-card-header">
                <span className="vp-card-title">{title}</span>
                <span className="vp-card-badge">{badge}</span>
            </div>
            <p className="vp-card-desc">{desc}</p>
            {children}
        </div>
    );
}

export default function VerifyPage() {
    const { tKey, isRTL, headFont } = useLang();

    const [user, setUser] = useState(() => {
        supabase.auth.getUser().then(({ data }) => setUser(data?.user ?? null));
        return undefined;
    });

    // institutional email
    const [instEmail, setInstEmail]   = useState('');
    const [instStatus, setInstStatus] = useState(null); // null | 'loading' | 'ok' | string(err)

    // photo
    const photoRef = useRef();
    const [photoFile, setPhotoFile]     = useState(null);
    const [photoStatus, setPhotoStatus] = useState(null);

    // ID
    const idRef = useRef();
    const [idFile, setIdFile]     = useState(null);
    const [idStatus, setIdStatus] = useState(null);

    async function submitInstitutional(e) {
        e.preventDefault();
        setInstStatus('loading');
        try {
            const headers = await getAuthHeader();
            if (!headers) { setInstStatus(tKey('verify.loginRequired')); return; }
            await postJSON('/api/users/verify-institutional', { email: instEmail }, headers);
            setInstStatus('ok');
        } catch (err) {
            const msg = err.message || '';
            setInstStatus(msg.includes('Domain') ? tKey('verify.institutionalBadDomain') : msg);
        }
    }

    async function submitPhoto(e) {
        e.preventDefault();
        if (!photoFile) return;
        setPhotoStatus('loading');
        try {
            const headers = await getAuthHeader();
            if (!headers) { setPhotoStatus(tKey('verify.loginRequired')); return; }
            const fileUrl = await uploadFile(photoFile, 'verifications', 'photos');
            await postJSON('/api/users/verify-photo', { fileUrl }, headers);
            setPhotoStatus('ok');
        } catch (err) {
            setPhotoStatus(err.message);
        }
    }

    async function submitId(e) {
        e.preventDefault();
        if (!idFile) return;
        setIdStatus('loading');
        try {
            const headers = await getAuthHeader();
            if (!headers) { setIdStatus(tKey('verify.loginRequired')); return; }
            const fileUrl = await uploadFile(idFile, 'verifications', 'ids');
            await postJSON('/api/users/verify-id', { fileUrl }, headers);
            setIdStatus('ok');
        } catch (err) {
            setIdStatus(err.message);
        }
    }

    if (user === undefined) return null; // hydrating

    if (!user) {
        return (
            <div className="vp-root" dir={isRTL ? 'rtl' : 'ltr'} style={{ fontFamily: headFont }}>
                <div className="vp-login-wall">
                    <p>{tKey('verify.loginRequired')}</p>
                    <a href="/login" className="vp-login-btn">{tKey('verify.loginCTA')}</a>
                </div>
            </div>
        );
    }

    return (
        <div className="vp-root" dir={isRTL ? 'rtl' : 'ltr'} style={{ fontFamily: headFont }}>
            <h1 className="vp-title">{tKey('verify.title')}</h1>
            <p className="vp-sub">{tKey('verify.sub')}</p>

            <div className="vp-grid">
                {/* Institutional Email */}
                <MethodCard
                    title={tKey('verify.institutionalTitle')}
                    desc={tKey('verify.institutionalDesc')}
                    badge={tKey('verify.scoreReward', { n: 2 })}
                    done={instStatus === 'ok'}
                >
                    {instStatus === 'ok' ? (
                        <p className="vp-success">{tKey('verify.institutionalSuccess')}</p>
                    ) : (
                        <form onSubmit={submitInstitutional} className="vp-form">
                            <label className="vp-label">{tKey('verify.institutionalLabel')}</label>
                            <input
                                type="email"
                                className="vp-input"
                                value={instEmail}
                                onChange={e => setInstEmail(e.target.value)}
                                placeholder="you@university.edu"
                                required
                                disabled={instStatus === 'loading'}
                            />
                            {instStatus && instStatus !== 'loading' && (
                                <p className="vp-error">{instStatus}</p>
                            )}
                            <button
                                type="submit"
                                className="vp-submit"
                                disabled={instStatus === 'loading' || !instEmail}
                            >
                                {instStatus === 'loading' ? '…' : tKey('verify.institutionalSubmit')}
                            </button>
                        </form>
                    )}
                </MethodCard>

                {/* Photo */}
                <MethodCard
                    title={tKey('verify.photoTitle')}
                    desc={tKey('verify.photoDesc')}
                    badge={tKey('verify.scoreReward', { n: 1 })}
                    done={photoStatus === 'ok'}
                >
                    {photoStatus === 'ok' ? (
                        <p className="vp-success">{tKey('verify.photoSuccess')}</p>
                    ) : (
                        <form onSubmit={submitPhoto} className="vp-form">
                            <label className="vp-label">{tKey('verify.photoLabel')}</label>
                            <div
                                className={`vp-dropzone${photoFile ? ' vp-dropzone--has-file' : ''}`}
                                onClick={() => photoRef.current?.click()}
                            >
                                {photoFile ? photoFile.name : '📷'}
                                <input
                                    ref={photoRef}
                                    type="file"
                                    accept="image/*"
                                    className="vp-file-input"
                                    onChange={e => setPhotoFile(e.target.files[0] || null)}
                                    disabled={photoStatus === 'loading'}
                                />
                            </div>
                            {photoStatus && photoStatus !== 'loading' && (
                                <p className="vp-error">{photoStatus}</p>
                            )}
                            <button
                                type="submit"
                                className="vp-submit"
                                disabled={photoStatus === 'loading' || !photoFile}
                            >
                                {photoStatus === 'loading' ? '…' : tKey('verify.photoSubmit')}
                            </button>
                        </form>
                    )}
                </MethodCard>

                {/* Government ID */}
                <MethodCard
                    title={tKey('verify.idTitle')}
                    desc={tKey('verify.idDesc')}
                    badge={tKey('verify.scoreReward', { n: 3 })}
                    done={idStatus === 'ok'}
                >
                    {idStatus === 'ok' ? (
                        <p className="vp-success">{tKey('verify.idSuccess')}</p>
                    ) : (
                        <form onSubmit={submitId} className="vp-form">
                            <label className="vp-label">{tKey('verify.idLabel')}</label>
                            <div
                                className={`vp-dropzone${idFile ? ' vp-dropzone--has-file' : ''}`}
                                onClick={() => idRef.current?.click()}
                            >
                                {idFile ? idFile.name : '🪪'}
                                <input
                                    ref={idRef}
                                    type="file"
                                    accept="image/*,.pdf"
                                    className="vp-file-input"
                                    onChange={e => setIdFile(e.target.files[0] || null)}
                                    disabled={idStatus === 'loading'}
                                />
                            </div>
                            {idStatus && idStatus !== 'loading' && (
                                <p className="vp-error">{idStatus}</p>
                            )}
                            <button
                                type="submit"
                                className="vp-submit"
                                disabled={idStatus === 'loading' || !idFile}
                            >
                                {idStatus === 'loading' ? '…' : tKey('verify.idSubmit')}
                            </button>
                        </form>
                    )}
                </MethodCard>

                {/* Phone — coming soon */}
                <MethodCard
                    title={tKey('verify.phoneTitle')}
                    desc={tKey('verify.phoneDesc')}
                    badge={tKey('verify.scoreReward', { n: 2 })}
                >
                    <button className="vp-submit vp-submit--disabled" disabled>
                        {tKey('verify.comingSoon')}
                    </button>
                </MethodCard>
            </div>
        </div>
    );
}
