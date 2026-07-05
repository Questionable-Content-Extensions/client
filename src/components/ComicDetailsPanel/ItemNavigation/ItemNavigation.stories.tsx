import { fn } from 'storybook/test'

import { NavElementMode } from '@components/NavElement/NavElement'
import { setCurrentComic, setLockedToItem } from '@store/comicSlice'
import store from '@store/store'
import type { Meta, StoryObj } from '@storybook/react-vite'

import { COMIC_DATA_666_HYDRATED_ITEMS } from '~/mocks'

import ItemNavigation from './ItemNavigation'

const meta: Meta<typeof ItemNavigation> = {
    component: ItemNavigation,
    argTypes: {
        mode: {
            control: 'select',
            options: [
                NavElementMode[NavElementMode.Present],
                NavElementMode[NavElementMode.Missing],
            ],
        },
    },
    args: {
        itemNavigationData: COMIC_DATA_666_HYDRATED_ITEMS,
        useColors: true,
        isLoading: false,
        isFetching: false,
        mode: NavElementMode[NavElementMode.Present] as unknown as
            NavElementMode.Present | NavElementMode.Missing,
        editMode: false,
        onSetCurrentComic: fn(),
        onShowInfoFor: fn(),
        onRemoveItem: fn(),
        onAddItem: fn(),
        onAddFirstMatchChange: fn(),
    },
    // For better Storybook experience, the control shows the enum's string
    // names, but the component needs the underlying numeric enum value.
    render: (args) => {
        const mode =
            typeof args.mode === 'string'
                ? (NavElementMode[args.mode] as unknown as
                      NavElementMode.Present | NavElementMode.Missing)
                : args.mode

        return <ItemNavigation {...args} mode={mode} />
    },
    loaders: [
        (context) => {
            const state = store.getState()

            if (state.comic.current !== 666) {
                store.dispatch(setCurrentComic(666))
            }
            const lockedToItemId = context.args.lockedToItemId
            store.dispatch(setLockedToItem(lockedToItemId ?? null))
        },
    ],
}
export default meta

type Story = StoryObj<typeof ItemNavigation>

export const Default: Story = {}

export const WithoutColor: Story = {
    args: {
        useColors: false,
    },
}

export const InitialLoading: Story = {
    args: {
        isLoading: true,
    },
}

export const ConsecutiveLoading: Story = {
    args: {
        isFetching: true,
    },
}

export const NoData: Story = {
    args: {
        itemNavigationData: [],
    },
}

export const AllItemsMode: Story = {
    args: {
        mode: NavElementMode[NavElementMode.Missing] as unknown as
            NavElementMode.Present | NavElementMode.Missing,
    },
}

export const AllItemsModeNoData: Story = {
    args: {
        itemNavigationData: [],
        mode: NavElementMode[NavElementMode.Missing] as unknown as
            NavElementMode.Present | NavElementMode.Missing,
    },
}

export const EditMode: Story = {
    args: {
        editMode: true,
    },
}

export const AllItemsEditMode: Story = {
    args: {
        editMode: true,
        mode: NavElementMode[NavElementMode.Missing] as unknown as
            NavElementMode.Present | NavElementMode.Missing,
    },
}

export const LockedToItem: Story = {
    args: {
        lockedToItemId: 4,
    },
}
