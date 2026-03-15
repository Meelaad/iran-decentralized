import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { createWrapper } from '../../test/wrapper';
import ProfilePage from './ProfilePage';

// Mock useAuth hook
vi.mock('../../hooks/useAuth', () => ({
    useAuth: () => ({
        session: { user: { id: 'test-user-id', email: 'test@example.com' } },
        authLoading: false,
        isAdmin: false,
        profileName: 'Test',
        logout: vi.fn(),
    }),
}));

describe('ProfilePage', () => {
    it('renders profile information when authenticated', async () => {
        render(<ProfilePage />, { wrapper: createWrapper() });

        await waitFor(() => {
            expect(screen.getAllByText('Test User').length).toBeGreaterThan(0);
        });

        expect(screen.getAllByText(/Citizen/i).length).toBeGreaterThan(0);
        expect(screen.getAllByText(/Iran/i).length).toBeGreaterThan(0);
    });

    it('displays invite codes section', async () => {
        render(<ProfilePage />, { wrapper: createWrapper() });

        await waitFor(() => {
            expect(screen.getByText(/INVITE CODES/i)).toBeInTheDocument();
        });

        expect(screen.getByText('ABCD1234')).toBeInTheDocument();
        expect(screen.getByText('EFGH5678')).toBeInTheDocument();
    });
});
