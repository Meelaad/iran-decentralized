import React from 'react';
import { Link } from 'react-router-dom';
import { useLang } from '../../contexts/LangContext';
import './PreTransPage.css';

export default function PreTransPage() {
    const { isRTL, t } = useLang();

    const sections = [
        {
            icon: '🏛',
            title: { en: 'Main Stage', fa: 'صحنه اصلی' },
            desc: { en: 'Endorse or oppose active transitional plans put forward by coalitions and movements.', fa: 'طرح‌های انتقالی فعال ارائه‌شده توسط ائتلاف‌ها را تأیید یا رد کنید.' },
            to: '/transition/main-stage',
        },
        {
            icon: '🌱',
            title: { en: 'Plan Incubator', fa: 'پرورشگاه طرح' },
            desc: { en: 'Propose a new grassroots plan and gather the 10,000 signatures needed for the Main Stage.', fa: 'یک طرح مردمی جدید پیشنهاد دهید و ۱۰,۰۰۰ امضای لازم را جمع‌آوری کنید.' },
            to: '/transition/incubator',
        },
        {
            icon: '📜',
            title: { en: 'Amendment Floor', fa: 'کف اصلاحات' },
            desc: { en: 'Propose and vote on line-item changes to any active plan in real time.', fa: 'تغییرات خط‌به‌خط طرح‌های فعال را پیشنهاد دهید و رأی بدهید.' },
            to: '/transition/amendment-floor',
        },
        {
            icon: '⚖️',
            title: { en: 'Shadow Cabinet', fa: 'کابینه سایه' },
            desc: { en: 'Nominate and elect sector experts to a shadow government using ranked-choice voting.', fa: 'کارشناسان بخشی را برای کابینه سایه معرفی و با رأی ترجیحی انتخاب کنید.' },
            to: '/transition/shadow-cabinet',
        },
    ];

    return (
        <div className="pretrans-root" dir={isRTL ? 'rtl' : 'ltr'}>
            <div className="pretrans-bg-grid" />

            <div className="pretrans-inner">
                <Link to="/choose" className="pretrans-back">
                    ← {t({ en: 'Back to path selection', fa: 'بازگشت به انتخاب مسیر' })}
                </Link>

                <div className="pretrans-eyebrow">
                    {t({ en: 'PHASE I — PRE-TRANSITIONAL', fa: 'مرحله یک — پیش‌انتقالی' })}
                </div>
                <h1 className="pretrans-title">
                    {t({ en: 'Transitional Governance', fa: 'حاکمیت انتقالی' })}
                </h1>
                <p className="pretrans-sub">
                    {t({
                        en: 'When the regime falls, there will be a power vacuum. This platform prepares the diaspora to fill it with a legitimate, pre-agreed transitional framework.',
                        fa: 'وقتی رژیم فرو می‌پاشد، خلأ قدرتی به وجود می‌آید. این پلتفرم دیاسپورا را برای پر کردن آن با یک چارچوب انتقالی مشروع و از پیش توافق‌شده آماده می‌کند.',
                    })}
                </p>

                <div className="pretrans-grid">
                    {sections.map(s => (
                        <Link key={s.to} to={s.to} className="pretrans-card">
                            <span className="pretrans-card-icon">{s.icon}</span>
                            <div className="pretrans-card-title">{t(s.title)}</div>
                            <div className="pretrans-card-desc">{t(s.desc)}</div>
                        </Link>
                    ))}
                </div>

                <div className="pretrans-footer">
                    <Link to="/destination" className="pretrans-phase2-link">
                        {t({ en: 'Phase II: Permanent Constitution →', fa: '← مرحله دوم: قانون اساسی دائمی' })}
                    </Link>
                </div>
            </div>
        </div>
    );
}
