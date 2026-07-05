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

function buildFakeState(title: string) {
    return {
        settings: { values: undefined },
        comic: { current: 0 },
        comicEditor: {
            title,
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
}

let fakeState = buildFakeState('')

vi.mock('@store/hooks', () => ({
    useAppSelector: (
        selector: (state: ReturnType<typeof buildFakeState>) => unknown
    ) => selector(fakeState),
    useAppDispatch: () => vi.fn(),
}))

describe('EditorModePanel', () => {
    afterEach(() => {
        fakeState = buildFakeState('')
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

    it('prevents the default beforeunload behavior when the editor is dirty', () => {
        fakeState = buildFakeState('unsaved title')

        render(<EditorModePanel />)

        const event = new Event('beforeunload', {
            cancelable: true,
        }) as BeforeUnloadEvent
        window.dispatchEvent(event)

        expect(event.defaultPrevented).toBe(true)
    })

    it('does not prevent the default beforeunload behavior when there are no unsaved changes', () => {
        render(<EditorModePanel />)

        const event = new Event('beforeunload', {
            cancelable: true,
        }) as BeforeUnloadEvent
        window.dispatchEvent(event)

        expect(event.defaultPrevented).toBe(false)
    })
})
