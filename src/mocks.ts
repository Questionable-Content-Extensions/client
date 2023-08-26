import { Comic } from '@models/Comic'
import { HydratedItemNavigationData } from '@models/HydratedItemData'
import { Item } from '@models/Item'
import { ItemImageList } from '@models/ItemImageList'
import { ItemList } from '@models/ItemList'
import { ItemNavigationData } from '@models/ItemNavigationData'
import { RelatedItem } from '@models/RelatedItem'

import constants from './constants'

export const COMIC_DATA_666: Comic = {
    editorData: { present: false },
    comic: 666,
    imageType: 'png',
    hasData: true,
    publishDate: '2006-07-18T00:00:00Z',
    isAccuratePublishDate: false,
    title: 'I Have Been Waiting Three Years For This Strip',
    tagline: null,
    isGuestComic: false,
    isNonCanon: true,
    hasNoCast: false,
    hasNoLocation: false,
    hasNoStoryline: false,
    hasNoTitle: false,
    hasNoTagline: false,
    news: "SIX HUNDRED AND SIXTY SIX COMICS WOOOO!\n\nConsider today's strip a break in QC's usual strict continuity. I simply couldn't let such a once-in-a-comic's-lifetime opportunity pass me by. Can you tell I had fun drawing this one? 'Cause I did!\n\nQC won another <a href=\"http://www.ccawards.com/\">WCCA</a> for \"Outstanding Romantic Comic\"! Thanks a ton to the nice folks who voted for me, I truly appreciate it.\n\nThat's all for now. Got more comics to draw! Join me again tomorrow for a return to your regularly scheduled QC. Until next Monday, anyway, when my Guest Week Doomstravaganza begins.",
    previous: 665,
    next: 667,
    items: [
        {
            id: 4,
            first: 3,
            previous: 665,
            next: 667,
            last: 4805,
        },
        {
            id: 1,
            first: 1,
            previous: 664,
            next: 667,
            last: 4857,
        },
        {
            id: 10,
            first: 75,
            previous: 661,
            next: 671,
            last: 4857,
        },
        {
            id: 23,
            first: 515,
            previous: 665,
            next: 667,
            last: 4857,
        },
        {
            id: 141,
            first: 313,
            previous: 665,
            next: 667,
            last: 4840,
        },
        {
            id: 2,
            first: 1,
            previous: 665,
            next: 667,
            last: 4840,
        },
        {
            id: 3,
            first: 3,
            previous: 619,
            next: 712,
            last: 4510,
        },
        {
            id: 24,
            first: 527,
            previous: 612,
            next: 668,
            last: 4798,
        },
        {
            id: 17,
            first: 366,
            previous: 664,
            next: 669,
            last: 2607,
        },
        {
            id: 14,
            first: 248,
            previous: 664,
            next: 669,
            last: 1178,
        },
        {
            id: 153,
            first: 553,
            previous: 664,
            next: 843,
            last: 2606,
        },
    ],
}

export const COMIC_DATA_666_ITEMS: Array<ItemList> = [
    {
        id: 4,
        shortName: 'Faye',
        name: 'Faye Whitaker',
        type: 'cast',
        color: '341400',
        count: 1974,
    },
    {
        id: 1,
        shortName: 'Marten',
        name: 'Marten Reed',
        type: 'cast',
        color: '7d929e',
        count: 1869,
    },
    {
        id: 10,
        shortName: 'Dora',
        name: 'Dora Bianchi',
        type: 'cast',
        color: '1d1d1d',
        count: 1204,
    },
    {
        id: 23,
        shortName: 'Hannelore',
        name: 'Hannelore Ellicott-Chatham',
        type: 'cast',
        color: '00c1d6',
        count: 910,
    },
    {
        id: 141,
        shortName: "Marten and Faye's Apartment",
        name: "Marten, Claire, Faye, and Bubbles' Apartment",
        type: 'location',
        color: 'daeff6',
        count: 758,
    },
    {
        id: 2,
        shortName: 'Pintsize',
        name: 'Pintsize',
        type: 'cast',
        color: '8dbd9a',
        count: 486,
    },
    {
        id: 3,
        shortName: 'Steve',
        name: 'Steve',
        type: 'cast',
        color: '5b2900',
        count: 232,
    },
    {
        id: 24,
        shortName: 'Winslow',
        name: 'Winslow',
        type: 'cast',
        color: 'eeeeee',
        count: 148,
    },
    {
        id: 17,
        shortName: 'Amir',
        name: 'Amir Afridi',
        type: 'cast',
        color: '003388',
        count: 37,
    },
    {
        id: 14,
        shortName: 'Natasha',
        name: 'Natasha',
        type: 'cast',
        color: '000000',
        count: 33,
    },
    {
        id: 153,
        shortName: 'Practice space',
        name: 'Practice space on Ward avenue',
        type: 'location',
        color: 'eae2dd',
        count: 22,
    },
]

export const COMIC_DATA_666_HYDRATED_ITEMS: Array<HydratedItemNavigationData> =
    COMIC_DATA_666_ITEMS.map((e, i) => ({
        ...e,
        ...COMIC_DATA_666.items[i],
    }))

export const FAYE: Item = {
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
    primaryImage: null,
}

export const FAYE_IMAGES: ItemImageList[] = [{ id: 4, crc32cHash: 776532179 }]

export const FAYE_FRIENDS: RelatedItem[] = [
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

export const FAYE_LOCATIONS: RelatedItem[] = [
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

export const MANY_IMAGES: ItemImageList[] = [
    { id: 1, crc32cHash: 0 },
    { id: 2, crc32cHash: 0 },
    { id: 3, crc32cHash: 0 },
    { id: 4, crc32cHash: 0 },
]

export const COFFEE_OF_DOOM: Item = {
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
    primaryImage: null,
}

export const COFFEE_OF_DOOM_FRIENDS: RelatedItem[] = [
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

export const COFFEE_OF_DOOM_LOCATIONS: RelatedItem[] = [
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

export const MARTEN: ItemNavigationData = {
    id: 1,
    first: 1,
    previous: 1233,
    next: 1235,
    last: 2345,
}

export const MARTEN_ITEM: ItemList = {
    id: 1,
    shortName: 'Marten',
    name: 'Marten Reed',
    type: 'cast',
    color: '7d929e',
    count: 6969,
}

export const MARTEN_HYDRATED: HydratedItemNavigationData = {
    ...MARTEN,
    ...MARTEN_ITEM,
}

/**
 * This URL will be functional if you start the QC dev server
 * with its default port
 */
export const QCEXT_SERVER_DEVELOPMENT_URL =
    `${constants.developmentBaseUrl}itemdata/` as const
