import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';

/**
 * Creates a fresh QueryClient per test (no shared cache between tests).
 * Wraps children in QueryClientProvider + MemoryRouter.
 */
export function createWrapper() {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: { retry: false },
            mutations: { retry: false },
        },
    });

    return function Wrapper({ children }) {
        return (
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>{children}</MemoryRouter>
            </QueryClientProvider>
        );
    };
}
