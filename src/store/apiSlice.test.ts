import { describe, expect, it } from 'vitest'

import type { EndpointSpec } from '@endpoints/EndpointSpec'

import { queryFromSpec } from './apiSlice'

describe('queryFromSpec', () => {
    it('builds a bare GET url when there are no path params, query, or body', () => {
        const spec = {
            method: 'GET',
            path: 'itemdata/',
        } satisfies EndpointSpec<never, never, never, unknown>

        expect(queryFromSpec(spec)).toEqual({ url: 'itemdata/' })
    })

    it('substitutes an object-form path param', () => {
        const spec = {
            method: 'GET',
            path: 'comicdata/{comicId}',
        } satisfies EndpointSpec<never, never, { comicId: number }, unknown>

        expect(queryFromSpec(spec, { pathParams: { comicId: 42 } })).toEqual({
            url: 'comicdata/42',
        })
    })

    it('substitutes a scalar-form path param', () => {
        const spec = {
            method: 'GET',
            path: 'itemdata/{itemId}',
        } satisfies EndpointSpec<never, never, number, unknown>

        expect(queryFromSpec(spec, { pathParams: 7 })).toEqual({
            url: 'itemdata/7',
        })
    })

    it('appends a query string, including repeated keys for array values', () => {
        const spec = {
            method: 'GET',
            path: 'comicdata/containing-items',
        } satisfies EndpointSpec<
            { 'item-id'?: number[] },
            never,
            never,
            unknown
        >

        const result = queryFromSpec(spec, {
            query: { 'item-id': [1, 2, 3] },
        })
        expect(result.url).toBe(
            'comicdata/containing-items?item-id=1&item-id=2&item-id=3'
        )
    })

    it('omits undefined query values', () => {
        const spec = {
            method: 'GET',
            path: 'comicdata/excluded',
        } satisfies EndpointSpec<{ exclusion?: string }, never, never, unknown>

        expect(queryFromSpec(spec, { query: {} })).toEqual({
            url: 'comicdata/excluded',
        })
    })

    it('builds a JSON body with the spec method and content-type header', () => {
        const spec = {
            method: 'PATCH',
            path: 'itemdata/{itemId}',
        } satisfies EndpointSpec<never, { name: string }, number, unknown>

        expect(
            queryFromSpec(spec, { pathParams: 3, body: { name: 'Bob' } })
        ).toEqual({
            url: 'itemdata/3',
            configuration: {
                data: JSON.stringify({ name: 'Bob' }),
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                },
            },
        })
    })

    it('sets the method without a body for non-GET requests with no body', () => {
        const spec = {
            method: 'DELETE',
            path: 'itemdata/image/{imageId}',
        } satisfies EndpointSpec<never, never, number, unknown>

        expect(queryFromSpec(spec, { pathParams: 5 })).toEqual({
            url: 'itemdata/image/5',
            configuration: { method: 'DELETE' },
        })
    })
})
