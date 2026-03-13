import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import ErrorBoundary from './ErrorBoundary';

// Component that throws an error
function CrashingComponent() {
    throw new Error('Test crash');
}

// Component that works normally
function WorkingComponent() {
    return <div>Working content</div>;
}

describe('ErrorBoundary', () => {
    // Suppress console.error for these tests
    const originalError = console.error;
    beforeAll(() => {
        console.error = vi.fn();
    });
    afterAll(() => {
        console.error = originalError;
    });

    it('renders children when no error occurs', () => {
        render(
            <ErrorBoundary>
                <WorkingComponent />
            </ErrorBoundary>
        );

        expect(screen.getByText('Working content')).toBeInTheDocument();
    });

    it('renders error UI when child component crashes', () => {
        render(
            <ErrorBoundary>
                <CrashingComponent />
            </ErrorBoundary>
        );

        expect(screen.getByText('Something went wrong')).toBeInTheDocument();
        expect(screen.getByText(/unexpected error occurred/i)).toBeInTheDocument();
    });

    it('shows recovery buttons in error state', () => {
        render(
            <ErrorBoundary>
                <CrashingComponent />
            </ErrorBoundary>
        );

        expect(screen.getByText(/TRY AGAIN/i)).toBeInTheDocument();
        expect(screen.getByText(/RETURN TO MAP/i)).toBeInTheDocument();
    });

    it('displays SYSTEM ERROR label', () => {
        render(
            <ErrorBoundary>
                <CrashingComponent />
            </ErrorBoundary>
        );

        expect(screen.getByText('SYSTEM ERROR')).toBeInTheDocument();
    });
});
