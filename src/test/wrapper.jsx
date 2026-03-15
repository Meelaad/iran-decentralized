import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import { LangProvider } from '../contexts/LangContext';
import i18n from '../i18n';

// Tests expect English text by default
i18n.changeLanguage('en');

/**
 * Creates a fresh QueryClient per test (no shared cache between tests).
 * Wraps children in QueryClientProvider + MemoryRouter + LangProvider (en).
 */
export function createWrapper({ lang = 'en' } = {}) {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: { retry: false },
            mutations: { retry: false },
        },
    });

    return function Wrapper({ children }) {
        return (
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <LangProvider initialLang={lang}>{children}</LangProvider>
                </MemoryRouter>
            </QueryClientProvider>
        );
    };
}
