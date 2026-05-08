import { useLang } from '../../contexts/LangContext';
import './TermsPage.css';
import CONTENT from '../../locales/pages/terms.json';

const { sections: SECTIONS } = CONTENT;

export default function TermsPage() {
    const { t, isRTL, monoFont, headFont } = useLang();

    return (
        <div className="terms-page" dir={isRTL ? 'rtl' : 'ltr'} style={{ fontFamily: headFont }}>
            <div className="terms-bg-grid" />
            <div className="terms-scanline" />

            <div className="terms-inner">
                <div className="terms-header">
                    <div className="terms-eyebrow" style={{ fontFamily: monoFont }}>
                        {t(CONTENT.eyebrow)}
                    </div>
                    <h1 className="terms-title" style={{ fontFamily: headFont }}>
                        {t(CONTENT.title)}
                    </h1>
                    <p className="terms-date" style={{ fontFamily: monoFont }}>
                        {t(CONTENT.date)}
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
