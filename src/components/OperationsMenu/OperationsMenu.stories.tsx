import { Provider } from 'react-redux'
import { expect, spyOn, userEvent, waitFor, within } from 'storybook/test'

import { setCurrentComic } from '@store/comicSlice'
import {
    setShowCopyItemsDialog,
    setShowEditLogDialog,
} from '@store/dialogSlice'
import { makeStore } from '@store/store'
import type { Meta, StoryObj } from '@storybook/react-vite'

import OperationsMenu from './OperationsMenu'

const store = makeStore()

const meta: Meta<typeof OperationsMenu> = {
    component: OperationsMenu,
    decorators: [
        (Story) => (
            <Provider store={store}>
                <Story />
            </Provider>
        ),
    ],
    beforeEach: () => {
        const state = store.getState()

        if (state.comic.current === 0) {
            store.dispatch(setCurrentComic(666))
        }

        const dispatchSpy = spyOn(store, 'dispatch')

        return () => {
            dispatchSpy.mockRestore()
        }
    },
}
export default meta

type Story = StoryObj<typeof OperationsMenu>

export const Default: Story = {
    play: async ({ canvasElement }) => {
        await testMenuItem(
            canvasElement,
            'Copy items from another comic...',
            setShowCopyItemsDialog(666)
        )
        await testMenuItem(
            canvasElement,
            'Show edit log for comic 666...',
            setShowEditLogDialog({ kind: 'comic', comicId: 666 })
        )
        await testMenuItem(
            canvasElement,
            'Show edit log...',
            setShowEditLogDialog({ kind: 'all' })
        )
    },
}

async function testMenuItem<T>(
    canvasElement: HTMLElement,
    menuText: string,
    expectedDispatchedAction: T
) {
    const canvas = within(canvasElement)

    await waitFor(async () => {
        await expect(canvas.queryByText(menuText)).not.toBeInTheDocument()
    })

    const menuButton = canvas.getByRole('button')
    await userEvent.click(menuButton)

    await waitFor(async () => {
        await expect(canvas.getByText(menuText)).toBeInTheDocument()
    })

    await userEvent.click(canvas.getByText(menuText))

    await expect(store.dispatch).toHaveBeenCalledWith(expectedDispatchedAction)

    await waitFor(async () => {
        await expect(canvas.queryByText(menuText)).not.toBeInTheDocument()
    })
}
