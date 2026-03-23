import { useLang } from '../../contexts/LangContext';
import './TermsPage.css';
import CONTENT from '../../locales/pages/terms.json';

const { sections: SECTIONS } = CONTENT;

export default function TermsPage() {
    const { t, isRTL, monoFont, headFont } = useLang();

    return (
        <div className="terms-page">
            <div className="terms-bg-grid" />
            <div className="terms-scanline" />

            <div className="terms-inner" dir={isRTL ? 'rtl' : 'ltr'}>
                <div className="terms-header">
                    <div className="terms-eyebrow" style={{ fontFamily: monoFont }}>
                        {isRTL ? 'سند قانونی' : 'LEGAL'}
                    </div>
                    <h1 className="terms-title" style={{ fontFamily: headFont }}>
                        {isRTL ? 'شرایط استفاده' : 'Terms of Use'}
                    </h1>
                    <p className="terms-date" style={{ fontFamily: monoFont }}>
                        {isRTL ? 'آخرین به‌روزرسانی: مارس ۲۰۲۶' : 'Last updated: March 2026'}
                    </p>
                </div>

                <div className="terms-card">
                    {SECTIONS.map((s, i) => (
                        <div className="terms-section" key={i}>
                            <h2 className="terms-section-heading" style={{ fontFamily: headFont }}>
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
