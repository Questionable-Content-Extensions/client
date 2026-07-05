import { HttpResponse, http } from 'msw'
import { useState } from 'react'
import { fn } from 'storybook/test'

import { Item } from '@models/Item'
import { apiSlice } from '@store/apiSlice'
import { setFromItem } from '@store/itemEditorSlice'
import store from '@store/store'
import type { Meta, StoryObj } from '@storybook/react-vite'

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
} from '~/mocks'

import fayeImage from '../4.png'
import ItemDataPanel from './ItemDataPanel'

const meta: Meta<typeof ItemDataPanel> = {
    component: ItemDataPanel,
    argTypes: {
        onGoToComic: { action: 'onGoToComic' },
        onShowItemData: { action: 'onShowItemData' },
        onDeleteImage: { action: 'onDeleteImage' },
        onSetPrimaryImage: { action: 'onSetPrimaryImage' },
    },
    args: {
        itemDataUrl: QCEXT_SERVER_DEVELOPMENT_URL,
        itemData: FAYE,
        itemImageData: FAYE_IMAGES,
        itemFriendData: FAYE_FRIENDS,
        itemLocationData: FAYE_LOCATIONS,
        editModeToken: null,
        onGoToComic: fn(),
        onShowItemData: fn(),
        onDeleteImage: fn(),
        onSetPrimaryImage: fn(),
        onUploadImage: fn(),
    },
    parameters: {
        msw: {
            handlers: [
                http.get('http://localhost:3000/api/v3/itemdata/', () => {
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
                        startComicId: null,
                        endComicId: null,
                    })
                    return HttpResponse.json(all)
                }),
                http.get(
                    'http://localhost:3000/api/v3/itemdata/image/:imageId',
                    async () => {
                        const imageBuffer = await fetch(fayeImage).then((res) =>
                            res.arrayBuffer()
                        )
                        return new HttpResponse(imageBuffer, {
                            headers: {
                                'Content-Length':
                                    imageBuffer.byteLength.toString(),
                                'Content-Type': 'image/png',
                            },
                        })
                    }
                ),
            ],
        },
    },
    render: (args) => {
        const [previousItem, setPreviousItem] = useState<Item | null>(null)

        if (previousItem !== args.itemData && args.itemData) {
            setPreviousItem(args.itemData)
            store.dispatch(setFromItem(args.itemData))
        }

        return <ItemDataPanel {...args} />
    },
    loaders: [
        () => {
            store.dispatch(apiSlice.util.resetApiState())
        },
    ],
}
export default meta

type Story = StoryObj<typeof ItemDataPanel>

export const Default: Story = {}

export const Editor: Story = {
    args: {
        editModeToken: '00000000-0000-0000-0000-000000000000',
    },
}

export const Loading: Story = {
    args: {
        itemData: null,
    },
}

export const NoImages: Story = {
    args: {
        itemImageData: [],
    },
}

export const NoImagesEditor: Story = {
    args: {
        itemImageData: [],
        editModeToken: '00000000-0000-0000-0000-000000000000',
    },
}

export const MultipleImages: Story = {
    args: {
        itemImageData: MANY_IMAGES,
    },
}

export const MultipleImagesEditor: Story = {
    args: {
        itemImageData: MANY_IMAGES,
        editModeToken: '00000000-0000-0000-0000-000000000000',
    },
}

export const NoRelations: Story = {
    args: {
        itemFriendData: [],
        itemLocationData: [],
    },
}

export const Location: Story = {
    args: {
        itemData: COFFEE_OF_DOOM,
        itemImageData: [],
        itemFriendData: COFFEE_OF_DOOM_FRIENDS,
        itemLocationData: COFFEE_OF_DOOM_LOCATIONS,
    },
}
