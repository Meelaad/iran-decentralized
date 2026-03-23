import { useLang } from '../../contexts/LangContext';
import './PrivacyPage.css';
import CONTENT from '../../locales/pages/privacy.json';

const { sections: SECTIONS } = CONTENT;

export default function PrivacyPage() {
    const { t, isRTL, monoFont, headFont } = useLang();

    return (
        <div className="priv-page">
            <div className="priv-bg-grid" />
            <div className="priv-scanline" />

            <div className="priv-inner" dir={isRTL ? 'rtl' : 'ltr'}>
                <div className="priv-header">
                    <div className="priv-eyebrow" style={{ fontFamily: monoFont }}>
                        {isRTL ? 'سند قانونی' : 'LEGAL'}
                    </div>
                    <h1 className="priv-title" style={{ fontFamily: headFont }}>
                        {isRTL ? 'سیاست حریم خصوصی' : 'Privacy Policy'}
                    </h1>
                    <p className="priv-date" style={{ fontFamily: monoFont }}>
                        {isRTL ? 'آخرین به‌روزرسانی: مارس ۲۰۲۶' : 'Last updated: March 2026'}
                    </p>
                </div>

                <div className="priv-card">
                    {SECTIONS.map((s, i) => (
                        <div className="priv-section" key={i}>
                            <h2 className="priv-section-heading" style={{ fontFamily: headFont }}>
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
