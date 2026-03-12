import { describe, it, expect } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useProfile, useInviteCodes } from './useProfile';
import { createWrapper } from '../test/wrapper';
import { MOCK_PROFILE, MOCK_INVITE_CODES } from '../test/handlers';

describe('useProfile', () => {
    it('fetches profile data for an authenticated user', async () => {
        const { result } = renderHook(
            () => useProfile('test-user-id'),
            { wrapper: createWrapper() }
        );

        await waitFor(() => expect(result.current.isSuccess).toBe(true));
        expect(result.current.data).toMatchObject({
            id: MOCK_PROFILE.id,
            full_name: MOCK_PROFILE.full_name,
            user_type: MOCK_PROFILE.user_type,
        });
    });

    it('does not fetch when userId is undefined', () => {
        const { result } = renderHook(
            () => useProfile(undefined),
            { wrapper: createWrapper() }
        );

        expect(result.current.fetchStatus).toBe('idle');
        expect(result.current.data).toBeUndefined();
    });
});

describe('useInviteCodes', () => {
    it('returns invite codes for the authenticated user', async () => {
        const { result } = renderHook(
            () => useInviteCodes('test-user-id'),
            { wrapper: createWrapper() }
        );

        await waitFor(() => expect(result.current.isSuccess).toBe(true));
        expect(result.current.data).toHaveLength(MOCK_INVITE_CODES.length);
        expect(result.current.data[0].code).toBe('ABCD1234');
    });

    it('does not fetch when userId is undefined', () => {
        const { result } = renderHook(
            () => useInviteCodes(undefined),
            { wrapper: createWrapper() }
        );

        expect(result.current.fetchStatus).toBe('idle');
    });
});
