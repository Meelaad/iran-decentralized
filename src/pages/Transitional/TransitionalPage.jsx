import React, { useRef, useEffect, useState } from "react";
import { useLang } from "../../contexts/LangContext";
import "./TransitionalPage.css";

/* ── Animated particle grid background ── */
function ParticleGrid() {
    const canvasRef = useRef(null);
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        let animId, t = 0;
        const nodes = [];
        const NUM = 60;

        function resize() {
            canvas.width = canvas.offsetWidth * devicePixelRatio;
            canvas.height = canvas.offsetHeight * devicePixelRatio;
            ctx.scale(devicePixelRatio, devicePixelRatio);
        }
        resize();
        window.addEventListener("resize", resize);

        for (let i = 0; i < NUM; i++) {
            nodes.push({
                x: Math.random() * 1600,
                y: Math.random() * 900,
                vx: (Math.random() - 0.5) * 0.25,
                vy: (Math.random() - 0.5) * 0.25,
            });
        }

        function draw() {
            const W = canvas.offsetWidth, H = canvas.offsetHeight;
            ctx.clearRect(0, 0, W, H);
            t += 0.008;

            nodes.forEach(n => {
                n.x += n.vx; n.y += n.vy;
                if (n.x < 0 || n.x > W) n.vx *= -1;
                if (n.y < 0 || n.y > H) n.vy *= -1;
            });

            for (let i = 0; i < nodes.length; i++) {
                for (let j = i + 1; j < nodes.length; j++) {
                    const dx = nodes[i].x - nodes[j].x;
                    const dy = nodes[i].y - nodes[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 180) {
                        const alpha = (1 - dist / 180) * 0.12;
                        ctx.beginPath();
                        ctx.moveTo(nodes[i].x, nodes[i].y);
                        ctx.lineTo(nodes[j].x, nodes[j].y);
                        ctx.strokeStyle = `rgba(79,195,247,${alpha})`;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                }
                const pulse = 0.5 + 0.5 * Math.sin(t + i);
                ctx.beginPath();
                ctx.arc(nodes[i].x, nodes[i].y, 1.5, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(79,195,247,${0.15 + pulse * 0.2})`;
                ctx.fill();
            }
            animId = requestAnimationFrame(draw);
        }
        draw();
        return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", resize); };
    }, []);
    return <canvas ref={canvasRef} className="tp-bg-canvas" />;
}

/* ── Data ── */
const BRANCHES = [
    {
        id: "mehestan",
        icon: "⚖️",
        color: "#4fc3f7",
        title: { en: "Transitional Mehestan", fa: "مجلس موقت" },
        role: { en: "Legislative Branch", fa: "قوه مقننه" },
        items: [
            { en: "Members appointed by Leader; represent full national diversity", fa: "اعضا توسط رهبر منصوب می‌شوند؛ تنوع ملی را نمایندگی می‌کنند" },
            { en: "Head elected internally by absolute majority", fa: "رئیس توسط اکثریت مطلق داخلی انتخاب می‌شود" },
            { en: "Reviews all existing laws (Hybrid Option) — repeals those conflicting with UDHR, national identity, or transition", fa: "بررسی همه قوانین موجود — لغو قوانین مغایر با اعلامیه جهانی حقوق بشر، هویت ملی یا گذار" },
            { en: "Enacts temporary new laws; must consult panel of 5 distinguished jurists for every law", fa: "وضع قوانین موقت؛ مشاوره با پنل ۵ حقوقدان برجسته برای هر قانون الزامی است" },
            { en: "Reviews and approves national annual budget", fa: "بررسی و تصویب بودجه سالانه کشور" },
            { en: "Confirms Supreme Court and Administrative Justice Court judges", fa: "تأیید قضات دیوان عالی کشور و دادگاه عدالت اداری" },
            { en: "Sets Constituent Assembly rules: seat count (70–310) and eligibility criteria", fa: "تعیین قوانین مجلس مؤسسان: تعداد کرسی (۷۰–۳۱۰) و شرایط احراز صلاحیت" },
        ],
    },
    {
        id: "government",
        icon: "🏛️",
        color: "#69d98c",
        title: { en: "Transitional Government", fa: "دولت موقت" },
        role: { en: "Executive Branch", fa: "قوه مجریه" },
        items: [
            { en: "Head appointed by Leader after consulting Mehestan", fa: "رئیس توسط رهبر پس از مشورت با مجلس موقت منصوب می‌شود" },
            { en: "All ministers approved by Mehestan (absolute majority); removed at head's discretion", fa: "تمام وزرا با تصویب اکثریت مطلق مجلس موقت تعیین می‌شوند" },
            { en: "★ Minister of Defense: approved by Leader directly (not Mehestan)", fa: "★ وزیر دفاع: مستقیماً توسط رهبر تصویب می‌شود" },
            { en: "Day-1 declarations: remove 'Islamic Republic' from name, restore Lion & Sun flag, replace anthem with 'Ey Iran'", fa: "اعلامیه‌های روز اول: حذف 'جمهوری اسلامی'، بازگرداندن پرچم شیر و خورشید، تغییر سرود" },
            { en: "Assume control of all embassies; appoint interim envoys; update passports", fa: "کنترل تمام سفارتخانه‌ها؛ انتصاب نمایندگان موقت؛ بروزرسانی گذرنامه‌ها" },
            { en: "Negotiate lifting of all sanctions (financial, trade, military, HR)", fa: "مذاکره برای لغو تمام تحریم‌ها (مالی، تجاری، نظامی، حقوق بشر)" },
            { en: "Hold referendum on system of government within 4 months", fa: "برگزاری رفراندوم درباره نظام حکومتی ظرف ۴ ماه" },
        ],
    },
    {
        id: "divan",
        icon: "🔏",
        color: "#ffd166",
        title: { en: "Transitional Divan", fa: "دیوان موقت" },
        role: { en: "Judicial Branch", fa: "قوه قضاییه" },
        items: [
            { en: "Head appoints: Chief Justice Supreme Court, Chief Justice Admin. Court, Head of Inspectorate, Prisons, Forensic Medicine, Deeds & Properties, Budget Org.", fa: "رئیس منصوب می‌کند: رئیس دیوان عالی، دادگاه اداری، بازرسی، زندان‌ها، پزشکی قانونی، ثبت اسناد، سازمان بودجه" },
            { en: "Attorney General moved to Ministry of Justice (executive), eliminating conflict of duty", fa: "دادستان کل به وزارت دادگستری (قوه مجریه) منتقل می‌شود" },
            { en: "Judicial Council (5 jurists): oversees nationwide judge appointments", fa: "شورای قضایی (۵ حقوقدان): نظارت بر انتصابات قضایی سراسری" },
            { en: "Budget Organization of Divan: independent; government cannot alter it; audited by Supreme Audit Court", fa: "سازمان بودجه دیوان: مستقل؛ دولت نمی‌تواند آن را تغییر دهد" },
            { en: "Transitional Justice Court: crimes Feb 1979–fall; universal jurisdiction; no immunity; no statute of limitations", fa: "دادگاه عدالت انتقالی: جرایم از بهمن ۱۳۵۷ تا سقوط رژیم؛ صلاحیت جهانی؛ بدون مصونیت" },
            { en: "Truth Commission (3 committees): Investigation, Conditional Amnesty, High Committee (apex supervisor)", fa: "کمیسیون حقیقت (۳ کمیته): تحقیق، عفو مشروط، کمیته عالی (ناظر ارشد)" },
        ],
    },
];

const REFORMS = [
    { en: "Remove 'Islamic Republic' from official name; notify all UN states", fa: "حذف 'جمهوری اسلامی' از نام رسمی؛ اطلاع‌رسانی به تمام کشورهای عضو سازمان ملل" },
    { en: "Restore Lion & Sun tricolor flag; notify all UN states and organizations", fa: "بازگرداندن پرچم شیر و خورشید سه‌رنگ؛ اطلاع‌رسانی به سازمان‌های بین‌المللی" },
    { en: "Replace national anthem with 'Ey Iran' until official anthem is chosen", fa: "جایگزینی سرود ملی با 'ای ایران' تا انتخاب سرود رسمی" },
    { en: "Dissolve: Supreme Leader's Office, Assembly of Experts, Expediency Council, Guardian Council", fa: "انحلال: دفتر رهبری، مجلس خبرگان، مجمع تشخیص مصلحت، شورای نگهبان" },
    { en: "Dissolve IRGC: armed wing → National Army; intelligence → NISS; economic/cultural assets → Government", fa: "انحلال سپاه: بازوی نظامی → ارتش ملی؛ اطلاعات → سرین؛ دارایی‌های اقتصادی/فرهنگی → دولت" },
    { en: "Establish NISS (National Intelligence and Security Service) under Transitional Government", fa: "تأسیس سرین (سرویس اطلاعات و امنیت ملی) تحت دولت موقت" },
    { en: "Dissolve IRI Revolutionary Court and Special Clerical Court; restore General Court", fa: "انحلال دادگاه انقلاب و دادگاه ویژه روحانیت؛ احیای دادگاه عمومی" },
    { en: "Transfer Attorney General from judiciary to Ministry of Justice (executive)", fa: "انتقال دادستان کل از قوه قضاییه به وزارت دادگستری (قوه مجریه)" },
    { en: "Establish Bar Association independence mechanism; allocate legal aid budget", fa: "ایجاد مکانیزم استقلال کانون وکلا؛ تخصیص بودجه معاضدت قضایی" },
    { en: "Dissolve Morality Police, Supreme Council of Cultural Revolution, Supreme Council of Cyberspace", fa: "انحلال گشت ارشاد، شورای عالی انقلاب فرهنگی، شورای عالی فضای مجازی" },
    { en: "Dissolve IRI Broadcasting; restore National Iranian Radio and Television", fa: "انحلال صداوسیمای جمهوری اسلامی؛ احیای رادیو و تلویزیون ملی ایران" },
    { en: "Rename Red Crescent → Red Lion and Sun Society; notify Swiss Government (Geneva Convention depositary)", fa: "تغییر نام هلال احمر به جمعیت شیر و خورشید سرخ؛ اطلاع‌رسانی به دولت سوئیس" },
    { en: "Establish transitional justice mechanism to address gross human rights violations", fa: "ایجاد مکانیزم عدالت انتقالی برای رسیدگی به نقض فاحش حقوق بشر" },
];

const PRINCIPLES = [
    { en: "Territorial Integrity", fa: "تمامیت ارضی", icon: "🗺️" },
    { en: "Human Dignity + UDHR 1948 + Cyrus Cylinder", fa: "کرامت انسانی + اعلامیه جهانی حقوق بشر + منشور کوروش", icon: "🕊️" },
    { en: "Democracy — 'one citizen, one vote'", fa: "دموکراسی — 'یک شهروند، یک رأی'", icon: "🗳️" },
    { en: "Rule of Law", fa: "حاکمیت قانون", icon: "⚖️" },
    { en: "Complete Separation of Religion & State", fa: "جدایی کامل دین از حکومت", icon: "🔱" },
    { en: "Separation of Powers", fa: "تفکیک قوا", icon: "🏛️" },
    { en: "Independence and Impartiality of the Divan", fa: "استقلال و بی‌طرفی دیوان", icon: "🔏" },
];

const TIMELINE = [
    { phase: "H+72", label: { en: "Secure Critical Infrastructure", fa: "تأمین زیرساخت‌های حیاتی" }, desc: { en: "Fuel depots, grain, ports, hospitals, water plants, telecom, logistics corridors", fa: "انبارهای سوخت، غله، بنادر، بیمارستان‌ها، تأسیسات آب، مخابرات، کریدورهای لجستیک" }, color: "#ef5350" },
    { phase: "Days 1–10", label: { en: "Seizure & Stabilization", fa: "تصرف و تثبیت" }, desc: { en: "Artesh deployed, cyber neutralization (48–72 hrs), emergency broadcasts, IRGC dissolved", fa: "استقرار ارتش، خنثی‌سازی سایبری (۴۸–۷۲ ساعت)، پخش اضطراری، انحلال سپاه" }, color: "#ff7043" },
    { phase: "Days 11–40", label: { en: "Vetting & Disarmament", fa: "غربالگری و خلع سلاح" }, desc: { en: "3-tier vetting (A/B/C), disarm militant groups, NISS established, diplomatic outreach begins", fa: "غربالگری سه‌مرحله‌ای (الف/ب/پ)، خلع سلاح گروه‌های شبه‌نظامی، تأسیس سرین" }, color: "#ffa726" },
    { phase: "Days 41–100", label: { en: "Build New Institutions", fa: "ساخت نهادهای جدید" }, desc: { en: "New courts operational, sanctions negotiations, NISS active, Bar Association independence", fa: "فعال‌سازی دادگاه‌های جدید، مذاکرات تحریم، سرین فعال، استقلال کانون وکلا" }, color: "#66bb6a" },
    { phase: "Within 4 months", label: { en: "System of Government Referendum", fa: "رفراندوم نظام حکومتی" }, desc: { en: "Parliamentary Monarchy vs. Republic — 3-month campaign, both ballots include 7 immutable principles", fa: "پادشاهی پارلمانی در برابر جمهوری — ۳ ماه کمپین؛ هر دو برگه رأی شامل ۷ اصل تغییرناپذیر" }, color: "#4fc3f7" },
    { phase: "Within 6 months", label: { en: "Constituent Assembly Election", fa: "انتخابات مجلس مؤسسان" }, desc: { en: "70–310 seats, 7-member jurist panel assists drafting, 6-month mandate to write new constitution", fa: "۷۰–۳۱۰ کرسی، پنل ۷ حقوقدان به تهیه پیش‌نویس کمک می‌کند، ۶ ماه مأموریت" }, color: "#ba68c8" },
    { phase: "Within 7 months", label: { en: "Constitutional Referendum", fa: "رفراندوم قانون اساسی" }, desc: { en: "If rejected: 2-month revision + re-vote (up to 3 attempts). If monarchy: coronation within 2 weeks", fa: "در صورت رد: ۲ ماه بازنگری + رأی‌گیری مجدد (تا ۳ بار). در صورت پادشاهی: تاجگذاری ظرف ۲ هفته" }, color: "#4db6ac" },
    { phase: "Completion", label: { en: "Elected Government Sworn In → Full Dissolution", fa: "سوگند دولت منتخب → انحلال کامل" }, desc: { en: "Entire transitional system — including the Leader's role — completely dissolved. All power transfers to democratically elected institutions", fa: "تمام سیستم موقت — شامل نقش رهبر — کاملاً منحل می‌شود. همه قدرت به نهادهای منتخب دموکراتیک منتقل می‌شود" }, color: "#69d98c" },
];

/* ── Components ── */
function BranchCard({ branch, isRTL, t }) {
    const [open, setOpen] = useState(false);
    return (
        <div className={`tp-branch-card${open ? " is-open" : ""}`} style={{ "--branch-color": branch.color }}>
            <button className="tp-branch-header" onClick={() => setOpen(o => !o)}>
                <span className="tp-branch-icon">{branch.icon}</span>
                <div className="tp-branch-titles">
                    <div className="tp-branch-name" style={{ fontFamily: isRTL ? "'Vazirmatn', sans-serif" : "'Inter', sans-serif" }}>
                        {t(branch.title)}
                    </div>
                    <div className="tp-branch-role">{t(branch.role)}</div>
                </div>
                <span className="tp-branch-caret">{open ? "▲" : "▼"}</span>
            </button>
            {open && (
                <ul className="tp-branch-items">
                    {branch.items.map((item, i) => (
                        <li key={i} className="tp-branch-item">
                            <span className="tp-branch-dot" />
                            {t(item)}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

function ReformGrid({ isRTL, t }) {
    return (
        <div className="tp-reforms-grid">
            {REFORMS.map((r, i) => (
                <div key={i} className="tp-reform-item">
                    <span className="tp-reform-num">{String(i + 1).padStart(2, "0")}</span>
                    <span className="tp-reform-text">{t(r)}</span>
                </div>
            ))}
        </div>
    );
}

function PrinciplesRow({ isRTL, t }) {
    return (
        <div className="tp-principles-row">
            {PRINCIPLES.map((p, i) => (
                <div key={i} className="tp-principle-pill" style={{ animationDelay: `${i * 0.06}s` }}>
                    <span className="tp-principle-num">{i + 1}</span>
                    <span className="tp-principle-icon">{p.icon}</span>
                    <span className="tp-principle-label" style={{ fontFamily: isRTL ? "'Vazirmatn', sans-serif" : "'Inter', sans-serif" }}>
                        {t(p)}
                    </span>
                </div>
            ))}
        </div>
    );
}

function TimelineRow({ isRTL, t }) {
    return (
        <div className="tp-timeline">
            {TIMELINE.map((item, i) => (
                <div key={i} className="tp-timeline-item" style={{ "--tl-color": item.color }}>
                    <div className="tp-timeline-dot" />
                    {i < TIMELINE.length - 1 && <div className="tp-timeline-line" />}
                    <div className="tp-timeline-content">
                        <div className="tp-timeline-phase">{item.phase}</div>
                        <div className="tp-timeline-label" style={{ fontFamily: isRTL ? "'Vazirmatn', sans-serif" : "'Inter', sans-serif" }}>
                            {t(item.label)}
                        </div>
                        <div className="tp-timeline-desc">{t(item.desc)}</div>
                    </div>
                </div>
            ))}
        </div>
    );
}

/* ── Main page ── */
export default function TransitionalPage() {
    const { t, isRTL } = useLang();
    const fontFamily = isRTL ? "'Vazirmatn', sans-serif" : "'Inter', sans-serif";

    return (
        <div className="tp-page" dir={isRTL ? "rtl" : "ltr"}>
            <ParticleGrid />
            <div className="tp-scanline" />

            <div className="tp-inner" style={{ fontFamily }}>

                {/* ── Hero ── */}
                <div className="tp-hero">
                    <div className="tp-hero-eyebrow">
                        {isRTL ? "ایران پراسپریتی پروژه · نافدی · فوریه ۲۰۲۶" : "Iran Prosperity Project · NUFDI · February 2026"}
                    </div>
                    <h1 className="tp-hero-title" style={{ fontFamily }}>
                        {isRTL ? "طرح دولت موقت" : "Transitional Government Blueprint"}
                    </h1>
                    <p className="tp-hero-sub">
                        {isRTL
                            ? "یک چارچوب جامع ۱۸–۲۴ ماهه برای گذار ایران از نظام جمهوری اسلامی به یک دموکراسی پایدار — از روز صفر تا تشکیل دولت منتخب"
                            : "A comprehensive 18–24 month framework for Iran's transition from the Islamic Republic to a stable democracy — from Day 1 through the formation of an elected government"
                        }
                    </p>
                    <div className="tp-hero-badges">
                        <span className="tp-badge tp-badge-blue">{isRTL ? "۱۴ کاغذ سفید" : "14 White Papers"}</span>
                        <span className="tp-badge tp-badge-green">{isRTL ? "فاز اضطراری: ۱۸۰ روز" : "Emergency Phase: 180 Days"}</span>
                        <span className="tp-badge tp-badge-purple">{isRTL ? "۷ اصل تغییرناپذیر" : "7 Immutable Principles"}</span>
                    </div>
                </div>

                {/* ── Pre-fall ── */}
                <div className="tp-section">
                    <div className="tp-section-label">
                        {isRTL ? "پیش از سقوط" : "PRE-FALL INSTITUTIONS"}
                    </div>
                    <div className="tp-prefail-grid">
                        <div className="tp-prefail-card">
                            <div className="tp-prefail-card-title" style={{ fontFamily }}>
                                {isRTL ? "شورای قیام ملی" : "National Uprising Council"}
                            </div>
                            <p className="tp-prefail-card-desc">
                                {isRTL
                                    ? "بازوی مشورتی و سیاستگذاری رهبر — اعضا داخل و خارج از ایران — هویت‌ها مخفی تا زمان امنیت"
                                    : "Advisory and policy arm of the Leader — members inside & outside Iran — identities secret until safe to reveal"
                                }
                            </p>
                        </div>
                        <div className="tp-prefail-arrow">→</div>
                        <div className="tp-prefail-center">
                            <div className="tp-leader-badge" style={{ fontFamily }}>
                                {isRTL ? "رهبر قیام ملی" : "Leader of the National Uprising"}
                            </div>
                            <div className="tp-leader-sub">
                                {isRTL ? "فرمانده کل قوا · رئیس دولت" : "Head of State · Commander-in-Chief"}
                            </div>
                        </div>
                        <div className="tp-prefail-arrow">←</div>
                        <div className="tp-prefail-card">
                            <div className="tp-prefail-card-title" style={{ fontFamily }}>
                                {isRTL ? "تیم اجرایی موقت" : "Temporary Executive Team"}
                            </div>
                            <p className="tp-prefail-card-desc">
                                {isRTL
                                    ? "مجری تصمیمات رهبر — اعضا داخل و خارج از ایران — طبق استراتژی ۵ محوری"
                                    : "Implements Leader's decisions — members inside & outside Iran — operates per 5-pronged strategy"
                                }
                            </p>
                        </div>
                    </div>
                    <div className="tp-five-prongs">
                        {[
                            { en: "Max pressure on regime", fa: "حداکثر فشار بر رژیم" },
                            { en: "Max support for people", fa: "حداکثر حمایت از مردم" },
                            { en: "Max defections", fa: "حداکثر فرار از رژیم" },
                            { en: "Max mobilization", fa: "حداکثر بسیج" },
                            { en: "Plan reconstruction (IPP)", fa: "برنامه‌ریزی بازسازی (IPP)" },
                        ].map((p, i) => (
                            <span key={i} className="tp-prong">
                                <span className="tp-prong-n">{i + 1}</span> {t(p)}
                            </span>
                        ))}
                    </div>
                </div>

                {/* ── Stage 1 Three Branches ── */}
                <div className="tp-section">
                    <div className="tp-section-label">
                        {isRTL ? "مرحله اول · سیستم موقت" : "STAGE 1 · TRANSITIONAL SYSTEM"}
                    </div>
                    <h2 className="tp-section-heading" style={{ fontFamily }}>
                        {isRTL ? "سه قوه موقت" : "Three Transitional Branches"}
                    </h2>
                    <p className="tp-section-intro">
                        {isRTL
                            ? "رهبر در ابتدا سران هر سه قوه را منصوب می‌کند. مجلس موقت وزرای دولت را تأیید می‌کند. دیوان موقت بودجه مستقل دارد که دولت نمی‌تواند تغییر دهد. در صورت عدم توانایی رهبر برای خدمت، شورای رهبری موقت (سران هر سه قوه) تشکیل می‌شود."
                            : "The Leader initially appoints all three branch heads. Mehestan approves government ministers. Divan has an independent budget the government cannot alter. Contingency: if the Leader cannot serve, a Temporary Leadership Council (all 3 heads) governs by majority."
                        }
                    </p>
                    <div className="tp-branches">
                        {BRANCHES.map(branch => (
                            <BranchCard key={branch.id} branch={branch} isRTL={isRTL} t={t} />
                        ))}
                    </div>
                </div>

                {/* ── Military ── */}
                <div className="tp-section">
                    <div className="tp-section-label">
                        {isRTL ? "ارتش و امنیت" : "MILITARY & SECURITY"}
                    </div>
                    <div className="tp-military-grid">
                        {[
                            { icon: "🎖️", title: { en: "Artesh Retained", fa: "ارتش حفظ می‌شود" }, desc: { en: "Conventional forces vetted and operational from Day 1", fa: "نیروهای رسمی غربالگری شده و از روز اول عملیاتی هستند" } },
                            { icon: "❌", title: { en: "IRGC Dissolved", fa: "سپاه منحل می‌شود" }, desc: { en: "Armed wing → National Army · Intel → NISS · Economic assets → Government", fa: "بازوی نظامی → ارتش ملی · اطلاعات → سرین · دارایی‌ها → دولت" } },
                            { icon: "🔒", title: { en: "Basij + Quds Force", fa: "بسیج + نیروی قدس" }, desc: { en: "Fully dissolved — no parallel structures permitted", fa: "کاملاً منحل — هیچ ساختار موازی مجاز نیست" } },
                            { icon: "🛡️", title: { en: "NISS Established", fa: "سرین تأسیس می‌شود" }, desc: { en: "National Intelligence & Security Service under Transitional Government, replacing Ministry of Intelligence", fa: "سرویس اطلاعات و امنیت ملی تحت دولت موقت، جایگزین وزارت اطلاعات" } },
                            { icon: "🔍", title: { en: "3-Tier Vetting", fa: "غربالگری سه‌مرحله‌ای" }, desc: { en: "Cat. A: Retain · Cat. B: Retrain · Cat. C: Prosecute — individual case-by-case", fa: "دسته الف: نگه‌دار · دسته ب: آموزش مجدد · دسته پ: پیگرد — بررسی فردی" } },
                            { icon: "👁️", title: { en: "Civilian Oversight", fa: "نظارت مدنی" }, desc: { en: "Mehestan security committees + Inspector-General for each unit", fa: "کمیته‌های امنیتی مجلس موقت + بازرس کل برای هر واحد" } },
                        ].map((item, i) => (
                            <div key={i} className="tp-military-card">
                                <span className="tp-military-icon">{item.icon}</span>
                                <div className="tp-military-title" style={{ fontFamily }}>{t(item.title)}</div>
                                <div className="tp-military-desc">{t(item.desc)}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── Decree & 13 Reforms ── */}
                <div className="tp-section">
                    <div className="tp-section-label">
                        {isRTL ? "فرمان روز اول" : "DAY-1 LEADER'S DECREE"}
                    </div>
                    <h2 className="tp-section-heading" style={{ fontFamily }}>
                        {isRTL ? "۱۳ اصلاح ساختاری فوری" : "13 Immediate Structural Reforms"}
                    </h2>
                    <div className="tp-decree-parts">
                        {[
                            { label: { en: "Part I", fa: "بخش اول" }, title: { en: "Abolish IRI Constitution", fa: "لغو قانون اساسی جمهوری اسلامی" }, desc: { en: "Formally dissolves the regime — creates break with the old order — establishes international legitimacy basis", fa: "انحلال رسمی رژیم — گسست از نظام قدیم — پایه مشروعیت بین‌المللی" }, color: "#ef5350" },
                            { label: { en: "Part II", fa: "بخش دوم" }, title: { en: "Hybrid Option: Retain Existing Laws", fa: "گزینه ترکیبی: حفظ قوانین موجود" }, desc: { en: "All laws remain as default (inspired by Brexit 2020) — prevents legal vacuum — repressive laws repealed", fa: "همه قوانین به عنوان پیش‌فرض باقی می‌مانند (الهام از برگزیت ۲۰۲۰) — جلوگیری از خلاء قانونی" }, color: "#4fc3f7" },
                            { label: { en: "Part III", fa: "بخش سوم" }, title: { en: "Repeal Conflicting Laws", fa: "لغو قوانین متعارض" }, desc: { en: "Repeal laws conflicting with (a) national identity (b) UDHR 1948 (c) transition progress — replacements from Pahlavi era or updated equivalents", fa: "لغو قوانین مغایر با (الف) هویت ملی (ب) اعلامیه جهانی حقوق بشر (پ) پیشرفت گذار" }, color: "#69d98c" },
                        ].map((part, i) => (
                            <div key={i} className="tp-decree-part" style={{ "--dp-color": part.color }}>
                                <div className="tp-decree-part-label">{t(part.label)}</div>
                                <div className="tp-decree-part-title" style={{ fontFamily }}>{t(part.title)}</div>
                                <div className="tp-decree-part-desc">{t(part.desc)}</div>
                            </div>
                        ))}
                    </div>
                    <ReformGrid isRTL={isRTL} t={t} />
                </div>

                {/* ── 7 Immutable Principles ── */}
                <div className="tp-section tp-section-principles">
                    <div className="tp-section-label">
                        {isRTL ? "۷ اصل تغییرناپذیر" : "7 IMMUTABLE PRINCIPLES"}
                    </div>
                    <h2 className="tp-section-heading" style={{ fontFamily }}>
                        {isRTL ? "در هر دو برگه رفراندوم و قانون اساسی جدید" : "On both referendum ballots and enshrined in the new Constitution"}
                    </h2>
                    <PrinciplesRow isRTL={isRTL} t={t} />
                </div>

                {/* ── 180-Day Timeline ── */}
                <div className="tp-section">
                    <div className="tp-section-label">
                        {isRTL ? "جدول زمانی گذار" : "TRANSITION TIMELINE"}
                    </div>
                    <h2 className="tp-section-heading" style={{ fontFamily }}>
                        {isRTL ? "از روز صفر تا دولت منتخب" : "From Day Zero to Elected Government"}
                    </h2>
                    <TimelineRow isRTL={isRTL} t={t} />
                </div>

                {/* ── Stage 2 ── */}
                <div className="tp-section tp-section-stage2">
                    <div className="tp-section-label">
                        {isRTL ? "مرحله دوم · پایان گذار" : "STAGE 2 · PERMANENT DEMOCRACY"}
                    </div>
                    <h2 className="tp-section-heading" style={{ fontFamily }}>
                        {isRTL ? "ساختار دموکراتیک دائمی" : "Permanent Democratic Structure"}
                    </h2>
                    <p className="tp-section-intro">
                        {isRTL
                            ? "تمام اقتدار از رهبر موقت به مردم ایران منتقل می‌شود. با سوگند دولت منتخب، سیستم موقت — از جمله نقش رهبر — کاملاً منحل می‌شود."
                            : "All authority shifts from the temporary Leader to the people of Iran. Upon the elected government's swearing-in, the transitional system — including the Leader's role — is completely dissolved."
                        }
                    </p>
                    <div className="tp-stage2-flow">
                        {[
                            { icon: "👥", label: { en: "The People of Iran", fa: "مردم ایران" }, sub: { en: "Source of all sovereignty", fa: "منبع تمام حاکمیت" } },
                            { icon: "🗳️", label: { en: "Constituent Assembly + Referendum", fa: "مجلس مؤسسان + رفراندوم" }, sub: { en: "Draft & approve new constitution", fa: "تهیه و تصویب قانون اساسی جدید" } },
                            { icon: "📜", label: { en: "New Constitution", fa: "قانون اساسی جدید" }, sub: { en: "Permanent law of the land", fa: "قانون پایدار کشور" } },
                            { icon: "🏛️", label: { en: "3 Elected Branches", fa: "۳ قوه منتخب" }, sub: { en: "Parliament · Government · Independent Judiciary", fa: "پارلمان · دولت · قوه قضاییه مستقل" } },
                        ].map((node, i) => (
                            <React.Fragment key={i}>
                                <div className="tp-s2-node">
                                    <div className="tp-s2-node-icon">{node.icon}</div>
                                    <div className="tp-s2-node-label" style={{ fontFamily }}>{t(node.label)}</div>
                                    <div className="tp-s2-node-sub">{t(node.sub)}</div>
                                </div>
                                {i < 3 && <div className="tp-s2-arrow">↓</div>}
                            </React.Fragment>
                        ))}
                    </div>
                    <div className="tp-dissolution-notice">
                        <span className="tp-dissolution-icon">⚡</span>
                        <span style={{ fontFamily }}>
                            {isRTL
                                ? "در لحظه سوگند دولت منتخب: سیستم موقت کاملاً منحل می‌شود. «سیستم موقت منحل تلقی خواهد شد.» — کتاب فاز اضطراری، بند ۲۱"
                                : "At the moment the elected government is sworn in: the entire transitional system is fully dissolved. \"The Transitional System shall be deemed dissolved.\" — Emergency Phase Booklet, para. 21"
                            }
                        </span>
                    </div>
                </div>

                {/* ── Source note ── */}
                <div className="tp-source-note">
                    {isRTL
                        ? "منبع: کتاب فاز اضطراری (مارس ۲۰۲۶) · ایران پراسپریتی پروژه / نافدی · ۱۴ کاغذ سفید · IranProsperityProject.org"
                        : "Source: Emergency Phase Booklet (March 2026) · Iran Prosperity Project / NUFDI · 14 White Papers · IranProsperityProject.org"
                    }
                </div>

            </div>
        </div>
    );
}
