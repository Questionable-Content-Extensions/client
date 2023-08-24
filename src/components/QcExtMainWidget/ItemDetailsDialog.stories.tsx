import { Item as ItemData } from '@models/Item'
import { ItemImageList as ItemImageData } from '@models/ItemImageList'
import { RelatedItem as ItemRelationData } from '@models/RelatedItem'
import { ComponentMeta, ComponentStory } from '@storybook/react'

import {
    COFFEE_OF_DOOM,
    COFFEE_OF_DOOM_FRIENDS,
    COFFEE_OF_DOOM_LOCATIONS,
    FAYE,
    FAYE_FRIENDS,
    FAYE_IMAGES,
    FAYE_LOCATIONS,
    MANY_IMAGES,
} from '~/mocks'

import { ItemDataPanel } from './ItemDetailsDialog'

/**
 * This URL will be functional if you start the QC dev server
 * with its default port
 */
const QCEXT_SERVER_DEFAULT_URL = 'http://localhost:3000/api/itemdata/'

export default {
    component: ItemDataPanel,
    argTypes: {
        onGoToComic: { action: 'goto-comic' },
        onShowItemData: { action: 'show-item-data' },
    },
    title: 'Components/QcExtMainWidget/ItemDataPanel',
} as ComponentMeta<typeof ItemDataPanel>

const Template: ComponentStory<typeof ItemDataPanel> = (args) => {
    return <ItemDataPanel {...args} />
}

export const Default = Template.bind({})
Default.args = {
    itemDataUrl: QCEXT_SERVER_DEFAULT_URL,
    itemData: FAYE,
    itemImageData: FAYE_IMAGES,
    itemFriendData: FAYE_FRIENDS,
    itemLocationData: FAYE_LOCATIONS,
    editMode: false,
}

export const Editor = Template.bind({})
Editor.args = {
    ...Default.args,
    editMode: true,
}

export const Loading = Template.bind({})
Loading.args = {
    ...Default.args,
    itemData: null,
}

export const NoImages = Template.bind({})
NoImages.args = {
    ...Default.args,
    itemImageData: [],
}

export const MultipleImages = Template.bind({})
MultipleImages.args = {
    ...Default.args,
    itemImageData: MANY_IMAGES,
}

export const NoRelations = Template.bind({})
NoRelations.args = {
    ...Default.args,
    itemFriendData: [],
    itemLocationData: [],
}

export const Location = Template.bind({})
Location.args = {
    ...Default.args,
    itemData: COFFEE_OF_DOOM,
    itemImageData: [],
    itemFriendData: COFFEE_OF_DOOM_FRIENDS,
    itemLocationData: COFFEE_OF_DOOM_LOCATIONS,
}
