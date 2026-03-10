import { useLang } from '../../contexts/LangContext';
import './PrivacyPage.css';

const SECTIONS = [
    {
        heading: { en: 'Overview', fa: 'مرور کلی' },
        body: {
            en: 'IranDAO is a decentralized governance platform. This policy explains what information we collect and how we use it.',
            fa: 'ایران‌دائو یک پلتفرم حاکمیت غیرمتمرکز است. این سیاست توضیح می‌دهد که چه اطلاعاتی جمع‌آوری می‌کنیم و چگونه از آن استفاده می‌کنیم.',
        },
    },
    {
        heading: { en: 'What We Collect', fa: 'آنچه جمع‌آوری می‌کنیم' },
        body: {
            en: 'We collect information and technical data from your device to operate and protect the platform. This includes information you provide during registration and technical signals from your browser used for security purposes.',
            fa: 'ما اطلاعات و داده‌های فنی از دستگاه شما را برای راه‌اندازی و محافظت از پلتفرم جمع‌آوری می‌کنیم. این شامل اطلاعاتی است که در هنگام ثبت‌نام ارائه می‌دهید و سیگنال‌های فنی از مرورگر شما که برای اهداف امنیتی استفاده می‌شود.',
        },
    },
    {
        heading: { en: 'How We Use It', fa: 'چگونه استفاده می‌کنیم' },
        body: {
            en: 'Collected information is used solely to operate the platform, verify identities, detect abuse, and protect the community. We do not sell, share, or transfer your data to third parties.',
            fa: 'اطلاعات جمع‌آوری‌شده صرفاً برای راه‌اندازی پلتفرم، تأیید هویت، تشخیص سوءاستفاده و حفاظت از جامعه استفاده می‌شود. ما داده‌های شما را به اشخاص ثالث نمی‌فروشیم، به اشتراک نمی‌گذاریم یا منتقل نمی‌کنیم.',
        },
    },
    {
        heading: { en: 'Data Security', fa: 'امنیت داده' },
        body: {
            en: 'Your data is stored securely and access is strictly limited to platform administrators. We take reasonable technical measures to protect against unauthorised access.',
            fa: 'داده‌های شما به صورت امن ذخیره می‌شود و دسترسی به آن‌ها کاملاً محدود به مدیران پلتفرم است. ما اقدامات فنی معقولی برای محافظت در برابر دسترسی غیرمجاز انجام می‌دهیم.',
        },
    },
    {
        heading: { en: 'Contact', fa: 'تماس' },
        body: {
            en: 'If you have questions about this policy or your data, contact us through the support page.',
            fa: 'اگر سؤالی درباره این سیاست یا داده‌های خود دارید، از طریق صفحه پشتیبانی با ما تماس بگیرید.',
        },
    },
];

export default function PrivacyPage() {
    const { t, isRTL } = useLang();
    const monoFont    = { fontFamily: isRTL ? "'Irancell', sans-serif" : "'IBM Plex Mono', monospace" };
    const headingFont = { fontFamily: isRTL ? "'Vazirmatn', sans-serif" : "'Inter', sans-serif" };

    return (
        <div className="priv-page">
            <div className="priv-bg-grid" />
            <div className="priv-scanline" />

            <div className="priv-inner" dir={isRTL ? 'rtl' : 'ltr'}>
                <div className="priv-header">
                    <div className="priv-eyebrow" style={monoFont}>
                        {isRTL ? 'سند قانونی' : 'LEGAL'}
                    </div>
                    <h1 className="priv-title" style={headingFont}>
                        {isRTL ? 'سیاست حریم خصوصی' : 'Privacy Policy'}
                    </h1>
                    <p className="priv-date" style={monoFont}>
                        {isRTL ? 'آخرین به‌روزرسانی: مارس ۲۰۲۶' : 'Last updated: March 2026'}
                    </p>
                </div>

                <div className="priv-card">
                    {SECTIONS.map((s, i) => (
                        <div className="priv-section" key={i}>
                            <h2 className="priv-section-heading" style={headingFont}>
                                {t(s.heading)}
                            </h2>
                            <p className="priv-section-body">
                                {t(s.body)}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
