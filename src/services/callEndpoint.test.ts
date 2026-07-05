import { afterEach, describe, expect, it, vi } from 'vitest'

import type { EndpointSpec } from '@endpoints/EndpointSpec'

import { callEndpoint } from './callEndpoint'

describe('callEndpoint', () => {
    afterEach(() => {
        vi.unstubAllGlobals()
    })

    it('repeats the key for each array-valued query param', async () => {
        const fetchMock = vi.fn().mockResolvedValue({
            ok: true,
            json: () => Promise.resolve({}),
        })
        vi.stubGlobal('fetch', fetchMock)

        const spec = {
            method: 'GET',
            path: 'comicdata/containing-items',
        } satisfies EndpointSpec<
            { 'item-id'?: number[] },
            never,
            never,
            unknown
        >

        await callEndpoint(spec, { query: { 'item-id': [1, 2, 3] } })

        expect(fetchMock).toHaveBeenCalledWith(
            '/api/v3/comicdata/containing-items?item-id=1&item-id=2&item-id=3',
            expect.anything()
        )
    })

    it('omits the query string entirely when there are no query params', async () => {
        const fetchMock = vi.fn().mockResolvedValue({
            ok: true,
            json: () => Promise.resolve({}),
        })
        vi.stubGlobal('fetch', fetchMock)

        const spec = {
            method: 'GET',
            path: 'itemdata/',
        } satisfies EndpointSpec<never, never, never, unknown>

        await callEndpoint(spec)

        expect(fetchMock).toHaveBeenCalledWith(
            '/api/v3/itemdata/',
            expect.anything()
        )
    })
})
