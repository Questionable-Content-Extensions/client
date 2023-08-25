import { useState } from 'react'

import { Item } from '@models/Item'
import { useAppDispatch } from '@store/hooks'
import { setFromItem } from '@store/itemEditorSlice'
import { ComponentMeta, ComponentStory } from '@storybook/react'

import constants from '~/constants'
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

import ItemDataPanel from './ItemDataPanel'

/**
 * This URL will be functional if you start the QC dev server
 * with its default port
 */
const QCEXT_SERVER_DEVELOPMENT_URL =
    `${constants.developmentBaseUrl}itemdata/` as const

export default {
    component: ItemDataPanel,
    argTypes: {
        onGoToComic: { action: 'goto-comic' },
        onShowItemData: { action: 'show-item-data' },
    },
} as ComponentMeta<typeof ItemDataPanel>

const Template: ComponentStory<typeof ItemDataPanel> = (args) => {
    const dispatch = useAppDispatch()
    const [previousItem, setPreviousItem] = useState<Item | null>(null)
    if (previousItem !== args.itemData && args.itemData) {
        setPreviousItem(args.itemData)
        dispatch(setFromItem(args.itemData))
    }
    return <ItemDataPanel {...args} />
}

export const Default = Template.bind({})
Default.args = {
    itemDataUrl: QCEXT_SERVER_DEVELOPMENT_URL,
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
