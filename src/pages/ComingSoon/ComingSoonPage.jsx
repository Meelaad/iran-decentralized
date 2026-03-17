import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLang } from '../../contexts/LangContext';
import './ComingSoonPage.css';

const SECTIONS = {
    '/transition/main-stage': {
        icon: '🏛',
        en: {
            label: 'TRANSITION / MAIN STAGE',
            title: 'Main Stage',
            desc: 'The arena where active transitional plans endorsed by movements and coalitions are voted on by the public. Plans that reach 10,000 signatures advance here for final deliberation.',
            eta: 'Under active development',
        },
        fa: {
            label: 'گذار / صحنه اصلی',
            title: 'صحنه اصلی',
            desc: 'بستری که در آن طرح‌های انتقالی فعال مورد تأیید جنبش‌ها و ائتلاف‌ها توسط مردم رأی‌گیری می‌شوند. طرح‌هایی که به ۱۰٬۰۰۰ امضا می‌رسند برای بررسی نهایی به اینجا می‌آیند.',
            eta: 'در حال توسعه فعال',
        },
    },
    '/transition/incubator': {
        icon: '🌱',
        en: {
            label: 'TRANSITION / PLAN INCUBATOR',
            title: 'Plan Incubator',
            desc: 'Propose a new grassroots transitional plan and gather the 10,000 signatures needed to advance it to the Main Stage. Currently accessible via the Arena.',
            eta: 'Available now via /arena',
            link: '/arena',
            linkLabel: 'Go to Arena →',
        },
        fa: {
            label: 'گذار / پرورشگاه طرح',
            title: 'پرورشگاه طرح',
            desc: 'یک طرح انتقالی مردمی جدید پیشنهاد دهید و ۱۰٬۰۰۰ امضای لازم برای ارتقا به صحنه اصلی را جمع‌آوری کنید. در حال حاضر از طریق آرنا در دسترس است.',
            eta: 'هم‌اکنون از طریق آرنا در دسترس',
            link: '/arena',
            linkLabel: 'رفتن به آرنا ←',
        },
    },
    '/transition/amendment-floor': {
        icon: '📜',
        en: {
            label: 'TRANSITION / AMENDMENT FLOOR',
            title: 'Amendment Floor',
            desc: 'Propose and vote on line-item changes to any active transitional plan in real time. This deliberative layer enables the public to refine plans before they are ratified.',
            eta: 'Under active development',
        },
        fa: {
            label: 'گذار / کف اصلاحات',
            title: 'کف اصلاحات',
            desc: 'تغییرات خط‌به‌خط هر طرح انتقالی فعال را در زمان واقعی پیشنهاد دهید و رأی بدهید. این لایه مداولاتی به مردم امکان می‌دهد طرح‌ها را پیش از تصویب اصلاح کنند.',
            eta: 'در حال توسعه فعال',
        },
    },
    '/transition/shadow-cabinet': {
        icon: '⚖️',
        en: {
            label: 'TRANSITION / SHADOW CABINET',
            title: 'Shadow Cabinet',
            desc: 'Nominate and elect sector experts to a shadow transitional government using ranked-choice voting. The cabinet will serve as a public accountability layer during the transition.',
            eta: 'Under active development',
        },
        fa: {
            label: 'گذار / کابینه سایه',
            title: 'کابینه سایه',
            desc: 'کارشناسان بخشی را برای کابینه دولت انتقالی سایه معرفی و با رأی ترجیحی انتخاب کنید. کابینه در دوران گذار به عنوان لایه پاسخگویی عمومی عمل خواهد کرد.',
            eta: 'در حال توسعه فعال',
        },
    },
};

const DEFAULT = {
    icon: '⚙️',
    en: {
        label: 'SYSTEM',
        title: 'Page In Progress',
        desc: 'This section of the platform is currently being built. Check back soon.',
        eta: 'Under active development',
    },
    fa: {
        label: 'سیستم',
        title: 'صفحه در دست ساخت',
        desc: 'این بخش از پلتفرم در حال ساخت است. به زودی بازگردید.',
        eta: 'در حال توسعه فعال',
    },
};

export default function ComingSoonPage() {
    const { lang, isRTL } = useLang();
    const { pathname } = useLocation();
    const section = SECTIONS[pathname] || DEFAULT;
    const d = section[lang] || section.en;
    const dir = isRTL ? 'rtl' : 'ltr';
    const monoFont = isRTL ? "'Irancell', sans-serif" : "'intelone-mono', monospace";
    const headFont = isRTL ? "'Vazirmatn', sans-serif" : "'Inter', sans-serif";

    return (
        <div className="cs2-page" dir={dir}>
            <div className="cs2-inner">
                <div className="cs2-label" style={{ fontFamily: monoFont }}>
                    {d.label}
                </div>

                <div className="cs2-icon">{section.icon}</div>

                <h1 className="cs2-title" style={{ fontFamily: headFont }}>
                    {d.title}
                </h1>

                <p className="cs2-desc">{d.desc}</p>

                <div className="cs2-status" style={{ fontFamily: monoFont }}>
                    <span className="cs2-status-dot" />
                    <span>{d.eta}</span>
                </div>

                {d.link && (
                    <Link to={d.link} className="cs2-action-btn">
                        {d.linkLabel}
                    </Link>
                )}

                <div className="cs2-nav">
                    <Link to="/plans" className="cs2-nav-link">
                        {isRTL ? '← همه طرح‌های انتقالی' : '← All Transitional Plans'}
                    </Link>
                    <Link to="/arena" className="cs2-nav-link cs2-nav-link--dim">
                        {isRTL ? 'آرنا ←' : 'Arena →'}
                    </Link>
                </div>
            </div>
        </div>
    );
}
