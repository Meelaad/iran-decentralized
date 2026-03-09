import { createContext, useContext, useState, useCallback } from 'react';

export const LangContext = createContext({
    lang: 'fa',
    setLang: () => {},
    t: (obj) => obj?.en ?? '',
    isRTL: true,
});

export function useLang() {
    return useContext(LangContext);
}

export function LangProvider({ children }) {
    const [lang, setLang] = useState('fa');
    const t = useCallback((obj) => (obj ? obj[lang] ?? obj.en : ''), [lang]);
    const isRTL = lang === 'fa';

    return (
        <LangContext.Provider value={{ lang, setLang, t, isRTL }}>
            {children}
        </LangContext.Provider>
    );
}