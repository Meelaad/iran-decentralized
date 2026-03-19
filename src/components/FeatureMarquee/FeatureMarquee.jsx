import { useLang } from '../../contexts/LangContext';
import './FeatureMarquee.css';

export const LEFT_FEATURES = [
    { icon: '🏛', title: { en: 'Transitional Plans', fa: 'طرح‌های انتقالی' }, desc: { en: 'Endorse real frameworks like the Mahsa Charter already active on the Main Stage.', fa: 'طرح‌های واقعی مانند منشور مهسا را بر روی صحنه اصلی تأیید کنید.' } },
    { icon: '🗳', title: { en: 'Amendment Floor', fa: 'پیشنهاد اصلاحی در صحن' }, desc: { en: 'Propose and vote on line-item edits to any active plan in real time.', fa: 'پیشنهاد و رأی‌گیری برای تغییرات خط‌به‌خط در طرح‌های فعال.' } },
    { icon: '🌱', title: { en: 'Plan Incubator', fa: 'پرورشگاه طرح' }, desc: { en: 'New grassroots plans earn a Main Stage spot after 10,000 verified signatures.', fa: 'طرح‌های جدید مردمی پس از ۱۰,۰۰۰ امضای تأیید‌شده به صحنه اصلی می‌رسند.' } },
    { icon: '📈', title: { en: 'Live Consensus', fa: 'اجماع زنده' }, desc: { en: 'Stock-style graphs track daily momentum shifts across all competing plans.', fa: 'نمودارهای سهام‌وار تغییرات روزانه اجماع در تمام طرح‌ها را نشان می‌دهند.' } },
    { icon: '🤝', title: { en: 'Web of Trust', fa: 'شبکه اعتماد' }, desc: { en: 'Join via invite-only codes shared by people you trust — no bots allowed.', fa: 'از طریق کدهای دعوت‌نامه از افراد مورد اعتماد بپیوندید — ربات مجاز نیست.' } },
    { icon: '🔐', title: { en: 'Privacy First', fa: 'اولویت با حریم خصوصی' }, desc: { en: 'No government ID required. Verify freely with institutional email or passkey.', fa: 'نیازی به شناسه دولتی نیست. با ایمیل دانشگاهی یا کلید تأیید کنید.' } },
];

export const RIGHT_FEATURES = [
    { icon: '⚖️', title: { en: 'Shadow Cabinet', fa: 'دولت سایه' }, desc: { en: 'Nominate and elect experts into sector roles using ranked-choice voting.', fa: 'کارشناسان را برای نقش‌های بخشی با رأی‌گیری ترجیحی منصوب و انتخاب کنید.' } },
    { icon: '🌍', title: { en: 'Diaspora Map', fa: 'نقشه دیاسپورا' }, desc: { en: 'See where Iranian voices are concentrated across the globe in real time.', fa: 'ببینید صداهای ایرانی در سراسر جهان کجا متمرکز شده‌اند.' } },
    { icon: '🏆', title: { en: 'Civic Score', fa: 'امتیاز مدنی' }, desc: { en: '3-tier system: higher score means more weight in governance votes.', fa: 'سیستم ۳ سطحی: امتیاز بالاتر یعنی وزن بیشتر در رأی‌گیری‌های حاکمیتی.' } },
    { icon: '🗺', title: { en: 'Blueprint Explorer', fa: 'کاوشگر طرح‌ها' }, desc: { en: 'Compare every proposed system of government side-by-side in detail.', fa: 'هر سیستم پیشنهادی حکومت را به طور مفصل در کنار هم مقایسه کنید.' } },
    { icon: '🔥', title: { en: 'Activity Grid', fa: 'شبکه فعالیت' }, desc: { en: '365-day contribution heatmap on your profile — like GitHub, but for democracy.', fa: 'نقشه حرارتی ۳۶۵ روزه مشارکت در پروفایل شما — مثل گیت‌هاب، برای دموکراسی.' } },
    { icon: '📜', title: { en: 'Permanent Constitution', fa: 'قانون اساسی دائمی' }, desc: { en: 'Phase 2 destination: a ratified post-collapse constitution built from the ground up.', fa: 'مرحله دوم: قانون اساسی دائمی پس از فروپاشی که از پایه ساخته می‌شود.' } },
];

export function FeatureMarquee({ items, reverse, style }) {
    const { t } = useLang();
    const quadrupled = [...items, ...items, ...items, ...items];

    return (
        <div className={`fm-marquee${reverse ? ' fm-marquee--rev' : ''}`} style={style}>
            <div className={`fm-marquee-track${reverse ? ' fm-marquee-track--rev' : ''}`}>
                {quadrupled.map((f, i) => (
                    <div key={i} className="fm-card">
                        <span className="fm-card-icon">{f.icon}</span>
                        <div className="fm-card-body">
                            <div className="fm-card-title">{t(f.title)}</div>
                            <div className="fm-card-desc">{t(f.desc)}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
