import { HttpResponse, delay, http } from 'msw'

import type { Meta, StoryObj } from '@storybook/react-vite'

import {
    FAYE,
    FAYE_IMAGES,
    MANY_IMAGES,
    QCEXT_SERVER_DEVELOPMENT_URL,
} from '~/mocks'

import fayeImage from '../4.png'
import ItemImageViewer from './ItemImageViewer'

const meta: Meta<typeof ItemImageViewer> = {
    component: ItemImageViewer,
    argTypes: {
        onDeleteImage: { action: 'onDeleteImage' },
        onSetPrimaryImage: { action: 'onSetPrimaryImage' },
        itemDataUrl: {
            table: {
                disable: true,
            },
        },
    },
    parameters: {
        msw: {
            handlers: [
                http.get(
                    'http://localhost:3000/api/v3/itemdata/image/:imageId',
                    async () => {
                        const imageBuffer = await fetch(fayeImage).then((res) =>
                            res.arrayBuffer()
                        )
                        await delay(1000 + Math.random() * 1000)
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
}
export default meta

type Story = StoryObj<typeof ItemImageViewer>

export const Single: Story = {
    args: {
        itemId: 4,
        editModeToken: null,
        itemDataUrl: QCEXT_SERVER_DEVELOPMENT_URL,
        itemImageData: FAYE_IMAGES,
        itemShortName: FAYE.shortName,
        primaryImage: null,
    },
}

export const SingleEditMode: Story = {
    args: {
        ...Single.args,
        editModeToken: '00000000-0000-0000-0000-000000000000',
    },
}

export const Many: Story = {
    args: {
        itemId: 4,
        editModeToken: null,
        itemDataUrl: QCEXT_SERVER_DEVELOPMENT_URL,
        itemImageData: MANY_IMAGES,
        itemShortName: FAYE.shortName,
    },
}

export const ManyWithPrimarySet: Story = {
    args: {
        ...Many.args,
        primaryImage: 4,
    },
}

export const ManyEditMode: Story = {
    args: {
        ...Many.args,
        editModeToken: '00000000-0000-0000-0000-000000000000',
    },
}
