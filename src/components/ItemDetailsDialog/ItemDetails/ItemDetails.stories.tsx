import { useState } from 'react'

import { Item } from '@models/Item'
import { useAppDispatch } from '@store/hooks'
import { setFromItem } from '@store/itemEditorSlice'
import { ComponentMeta, ComponentStory } from '@storybook/react'

import { FAYE } from '~/mocks'

import ItemDetails from './ItemDetails'

export default {
    component: ItemDetails,
    argTypes: {
        onGoToComic: { action: 'onGoToComic' },
    },
} as ComponentMeta<typeof ItemDetails>

const Template: ComponentStory<typeof ItemDetails> = (args) => {
    const dispatch = useAppDispatch()
    const [previousItem, setPreviousItem] = useState<Item | null>(null)
    if (previousItem !== args.item) {
        setPreviousItem(args.item)
        dispatch(setFromItem(args.item))
    }
    return <ItemDetails {...args} />
}

export const Default = Template.bind({})
Default.args = {
    item: FAYE,
    editMode: false,
}

export const Editor = Template.bind({})
Editor.args = {
    ...Default.args,
    editMode: true,
}
