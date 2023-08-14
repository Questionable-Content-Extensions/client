import { ComicData } from '@models/ComicData'
import { ComponentMeta, ComponentStory } from '@storybook/react'

import ItemNavigation from './ItemNavigation'

const COMIC_DATA_666: ComicData = {
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
            shortName: 'Faye',
            name: 'Faye Whitaker',
            type: 'cast',
            color: '341400',
            first: 3,
            previous: 665,
            next: 667,
            last: 4805,
            count: 1974,
        },
        {
            id: 1,
            shortName: 'Marten',
            name: 'Marten Reed',
            type: 'cast',
            color: '7d929e',
            first: 1,
            previous: 664,
            next: 667,
            last: 4857,
            count: 1869,
        },
        {
            id: 10,
            shortName: 'Dora',
            name: 'Dora Bianchi',
            type: 'cast',
            color: '1d1d1d',
            first: 75,
            previous: 661,
            next: 671,
            last: 4857,
            count: 1204,
        },
        {
            id: 23,
            shortName: 'Hannelore',
            name: 'Hannelore Ellicott-Chatham',
            type: 'cast',
            color: '00c1d6',
            first: 515,
            previous: 665,
            next: 667,
            last: 4857,
            count: 910,
        },
        {
            id: 141,
            shortName: "Marten and Faye's Apartment",
            name: "Marten, Claire, Faye, and Bubbles' Apartment",
            type: 'location',
            color: 'daeff6',
            first: 313,
            previous: 665,
            next: 667,
            last: 4840,
            count: 758,
        },
        {
            id: 2,
            shortName: 'Pintsize',
            name: 'Pintsize',
            type: 'cast',
            color: '8dbd9a',
            first: 1,
            previous: 665,
            next: 667,
            last: 4840,
            count: 486,
        },
        {
            id: 3,
            shortName: 'Steve',
            name: 'Steve',
            type: 'cast',
            color: '5b2900',
            first: 3,
            previous: 619,
            next: 712,
            last: 4510,
            count: 232,
        },
        {
            id: 24,
            shortName: 'Winslow',
            name: 'Winslow',
            type: 'cast',
            color: 'eeeeee',
            first: 527,
            previous: 612,
            next: 668,
            last: 4798,
            count: 148,
        },
        {
            id: 17,
            shortName: 'Amir',
            name: 'Amir Afridi',
            type: 'cast',
            color: '003388',
            first: 366,
            previous: 664,
            next: 669,
            last: 2607,
            count: 37,
        },
        {
            id: 14,
            shortName: 'Natasha',
            name: 'Natasha',
            type: 'cast',
            color: '000000',
            first: 248,
            previous: 664,
            next: 669,
            last: 1178,
            count: 33,
        },
        {
            id: 153,
            shortName: 'Practice space',
            name: 'Practice space on Ward avenue',
            type: 'location',
            color: 'eae2dd',
            first: 553,
            previous: 664,
            next: 843,
            last: 2606,
            count: 22,
        },
    ],
}

export default {
    component: ItemNavigation,
} as ComponentMeta<typeof ItemNavigation>

const Template: ComponentStory<typeof ItemNavigation> = (args) => (
    <ItemNavigation {...args} />
)

export const Default = Template.bind({})
Default.args = {
    itemNavigationData: COMIC_DATA_666.items,
    useColors: true,
    isLoading: false,
    isAllItems: false,
}

export const WithoutColor = Template.bind({})
WithoutColor.args = {
    ...Default.args,
    useColors: false,
}

export const Loading = Template.bind({})
Loading.args = {
    ...Default.args,
    isLoading: true,
}

export const NoData = Template.bind({})
NoData.args = {
    ...Default.args,
    itemNavigationData: [],
}

export const AllItemsMode = Template.bind({})
AllItemsMode.args = {
    ...Default.args,
    isAllItems: true,
}

export const AllItemsModeNoData = Template.bind({})
AllItemsModeNoData.args = {
    ...Default.args,
    itemNavigationData: [],
    isAllItems: true,
}
