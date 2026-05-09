import React, { useEffect, useState } from 'react';
import { useLang } from '../../contexts/LangContext';
import './CivicScoreGuide.css';

const EVENT_LABELS = {
    daily_login:                  { en: 'Daily login',                    fa: 'ورود روزانه' },
    vote_cast:                    { en: 'Blueprint vote',                  fa: 'رأی به بلوپرینت' },
    plan_vote:                    { en: 'Endorse a plan',                  fa: 'تأیید یک طرح' },
    plan_signed:                  { en: 'Sign incubator plan',             fa: 'امضای طرح شتابدهنده' },
    expert_vote:                  { en: 'Expert vote',                     fa: 'رأی به متخصص' },
    amendment_vote:               { en: 'Amendment vote',                  fa: 'رأی به اصلاحیه' },
    amendment_proposed:           { en: 'Propose amendment',               fa: 'پیشنهاد اصلاحیه' },
    amendment_500_upvotes:        { en: 'Amendment reaches 500 upvotes',   fa: 'اصلاحیه به ۵۰۰ رأی رسید' },
    comment_posted:               { en: 'Expert Q&A question',             fa: 'سؤال در پرسش‌وپاسخ متخصصان' },
    invited_user_joined:          { en: 'Referred user joined',            fa: 'کاربر معرفی‌شده عضو شد' },
    invited_user_banned:          { en: 'Referred user banned',            fa: 'کاربر معرفی‌شده مسدود شد' },
    email_verified:               { en: 'Email verified',                  fa: 'ایمیل تأیید شد' },
    phone_verified:               { en: 'Phone verified',                  fa: 'شماره تلفن تأیید شد' },
    id_verified:                  { en: 'Government ID verified',          fa: 'هویت دولتی تأیید شد' },
    photo_verified:               { en: 'Profile photo verified',          fa: 'عکس پروفایل تأیید شد' },
    institutional_email:          { en: 'Institutional email verified',    fa: 'ایمیل سازمانی تأیید شد' },
    consecutive_3_day_login:      { en: '3-day consecutive login',         fa: 'ورود ۳ روز متوالی' },
    streak_7:                     { en: '7-day streak',                    fa: 'دنباله ۷ روزه' },
    streak_30:                    { en: '30-day streak',                   fa: 'دنباله ۳۰ روزه' },
    zk_proof_linked:              { en: 'ZK identity proof linked',        fa: 'اثبات هویت ZK متصل شد' },
};

export default function CivicScoreGuide() {
    const { lang, isRTL, headFont } = useLang();
    const [rules, setRules] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/public/score-rules')
            .then(r => r.json())
            .then(d => {
                if (d.ok && Array.isArray(d.rules)) setRules(d.rules);
            })
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    const oneTime    = rules.filter(r => r.is_one_time);
    const repeatable = rules.filter(r => !r.is_one_time && r.score_delta > 0);
    const negative   = rules.filter(r => r.score_delta < 0);

    function label(r) {
        const l = EVENT_LABELS[r.event_type];
        if (!l) return r.event_type;
        return lang === 'fa' ? l.fa : l.en;
    }

    function DeltaBadge({ delta }) {
        const cls = delta > 0 ? 'csg-delta--pos' : 'csg-delta--neg';
        return <span className={`csg-delta ${cls}`}>{delta > 0 ? `+${delta}` : delta}</span>;
    }

    function RuleRow({ rule }) {
        return (
            <div className="csg-row">
                <span className="csg-event-label" style={{ fontFamily: headFont }}>{label(rule)}</span>
                <DeltaBadge delta={rule.score_delta} />
            </div>
        );
    }

    function Section({ titleEn, titleFa, rows }) {
        if (!rows.length) return null;
        return (
            <div className="csg-section">
                <div className="csg-section-title" style={{ fontFamily: headFont }}>
                    {lang === 'fa' ? titleFa : titleEn}
                </div>
                {rows.map(r => <RuleRow key={r.event_type} rule={r} />)}
            </div>
        );
    }

    if (loading) return <div className="csg-loading" style={{ fontFamily: headFont }}>...</div>;

    return (
        <div className="csg-root" dir={isRTL ? 'rtl' : 'ltr'} style={{ fontFamily: headFont }}>
            <div className="csg-kicker">{lang === 'fa' ? 'امتیازدهی مدنی' : 'CIVIC SCORING'}</div>
            <Section titleEn="Repeatable actions" titleFa="اقدامات تکرارشونده" rows={repeatable} />
            <Section titleEn="One-time bonuses"   titleFa="پاداش‌های یک‌بار"   rows={oneTime} />
            <Section titleEn="Penalties"           titleFa="جریمه‌ها"            rows={negative} />
        </div>
    );
}
