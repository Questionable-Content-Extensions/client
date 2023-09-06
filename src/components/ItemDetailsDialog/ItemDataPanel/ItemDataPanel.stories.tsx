import { useState } from 'react'

import { Item } from '@models/Item'
import { apiSlice } from '@store/apiSlice'
import { setFromItem } from '@store/itemEditorSlice'
import store from '@store/store'
import { ComponentMeta, ComponentStory } from '@storybook/react'

import {
    ALL_ITEMS,
    COFFEE_OF_DOOM,
    COFFEE_OF_DOOM_FRIENDS,
    COFFEE_OF_DOOM_LOCATIONS,
    FAYE,
    FAYE_FRIENDS,
    FAYE_IMAGES,
    FAYE_LOCATIONS,
    MANY_IMAGES,
    QCEXT_SERVER_DEVELOPMENT_URL,
    useMswReady,
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

const fayeImage: any = require('../4.png')

const Template: ComponentStory<typeof ItemDataPanel> = (args) => {
    const mswReady = useMswReady()

    const [previousItem, setPreviousItem] = useState<Item | null>(null)

    // Let's set up the Redux store to be the way we need
    store.dispatch(apiSlice.util.resetApiState())
    if (previousItem !== args.itemData && args.itemData) {
        setPreviousItem(args.itemData)
        store.dispatch(setFromItem(args.itemData))
    }

    // Then, let's fake the necessary REST calls
    const { worker, rest } = window.msw
    worker.use(
        rest.get('http://localhost:3000/api/v2/itemdata/', (req, res, ctx) => {
            const all = [...ALL_ITEMS]
            const name =
                'This is a mocked API response and will only be accurate for comic 666'
            all.push({
                id: -1,
                name,
                shortName: name,
                count: 0,
                type: 'storyline',
                color: 'ffaabb',
            })
            return res(ctx.json(all))
        }),
        rest.get(
            'http://localhost:3000/api/v2/itemdata/image/:imageId',
            async (req, res, ctx) => {
                const imageBuffer = await fetch(fayeImage).then((res) =>
                    res.arrayBuffer()
                )
                return res(
                    ctx.delay(1000 + Math.random() * 1000),
                    ctx.set(
                        'Content-Length',
                        imageBuffer.byteLength.toString()
                    ),
                    ctx.set('Content-Type', 'image/png'),
                    ctx.body(imageBuffer)
                )
            }
        )
    )

    return mswReady ? <ItemDataPanel {...args} /> : <></>
}

export const Default = Template.bind({})
Default.args = {
    itemDataUrl: QCEXT_SERVER_DEVELOPMENT_URL,
    itemData: FAYE,
    itemImageData: FAYE_IMAGES,
    itemFriendData: FAYE_FRIENDS,
    itemLocationData: FAYE_LOCATIONS,
    editModeToken: null,
}

export const Editor = Template.bind({})
Editor.args = {
    ...Default.args,
    editModeToken: '00000000-0000-0000-0000-000000000000',
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

export const NoImagesEditor = Template.bind({})
NoImagesEditor.args = {
    ...NoImages.args,
    editModeToken: '00000000-0000-0000-0000-000000000000',
}

export const MultipleImages = Template.bind({})
MultipleImages.args = {
    ...Default.args,
    itemImageData: MANY_IMAGES,
}

export const MultipleImagesEditor = Template.bind({})
MultipleImagesEditor.args = {
    ...MultipleImages.args,
    editModeToken: '00000000-0000-0000-0000-000000000000',
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
