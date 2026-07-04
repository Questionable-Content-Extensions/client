import { expect, fn, userEvent, waitFor, within } from 'storybook/test'

import { setCurrentComic } from '@store/comicSlice'
import store from '@store/store'
import type { Meta, StoryObj } from '@storybook/react-vite'

import { COMIC_DATA_666_HYDRATED_ITEMS, FAYE } from '~/mocks'

import FilteredNavigationData from './FilteredNavigationData'

const meta: Meta<typeof FilteredNavigationData> = {
    component: FilteredNavigationData,
    argTypes: {
        onAddItem: { action: 'onAddItem' },
    },
    args: {
        editMode: false,
        isFetching: false,
        isLoading: false,
        isSaving: false,
        hasError: false,
        itemData: COMIC_DATA_666_HYDRATED_ITEMS,
        useColors: true,
        onAddItem: fn(),
    },
    loaders: [
        () => {
            const state = store.getState()

            if (state.comic.current !== 666) {
                store.dispatch(setCurrentComic(666))
            }
        },
    ],
}
export default meta

type Story = StoryObj<typeof FilteredNavigationData>

export const Default: Story = {}

export const NoColors: Story = {
    args: {
        useColors: false,
    },
}

export const Loading: Story = {
    args: {
        isLoading: true,
    },
}

export const Fetching: Story = {
    args: {
        isFetching: true,
    },
}

export const Saving: Story = {
    args: {
        isSaving: true,
    },
}

export const HasError: Story = {
    args: {
        hasError: true,
    },
}

export const EditMode: Story = {
    args: {
        editMode: true,
    },
}

export const EditModeAddFirstMatchViaEnter: Story = {
    args: {
        editMode: true,
    },
    play: async ({ canvasElement, args }) => {
        const canvas = within(canvasElement)

        const input = canvas.getByPlaceholderText('Filter non-present')
        await userEvent.type(input, FAYE.shortName)

        await waitFor(async () =>
            expect(
                canvas.getByTitle(`Add ${FAYE.shortName} to comic`)
            ).toBeInTheDocument()
        )

        await expect(args.onAddItem).not.toHaveBeenCalled()
        await userEvent.keyboard('{Enter}')
        await expect(args.onAddItem).toHaveBeenCalledWith({
            new: false,
            itemId: FAYE.id,
        })

        await waitFor(async () => expect(input).toHaveValue(''))
    },
}

export const EditModeAddNewViaCtrlEnter: Story = {
    args: {
        editMode: true,
    },
    play: async ({ canvasElement, args }) => {
        const canvas = within(canvasElement)

        const input = canvas.getByPlaceholderText('Filter non-present')
        await userEvent.type(input, '!Newbie')

        await waitFor(async () =>
            expect(canvas.getByTitle('Add cast')).toBeInTheDocument()
        )

        await expect(args.onAddItem).not.toHaveBeenCalled()
        await userEvent.keyboard('{Control>}{Enter}{/Control}')
        await expect(args.onAddItem).toHaveBeenCalledWith({
            new: true,
            newItemName: 'Newbie',
            newItemType: 'cast',
        })

        await waitFor(async () => expect(input).toHaveValue(''))
    },
}
