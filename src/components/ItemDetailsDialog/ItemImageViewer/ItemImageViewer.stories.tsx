import { ComponentMeta, ComponentStory } from '@storybook/react'

import {
    FAYE,
    FAYE_IMAGES,
    MANY_IMAGES,
    QCEXT_SERVER_DEVELOPMENT_URL,
} from '~/mocks'

import ItemImageViewer from './ItemImageViewer'

export default {
    component: ItemImageViewer,
    argTypes: {
        onDeleteImage: { action: 'onDeleteImage' },
        onSetPrimaryImage: { action: 'onSetPrimaryImage' },
    },
} as ComponentMeta<typeof ItemImageViewer>

const Template: ComponentStory<typeof ItemImageViewer> = (args) => {
    return <ItemImageViewer {...args} />
}

export const Single = Template.bind({})
Single.args = {
    editMode: false,
    itemDataUrl: QCEXT_SERVER_DEVELOPMENT_URL,
    itemImageData: FAYE_IMAGES,
    itemShortName: FAYE.shortName,
    primaryImage: null,
}

export const SingleEditMode = Template.bind({})
SingleEditMode.args = {
    ...Single.args,
    editMode: true,
}

export const Many = Template.bind({})
Many.args = {
    editMode: false,
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
    editMode: true,
}
