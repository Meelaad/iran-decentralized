import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLang } from '../../contexts/LangContext';
import { useAuth } from '../../hooks/useAuth';
import { useSubmitPlan } from '../../hooks/usePlans';
import './ArenaSubmitPage.css';

const THRESHOLD = 10_000;

const TITLE_REGEX = /^[\u0600-\u06FFa-zA-Z0-9\s\u200c\-.,:()'"/&—–]+$/;
const MIN_TITLE = 5;
const MIN_SUMMARY = 50;

export default function ArenaSubmitPage() {
    const { isRTL } = useLang();
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

    function set(field, value) {
        setForm(f => ({ ...f, [field]: value }));
    }

    function validate() {
        const title = form.title_en.trim();
        const summary = form.summary_en.trim();
        const url = form.full_doc_url.trim();

        if (!title) return isRTL ? 'عنوان انگلیسی الزامی است.' : 'English title is required.';
        if (title.length < MIN_TITLE) return isRTL ? `عنوان باید حداقل ${MIN_TITLE} کاراکتر داشته باشد.` : `Title must be at least ${MIN_TITLE} characters.`;
        if (!TITLE_REGEX.test(title)) return isRTL ? 'عنوان انگلیسی شامل کاراکترهای غیرمجاز است.' : 'English title contains invalid characters.';

        if (!summary) return isRTL ? 'خلاصه انگلیسی الزامی است.' : 'English summary is required.';
        if (summary.length < MIN_SUMMARY) return isRTL ? `خلاصه باید حداقل ${MIN_SUMMARY} کاراکتر داشته باشد.` : `Summary must be at least ${MIN_SUMMARY} characters.`;

        if (url && !url.startsWith('https://')) return isRTL ? 'لینک سند باید با https:// شروع شود.' : 'Document URL must start with https://.';

        return null;
    }

    function friendlyError(msg, rtl) {
        if (!msg) return rtl ? 'خطا در ارسال طرح.' : 'Failed to submit plan.';
        const m = msg.toLowerCase();
        if (m.includes('civic') || m.includes('score'))
            return rtl
                ? 'امتیاز مدنی شما کافی نیست. برای ارسال طرح به حداقل ۴ امتیاز مدنی نیاز دارید.'
                : 'Insufficient civic score. You need at least 4 civic score points to submit a plan.';
        if (m.includes('unauthorized') || m.includes('401'))
            return rtl ? 'لطفاً ابتدا وارد شوید.' : 'Please sign in to submit a plan.';
        if (m.includes('duplicate') || m.includes('already exists') || m.includes('unique'))
            return rtl ? 'طرحی با این عنوان قبلاً ارسال شده است.' : 'A plan with this title already exists.';
        if (m.includes('title') && (m.includes('character') || m.includes('invalid')))
            return rtl ? 'عنوان انگلیسی نامعتبر است. لطفاً بررسی کنید.' : 'Invalid English title. Please review your input.';
        if (m.includes('summary') && m.includes('character'))
            return rtl ? 'خلاصه انگلیسی باید حداقل ۵۰ کاراکتر داشته باشد.' : 'English summary must be at least 50 characters.';
        if (m.includes('https'))
            return rtl ? 'لینک سند باید با https:// شروع شود.' : 'Document URL must start with https://.';
        return rtl ? 'خطا در ارسال طرح. لطفاً دوباره امتحان کنید.' : 'Failed to submit plan. Please try again.';
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
            setError(friendlyError(err.message, isRTL));
        }
    }

    if (authLoading) return null;

    if (!session) {
        return (
            <div className="as-page" dir={dir}>
                <div className="as-inner">
                    <div className="as-login-gate">
                        <div className="as-login-icon">🔒</div>
                        <h2 className="as-login-title">
                            {isRTL ? 'برای ارسال طرح وارد شوید' : 'Sign in to submit a plan'}
                        </h2>
                        <p className="as-login-desc">
                            {isRTL
                                ? 'ارسال طرح نیاز به حساب کاربری دارد.'
                                : 'Submitting a plan requires an account.'}
                        </p>
                        <Link to="/login" className="as-login-btn">
                            {isRTL ? 'ورود' : 'Sign In'}
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    if (submitted) {
        return (
            <div className="as-page" dir={dir}>
                <div className="as-inner">
                    <div className="as-success">
                        <div className="as-success-icon">✓</div>
                        <h2 className="as-success-title">
                            {isRTL ? 'طرح شما ارسال شد' : 'Plan submitted successfully'}
                        </h2>
                        <p className="as-success-desc">
                            {isRTL
                                ? `طرح شما در بخش آزمایشگاه آرنا قرار گرفت. پس از جمع‌آوری ${THRESHOLD.toLocaleString()} امضا، برای بررسی مدیران ارسال می‌شود.`
                                : `Your plan is now in the Arena incubator. Once it collects ${THRESHOLD.toLocaleString()} signatures it will be sent for admin review.`}
                        </p>
                        <div className="as-success-actions">
                            <Link to="/arena" className="as-success-btn">
                                {isRTL ? 'بازگشت به آرنا' : 'Back to Arena'}
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="as-page" dir={dir}>
            <div className="as-inner">
                <nav className="as-breadcrumb">
                    <Link to="/arena" className="as-breadcrumb-link">
                        {isRTL ? 'آرنا' : 'Arena'}
                    </Link>
                    <span className="as-breadcrumb-sep">/</span>
                    <span>{isRTL ? 'ارسال طرح' : 'Submit Plan'}</span>
                </nav>

                <header className="as-header">
                    <h1 className="as-title">
                        {isRTL ? 'ارسال طرح انتقالی' : 'Submit a Transitional Plan'}
                    </h1>
                    <p className="as-subtitle">
                        {isRTL
                            ? `طرح شما در بخش آزمایشگاه آرنا نمایش داده می‌شود. پس از جمع‌آوری ${THRESHOLD.toLocaleString()} امضا، برای بررسی و تأیید به تیم مدیران ارسال می‌شود.`
                            : `Your plan will appear in the Arena incubator. Once it reaches ${THRESHOLD.toLocaleString()} signatures it moves to admin review for potential promotion to the main plans.`}
                    </p>
                    <div className="as-requirement">
                        <span className="as-req-dot" />
                        {isRTL
                            ? 'برای ارسال طرح به حداقل ۴ امتیاز مدنی نیاز دارید.'
                            : 'Requires a minimum civic score of 4 to submit.'}
                    </div>
                </header>

                <form className="as-form" onSubmit={handleSubmit}>
                    <div className="as-section-label">
                        {isRTL ? 'عنوان طرح' : 'Plan Title'}
                    </div>

                    <div className="as-field">
                        <label className="as-label" htmlFor="title_en">
                            {isRTL ? 'عنوان (انگلیسی) — الزامی' : 'Title (English) — required'}
                        </label>
                        <input
                            id="title_en"
                            className="as-input"
                            type="text"
                            dir="ltr"
                            placeholder="e.g. Democratic Federal Republic of Iran"
                            value={form.title_en}
                            onChange={e => set('title_en', e.target.value)}
                            maxLength={120}
                        />
                    </div>

                    <div className="as-field">
                        <label className="as-label" htmlFor="title_fa">
                            {isRTL ? 'عنوان (فارسی) — اختیاری' : 'Title (Farsi) — optional'}
                        </label>
                        <input
                            id="title_fa"
                            className="as-input"
                            type="text"
                            dir="rtl"
                            placeholder="مثال: جمهوری فدرال دموکراتیک ایران"
                            value={form.title_fa}
                            onChange={e => set('title_fa', e.target.value)}
                            maxLength={120}
                        />
                    </div>

                    <div className="as-section-label">
                        {isRTL ? 'خلاصه طرح' : 'Plan Summary'}
                    </div>

                    <div className="as-field">
                        <label className="as-label" htmlFor="summary_en">
                            {isRTL ? 'خلاصه (انگلیسی) — الزامی' : 'Summary (English) — required'}
                        </label>
                        <textarea
                            id="summary_en"
                            className="as-textarea"
                            dir="ltr"
                            rows={5}
                            placeholder="Describe the core principles, transition methodology, and proposed governance structure..."
                            value={form.summary_en}
                            onChange={e => set('summary_en', e.target.value)}
                            maxLength={2000}
                        />
                        <span className="as-char-count">
                            {form.summary_en.length}/2000
                            {form.summary_en.length < MIN_SUMMARY && form.summary_en.length > 0 && (
                                <span className="as-char-min"> — {isRTL ? `حداقل ${MIN_SUMMARY}` : `min ${MIN_SUMMARY}`}</span>
                            )}
                        </span>
                    </div>

                    <div className="as-field">
                        <label className="as-label" htmlFor="summary_fa">
                            {isRTL ? 'خلاصه (فارسی) — اختیاری' : 'Summary (Farsi) — optional'}
                        </label>
                        <textarea
                            id="summary_fa"
                            className="as-textarea"
                            dir="rtl"
                            rows={5}
                            placeholder="اصول اساسی، روش انتقال و ساختار حکومت پیشنهادی را شرح دهید..."
                            value={form.summary_fa}
                            onChange={e => set('summary_fa', e.target.value)}
                            maxLength={2000}
                        />
                        <span className="as-char-count">{form.summary_fa.length}/2000</span>
                    </div>

                    <div className="as-section-label">
                        {isRTL ? 'مستندات' : 'Documentation'}
                    </div>

                    <div className="as-field">
                        <label className="as-label" htmlFor="full_doc_url">
                            {isRTL ? 'لینک سند کامل — اختیاری' : 'Full document URL — optional'}
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
                            {isRTL
                                ? 'لینک به PDF، Google Docs یا هر مستند عمومی دیگری'
                                : 'Link to a PDF, Google Doc, or any publicly accessible document'}
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
                                ? (isRTL ? 'در حال ارسال...' : 'Submitting...')
                                : (isRTL ? 'ارسال طرح' : 'Submit Plan')}
                        </button>
                        <Link to="/arena" className="as-cancel-link">
                            {isRTL ? 'انصراف' : 'Cancel'}
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}