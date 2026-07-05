import { describe, expect, it, vi } from 'vitest'

import { skipToken } from '@reduxjs/toolkit/dist/query'
import { renderHook } from '@testing-library/react'

import Settings from '~/Settings'

import useHydratedItemData from './useHydratedItemData'

const useAllItemsQuery = vi.fn()
const useGetComicDataQuery = vi.fn()

vi.mock('@store/api/comicApiSlice', () => ({
    toGetDataQueryArgs: (comic: number) => ({ comic }),
    useGetComicDataQuery: (...args: unknown[]) => useGetComicDataQuery(...args),
}))

vi.mock('@store/api/itemApiSlice', () => ({
    useAllItemsQuery: (...args: unknown[]) => useAllItemsQuery(...args),
}))

const queryResult = {
    data: undefined,
    isLoading: false,
    isFetching: false,
    isError: false,
    refetch: vi.fn(),
}

describe('useHydratedItemData', () => {
    it('runs both queries by default', () => {
        useAllItemsQuery.mockReturnValue(queryResult)
        useGetComicDataQuery.mockReturnValue(queryResult)

        renderHook(() => useHydratedItemData(1, Settings.DEFAULTS))

        expect(useAllItemsQuery).toHaveBeenCalledWith(undefined, {
            skip: false,
        })
        expect(useGetComicDataQuery).toHaveBeenCalledWith({ comic: 1 })
    })

    it('skips both queries while disabled, e.g. behind a hidden dialog', () => {
        useAllItemsQuery.mockReturnValue(queryResult)
        useGetComicDataQuery.mockReturnValue(queryResult)

        renderHook(() => useHydratedItemData(1, Settings.DEFAULTS, false))

        expect(useAllItemsQuery).toHaveBeenCalledWith(undefined, {
            skip: true,
        })
        expect(useGetComicDataQuery).toHaveBeenCalledWith(skipToken)
    })
})
