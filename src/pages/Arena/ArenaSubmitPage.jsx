import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLang } from '../../contexts/LangContext';
import { useAuth } from '../../hooks/useAuth';
import { useSubmitPlan } from '../../hooks/usePlans';
import './ArenaSubmitPage.css';
import CONTENT from '../../locales/pages/arena-submit.json';

const THRESHOLD = 10_000;

const TITLE_REGEX = /^[\u0600-\u06FFa-zA-Z0-9\s\u200c\-.,:()'"/&—–]+$/;
const MIN_TITLE = 5;
const MIN_SUMMARY = 50;

export default function ArenaSubmitPage() {
    const { t, isRTL, headFont } = useLang();
    const { session, authLoading } = useAuth();
    const navigate = useNavigate();
    const submitMutation = useSubmitPlan();

    const [form, setForm] = useState({
        title_en: '',
        title_fa: '',
        summary_en: '',
        summary_fa: '',
        full_doc_url: '',
    });
    const [error, setError] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const dir = isRTL ? 'rtl' : 'ltr';
    const rootStyle = { fontFamily: headFont };

    function set(field, value) {
        setForm(f => ({ ...f, [field]: value }));
    }

    function validate() {
        const title = form.title_en.trim();
        const summary = form.summary_en.trim();
        const url = form.full_doc_url.trim();

        if (!title) return t(CONTENT.validateTitleRequired);
        if (title.length < MIN_TITLE) return t(CONTENT.validateTitleShort).replace('{n}', MIN_TITLE);
        if (!TITLE_REGEX.test(title)) return t(CONTENT.validateTitleInvalid);

        if (!summary) return t(CONTENT.validateSummaryRequired);
        if (summary.length < MIN_SUMMARY) return t(CONTENT.validateSummaryShort).replace('{n}', MIN_SUMMARY);

        if (url && !url.startsWith('https://')) return t(CONTENT.validateUrlHttps);

        return null;
    }

    function friendlyError(msg) {
        if (!msg) return t(CONTENT.errSubmitDefault);
        const m = msg.toLowerCase();
        if (m.includes('civic') || m.includes('score'))
            return t(CONTENT.errCivicScore);
        if (m.includes('unauthorized') || m.includes('401'))
            return t(CONTENT.errUnauthorized);
        if (m.includes('duplicate') || m.includes('already exists') || m.includes('unique'))
            return t(CONTENT.errDuplicate);
        if (m.includes('title') && (m.includes('character') || m.includes('invalid')))
            return t(CONTENT.errTitleInvalid);
        if (m.includes('summary') && m.includes('character'))
            return t(CONTENT.errSummaryShort);
        if (m.includes('https'))
            return t(CONTENT.errUrlHttps);
        return t(CONTENT.errSubmitRetry);
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setError('');
        const validationError = validate();
        if (validationError) { setError(validationError); return; }
        try {
            await submitMutation.mutateAsync({
                title_en: form.title_en.trim(),
                title_fa: form.title_fa.trim() || '',
                summary_en: form.summary_en.trim(),
                summary_fa: form.summary_fa.trim() || '',
                full_doc_url: form.full_doc_url.trim() || '',
            });
            setSubmitted(true);
        } catch (err) {
            setError(friendlyError(err.message));
        }
    }

    if (authLoading) return null;

    if (!session) {
        return (
            <div className="as-page" dir={dir} style={rootStyle}>
                <div className="as-inner">
                    <div className="as-login-gate">
                        <div className="as-login-icon">🔒</div>
                        <h2 className="as-login-title">
                            {t(CONTENT.loginGateTitle)}
                        </h2>
                        <p className="as-login-desc">
                            {t(CONTENT.loginGateDesc)}
                        </p>
                        <Link to="/login" className="as-login-btn">
                            {t(CONTENT.loginGateBtn)}
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    if (submitted) {
        return (
            <div className="as-page" dir={dir} style={rootStyle}>
                <div className="as-inner">
                    <div className="as-success">
                        <div className="as-success-icon">✓</div>
                        <h2 className="as-success-title">
                            {t(CONTENT.successTitle)}
                        </h2>
                        <p className="as-success-desc">
                            {t(CONTENT.successDesc).replace('{n}', THRESHOLD.toLocaleString())}
                        </p>
                        <div className="as-success-actions">
                            <Link to="/arena" className="as-success-btn">
                                {t(CONTENT.successBackBtn)}
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="as-page" dir={dir} style={rootStyle}>
            <div className="as-inner">
                <nav className="as-breadcrumb">
                    <Link to="/arena" className="as-breadcrumb-link">
                        {t(CONTENT.breadcrumbArena)}
                    </Link>
                    <span className="as-breadcrumb-sep">/</span>
                    <span>{t(CONTENT.breadcrumbSubmit)}</span>
                </nav>

                <header className="as-header">
                    <h1 className="as-title">
                        {t(CONTENT.pageTitle)}
                    </h1>
                    <p className="as-subtitle">
                        {t(CONTENT.pageSubtitle).replace('{n}', THRESHOLD.toLocaleString())}
                    </p>
                    <div className="as-requirement">
                        <span className="as-req-dot" />
                        {t(CONTENT.requirementNote)}
                    </div>
                </header>

                <form className="as-form" onSubmit={handleSubmit}>
                    <div className="as-section-label">
                        {t(CONTENT.sectionTitle)}
                    </div>

                    <div className="as-field">
                        <label className="as-label" htmlFor="title_en">
                            {t(CONTENT.labelTitleEn)}
                        </label>
                        <input
                            id="title_en"
                            className="as-input"
                            type="text"
                            dir="ltr"
                            placeholder={t(CONTENT.placeholderTitleEn)}
                            value={form.title_en}
                            onChange={e => set('title_en', e.target.value)}
                            maxLength={120}
                        />
                    </div>

                    <div className="as-field">
                        <label className="as-label" htmlFor="title_fa">
                            {t(CONTENT.labelTitleFa)}
                        </label>
                        <input
                            id="title_fa"
                            className="as-input"
                            type="text"
                            dir="rtl"
                            placeholder={t(CONTENT.placeholderTitleFa)}
                            value={form.title_fa}
                            onChange={e => set('title_fa', e.target.value)}
                            maxLength={120}
                        />
                    </div>

                    <div className="as-section-label">
                        {t(CONTENT.sectionSummary)}
                    </div>

                    <div className="as-field">
                        <label className="as-label" htmlFor="summary_en">
                            {t(CONTENT.labelSummaryEn)}
                        </label>
                        <textarea
                            id="summary_en"
                            className="as-textarea"
                            dir="ltr"
                            rows={5}
                            placeholder={t(CONTENT.placeholderSummaryEn)}
                            value={form.summary_en}
                            onChange={e => set('summary_en', e.target.value)}
                            maxLength={2000}
                        />
                        <span className="as-char-count">
                            {form.summary_en.length}/2000
                            {form.summary_en.length < MIN_SUMMARY && form.summary_en.length > 0 && (
                                <span className="as-char-min"> — {t(CONTENT.charMin).replace('{n}', MIN_SUMMARY)}</span>
                            )}
                        </span>
                    </div>

                    <div className="as-field">
                        <label className="as-label" htmlFor="summary_fa">
                            {t(CONTENT.labelSummaryFa)}
                        </label>
                        <textarea
                            id="summary_fa"
                            className="as-textarea"
                            dir="rtl"
                            rows={5}
                            placeholder={t(CONTENT.placeholderSummaryFa)}
                            value={form.summary_fa}
                            onChange={e => set('summary_fa', e.target.value)}
                            maxLength={2000}
                        />
                        <span className="as-char-count">{form.summary_fa.length}/2000</span>
                    </div>

                    <div className="as-section-label">
                        {t(CONTENT.sectionDocs)}
                    </div>

                    <div className="as-field">
                        <label className="as-label" htmlFor="full_doc_url">
                            {t(CONTENT.labelDocUrl)}
                        </label>
                        <input
                            id="full_doc_url"
                            className="as-input"
                            type="url"
                            dir="ltr"
                            placeholder="https://..."
                            value={form.full_doc_url}
                            onChange={e => set('full_doc_url', e.target.value)}
                        />
                        <span className="as-field-hint">
                            {t(CONTENT.docUrlHint)}
                        </span>
                    </div>

                    {error && <div className="as-error">{error}</div>}

                    <div className="as-form-footer">
                        <button
                            type="submit"
                            className="as-submit-btn"
                            disabled={submitMutation.isPending}
                        >
                            {submitMutation.isPending
                                ? t(CONTENT.submitBtnPending)
                                : t(CONTENT.submitBtn)}
                        </button>
                        <Link to="/arena" className="as-cancel-link">
                            {t(CONTENT.cancelLink)}
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}