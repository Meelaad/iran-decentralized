import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useLang } from '../../contexts/LangContext';
import { searchStatic } from '../../lib/search/staticIndex';
import CONTENT from '../../locales/pages/search.json';
import './SearchPage.css';

const TYPE_LABELS = {
    blueprint: { en: 'Blueprint', fa: 'طرح حکومتی' },
    sector:    { en: 'Sector',    fa: 'بخش' },
    plan:      { en: 'Plan',      fa: 'برنامه' },
    page:      { en: 'Page',      fa: 'صفحه' },
};

const MAX_Q = 100;
function sanitizeQuery(q) {
    return String(q ?? '').replace(/[<>"'`]/g, '').trim().slice(0, MAX_Q);
}

function useDebounce(value, delay) {
    const [debounced, setDebounced] = useState(value);
    useEffect(() => {
        const id = setTimeout(() => setDebounced(value), delay);
        return () => clearTimeout(id);
    }, [value, delay]);
    return debounced;
}

function ResultCard({ item, lang }) {
    const title = lang === 'fa' ? (item.title_fa || item.title_en) : (item.title_en || item.title_fa);
    const body  = lang === 'fa' ? (item.body_fa  || item.body_en)  : (item.body_en  || item.body_fa);
    const typeLabel = (lang === 'fa' ? TYPE_LABELS[item.type]?.fa : TYPE_LABELS[item.type]?.en) ?? item.type;

    return (
        <Link to={item.url} className="sr-card">
            <span className="sr-card-type">{typeLabel}</span>
            <div className="sr-card-title">{title}</div>
            {body && <p className="sr-card-body">{body.length > 160 ? body.slice(0, 160) + '…' : body}</p>}
        </Link>
    );
}

export default function SearchPage() {
    const { lang, isRTL, monoFont, headFont, tKey, t } = useLang();
    const [searchParams, setSearchParams] = useSearchParams();
    const initialQ = sanitizeQuery(searchParams.get('q') ?? '');

    const [query, setQuery]         = useState(initialQ);
    const [dbResults, setDbResults] = useState([]);
    const [dbLoading, setDbLoading] = useState(false);
    const [dbError,   setDbError]   = useState(null);
    const inputRef = useRef(null);

    const debouncedQuery = useDebounce(query, 280);

    // Static results (Fuse.js — instant)
    const staticResults = debouncedQuery.length >= 2
        ? searchStatic(debouncedQuery).map(r => r.item)
        : [];

    // DB results (arena plans only)
    useEffect(() => {
        if (debouncedQuery.length < 2) { setDbResults([]); return; }
        setDbLoading(true);
        setDbError(null);
        const controller = new AbortController();
        fetch(`/api/public/search?q=${encodeURIComponent(debouncedQuery)}`, { signal: controller.signal })
            .then(r => r.json())
            .then(data => { setDbResults(data.results ?? []); })
            .catch(err => { if (err.name !== 'AbortError') setDbError(true); })
            .finally(() => setDbLoading(false));
        return () => controller.abort();
    }, [debouncedQuery]);

    // Keep URL in sync
    useEffect(() => {
        if (debouncedQuery) setSearchParams({ q: debouncedQuery }, { replace: true });
        else setSearchParams({}, { replace: true });
    }, [debouncedQuery, setSearchParams]);

    // Auto-focus on mount
    useEffect(() => { inputRef.current?.focus(); }, []);

    // Merge: DB results first (more dynamic), then static not already in DB
    const dbIds = new Set(dbResults.map(r => `${r.type}:${r.id}`));
    const filteredStatic = staticResults.filter(r => !dbIds.has(`${r.type}:${r.id}`));
    const allResults = [...dbResults, ...filteredStatic];

    const hasQuery   = debouncedQuery.length >= 2;
    const isLoading  = dbLoading;
    const noResults  = hasQuery && !isLoading && allResults.length === 0;

    const handleInput = e => {
        setQuery(sanitizeQuery(e.target.value));
    };

    return (
        <div className="sr-root" dir={isRTL ? 'rtl' : 'ltr'} style={{ fontFamily: headFont }}>
            <div className="sr-hero">
                <h1 className="sr-title" style={{ fontFamily: headFont }}>
                    {t(CONTENT.title)}
                </h1>
                <div className="sr-input-wrap">
                    <span className="sr-input-icon" aria-hidden>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                            <circle cx="11" cy="11" r="7" />
                            <line x1="17" y1="17" x2="22" y2="22" />
                        </svg>
                    </span>
                    <input
                        ref={inputRef}
                        className="sr-input"
                        type="search"
                        value={query}
                        onChange={handleInput}
                        placeholder={t(CONTENT.placeholder)}
                        maxLength={MAX_Q}
                        style={{ fontFamily: monoFont }}
                        autoComplete="off"
                        spellCheck={false}
                    />
                    {query && (
                        <button className="sr-clear" onClick={() => setQuery('')} aria-label="Clear">✕</button>
                    )}
                </div>
            </div>

            <div className="sr-body">
                {!hasQuery && (
                    <p className="sr-hint" style={{ fontFamily: monoFont }}>
                        {t(CONTENT.hint)}
                    </p>
                )}

                {isLoading && (
                    <div className="sr-loading" style={{ fontFamily: monoFont }}>
                        {t(CONTENT.searching)}
                    </div>
                )}

                {dbError && (
                    <div className="sr-error" style={{ fontFamily: monoFont }}>
                        {t(CONTENT.errorAdvanced)}
                    </div>
                )}

                {noResults && (
                    <p className="sr-no-results" style={{ fontFamily: monoFont }}>
                        {t(CONTENT.noResults).replace('{q}', debouncedQuery)}
                    </p>
                )}

                {allResults.length > 0 && (
                    <div className="sr-results-wrap">
                        <div className="sr-count" style={{ fontFamily: monoFont }}>
                            {allResults.length === 1
                                ? t(CONTENT.resultCount).replace('{n}', allResults.length)
                                : t(CONTENT.resultCountPlural).replace('{n}', allResults.length)}
                        </div>
                        <div className="sr-results">
                            {allResults.map(item => (
                                <ResultCard key={`${item.type}:${item.id}`} item={item} lang={lang} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
