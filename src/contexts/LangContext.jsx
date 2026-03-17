import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import i18n from '../i18n';
import { useTranslation } from 'react-i18next';

export const LangContext = createContext({
    lang: 'fa',
    setLang: () => {},
    t: (obj) => obj?.en ?? '',
    tKey: (key) => key,
    isRTL: true,
});

export function useLang() {
    return useContext(LangContext);
}

export function LangProvider({ children, initialLang = 'fa' }) {
    const [lang, setLangState] = useState(() => localStorage.getItem('irdao-lang') || initialLang);
    const { t: tI18n } = useTranslation();

    // Sync i18n to stored language on mount (guards against i18n.js init order issues)
    useEffect(() => {
        i18n.changeLanguage(lang);
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // t() handles both data objects {en, fa} and i18next string keys
    const t = useCallback((obj) => {
        if (!obj) return '';
        if (typeof obj === 'object') return obj[lang] ?? obj.en ?? '';
        return String(obj);
    }, [lang]);

    // tKey() is for JSON locale keys, e.g. tKey('nav.map')
    const tKey = useCallback((key, opts) => tI18n(key, opts), [tI18n]);

    const setLang = useCallback((newLang) => {
        setLangState(newLang);
        i18n.changeLanguage(newLang);
        localStorage.setItem('irdao-lang', newLang);
    }, []);

    const isRTL = lang === 'fa';

    return (
        <LangContext.Provider value={{ lang, setLang, t, tKey, isRTL }}>
            {children}
        </LangContext.Provider>
    );
}
