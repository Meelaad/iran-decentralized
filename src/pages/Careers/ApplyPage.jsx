import React, { useState, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Turnstile } from '@marsidev/react-turnstile';
import { useLang } from '../../contexts/LangContext.jsx';
import './CareersPage.css'; // Reusing the same CSS file

const TURNSTILE_SITEKEY = import.meta.env.VITE_CONTACT_TURNSTILE_SITE_KEY;

export default function ApplyPage() {
    const { tKey, isRTL, monoFont, headFont } = useLang();
    const [searchParams] = useSearchParams();

    // Auto-select role if passed in URL (e.g. /apply?role=frontend)
    const initialRole = searchParams.get('role') || 'frontend';

    const [formData, setFormData] = useState({
        role: initialRole,
        alias: '',
        contact: '',
        proof: '',
        message: ''
    });

    const [status, setStatus] = useState('idle'); // idle, loading, success, error
    const [errorMsg, setErrorMsg] = useState('');
    const [captchaToken, setCaptchaToken] = useState(null);
    const turnstileRef = useRef(null);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    async function handleSubmit(e) {
        e.preventDefault();
        if (!captchaToken) {
            setErrorMsg(tKey('careers.errValidation'));
            return;
        }

        setStatus('loading');
        try {
            const res = await fetch('/api/apply/apply', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...formData, captchaToken }),
            });
            const data = await res.json();

            if (!res.ok) throw new Error(data.error || 'Transmission failed');

            setStatus('success');
        } catch (err) {
            setStatus('error');
            setErrorMsg(err.message);
            if (turnstileRef.current) turnstileRef.current.reset();
            setCaptchaToken(null);
        }
    }

    if (status === 'success') {
        return (
            <div className="careers-page" dir={isRTL ? 'rtl' : 'ltr'}>
                <div className="careers-inner apply-success-box">
                    <span className="apply-success-icon">⬡</span>
                    <h1 style={{ fontFamily: headFont }}>{tKey('careers.successApp')}</h1>
                    <p style={{ fontFamily: monoFont }}>{tKey('careers.successAppSub')}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="careers-page apply-page" dir={isRTL ? 'rtl' : 'ltr'}>
            <div className="careers-bg-grid" />
            <div className="careers-scanline" />

            <div className="careers-inner apply-container">
                <header className="careers-header">
                    <div className="careers-eyebrow" style={{ fontFamily: monoFont, display: 'flex', justifyContent: 'center', gap: '1rem' }}>
                        <span>[SYS_OK]</span>
                        <span>{tKey('careers.applyEyebrow')}</span>
                        <span>[E2E_ENCRYPTED]</span>
                    </div>
                    <h1 className="careers-title" style={{ fontFamily: headFont }}>
                        {tKey('careers.applyTitle')}
                    </h1>

                    {/* Decorative Terminal Output */}
                    <div style={{ fontFamily: monoFont, color: '#475569', fontSize: '0.75rem', marginBottom: '1.5rem', textAlign: isRTL ? 'right' : 'left', opacity: 0.7 }}>
                        <p>SESSION_ID: 0x{Math.random().toString(16).slice(2, 10).toUpperCase()}</p>
                        <p>HANDSHAKE: VERIFIED_ED25519</p>
                    </div>

                    <p className="careers-subtitle" style={{ fontFamily: monoFont, fontSize: '0.85rem' }}>
                        {tKey('careers.applySub')}
                    </p>
                </header>

                <form className="apply-form" onSubmit={handleSubmit}>
                    {status === 'error' && (
                        <div className="apply-error" style={{ fontFamily: monoFont }}>
                            [ERROR]: {errorMsg}
                        </div>
                    )}

                    <div className="apply-field">
                        <label style={{ fontFamily: monoFont }}>{tKey('careers.formRole')}</label>
                        <select name="role" value={formData.role} onChange={handleChange} className="apply-input">
                            <option value="blockchain">Lead Protocol Sovereign & Strategic Governor</option>
                            <option value="frontend">Lead Sovereign Interface Architect</option>
                            <option value="smartContract">Protocol Consensus Engineer (L1/L2)</option>
                            <option value="policy">Cyber-Legislative Strategist</option>
                        </select>
                    </div>

                    <div className="apply-field">
                        <label style={{ fontFamily: monoFont }}>{tKey('careers.formAlias')}</label>
                        <input required type="text" name="alias" value={formData.alias} onChange={handleChange} className="apply-input" maxLength="50" />
                    </div>

                    <div className="apply-field">
                        <label style={{ fontFamily: monoFont }}>{tKey('careers.formContact')}</label>
                        <input required type="text" name="contact" value={formData.contact} onChange={handleChange} className="apply-input" placeholder={tKey('careers.placeholderContact')} maxLength="100" />
                    </div>

                    <div className="apply-field">
                        <label style={{ fontFamily: monoFont }}>{tKey('careers.formProof')}</label>
                        <input required type="url" name="proof" value={formData.proof} onChange={handleChange} className="apply-input" placeholder="https://github.com/..." maxLength="200" />
                    </div>

                    <div className="apply-field">
                        <label style={{ fontFamily: monoFont }}>{tKey('careers.formMessage')}</label>
                        <textarea required name="message" value={formData.message} onChange={handleChange} className="apply-input" rows="5" maxLength="3000" />
                    </div>

                    <div className="apply-captcha">
                        <Turnstile
                            ref={turnstileRef}
                            siteKey={TURNSTILE_SITEKEY}
                            onSuccess={(token) => setCaptchaToken(token)}
                            options={{ theme: 'dark' }}
                        />
                    </div>

                    <button type="submit" className="apply-submit-btn" disabled={status === 'loading' || !captchaToken} style={{ fontFamily: monoFont }}>
                        {status === 'loading' ? 'ENCRYPTING...' : tKey('careers.submitApp')}
                    </button>
                </form>
            </div>
        </div>
    );
}