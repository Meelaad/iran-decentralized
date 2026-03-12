import { describe, it, expect } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useBlueprint, useBlueprintLayout } from './useBlueprints';
import { createWrapper } from '../test/wrapper';
import { MOCK_BLUEPRINT } from '../test/handlers';

describe('useBlueprint', () => {
    it('fetches blueprint from API when no local blueprint is provided', async () => {
        const { result } = renderHook(
            () => useBlueprint('decentralized', null),
            { wrapper: createWrapper() }
        );

        await waitFor(() => expect(result.current.isSuccess).toBe(true));
        expect(result.current.data).toMatchObject({ id: 'decentralized' });
        expect(result.current.data.name).toEqual(MOCK_BLUEPRINT.name);
    });

    it('does not fetch when a local blueprint is provided', () => {
        const localBp = { id: 'decentralized', sectors: [], connections: [] };
        const { result } = renderHook(
            () => useBlueprint('decentralized', localBp),
            { wrapper: createWrapper() }
        );

        // query is disabled — should never enter loading or success state
        expect(result.current.fetchStatus).toBe('idle');
        expect(result.current.data).toBeUndefined();
    });

    it('returns null for an unknown blueprint ID', async () => {
        const { result } = renderHook(
            () => useBlueprint('nonexistent', null),
            { wrapper: createWrapper() }
        );

        await waitFor(() => expect(result.current.isSuccess).toBe(true));
        expect(result.current.data).toBeNull();
    });
});

describe('useBlueprintLayout', () => {
    it('returns empty object when no layout is saved in DB', async () => {
        const { result } = renderHook(
            () => useBlueprintLayout('decentralized'),
            { wrapper: createWrapper() }
        );

        await waitFor(() => expect(result.current.isSuccess).toBe(true));
        expect(result.current.data).toEqual({});
    });
});
