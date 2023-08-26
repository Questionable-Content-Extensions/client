import { useState } from 'react'

import { Item } from '@models/Item'
import { useAppDispatch } from '@store/hooks'
import { setFromItem } from '@store/itemEditorSlice'
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
    QCEXT_SERVER_DEVELOPMENT_URL,
} from '~/mocks'

import ItemDataPanel from './ItemDataPanel'

export default {
    component: ItemDataPanel,
    argTypes: {
        onGoToComic: { action: 'onGoToComic' },
        onShowItemData: { action: 'onShowItemData' },
        onDeleteImage: { action: 'onDeleteImage' },
        onSetPrimaryImage: { action: 'onSetPrimaryImage' },
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
