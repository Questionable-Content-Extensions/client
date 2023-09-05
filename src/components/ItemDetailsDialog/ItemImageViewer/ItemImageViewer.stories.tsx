import { ComponentMeta, ComponentStory } from '@storybook/react'

import {
    FAYE,
    FAYE_IMAGES,
    MANY_IMAGES,
    QCEXT_SERVER_DEVELOPMENT_URL,
    useMswReady,
} from '~/mocks'

import ItemImageViewer from './ItemImageViewer'

const fayeImage: any = require('../4.png')

export default {
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
} as ComponentMeta<typeof ItemImageViewer>

const Template: ComponentStory<typeof ItemImageViewer> = (args) => {
    const mswReady = useMswReady()

    // Then, let's fake the necessary REST calls
    const { worker, rest } = window.msw
    worker.use(
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

    return !mswReady ? <></> : <ItemImageViewer {...args} />
}

export const Single = Template.bind({})
Single.args = {
    itemId: 4,
    editModeToken: null,
    itemDataUrl: QCEXT_SERVER_DEVELOPMENT_URL,
    itemImageData: FAYE_IMAGES,
    itemShortName: FAYE.shortName,
    primaryImage: null,
}

export const SingleEditMode = Template.bind({})
SingleEditMode.args = {
    ...Single.args,
    editModeToken: '00000000-0000-0000-0000-000000000000',
}

export const Many = Template.bind({})
Many.args = {
    itemId: 4,
    editModeToken: null,
    itemDataUrl: QCEXT_SERVER_DEVELOPMENT_URL,
    itemImageData: MANY_IMAGES,
    itemShortName: FAYE.shortName,
}

export const ManyWithPrimarySet = Template.bind({})
ManyWithPrimarySet.args = {
    ...Many.args,
    primaryImage: 4,
}

export const ManyEditMode = Template.bind({})
ManyEditMode.args = {
    ...Many.args,
    editModeToken: '00000000-0000-0000-0000-000000000000',
}
