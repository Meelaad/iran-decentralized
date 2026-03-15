import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLang } from '../../contexts/LangContext';
import './TransitionalComparePage.css';

// Placeholder data — replace with real plan data later
const PLANS = [
    {
        id: 'nufdi',
        name: { en: 'NUFDI Blueprint', fa: 'طرح NUFDI' },
        author: { en: 'National United Front of Democrats of Iran', fa: 'جبهه ملی متحد دموکرات‌های ایران' },
        type: { en: 'Decentralized Federal', fa: 'فدرال غیرمتمرکز' },
        duration: { en: '18–24 months', fa: '۱۸–۲۴ ماه' },
        keyPoints: [
            { en: 'Immediate dissolution of regime institutions', fa: 'انحلال فوری نهادهای رژیم' },
            { en: 'Provisional government by technocratic council', fa: 'حکومت موقت توسط شورای تکنوکراتیک' },
            { en: 'Regional autonomy during transition', fa: 'خودمختاری منطقه‌ای در دوران انتقال' },
            { en: 'Constitutional assembly via open election', fa: 'مجلس قانون اساسی از طریق انتخابات آزاد' },
        ],
        color: '#7c72e8',
        status: { en: 'Reference Document', fa: 'سند مرجع' },
    },
    {
        id: 'mahsa',
        name: { en: 'Mahsa Charter (Placeholder)', fa: 'منشور مهسا (نمونه)' },
        author: { en: 'Diaspora Coalition', fa: 'ائتلاف دیاسپورا' },
        type: { en: 'Secular Liberal', fa: 'سکولار لیبرال' },
        duration: { en: '12–18 months', fa: '۱۲–۱۸ ماه' },
        keyPoints: [
            { en: 'Woman, Life, Freedom as constitutional principle', fa: 'زن، زندگی، آزادی به عنوان اصل قانون اساسی' },
            { en: 'Immediate free press and assembly rights', fa: 'آزادی فوری مطبوعات و حق تجمع' },
            { en: 'International oversight of transition', fa: 'نظارت بین‌المللی بر دوران انتقال' },
            { en: 'Lustration of IRGC and judiciary', fa: 'پاکسازی سپاه و دستگاه قضائی' },
        ],
        color: '#4fc3f7',
        status: { en: 'Placeholder — Edit Later', fa: 'نمونه — بعداً ویرایش شود' },
    },
    {
        id: 'federalist',
        name: { en: 'Federal Transition Plan (Placeholder)', fa: 'طرح انتقال فدرال (نمونه)' },
        author: { en: 'Ethnic Minority Alliance', fa: 'اتحاد اقلیت‌های قومی' },
        type: { en: 'Federal Democratic', fa: 'دموکراتیک فدرال' },
        duration: { en: '24–36 months', fa: '۲۴–۳۶ ماه' },
        keyPoints: [
            { en: 'Ethnic region self-governance from day one', fa: 'خودگردانی مناطق قومی از روز اول' },
            { en: 'Federal constitution with regional chapters', fa: 'قانون اساسی فدرال با فصل‌های منطقه‌ای' },
            { en: 'Proportional representation in all bodies', fa: 'نمایندگی متناسب در تمام ارگان‌ها' },
            { en: 'National referendum on federal structure', fa: 'همه‌پرسی ملی درباره ساختار فدرال' },
        ],
        color: '#69d98c',
        status: { en: 'Placeholder — Edit Later', fa: 'نمونه — بعداً ویرایش شود' },
    },
];

const ROWS = [
    { key: 'type',     label: { en: 'Government Type', fa: 'نوع حکومت' } },
    { key: 'duration', label: { en: 'Transition Duration', fa: 'مدت انتقال' } },
    { key: 'author',   label: { en: 'Proposed By', fa: 'پیشنهاد‌دهنده' } },
    { key: 'status',   label: { en: 'Status', fa: 'وضعیت' } },
];

export default function TransitionalComparePage() {
    const { isRTL, t } = useLang();
    const [selected, setSelected] = useState(['nufdi', 'mahsa']);

    const planA = PLANS.find(p => p.id === selected[0]);
    const planB = PLANS.find(p => p.id === selected[1]);

    return (
        <div className="tc-root" dir={isRTL ? 'rtl' : 'ltr'}>
            <div className="tc-bg-grid" />

            <div className="tc-inner">
                <div className="tc-header">
                    <Link to="/choose" className="tc-back">← {isRTL ? 'بازگشت' : 'Back to Choose'}</Link>
                    <div className="tc-eyebrow">{isRTL ? 'مقایسه طرح‌های انتقالی' : 'TRANSITIONAL PLAN COMPARISON'}</div>
                    <h1 className="tc-title">{isRTL ? 'مقایسه طرح‌های دوران گذار' : 'Compare Transitional Plans'}</h1>
                    <p className="tc-sub">
                        {isRTL
                            ? 'این صفحه نمونه است — محتوا بعداً توسط مدیر ویرایش می‌شود'
                            : 'Placeholder page — content will be edited by admin later'}
                    </p>
                </div>

                {/* Plan selectors */}
                <div className="tc-selectors">
                    {[0, 1].map(idx => (
                        <div key={idx} className="tc-selector">
                            <div className="tc-selector-label">{isRTL ? `طرح ${idx + 1}` : `Plan ${idx + 1}`}</div>
                            <div className="tc-selector-btns">
                                {PLANS.map(p => (
                                    <button
                                        key={p.id}
                                        className={`tc-selector-btn${selected[idx] === p.id ? ' is-active' : ''}`}
                                        style={selected[idx] === p.id ? { borderColor: p.color, color: p.color } : {}}
                                        onClick={() => setSelected(s => s.map((v, i) => i === idx ? p.id : v))}
                                    >
                                        {t(p.name)}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Comparison table */}
                {planA && planB && (
                    <div className="tc-table-wrap">
                        {/* Header row */}
                        <div className="tc-grid">
                            <div className="tc-cell tc-cell--label" />
                            <div className="tc-cell tc-cell--head" style={{ borderTopColor: planA.color }}>
                                <div className="tc-plan-name" style={{ color: planA.color }}>{t(planA.name)}</div>
                            </div>
                            <div className="tc-cell tc-cell--head" style={{ borderTopColor: planB.color }}>
                                <div className="tc-plan-name" style={{ color: planB.color }}>{t(planB.name)}</div>
                            </div>
                        </div>

                        {/* Data rows */}
                        {ROWS.map(row => (
                            <div key={row.key} className="tc-grid tc-grid--row">
                                <div className="tc-cell tc-cell--label">{t(row.label)}</div>
                                <div className="tc-cell">{t(planA[row.key])}</div>
                                <div className="tc-cell">{t(planB[row.key])}</div>
                            </div>
                        ))}

                        {/* Key points */}
                        <div className="tc-grid tc-grid--row tc-grid--top">
                            <div className="tc-cell tc-cell--label">{isRTL ? 'نکات کلیدی' : 'Key Points'}</div>
                            {[planA, planB].map(plan => (
                                <div key={plan.id} className="tc-cell">
                                    <ul className="tc-points">
                                        {plan.keyPoints.map((pt, i) => (
                                            <li key={i}>{t(pt)}</li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="tc-footer">
                    <Link to="/arena" className="tc-cta">{isRTL ? '← آرنا — تأیید طرح‌های انتقالی' : 'Arena — Endorse Transitional Plans →'}</Link>
                    <Link to="/compare" className="tc-cta tc-cta--secondary">{isRTL ? 'مقایسه سیستم‌های حکومتی (مرحله ۲)' : 'Compare Governance Systems (Stage 2) →'}</Link>
                </div>
            </div>
        </div>
    );
}
