import { NavElementMode } from '@components/NavElement/NavElement'
import { setCurrentComic } from '@store/comicSlice'
import store from '@store/store'
import { Meta, StoryFn } from '@storybook/react'

import { COMIC_DATA_666_HYDRATED_ITEMS } from '~/mocks'

import ItemNavigation from './ItemNavigation'

export default {
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
} as Meta<typeof ItemNavigation>

const Template: StoryFn<typeof ItemNavigation> = (args) => {
    // For better Storybook experience, we pretend this field is a string
    // and then turn it into a number here
    const mode = args.mode
    if (typeof mode === 'string') {
        args.mode = NavElementMode[mode] as unknown as
            | NavElementMode.Present
            | NavElementMode.Missing
    }

    const state = store.getState()

    if (state.comic.current !== 666) {
        store.dispatch(setCurrentComic(666))
    }

    return <ItemNavigation {...args} />
}

export const Default = Template.bind({})
Default.args = {
    itemNavigationData: COMIC_DATA_666_HYDRATED_ITEMS,
    useColors: true,
    isLoading: false,
    isFetching: false,
    mode: NavElementMode[NavElementMode.Present] as unknown as
        | NavElementMode.Present
        | NavElementMode.Missing,
    editMode: false,
}

export const WithoutColor = Template.bind({})
WithoutColor.args = {
    ...Default.args,
    useColors: false,
}

export const InitialLoading = Template.bind({})
InitialLoading.args = {
    ...Default.args,
    isLoading: true,
}

export const ConsecutiveLoading = Template.bind({})
ConsecutiveLoading.args = {
    ...Default.args,
    isFetching: true,
}

export const NoData = Template.bind({})
NoData.args = {
    ...Default.args,
    itemNavigationData: [],
}

export const AllItemsMode = Template.bind({})
AllItemsMode.args = {
    ...Default.args,
    mode: NavElementMode[NavElementMode.Missing] as unknown as
        | NavElementMode.Present
        | NavElementMode.Missing,
}

export const AllItemsModeNoData = Template.bind({})
AllItemsModeNoData.args = {
    ...Default.args,
    itemNavigationData: [],
    mode: NavElementMode[NavElementMode.Missing] as unknown as
        | NavElementMode.Present
        | NavElementMode.Missing,
}

export const EditMode = Template.bind({})
EditMode.args = {
    ...Default.args,
    editMode: true,
}

export const AllItemsEditMode = Template.bind({})
AllItemsEditMode.args = {
    ...Default.args,
    editMode: true,
    mode: NavElementMode[NavElementMode.Missing] as unknown as
        | NavElementMode.Present
        | NavElementMode.Missing,
}
