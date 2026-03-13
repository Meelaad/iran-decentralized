import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { createWrapper } from '../../test/wrapper';
import VotePage from './VotePage';

// Mock supabase client
const mockSupabase = {
    auth: {
        getSession: vi.fn(),
    },
    from: vi.fn(),
    rpc: vi.fn(),
};

vi.mock('../../lib/supabase', () => ({
    supabase: mockSupabase,
}));

describe('VotePage', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        sessionStorage.clear();
    });

    it('shows age gate when user has not verified age', async () => {
        mockSupabase.auth.getSession.mockResolvedValue({
            data: { session: { user: { id: 'test-user' } } },
        });
        mockSupabase.from.mockReturnValue({
            select: vi.fn().mockReturnValue({
                eq: vi.fn().mockReturnValue({
                    single: vi.fn().mockResolvedValue({
                        data: { birth_date: null },
                    }),
                }),
            }),
        });
        mockSupabase.rpc.mockResolvedValue({ data: [] });

        render(<VotePage />, { wrapper: createWrapper() });

        await waitFor(() => {
            expect(screen.getByText(/verify your age/i)).toBeInTheDocument();
        });
    });

    it('shows vote results when age is verified', async () => {
        sessionStorage.setItem('irdao_age_ok', 'true');
        mockSupabase.auth.getSession.mockResolvedValue({
            data: { session: { user: { id: 'test-user' } } },
        });
        mockSupabase.from.mockReturnValue({
            select: vi.fn().mockReturnValue({
                eq: vi.fn().mockReturnValue({
                    single: vi.fn().mockResolvedValue({
                        data: { preferred_blueprint: 'decentralized' },
                    }),
                }),
            }),
        });
        mockSupabase.rpc.mockResolvedValue({
            data: [
                { blueprint_id: 'decentralized', votes: 150 },
                { blueprint_id: 'constMonarchy', votes: 50 },
            ],
        });

        render(<VotePage />, { wrapper: createWrapper() });

        await waitFor(() => {
            expect(screen.getByText(/200/)).toBeInTheDocument(); // Total votes
        });
    });

    it('shows too-young message for users under 18', async () => {
        mockSupabase.auth.getSession.mockResolvedValue({
            data: { session: { user: { id: 'test-user' } } },
        });
        mockSupabase.from.mockReturnValue({
            select: vi.fn().mockReturnValue({
                eq: vi.fn().mockReturnValue({
                    single: vi.fn().mockResolvedValue({
                        data: { birth_date: '2010-01-01' }, // 15 years old
                    }),
                }),
            }),
        });
        mockSupabase.rpc.mockResolvedValue({ data: [] });

        render(<VotePage />, { wrapper: createWrapper() });

        await waitFor(() => {
            expect(screen.getByText(/not yet eligible/i)).toBeInTheDocument();
        });
    });
});
