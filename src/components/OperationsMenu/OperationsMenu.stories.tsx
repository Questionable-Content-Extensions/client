import { Provider } from 'react-redux'

import { setCurrentComic } from '@store/comicSlice'
import {
    setShowCopyItemsDialog,
    setShowEditLogDialog,
} from '@store/dialogSlice'
import { makeStore } from '@store/store'
import { expect, jest } from '@storybook/jest'
import { Meta, StoryFn } from '@storybook/react'
import { userEvent, waitFor, within } from '@storybook/testing-library'

import OperationsMenu from './OperationsMenu'

export default {
    component: OperationsMenu,
} as Meta<typeof OperationsMenu>

const store = makeStore()

const Template: StoryFn<typeof OperationsMenu> = (args) => {
    const origDispatch = store.dispatch
    store.dispatch = jest.fn(origDispatch) as any
    // Let's set up the Redux store to be the way we need
    const state = store.getState()

    if (state.comic.current === 0) {
        store.dispatch(setCurrentComic(666))
    }

    return (
        <Provider store={store}>
            <OperationsMenu {...args} />
        </Provider>
    )
}

export const Default = Template.bind({})
Default.play = async ({ canvasElement, args: _args }) => {
    await testMenuItem(
        canvasElement,
        'Copy items from another comic...',
        setShowCopyItemsDialog(666)
    )
    await testMenuItem(
        canvasElement,
        'Show edit log for comic 666...',
        setShowEditLogDialog(666)
    )
    await testMenuItem(
        canvasElement,
        'Show edit log...',
        setShowEditLogDialog(true)
    )
}
async function testMenuItem<T>(
    canvasElement: HTMLElement,
    menuText: string,
    expectedDispatchedAction: T
) {
    const canvas = within(canvasElement)

    await waitFor(async () => {
        expect(canvas.queryByText(menuText)).not.toBeInTheDocument()
    })

    const menuButton = canvas.getByRole('button')
    await userEvent.click(menuButton)

    await waitFor(async () => {
        expect(canvas.getByText(menuText)).toBeInTheDocument()
    })

    await userEvent.click(canvas.getByText(menuText))

    expect(store.dispatch).toHaveBeenCalledWith(expectedDispatchedAction)

    await waitFor(async () => {
        expect(canvas.queryByText(menuText)).not.toBeInTheDocument()
    })
}
