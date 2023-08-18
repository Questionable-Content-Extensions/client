import { Item as ItemData } from '@models/Item'
import { ItemImageList as ItemImageData } from '@models/ItemImageList'
import { RelatedItem as ItemRelationData } from '@models/RelatedItem'
import { ComponentMeta, ComponentStory } from '@storybook/react'

import { ItemDataPanel } from './ItemDetailsDialog'

// #region "Mock" Data

const FAYE: ItemData = {
    id: 4,
    shortName: 'Faye',
    name: 'Faye Whitaker',
    type: 'cast',
    color: '341400',
    first: 3,
    last: 4805,
    appearances: 1974,
    totalComics: 4866,
    presence: 40.5672009864365,
    hasImage: true,
}

const FAYE_IMAGES: ItemImageData[] = [{ id: 4, crc32cHash: 776532179 }]

const FAYE_FRIENDS: ItemRelationData[] = [
    {
        id: 1,
        shortName: 'Marten',
        name: 'Marten Reed',
        type: 'cast',
        color: '7d929e',
        count: 859,
    },
    {
        id: 10,
        shortName: 'Dora',
        name: 'Dora Bianchi',
        type: 'cast',
        color: '1d1d1d',
        count: 730,
    },
    {
        id: 109,
        shortName: 'Bubbles',
        name: 'Bubbles',
        type: 'cast',
        color: 'b26262',
        count: 361,
    },
    {
        id: 23,
        shortName: 'Hannelore',
        name: 'Hannelore Ellicott-Chatham',
        type: 'cast',
        color: '00c1d6',
        count: 329,
    },
    {
        id: 2,
        shortName: 'Pintsize',
        name: 'Pintsize',
        type: 'cast',
        color: '8dbd9a',
        count: 247,
    },
]

const FAYE_LOCATIONS: ItemRelationData[] = [
    {
        id: 94,
        shortName: 'Coffee of Doom',
        name: 'Coffee of Doom',
        type: 'location',
        color: 'f0d6bd',
        count: 656,
    },
    {
        id: 141,
        shortName: "Marten and Faye's Apartment",
        name: "Marten, Claire, Faye, and Bubbles' Apartment",
        type: 'location',
        color: 'daeff6',
        count: 463,
    },
    {
        id: 282,
        shortName: 'Union Robotics',
        name: 'Union Robotics',
        type: 'location',
        color: '96aac3',
        count: 181,
    },
    {
        id: 89,
        shortName: "Marten's Initial Apartment",
        name: "Marten's Initial Apartment",
        type: 'location',
        color: '455293',
        count: 157,
    },
    {
        id: 96,
        shortName: 'Downtown Northampton',
        name: 'Downtown Northampton',
        type: 'location',
        color: '95dffd',
        count: 133,
    },
]

const MANY_IMAGES: ItemImageData[] = [
    { id: 1, crc32cHash: 0 },
    { id: 2, crc32cHash: 0 },
    { id: 3, crc32cHash: 0 },
    { id: 4, crc32cHash: 0 },
]

const COFFEE_OF_DOOM: ItemData = {
    id: 94,
    shortName: 'Coffee of Doom',
    name: 'Coffee of Doom',
    type: 'location',
    color: 'f0d6bd',
    first: 9,
    last: 4857,
    appearances: 1063,
    totalComics: 4866,
    presence: 21.845458281956432,
    hasImage: false,
}

const COFFEE_OF_DOOM_FRIENDS: ItemRelationData[] = [
    {
        id: 10,
        shortName: 'Dora',
        name: 'Dora Bianchi',
        type: 'cast',
        color: '1d1d1d',
        count: 741,
    },
    {
        id: 4,
        shortName: 'Faye',
        name: 'Faye Whitaker',
        type: 'cast',
        color: '341400',
        count: 656,
    },
    {
        id: 1,
        shortName: 'Marten',
        name: 'Marten Reed',
        type: 'cast',
        color: '7d929e',
        count: 309,
    },
    {
        id: 23,
        shortName: 'Hannelore',
        name: 'Hannelore Ellicott-Chatham',
        type: 'cast',
        color: '00c1d6',
        count: 289,
    },
    {
        id: 11,
        shortName: 'Raven',
        name: 'Blodwyn Raven Pritchard',
        type: 'cast',
        color: 'fb0b65',
        count: 140,
    },
]

const COFFEE_OF_DOOM_LOCATIONS: ItemRelationData[] = [
    {
        id: 132,
        shortName: 'Outside Coffee of Doom',
        name: 'Outside Coffee of Doom',
        type: 'location',
        color: 'f0d5ac',
        count: 26,
    },
    {
        id: 96,
        shortName: 'Downtown Northampton',
        name: 'Downtown Northampton',
        type: 'location',
        color: '95dffd',
        count: 24,
    },
    {
        id: 141,
        shortName: "Marten and Faye's Apartment",
        name: "Marten, Claire, Faye, and Bubbles' Apartment",
        type: 'location',
        color: 'daeff6',
        count: 9,
    },
    {
        id: 152,
        shortName: "Hannelore's apartment",
        name: "Hannelore's apartment",
        type: 'location',
        color: 'fbfaf3',
        count: 6,
    },
    {
        id: 298,
        shortName: 'Unicorn Grove',
        name: 'Unicorn Grove',
        type: 'location',
        color: '7f7f7f',
        count: 5,
    },
]

// #endregion

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
