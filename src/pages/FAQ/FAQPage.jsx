import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLang } from '../../contexts/LangContext';
import CONTENT from '../../locales/pages/faq.json';
import './FAQPage.css';

function ChevronIcon({ open }) {
    return (
        <svg className={`faq-chevron${open ? ' faq-chevron--open' : ''}`} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9" />
        </svg>
    );
}

function FAQItem({ item, isRTL }) {
    const [open, setOpen] = useState(false);
    return (
        <div className={`faq-item${open ? ' faq-item--open' : ''}`}>
            <button className="faq-question" onClick={() => setOpen(o => !o)}>
                <span>{isRTL ? item.q.fa : item.q.en}</span>
                <ChevronIcon open={open} />
            </button>
            {open && (
                <div className="faq-answer">
                    {isRTL ? item.a.fa : item.a.en}
                </div>
            )}
        </div>
    );
}

export default function FAQPage() {
    const { isRTL, headFont } = useLang();

    return (
        <div className="faq-root" dir={isRTL ? 'rtl' : 'ltr'} style={{ fontFamily: headFont }}>
            <div className="faq-hero">
                <p className="faq-eyebrow">HELP CENTER</p>
                <h1 className="faq-title">{isRTL ? CONTENT.pageTitle.fa : CONTENT.pageTitle.en}</h1>
                <p className="faq-subtitle">{isRTL ? CONTENT.pageSubtitle.fa : CONTENT.pageSubtitle.en}</p>
            </div>

            <div className="faq-body">
                {CONTENT.sections.map((section, si) => (
                    <section key={si} className="faq-section">
                        <h2 className="faq-section-title">
                            {isRTL ? section.title.fa : section.title.en}
                        </h2>
                        <div className="faq-list">
                            {section.items.map((item, ii) => (
                                <FAQItem key={ii} item={item} isRTL={isRTL} />
                            ))}
                        </div>
                    </section>
                ))}

                <div className="faq-contact-prompt">
                    <p>{isRTL ? CONTENT.contactPrompt.fa : CONTENT.contactPrompt.en}</p>
                    <Link to="/contact" className="faq-contact-link">
                        {isRTL ? CONTENT.contactLink.fa : CONTENT.contactLink.en} →
                    </Link>
                </div>
            </div>
        </div>
    );
}
