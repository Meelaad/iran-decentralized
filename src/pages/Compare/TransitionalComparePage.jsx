import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLang } from '../../contexts/LangContext';
import './TransitionalComparePage.css';

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
        link: '/transitional/plan/nufdi',
    },
    {
        id: 'mousavi',
        name: { en: 'Mousavi — "To Save Iran"', fa: 'موسوی — «برای نجات ایران»' },
        author: { en: 'Mir Hossein Mousavi (Green Movement)', fa: 'میر حسین موسوی (جنبش سبز)' },
        type: { en: '3-Stage Popular Sovereignty', fa: 'حاکمیت مردمی ۳ مرحله‌ای' },
        duration: { en: 'Until regime capitulation', fa: 'تا تسلیم رژیم' },
        keyPoints: [
            { en: 'Stage 1: Deconstruction referendum on current constitution', fa: 'مرحله ۱: همه‌پرسی فروپاشی قانون اساسی موجود' },
            { en: 'Stage 2: Constituent Assembly elected by free vote', fa: 'مرحله ۲: مجلس مؤسسان منتخب از طریق انتخابات آزاد' },
            { en: 'Stage 3: Ratification referendum on new constitution', fa: 'مرحله ۳: همه‌پرسی تصویب قانون اساسی جدید' },
            { en: 'Non-violent, rejects foreign military intervention', fa: 'غیرخشونت‌آمیز، مخالف مداخله نظامی خارجی' },
        ],
        color: '#69d98c',
        status: { en: 'Active Plan (Feb 2023 — Jan 2026+)', fa: 'طرح فعال (فوریه ۲۰۲۳ — ژانویه ۲۰۲۶+)' },
        link: '/transitional/plan/mirhosein-mousavi',
    },
    {
        id: 'itc',
        name: { en: 'Iran Transition Council (ITC)', fa: 'شورای انتقال ایران (ITC)' },
        author: { en: 'Shadow Government & Transitional Planning Unit', fa: 'دولت سایه و واحد برنامه‌ریزی انتقالی' },
        type: { en: 'Operational Shadow Government', fa: 'دولت سایه عملیاتی' },
        duration: { en: 'Immediate post-collapse deployment', fa: 'استقرار فوری پس از فروپاشی' },
        keyPoints: [
            { en: 'Pre-positioned shadow ministries ready for rapid deployment', fa: 'وزارتخانه‌های سایه آماده برای استقرار سریع' },
            { en: 'Absorb power vacuum and prevent state collapse', fa: 'جذب خلاء قدرت و جلوگیری از فروپاشی دولت' },
            { en: 'Logistical coordination of transitional institutions', fa: 'هماهنگی لجستیکی نهادهای انتقالی' },
            { en: 'Structured handover to democratic elected bodies', fa: 'واگذاری منظم به نهادهای منتخب دموکراتیک' },
        ],
        color: '#ff9a42',
        status: { en: 'Operational Plan · Est. 2019', fa: 'طرح عملیاتی · تأسیس ۲۰۱۹' },
        link: '/transitional/plan/itc',
    },
    {
        id: 'civil-society',
        name: { en: 'Iran Civil Society Charter', fa: 'منشور جامعه مدنی ایران' },
        author: { en: 'Civil Society Research & Advocacy Network', fa: 'شبکه پژوهش و حمایت جامعه مدنی' },
        type: { en: 'Civil Society Framework', fa: 'چارچوب جامعه مدنی' },
        duration: { en: 'Ongoing — pre-transition', fa: 'جاری — پیش از انتقال' },
        keyPoints: [
            { en: 'Grassroots civil society organisation and capacity-building', fa: 'سازماندهی پایه‌ای جامعه مدنی و ظرفیت‌سازی' },
            { en: 'Independent media and press freedom framework', fa: 'رسانه مستقل و چارچوب آزادی مطبوعات' },
            { en: 'Human rights documentation and accountability', fa: 'مستندسازی حقوق بشر و پاسخگویی' },
            { en: 'Coalition-building across ethnic and political lines', fa: 'ائتلاف‌سازی فراتر از مرزهای قومی و سیاسی' },
        ],
        color: '#ffd166',
        status: { en: 'Reference Document', fa: 'سند مرجع' },
        link: '/transitional/plan/civil-society',
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
                                {planA.link && <Link to={planA.link} className="tc-view-link" style={{ color: planA.color }}>{isRTL ? 'مشاهده طرح ←' : 'VIEW PLAN →'}</Link>}
                            </div>
                            <div className="tc-cell tc-cell--head" style={{ borderTopColor: planB.color }}>
                                <div className="tc-plan-name" style={{ color: planB.color }}>{t(planB.name)}</div>
                                {planB.link && <Link to={planB.link} className="tc-view-link" style={{ color: planB.color }}>{isRTL ? 'مشاهده طرح ←' : 'VIEW PLAN →'}</Link>}
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
