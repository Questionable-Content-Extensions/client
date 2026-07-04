import { toast } from 'react-toastify'
import { describe, expect, it, vi } from 'vitest'

import { configureStore, createAsyncThunk } from '@reduxjs/toolkit'

import { warn } from '~/utils'

import { rtkQueryErrorLogger } from './rtkQueryErrorLogger'

vi.mock('react-toastify', () => ({
    toast: { info: vi.fn(), error: vi.fn() },
}))
vi.mock('~/utils', () => ({ warn: vi.fn() }))

function buildStore() {
    return configureStore({
        reducer: (state = {}) => state,
        middleware: (getDefaultMiddleware) =>
            getDefaultMiddleware().concat(rtkQueryErrorLogger),
    })
}

describe('rtkQueryErrorLogger', () => {
    it('does not throw when a rejected thunk carries an undefined payload (e.g. comicEditor/itemEditor saveChanges failures)', async () => {
        const thunk = createAsyncThunk(
            'test/undefinedPayload',
            async (_arg: void, { rejectWithValue }) =>
                rejectWithValue(undefined)
        )
        const store = buildStore()

        const result = await store.dispatch(thunk())

        expect(thunk.rejected.match(result)).toBe(true)
    })

    it('warns instead of throwing when a rejected thunk carries a truthy, non-object payload', async () => {
        const thunk = createAsyncThunk(
            'test/primitivePayload',
            async (_arg: void, { rejectWithValue }) => rejectWithValue('boom')
        )
        const store = buildStore()

        const result = await store.dispatch(thunk())

        expect(thunk.rejected.match(result)).toBe(true)
        expect(warn).toHaveBeenCalled()
    })

    it('still recognizes a MAINTENANCE greasemonkey error payload and shows a toast', async () => {
        const thunk = createAsyncThunk(
            'test/maintenance',
            async (_arg: void, { rejectWithValue }) =>
                rejectWithValue({ type: 'MAINTENANCE' })
        )
        const store = buildStore()

        await store.dispatch(thunk())

        expect(toast.info).toHaveBeenCalled()
    })

    it('warns instead of throwing for a rejected payload without a recognized type', async () => {
        const thunk = createAsyncThunk(
            'test/unrecognized',
            async (_arg: void, { rejectWithValue }) =>
                rejectWithValue({ someOtherField: true })
        )
        const store = buildStore()

        const result = await store.dispatch(thunk())

        expect(thunk.rejected.match(result)).toBe(true)
        expect(warn).toHaveBeenCalled()
    })
})
