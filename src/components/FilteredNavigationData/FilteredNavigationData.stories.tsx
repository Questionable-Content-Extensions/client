import { Meta, StoryFn } from '@storybook/react'

import { COMIC_DATA_666_HYDRATED_ITEMS } from '~/mocks'

import FilteredNavigationData from './FilteredNavigationData'

export default {
    component: FilteredNavigationData,
} as Meta<typeof FilteredNavigationData>

const Template: StoryFn<typeof FilteredNavigationData> = (args) => {
    return <FilteredNavigationData {...args} />
}

export const Default = Template.bind({})
Default.args = {
    editMode: false,
    isFetching: false,
    isLoading: false,
    isSaving: false,
    hasError: false,
    itemData: COMIC_DATA_666_HYDRATED_ITEMS,
    useColors: true,
}

export const NoColors = Template.bind({})
NoColors.args = {
    ...Default.args,
    useColors: false,
}

export const Loading = Template.bind({})
Loading.args = {
    ...Default.args,
    isLoading: true,
}

export const Fetching = Template.bind({})
Fetching.args = {
    ...Default.args,
    isFetching: true,
}

export const Saving = Template.bind({})
Saving.args = {
    ...Default.args,
    isSaving: true,
}

export const HasError = Template.bind({})
HasError.args = {
    ...Default.args,
    hasError: true,
}

export const EditMode = Template.bind({})
EditMode.args = {
    ...Default.args,
    editMode: true,
}
