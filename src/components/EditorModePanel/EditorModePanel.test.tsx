import { afterEach, describe, expect, it, vi } from 'vitest'

import { render } from '@testing-library/react'

import EditorModePanel from './EditorModePanel'

vi.mock('@store/api/comicApiSlice', () => ({
    useGetComicDataQuery: () => ({
        data: undefined,
        isFetching: false,
        isLoading: false,
        isError: false,
        error: undefined,
    }),
    toGetDataQueryArgs: vi.fn(),
}))

vi.mock('@store/api/itemApiSlice', () => ({
    useAllItemsQuery: () => ({
        data: undefined,
        isLoading: false,
        isFetching: false,
        isError: false,
        refetch: vi.fn(),
    }),
}))

const fakeState = {
    settings: { values: undefined },
    comic: { current: 0 },
    comicEditor: {
        title: '',
        tagline: '',
        publishDate: '',
        isAccuratePublishDate: false,
        originalTitle: '',
        originalTagline: '',
        originalPublishDate: '',
        originalIsAccuratePublishDate: false,
        isSaving: false,
    },
}

vi.mock('@store/hooks', () => ({
    useAppSelector: (selector: (state: typeof fakeState) => unknown) =>
        selector(fakeState),
    useAppDispatch: () => vi.fn(),
}))

describe('EditorModePanel', () => {
    afterEach(() => {
        vi.restoreAllMocks()
    })

    it('registers exactly one resize listener, regardless of how many times it re-renders', () => {
        const addEventListenerSpy = vi.spyOn(window, 'addEventListener')
        const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener')

        const { rerender } = render(<EditorModePanel />)
        rerender(<EditorModePanel />)
        rerender(<EditorModePanel />)

        const resizeAddCalls = addEventListenerSpy.mock.calls.filter(
            ([type]) => type === 'resize'
        )
        const resizeRemoveCalls = removeEventListenerSpy.mock.calls.filter(
            ([type]) => type === 'resize'
        )

        expect(resizeAddCalls).toHaveLength(1)
        expect(resizeRemoveCalls).toHaveLength(0)
    })
})
