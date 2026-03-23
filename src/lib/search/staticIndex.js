/**
 * Client-side static search index built from bundled data.
 * Only includes content that is publicly visible to all users.
 * Fuse.js fuzzy matching — no external services, no auth-gated content.
 */
import Fuse from 'fuse.js';
import { BLUEPRINTS, SECTORS, OFFICIAL_PLANS } from '../../data';

function buildItems() {
    const items = [];

    // ── Governance Blueprints ────────────────────────────────────────────────
    for (const bp of Object.values(BLUEPRINTS)) {
        items.push({
            type: 'blueprint',
            id: bp.id,
            title_en: bp.name.en,
            title_fa: bp.name.fa,
            body_en: bp.sectors?.map(s => `${s.label.en} ${s.desc?.en ?? ''}`).join(' ') ?? '',
            body_fa: bp.sectors?.map(s => `${s.label.fa} ${s.desc?.fa ?? ''}`).join(' ') ?? '',
            url: `/blueprint/gov/${bp.id}`,
        });
    }

    // ── Sectors (from the decentralized blueprint) ───────────────────────────
    for (const sector of SECTORS) {
        items.push({
            type: 'sector',
            id: sector.id,
            title_en: sector.label.en,
            title_fa: sector.label.fa,
            body_en: [sector.desc?.en ?? '', ...sector.contents.map(c => c.en)].join(' '),
            body_fa: [sector.desc?.fa ?? '', ...sector.contents.map(c => c.fa)].join(' '),
            url: `/blueprint/gov/decentralized/sectors/${sector.id}`,
        });
    }

    // ── Official Transitional Plans ──────────────────────────────────────────
    for (const plan of OFFICIAL_PLANS) {
        items.push({
            type: 'plan',
            id: plan.slug,
            title_en: plan.name_en,
            title_fa: plan.name_fa,
            body_en: plan.summary_en ?? '',
            body_fa: plan.summary_fa ?? '',
            url: `/transitional/plan/${plan.slug}`,
        });
    }

    // ── Static pages ─────────────────────────────────────────────────────────
    const pages = [
        { id: 'arena', title_en: 'Transition Arena', title_fa: 'آرنای گذار', body_en: 'Browse and endorse community-submitted transition plans for Iran', body_fa: 'برنامه‌های گذار پیشنهادی جامعه را بررسی و تأیید کنید', url: '/arena' },
        { id: 'compare', title_en: 'Compare Blueprints', title_fa: 'مقایسه طرح‌های حکومتی', body_en: 'Side-by-side comparison of governance blueprints', body_fa: 'مقایسه تطبیقی طرح‌های حکومتی', url: '/compare' },
        { id: 'vote', title_en: 'Vote', title_fa: 'رأی‌گیری', body_en: 'Cast your vote for your preferred governance system', body_fa: 'به سیستم حکومتی مورد نظر خود رأی دهید', url: '/vote' },
        { id: 'about', title_en: 'About IranDAO', title_fa: 'درباره IranDAO', body_en: 'Learn about the IranDAO project, mission, and decentralized governance platform', body_fa: 'درباره پروژه IranDAO، مأموریت و پلتفرم حکومت غیرمتمرکز بیاموزید', url: '/about' },
        { id: 'contact', title_en: 'Contact', title_fa: 'تماس', body_en: 'Get in touch with the IranDAO team', body_fa: 'با تیم IranDAO در تماس باشید', url: '/contact' },
        { id: 'faq', title_en: 'FAQ', title_fa: 'سوالات متداول', body_en: 'Frequently asked questions about IranDAO and decentralized governance', body_fa: 'سوالات متداول درباره IranDAO و حکومت غیرمتمرکز', url: '/faq' },
        { id: 'pre', title_en: 'Pre-Transition Guide', title_fa: 'راهنمای پیش از گذار', body_en: 'Practical steps and strategies for the pre-transition period', body_fa: 'گام‌های عملی برای دوران پیش از گذار', url: '/pre' },
        { id: 'global', title_en: 'Global Support Map', title_fa: 'نقشه حمایت جهانی', body_en: 'See where supporters are located around the world', body_fa: 'مشاهده موقعیت حامیان در سراسر جهان', url: '/global' },
        { id: 'plans', title_en: 'Proposed Blueprints', title_fa: 'طرح‌های پیشنهادی', body_en: 'Browse all proposed transitional governance plans', body_fa: 'همه طرح‌های حکومتی انتقالی پیشنهادی را ببینید', url: '/plans' },
        { id: 'destination', title_en: 'Destination Hub', title_fa: 'هاب مقصد', body_en: 'Long-term governance destination blueprints for a free Iran', body_fa: 'طرح‌های بلندمدت برای آینده ایران آزاد', url: '/destination' },
    ];
    for (const p of pages) {
        items.push({ type: 'page', ...p });
    }

    return items;
}

const FUSE_OPTIONS = {
    includeScore: true,
    threshold: 0.42,
    ignoreLocation: true,
    minMatchCharLength: 2,
    keys: [
        { name: 'title_en', weight: 3 },
        { name: 'title_fa', weight: 3 },
        { name: 'body_en',  weight: 1 },
        { name: 'body_fa',  weight: 1 },
    ],
};

let _fuse = null;

export function getFuse() {
    if (!_fuse) _fuse = new Fuse(buildItems(), FUSE_OPTIONS);
    return _fuse;
}

/** @returns {Array} scored results [{item, score}] */
export function searchStatic(query) {
    if (!query || query.trim().length < 2) return [];
    return getFuse().search(query.trim().slice(0, 100));
}
