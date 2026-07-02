import { setCurrentComic } from '@store/comicSlice'
import store from '@store/store'
import type { Meta, StoryObj } from '@storybook/react-vite'

import { COMIC_DATA_666_HYDRATED_ITEMS } from '~/mocks'

import FilteredNavigationData from './FilteredNavigationData'

const meta: Meta<typeof FilteredNavigationData> = {
    component: FilteredNavigationData,
    args: {
        editMode: false,
        isFetching: false,
        isLoading: false,
        isSaving: false,
        hasError: false,
        itemData: COMIC_DATA_666_HYDRATED_ITEMS,
        useColors: true,
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
