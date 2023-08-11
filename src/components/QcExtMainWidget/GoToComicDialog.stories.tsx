import { ComponentStory, ComponentMeta } from '@storybook/react'

import { ComicList } from './GoToComicDialog'
import { ComicDataListing } from '../../services/comicDataService'

export default {
    component: ComicList,
    argTypes: {
        comicCount: {
            control: { type: 'number' },
            description: 'How many comics to auto-generate',
            name: 'How many comics to fake',
            table: {
                category: 'Data-autogeneration',
            },
        },
        onGoToComic: { action: 'goto-comic' },
    },
    title: 'Components/QcExtMainWidget/ComicList',
} as ComponentMeta<typeof ComicList>

const Template: ComponentStory<typeof ComicList> = (args) => {
    let allComicData: ComicDataListing[]
    if (!args.allComicData.length) {
        allComicData = []
        for (let c = 1; c <= (args as any).comicCount; c++) {
            allComicData.push({
                comic: c,
                title: `Comic ${c}`,
                isGuestComic: false,
                isNonCanon: false,
            })
        }
    } else {
        allComicData = args.allComicData
    }
    return <ComicList {...args} allComicData={allComicData} />
}

export const Default = Template.bind({})
Default.args = {
    allComicData: [], //
    subDivideGotoComics: true,
    comicCount: 5110,
    isLoading: false,
} as any // Needed because `comicCount` isn't truly part of the args

export const Loading = Template.bind({})
Loading.args = {
    ...Default.args,
    isLoading: true,
}

export const NonSubDivided = Template.bind({})
NonSubDivided.args = {
    ...Default.args,
    subDivideGotoComics: false,
}
NonSubDivided.storyName = 'Non-Subdivided'
