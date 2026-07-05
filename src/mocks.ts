import { ActiveStorylineSummary } from '@models/ActiveStorylineSummary'
import { Comic } from '@models/Comic'
import { ComicList } from '@models/ComicList'
import { HydratedItemNavigationData } from '@models/HydratedItemData'
import { Item } from '@models/Item'
import { ItemImageList } from '@models/ItemImageList'
import { ItemList } from '@models/ItemList'
import { ItemNavigationData } from '@models/ItemNavigationData'
import { LogResponse } from '@models/LogResponse'
import { RelatedItem } from '@models/RelatedItem'
import { HydratedActiveStoryline } from '@models/StorylineLifecycle'

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
    activeStorylines: [],
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
        startComicId: null,
        endComicId: null,
        count: 1974,
    },
    {
        id: 1,
        shortName: 'Marten',
        name: 'Marten Reed',
        type: 'cast',
        color: '7d929e',
        startComicId: null,
        endComicId: null,
        count: 1869,
    },
    {
        id: 10,
        shortName: 'Dora',
        name: 'Dora Bianchi',
        type: 'cast',
        color: '1d1d1d',
        startComicId: null,
        endComicId: null,
        count: 1204,
    },
    {
        id: 23,
        shortName: 'Hannelore',
        name: 'Hannelore Ellicott-Chatham',
        type: 'cast',
        color: '00c1d6',
        startComicId: null,
        endComicId: null,
        count: 910,
    },
    {
        id: 141,
        shortName: "Marten and Faye's Apartment",
        name: "Marten, Claire, Faye, and Bubbles' Apartment",
        type: 'location',
        color: 'daeff6',
        startComicId: null,
        endComicId: null,
        count: 758,
    },
    {
        id: 2,
        shortName: 'Pintsize',
        name: 'Pintsize',
        type: 'cast',
        color: '8dbd9a',
        startComicId: null,
        endComicId: null,
        count: 486,
    },
    {
        id: 3,
        shortName: 'Steve',
        name: 'Steve',
        type: 'cast',
        color: '5b2900',
        startComicId: null,
        endComicId: null,
        count: 232,
    },
    {
        id: 24,
        shortName: 'Winslow',
        name: 'Winslow',
        type: 'cast',
        color: 'eeeeee',
        startComicId: null,
        endComicId: null,
        count: 148,
    },
    {
        id: 17,
        shortName: 'Amir',
        name: 'Amir Afridi',
        type: 'cast',
        color: '003388',
        startComicId: null,
        endComicId: null,
        count: 37,
    },
    {
        id: 14,
        shortName: 'Natasha',
        name: 'Natasha',
        type: 'cast',
        color: '000000',
        startComicId: null,
        endComicId: null,
        count: 33,
    },
    {
        id: 153,
        shortName: 'Practice space',
        name: 'Practice space on Ward avenue',
        type: 'location',
        color: 'eae2dd',
        startComicId: null,
        endComicId: null,
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
    startComicId: null,
    endComicId: null,
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
        count: 859,
    },
    {
        id: 10,
        count: 730,
    },
    {
        id: 109,
        count: 361,
    },
    {
        id: 23,
        count: 329,
    },
    {
        id: 2,
        count: 247,
    },
]

export const FAYE_LOCATIONS: RelatedItem[] = [
    {
        id: 94,
        count: 656,
    },
    {
        id: 141,
        count: 463,
    },
    {
        id: 282,
        count: 181,
    },
    {
        id: 89,
        count: 157,
    },
    {
        id: 96,
        count: 133,
    },
]

export const FAYE_COMICS: ComicList[] = [
    {
        comic: 4805,
        title: 'Messy Joseph',
        tagline: 'say no more',
        isNonCanon: false,
        isGuestComic: false,
    },
    {
        comic: 4801,
        title: 'Five Bars',
        tagline: "it's the little things",
        isNonCanon: false,
        isGuestComic: false,
    },
    {
        comic: 4800,
        title: 'Fumigation',
        tagline: 'smells kinda mustardy',
        isNonCanon: false,
        isGuestComic: false,
    },
    {
        comic: 4799,
        title: 'Intestinal Fortitude',
        tagline: 'just a gut feeling',
        isNonCanon: false,
        isGuestComic: false,
    },
    {
        comic: 4798,
        title: 'Beast Mode',
        tagline: 'then the hyenas came',
        isNonCanon: false,
        isGuestComic: false,
    },
    {
        comic: 4796,
        title: 'Pollen',
        tagline: 'just a sneeze',
        isNonCanon: false,
        isGuestComic: false,
    },
    {
        comic: 4795,
        title: 'The Brute Force Method',
        tagline: 'do not try this at home',
        isNonCanon: false,
        isGuestComic: false,
    },
    {
        comic: 4794,
        title: 'Skull Buddy',
        tagline: 'explains a lot',
        isNonCanon: false,
        isGuestComic: false,
    },
    {
        comic: 4793,
        title: 'Self-Diagnostic',
        tagline: 'haha woo',
        isNonCanon: false,
        isGuestComic: false,
    },
    {
        comic: 4792,
        title: 'Heat Shrink',
        tagline: "it's just really fancy shrinkwrap",
        isNonCanon: false,
        isGuestComic: false,
    },
    {
        comic: 4791,
        title: 'Does A Body Good',
        tagline: 'humans are like 80% goop, robots are about 20%',
        isNonCanon: false,
        isGuestComic: false,
    },
    {
        comic: 4790,
        title: 'Renowned Entomologist',
        tagline: 'some never before known to science',
        isNonCanon: false,
        isGuestComic: false,
    },
    {
        comic: 4778,
        title: 'Frankenmelon',
        tagline: 'SO smug',
        isNonCanon: false,
        isGuestComic: false,
    },
    {
        comic: 4727,
        title: 'Stick The Pose',
        tagline: 'who could have foreseen this',
        isNonCanon: false,
        isGuestComic: false,
    },
    {
        comic: 4716,
        title: 'Exit Strategy',
        tagline: 'in reality, bears shit pretty much wherever they feel like',
        isNonCanon: false,
        isGuestComic: false,
    },
    {
        comic: 4712,
        title: 'The Straight And Narrow',
        tagline: 'crimes and bad decisions are not necessarily the same thing',
        isNonCanon: false,
        isGuestComic: false,
    },
    {
        comic: 4711,
        title: 'The Dankest Emmett Lore',
        tagline:
            "either Emmett rules or they're a really creative liar. or both",
        isNonCanon: false,
        isGuestComic: false,
    },
    {
        comic: 4710,
        title: 'More Emmett Lore',
        tagline: 'the cool S...',
        isNonCanon: false,
        isGuestComic: false,
    },
    {
        comic: 4705,
        title: 'Pupating',
        tagline: 'babies freak me out',
        isNonCanon: false,
        isGuestComic: false,
    },
    {
        comic: 4704,
        title: 'Wind-Blown',
        tagline: 'all other emotions are a subset of either chomp or awoo',
        isNonCanon: false,
        isGuestComic: false,
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
    startComicId: null,
    endComicId: null,
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
        count: 741,
    },
    {
        id: 4,
        count: 656,
    },
    {
        id: 1,
        count: 309,
    },
    {
        id: 23,
        count: 289,
    },
    {
        id: 11,
        count: 140,
    },
]

export const COFFEE_OF_DOOM_LOCATIONS: RelatedItem[] = [
    {
        id: 132,
        count: 26,
    },
    {
        id: 96,
        count: 24,
    },
    {
        id: 141,
        count: 9,
    },
    {
        id: 152,
        count: 6,
    },
    {
        id: 298,
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
    startComicId: null,
    endComicId: null,
    count: 6969,
}

export const MARTEN_HYDRATED: HydratedItemNavigationData = {
    ...MARTEN,
    ...MARTEN_ITEM,
}

export const STORYLINE_SHORT_ARC_ITEM: ItemList = {
    id: 201,
    shortName: 'Coffee Coup',
    name: 'The Coffee of Doom Coup',
    type: 'storyline',
    color: '8a5a2b',
    startComicId: 640,
    endComicId: 660,
    count: 12,
}

export const STORYLINE_SHORT_ARC_SUMMARY: ActiveStorylineSummary = {
    id: 201,
    startComicId: 640,
    endComicId: 660,
    segments: [{ fromComicId: 640, toComicId: 660, featured: true }],
}

export const STORYLINE_SHORT_ARC_HYDRATED: HydratedActiveStoryline = {
    ...STORYLINE_SHORT_ARC_ITEM,
    ...STORYLINE_SHORT_ARC_SUMMARY,
}

export const STORYLINE_LONG_GAP_ITEM: ItemList = {
    id: 202,
    shortName: 'Momerath',
    name: "Momma Momerath's Arc",
    type: 'storyline',
    color: '2b6a8a',
    startComicId: 400,
    endComicId: 900,
    count: 40,
}

export const STORYLINE_LONG_GAP_SUMMARY: ActiveStorylineSummary = {
    id: 202,
    startComicId: 400,
    endComicId: 900,
    segments: [
        { fromComicId: 400, toComicId: 420, featured: true },
        { fromComicId: 420, toComicId: 860, featured: false },
        { fromComicId: 860, toComicId: 900, featured: true },
    ],
}

export const STORYLINE_LONG_GAP_HYDRATED: HydratedActiveStoryline = {
    ...STORYLINE_LONG_GAP_ITEM,
    ...STORYLINE_LONG_GAP_SUMMARY,
}

export const STORYLINE_INTERMITTENT_ITEM: ItemList = {
    id: 203,
    shortName: 'AI Uprising',
    name: 'The AI Uprising',
    type: 'storyline',
    color: '6a2b8a',
    startComicId: 500,
    endComicId: 560,
    count: 25,
}

export const STORYLINE_INTERMITTENT_SUMMARY: ActiveStorylineSummary = {
    id: 203,
    startComicId: 500,
    endComicId: 560,
    segments: [
        { fromComicId: 500, toComicId: 503, featured: true },
        { fromComicId: 503, toComicId: 507, featured: false },
        { fromComicId: 507, toComicId: 511, featured: true },
        { fromComicId: 511, toComicId: 515, featured: false },
        { fromComicId: 515, toComicId: 519, featured: true },
        { fromComicId: 519, toComicId: 560, featured: false },
    ],
}

export const STORYLINE_INTERMITTENT_HYDRATED: HydratedActiveStoryline = {
    ...STORYLINE_INTERMITTENT_ITEM,
    ...STORYLINE_INTERMITTENT_SUMMARY,
}

export const STORYLINE_OPEN_ENDED_ITEM: ItemList = {
    id: 204,
    shortName: 'Hostile Alien',
    name: 'The Hostile Alien Storyline',
    type: 'storyline',
    color: '2b8a5a',
    startComicId: 600,
    endComicId: null,
    count: 18,
}

export const STORYLINE_OPEN_ENDED_SUMMARY: ActiveStorylineSummary = {
    id: 204,
    startComicId: 600,
    endComicId: null,
    segments: [
        { fromComicId: 600, toComicId: 630, featured: true },
        { fromComicId: 630, toComicId: 650, featured: false },
        { fromComicId: 650, toComicId: 666, featured: true },
    ],
}

export const STORYLINE_OPEN_ENDED_HYDRATED: HydratedActiveStoryline = {
    ...STORYLINE_OPEN_ENDED_ITEM,
    ...STORYLINE_OPEN_ENDED_SUMMARY,
}

export const ACTIVE_STORYLINES_COMIC_666: HydratedActiveStoryline[] = [
    STORYLINE_LONG_GAP_HYDRATED,
    STORYLINE_INTERMITTENT_HYDRATED,
    STORYLINE_OPEN_ENDED_HYDRATED,
]

export const STORYLINE_ONGOING_ITEM: Item = {
    id: 205,
    shortName: 'Momerath',
    name: "Momma Momerath's Arc",
    type: 'storyline',
    color: '2b6a8a',
    startComicId: 400,
    endComicId: null,
    first: 400,
    last: 850,
    appearances: 40,
    totalComics: 450,
    presence: 8.888888888888888,
    hasImage: false,
    primaryImage: null,
}

export const EDIT_LOG_COMIC_4269: LogResponse = {
    logEntries: [
        {
            identifier: '/u/alexschrod',
            dateTime: '2020-05-21T14:40:10Z',
            action: 'Set tagline on comic #4269 to "the hunt for red bot-tober"',
        },
        {
            identifier: '/u/alexschrod',
            dateTime: '2020-05-21T14:39:57Z',
            action: 'Added location #94 (Coffee of Doom) to comic #4269',
        },
        {
            identifier: '/u/alexschrod',
            dateTime: '2020-05-21T14:39:51Z',
            action: 'Added cast #109 (Bubbles) to comic #4269',
        },
        {
            identifier: '/u/alexschrod',
            dateTime: '2020-05-21T14:39:45Z',
            action: 'Added cast #4 (Faye Whitaker) to comic #4269',
        },
    ],
    page: 1,
    pageCount: 1,
    logEntryCount: 4,
}

export const LATEST_EDIT_LOG: LogResponse = {
    logEntries: [
        {
            identifier: '/u/alexschrod',
            dateTime: '2023-09-02T04:47:38Z',
            action: 'Added cast #105 (Aurelia Augustus) to comic #4877',
        },
        {
            identifier: '/u/alexschrod',
            dateTime: '2023-09-02T04:47:34Z',
            action: "Added location #234 (Mrs. Augustus' House) to comic #4877",
        },
        {
            identifier: '/u/alexschrod',
            dateTime: '2023-09-02T04:47:22Z',
            action: 'Added cast #76 (Claire Augustus) to comic #4877',
        },
        {
            identifier: '/u/alexschrod',
            dateTime: '2023-09-02T04:46:16Z',
            action: 'Added cast #329 (Hercules) to comic #4876',
        },
        {
            identifier: '/u/alexschrod',
            dateTime: '2023-09-01T16:00:48Z',
            action: 'Added cast #64 (Clinton P. Augustus) to comic #4876',
        },
        {
            identifier: '/u/alexschrod',
            dateTime: '2023-09-01T16:00:48Z',
            action: "Added location #317 (Elliot's Apartment) to comic #4876",
        },
        {
            identifier: '/u/alexschrod',
            dateTime: '2023-09-01T16:00:26Z',
            action: 'Added cast #61 (Elliot) to comic #4876',
        },
        {
            identifier: '/u/alexschrod',
            dateTime: '2023-09-01T15:59:27Z',
            action: 'Added cast #23 (Hannelore Ellicott-Chatham) to comic #4875',
        },
        {
            identifier: '/u/alexschrod',
            dateTime: '2023-09-01T15:59:27Z',
            action: 'Added cast #64 (Clinton P. Augustus) to comic #4875',
        },
        {
            identifier: '/u/alexschrod',
            dateTime: '2023-09-01T15:59:27Z',
            action: 'Added cast #69 (Station) to comic #4875',
        },
    ],
    page: 1,
    pageCount: 1054,
    logEntryCount: 10531,
}

export const FAYE_EDIT_LOG: LogResponse = {
    logEntries: [
        {
            identifier: '/u/alexschrod',
            dateTime: '2023-08-20T19:10:32Z',
            action: 'Removed cast #4 (Faye Whitaker) from comic #4865',
        },
        {
            identifier: '/u/alexschrod',
            dateTime: '2023-08-20T19:10:29Z',
            action: 'Added cast #4 (Faye Whitaker) to comic #4865',
        },
        {
            identifier: '/u/alexschrod',
            dateTime: '2023-08-15T19:37:31Z',
            action: 'Removed cast #4 (Faye Whitaker) from comic #3466',
        },
        {
            identifier: '/u/alexschrod',
            dateTime: '2023-08-15T19:10:25Z',
            action: 'Added cast #4 (Faye Whitaker) to comic #3466',
        },
        {
            identifier: '/u/alexschrod',
            dateTime: '2022-06-13T04:44:03Z',
            action: 'Added cast #4 (Faye Whitaker) to comic #4805',
        },
        {
            identifier: '/u/alexschrod',
            dateTime: '2022-06-08T13:24:49Z',
            action: 'Added cast #4 (Faye Whitaker) to comic #4801',
        },
        {
            identifier: '/u/alexschrod',
            dateTime: '2022-06-03T02:25:51Z',
            action: 'Added cast #4 (Faye Whitaker) to comic #4800',
        },
        {
            identifier: '/u/alexschrod',
            dateTime: '2022-06-02T01:38:18Z',
            action: 'Added cast #4 (Faye Whitaker) to comic #4799',
        },
        {
            identifier: '/u/alexschrod',
            dateTime: '2022-06-01T14:51:18Z',
            action: 'Added cast #4 (Faye Whitaker) to comic #4798',
        },
        {
            identifier: '/u/alexschrod',
            dateTime: '2022-05-30T01:45:26Z',
            action: 'Added cast #4 (Faye Whitaker) to comic #4796',
        },
    ],
    page: 1,
    pageCount: 43,
    logEntryCount: 429,
}

/**
 * This URL will be functional if you start the QC dev server
 * with its default port
 */
export const QCEXT_SERVER_DEVELOPMENT_URL =
    `${constants.developmentBaseUrl}itemdata/` as const

/**
 * Well. All the major items, and the few minor ones that appear
 * in the mock data above.
 */
export const ALL_ITEMS: ItemList[] = [
    {
        id: 4,
        shortName: 'Faye',
        name: 'Faye Whitaker',
        type: 'cast',
        color: '341400',
        startComicId: null,
        endComicId: null,
        count: 1974,
    },
    {
        id: 1,
        shortName: 'Marten',
        name: 'Marten Reed',
        type: 'cast',
        color: '7d929e',
        startComicId: null,
        endComicId: null,
        count: 1870,
    },
    {
        id: 10,
        shortName: 'Dora',
        name: 'Dora Bianchi',
        type: 'cast',
        color: '1d1d1d',
        startComicId: null,
        endComicId: null,
        count: 1205,
    },
    {
        id: 94,
        shortName: 'Coffee of Doom',
        name: 'Coffee of Doom',
        type: 'location',
        color: 'f0d6bd',
        startComicId: null,
        endComicId: null,
        count: 1064,
    },
    {
        id: 23,
        shortName: 'Hannelore',
        name: 'Hannelore Ellicott-Chatham',
        type: 'cast',
        color: '00c1d6',
        startComicId: null,
        endComicId: null,
        count: 911,
    },
    {
        id: 141,
        shortName: "Marten and Faye's Apartment",
        name: "Marten, Claire, Faye, and Bubbles' Apartment",
        type: 'location',
        color: 'daeff6',
        startComicId: null,
        endComicId: null,
        count: 758,
    },
    {
        id: 76,
        shortName: 'Claire',
        name: 'Claire Augustus',
        type: 'cast',
        color: 'c13232',
        startComicId: null,
        endComicId: null,
        count: 527,
    },
    {
        id: 2,
        shortName: 'Pintsize',
        name: 'Pintsize',
        type: 'cast',
        color: '8dbd9a',
        startComicId: null,
        endComicId: null,
        count: 486,
    },
    {
        id: 46,
        shortName: 'Marigold',
        name: 'Marigold Louise Farmer',
        type: 'cast',
        color: '5a3e1c',
        startComicId: null,
        endComicId: null,
        count: 465,
    },
    {
        id: 109,
        shortName: 'Bubbles',
        name: 'Bubbles',
        type: 'cast',
        color: 'b26262',
        startComicId: null,
        endComicId: null,
        count: 431,
    },
    {
        id: 96,
        shortName: 'Downtown Northampton',
        name: 'Downtown Northampton',
        type: 'location',
        color: '95dffd',
        startComicId: null,
        endComicId: null,
        count: 394,
    },
    {
        id: 27,
        shortName: 'Tai',
        name: 'Tai Hubbert',
        type: 'cast',
        color: '5f0000',
        startComicId: null,
        endComicId: null,
        count: 333,
    },
    {
        id: 64,
        shortName: 'Clinton',
        name: 'Clinton P. Augustus',
        type: 'cast',
        color: 'c0c0c0',
        startComicId: null,
        endComicId: null,
        count: 307,
    },
    {
        id: 82,
        shortName: 'May',
        name: 'May (Virtual companion)',
        type: 'cast',
        color: 'e4f9ff',
        startComicId: null,
        endComicId: null,
        count: 276,
    },
    {
        id: 43,
        shortName: 'Momo',
        name: 'Momo-tan',
        type: 'cast',
        color: 'dd2875',
        startComicId: null,
        endComicId: null,
        count: 263,
    },
    {
        id: 259,
        shortName: 'Roko',
        name: 'Roko Basilisk',
        type: 'cast',
        color: 'debedf',
        startComicId: null,
        endComicId: null,
        count: 253,
    },
    {
        id: 195,
        shortName: "Marigold's Apartment",
        name: "Marigold's Apartment",
        type: 'location',
        color: '8186b6',
        startComicId: null,
        endComicId: null,
        count: 247,
    },
    {
        id: 3,
        shortName: 'Steve',
        name: 'Steve',
        type: 'cast',
        color: '5b2900',
        startComicId: null,
        endComicId: null,
        count: 232,
    },
    {
        id: 61,
        shortName: 'Elliot',
        name: 'Elliot',
        type: 'cast',
        color: 'b26d24',
        startComicId: null,
        endComicId: null,
        count: 225,
    },
    {
        id: 15,
        shortName: 'Sven',
        name: 'Sven Bianchi',
        type: 'cast',
        color: 'c17b27',
        startComicId: null,
        endComicId: null,
        count: 220,
    },
    {
        id: 144,
        shortName: 'Brun',
        name: 'Brunhilde Khoury',
        type: 'cast',
        color: 'd5d5da',
        startComicId: null,
        endComicId: null,
        count: 209,
    },
    {
        id: 282,
        shortName: 'Union Robotics',
        name: 'Union Robotics',
        type: 'location',
        color: '96aac3',
        startComicId: null,
        endComicId: null,
        count: 205,
    },
    {
        id: 29,
        shortName: 'Angus',
        name: 'Angus McPhee',
        type: 'cast',
        color: 'ce7700',
        startComicId: null,
        endComicId: null,
        count: 195,
    },
    {
        id: 164,
        shortName: 'SMIF Library',
        name: 'Smith College Williston Library',
        type: 'location',
        color: 'bfb757',
        startComicId: null,
        endComicId: null,
        count: 191,
    },
    {
        id: 56,
        shortName: 'Dale',
        name: 'Dale',
        type: 'cast',
        color: 'fafafa',
        startComicId: null,
        endComicId: null,
        count: 185,
    },
    {
        id: 74,
        shortName: 'Emily',
        name: 'Emily Azuma',
        type: 'cast',
        color: 'ee9c6b',
        startComicId: null,
        endComicId: null,
        count: 176,
    },
    {
        id: 89,
        shortName: "Marten's Initial Apartment",
        name: "Marten's Initial Apartment",
        type: 'location',
        color: '455293',
        startComicId: null,
        endComicId: null,
        count: 173,
    },
    {
        id: 67,
        shortName: 'Sam',
        name: 'Samantha Bean',
        type: 'cast',
        color: 'f8a673',
        startComicId: null,
        endComicId: null,
        count: 160,
    },
    {
        id: 11,
        shortName: 'Raven',
        name: 'Blodwyn Raven Pritchard',
        type: 'cast',
        color: 'fb0b65',
        startComicId: null,
        endComicId: null,
        count: 159,
    },
    {
        id: 24,
        shortName: 'Winslow',
        name: 'Winslow',
        type: 'cast',
        color: 'eeeeee',
        startComicId: null,
        endComicId: null,
        count: 148,
    },
    {
        id: 62,
        shortName: 'Renee',
        name: 'Renee',
        type: 'cast',
        color: '060666',
        startComicId: null,
        endComicId: null,
        count: 143,
    },
    {
        id: 28,
        shortName: 'Penelope',
        name: 'Penelope Gaines',
        type: 'cast',
        color: 'f3cf75',
        startComicId: null,
        endComicId: null,
        count: 139,
    },
    {
        id: 152,
        shortName: "Hannelore's apartment",
        name: "Hannelore's apartment",
        type: 'location',
        color: 'fbfaf3',
        startComicId: null,
        endComicId: null,
        count: 135,
    },
    {
        id: 185,
        shortName: 'Bar / Restaurant (Horrible Revelation)',
        name: 'Bar / Restaurant (Horrible Revelation)',
        type: 'location',
        color: '7c1414',
        startComicId: null,
        endComicId: null,
        count: 131,
    },
    {
        id: 262,
        shortName: 'Yay',
        name: 'Yaaaaaaaay Newfriend',
        type: 'cast',
        color: 'eff7ff',
        startComicId: null,
        endComicId: null,
        count: 127,
    },
    {
        id: 132,
        shortName: 'Outside Coffee of Doom',
        name: 'Outside Coffee of Doom',
        type: 'location',
        color: 'f0d5ac',
        startComicId: null,
        endComicId: null,
        count: 69,
    },
    {
        id: 17,
        shortName: 'Amir',
        name: 'Amir Afridi',
        type: 'cast',
        color: '003388',
        startComicId: null,
        endComicId: null,
        count: 37,
    },
    {
        id: 14,
        shortName: 'Natasha',
        name: 'Natasha',
        type: 'cast',
        color: '000000',
        startComicId: null,
        endComicId: null,
        count: 33,
    },
    {
        id: 153,
        shortName: 'Practice space',
        name: 'Practice space on Ward avenue',
        type: 'location',
        color: 'eae2dd',
        startComicId: null,
        endComicId: null,
        count: 22,
    },
    {
        id: 298,
        shortName: 'Unicorn Grove',
        name: 'Unicorn Grove',
        type: 'location',
        color: '7f7f7f',
        startComicId: null,
        endComicId: null,
        count: 6,
    },
]

const randomNamePool =
    'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
export function generateRandomName(length: number) {
    let randomName = ''
    for (let i = 0; i < length; i++) {
        randomName =
            randomName +
            randomNamePool[Math.floor(Math.random() * randomNamePool.length)]
    }
    return randomName
}

/**
 * Because thousands of comics worth of data actually takes up
 * quite a bit of space, we're going to use generated values
 * for most situations.
 *
 * @param count the number of fake comics to generate
 * @returns a list of comics from 1 to `count` with randomly
 * generated names
 */
export function getComicListMocks(count: number) {
    const comicList: ComicList[] = []
    for (let c = 1; c <= count; c++) {
        comicList.push({
            comic: c,
            title: generateRandomName(Math.floor(Math.random() * 10) + 5),
            tagline:
                c % 3 === 0
                    ? generateRandomName(Math.floor(Math.random() * 10) + 5)
                    : undefined,
            isGuestComic: false,
            isNonCanon: false,
        })
    }

    return comicList
}
