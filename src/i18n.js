import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import fa from './locales/fa.json';

const _log = console.log;
console.log = (...args) => { if (typeof args[0] === 'string' && args[0].includes('locize')) return; _log(...args); };
i18n
    .use(initReactI18next)
    .init({
        resources: { en: { translation: en }, fa: { translation: fa } },
        lng: 'fa',
        fallbackLng: 'en',
        interpolation: { escapeValue: false },
    });
console.log = _log;

export default i18n;
