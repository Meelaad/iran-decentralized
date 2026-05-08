import { useLang } from '../../contexts/LangContext';
import './PrivacyPage.css';
import CONTENT from '../../locales/pages/privacy.json';

const { sections: SECTIONS } = CONTENT;

export default function PrivacyPage() {
    const { t, isRTL, monoFont, headFont } = useLang();

    return (
        <div className="priv-page" dir={isRTL ? 'rtl' : 'ltr'} style={{ fontFamily: headFont }}>
            <div className="priv-bg-grid" />
            <div className="priv-scanline" />

            <div className="priv-inner">
                <div className="priv-header">
                    <div className="priv-eyebrow" style={{ fontFamily: monoFont }}>
                        {t(CONTENT.eyebrow)}
                    </div>
                    <h1 className="priv-title" style={{ fontFamily: headFont }}>
                        {t(CONTENT.title)}
                    </h1>
                    <p className="priv-date" style={{ fontFamily: monoFont }}>
                        {t(CONTENT.date)}
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
