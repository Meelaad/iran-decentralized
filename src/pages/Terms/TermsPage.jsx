import { useLang } from '../../contexts/LangContext';
import './TermsPage.css';

const SECTIONS = [
    {
        heading: { en: 'Acceptance of Terms', fa: 'پذیرش شرایط' },
        body: {
            en: 'By accessing or using IranDAO, you agree to be bound by these Terms of Use. If you do not agree to these terms, you may not access or use the platform. We reserve the right to update these terms at any time, and continued use constitutes acceptance of any changes.',
            fa: 'با دسترسی یا استفاده از ایران‌دائو، موافقت خود را با این شرایط استفاده اعلام می‌کنید. در صورت عدم موافقت، از استفاده از پلتفرم خودداری کنید. ما حق داریم این شرایط را در هر زمان به‌روزرسانی کنیم و ادامه استفاده به منزله پذیرش تغییرات است.',
        },
    },
    {
        heading: { en: 'Eligibility', fa: 'شرایط عضویت' },
        body: {
            en: 'You must be at least 16 years of age to use IranDAO. By using the platform you confirm that you meet this requirement. Participation in certain civic actions, including voting, may require additional age verification.',
            fa: 'برای استفاده از ایران‌دائو باید حداقل ۱۶ سال سن داشته باشید. با استفاده از پلتفرم تأیید می‌کنید که این شرط را دارید. مشارکت در برخی اقدامات مدنی، از جمله رأی‌گیری، ممکن است نیاز به تأیید سن بیشتری داشته باشد.',
        },
    },
    {
        heading: { en: 'User Conduct', fa: 'رفتار کاربر' },
        body: {
            en: 'You agree not to misuse the platform. Prohibited conduct includes but is not limited to: creating fake accounts, manipulating votes or civic scores, submitting false identity documents, distributing spam or malicious content, attempting to circumvent security measures, or engaging in any activity that disrupts platform integrity.',
            fa: 'موافقت می‌کنید که از پلتفرم سوءاستفاده نکنید. رفتارهای ممنوعه شامل موارد زیر است اما به آن‌ها محدود نمی‌شود: ایجاد حساب‌های جعلی، دستکاری آرا یا امتیازات مدنی، ارسال مدارک هویتی جعلی، توزیع محتوای مخرب، تلاش برای دور زدن اقدامات امنیتی، یا هر فعالیتی که یکپارچگی پلتفرم را مختل کند.',
        },
    },
    {
        heading: { en: 'Invite System', fa: 'سیستم دعوت‌نامه' },
        body: {
            en: 'Access to IranDAO requires a valid invite code. Invite codes are non-transferable for commercial purposes and must not be sold. Users who abuse the invite system, including inviting bad-faith actors, may have their account suspended and their civic score penalised.',
            fa: 'دسترسی به ایران‌دائو نیاز به کد دعوت معتبر دارد. کدهای دعوت برای اهداف تجاری غیرقابل انتقال هستند و نباید فروخته شوند. کاربرانی که از سیستم دعوت سوءاستفاده کنند، از جمله دعوت افراد بدنیت، ممکن است حساب‌شان تعلیق شود و امتیاز مدنی‌شان کاهش یابد.',
        },
    },
    {
        heading: { en: 'Intellectual Property', fa: 'مالکیت معنوی' },
        body: {
            en: 'All content, governance blueprints, design elements, and software on IranDAO are protected intellectual property. You may not reproduce, distribute, or create derivative works without explicit permission. User-submitted content remains your property but you grant IranDAO a licence to display and use it within the platform.',
            fa: 'تمام محتوا، طرح‌های حاکمیتی، عناصر طراحی و نرم‌افزار ایران‌دائو مالکیت معنوی محافظت‌شده هستند. بدون اجازه صریح نمی‌توانید آن‌ها را تکثیر، توزیع یا آثار مشتق ایجاد کنید. محتوای ارسال‌شده توسط کاربر دارایی شما باقی می‌ماند اما به ایران‌دائو مجوز نمایش و استفاده از آن در پلتفرم را می‌دهید.',
        },
    },
    {
        heading: { en: 'Disclaimers', fa: 'سلب مسئولیت' },
        body: {
            en: 'IranDAO is a civic blueprint and deliberation platform — it does not constitute legal, political, or governmental authority of any kind. All governance models presented are proposals for democratic deliberation only. The platform is provided "as is" without warranties of any kind, express or implied.',
            fa: 'ایران‌دائو یک پلتفرم طرح مدنی و مشورت است — هیچ‌گونه اقتدار قانونی، سیاسی یا دولتی ندارد. تمام مدل‌های حاکمیتی ارائه‌شده صرفاً پیشنهاداتی برای بررسی و گفتگوی دموکراتیک هستند. پلتفرم به صورت «همان‌طور که هست» بدون هیچ‌گونه ضمانتی ارائه می‌شود.',
        },
    },
    {
        heading: { en: 'Termination', fa: 'خاتمه' },
        body: {
            en: 'We reserve the right to suspend or terminate accounts that violate these terms, engage in bad-faith participation, or otherwise compromise the integrity of the platform. Users may also delete their own account at any time by contacting support.',
            fa: 'ما حق داریم حساب‌هایی را که این شرایط را نقض می‌کنند، مشارکت بدنیتانه دارند، یا به هر نحوی یکپارچگی پلتفرم را به خطر می‌اندازند تعلیق یا خاتمه دهیم. کاربران می‌توانند حساب خود را در هر زمان با تماس با پشتیبانی حذف کنند.',
        },
    },
    {
        heading: { en: 'Contact', fa: 'تماس' },
        body: {
            en: 'Questions about these Terms of Use can be directed to us through the contact page.',
            fa: 'سؤالات مربوط به این شرایط استفاده را می‌توانید از طریق صفحه تماس به ما بفرستید.',
        },
    },
];

export default function TermsPage() {
    const { t, isRTL } = useLang();
    const monoFont    = { fontFamily: isRTL ? "'Irancell', sans-serif" : "'intelone-mono', monospace" };
    const headingFont = { fontFamily: isRTL ? "'Vazirmatn', sans-serif" : "'Inter', sans-serif" };

    return (
        <div className="terms-page">
            <div className="terms-bg-grid" />
            <div className="terms-scanline" />

            <div className="terms-inner" dir={isRTL ? 'rtl' : 'ltr'}>
                <div className="terms-header">
                    <div className="terms-eyebrow" style={monoFont}>
                        {isRTL ? 'سند قانونی' : 'LEGAL'}
                    </div>
                    <h1 className="terms-title" style={headingFont}>
                        {isRTL ? 'شرایط استفاده' : 'Terms of Use'}
                    </h1>
                    <p className="terms-date" style={monoFont}>
                        {isRTL ? 'آخرین به‌روزرسانی: مارس ۲۰۲۶' : 'Last updated: March 2026'}
                    </p>
                </div>

                <div className="terms-card">
                    {SECTIONS.map((s, i) => (
                        <div className="terms-section" key={i}>
                            <h2 className="terms-section-heading" style={headingFont}>
                                {t(s.heading)}
                            </h2>
                            <p className="terms-section-body">
                                {t(s.body)}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
