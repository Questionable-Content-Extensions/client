import { PresentComic } from '@models/PresentComic'
import { ComponentMeta, ComponentStory } from '@storybook/react'

import { COMIC_DATA_666 } from '~/mocks'

import FilteredNavigationData from './FilteredNavigationData'

export default {
    component: FilteredNavigationData,
} as ComponentMeta<typeof FilteredNavigationData>

const Template: ComponentStory<typeof FilteredNavigationData> = (args) => {
    return <FilteredNavigationData {...args} />
}

export const Default = Template.bind({})
Default.args = {
    editMode: false,
    isFetching: true,
    isLoading: false,
    itemData: (COMIC_DATA_666 as PresentComic).items,
    useColors: true,
}
