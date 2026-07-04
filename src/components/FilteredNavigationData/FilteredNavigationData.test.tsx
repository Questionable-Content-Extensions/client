import { describe, expect, it, vi } from 'vitest'

import { fireEvent, render, screen, waitFor } from '@testing-library/react'

import FilteredNavigationData from './FilteredNavigationData'

function renderComponent(onAddItem: (item: unknown) => Promise<void>) {
    return render(
        <FilteredNavigationData
            isLoading={false}
            isFetching={false}
            isSaving={false}
            hasError={false}
            itemData={[]}
            onSetCurrentComic={vi.fn()}
            onShowInfoFor={vi.fn()}
            useColors={false}
            orderMembersByLastAppearance={false}
            editMode={true}
            onAddItem={onAddItem}
        />
    )
}

describe('FilteredNavigationData', () => {
    it('does not produce an unhandled rejection when adding an item fails', async () => {
        const onAddItem = vi.fn().mockRejectedValue(new Error('add failed'))
        const unhandledRejections: unknown[] = []
        const onUnhandledRejection = (event: PromiseRejectionEvent) => {
            unhandledRejections.push(event.reason)
        }
        window.addEventListener('unhandledrejection', onUnhandledRejection)

        try {
            renderComponent(onAddItem)

            fireEvent.change(
                screen.getByPlaceholderText('Filter non-present'),
                // "!" prefix picks the "cast" type explicitly, avoiding the
                // ambiguous-type alert path in handleAddNew.
                { target: { value: '!Something' } }
            )
            // The "Add new" button only enables once the debounced filter
            // (500ms) catches up with the typed value.
            await waitFor(
                () => expect(screen.getByText(/Add new/)).toBeEnabled(),
                { timeout: 1000 }
            )
            fireEvent.click(screen.getByText(/Add new/))

            await waitFor(() => expect(onAddItem).toHaveBeenCalledTimes(1))
            // Give the rejected promise a tick to (not) surface as unhandled.
            await new Promise((resolve) => setTimeout(resolve, 0))

            expect(unhandledRejections).toHaveLength(0)
            // The filter is only cleared on success, so it should remain.
            expect(
                screen.getByPlaceholderText('Filter non-present')
            ).toHaveValue('!Something')
        } finally {
            window.removeEventListener(
                'unhandledrejection',
                onUnhandledRejection
            )
        }
    })

    it('clears the filter once adding an item succeeds', async () => {
        const onAddItem = vi.fn().mockResolvedValue(undefined)
        renderComponent(onAddItem)

        fireEvent.change(screen.getByPlaceholderText('Filter non-present'), {
            target: { value: '!Something' },
        })
        await waitFor(() => expect(screen.getByText(/Add new/)).toBeEnabled(), {
            timeout: 1000,
        })
        fireEvent.click(screen.getByText(/Add new/))

        await waitFor(() => expect(onAddItem).toHaveBeenCalledTimes(1))
        await waitFor(() =>
            expect(
                screen.getByPlaceholderText('Filter non-present')
            ).toHaveValue('')
        )
    })
})
