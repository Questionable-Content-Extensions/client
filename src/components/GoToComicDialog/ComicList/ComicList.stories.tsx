import { ComicList as ComicDataListing } from '@models/ComicList'
import { Meta, StoryFn } from '@storybook/react'

import { ALL_ITEMS, generateRandomName, useMswReady } from '~/mocks'

import ComicList from './ComicList'

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
        onGoToComic: { action: 'onGoToComic' },
    },
} as Meta<typeof ComicList>

const Template: StoryFn<typeof ComicList> = (args) => {
    const mswReady = useMswReady()

    let allComicData: ComicDataListing[]
    if (!args.allComicData.length) {
        allComicData = []
        for (let c = 1; c <= (args as any).comicCount; c++) {
            allComicData.push({
                comic: c,
                title: generateRandomName(Math.floor(Math.random() * 10) + 5),
                tagline:
                    c % 3 === 0
                        ? generateRandomName(Math.floor(Math.random() * 10) + 5)
                        : undefined,
                isGuestComic: c % 5 === 0,
                isNonCanon: c % 7 === 0,
            })
        }
    } else {
        allComicData = args.allComicData
    }

    // Let's fake the necessary REST calls
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
            'http://localhost:3000/api/v2/comicdata/containing-items',
            (req, res, ctx) => {
                let count =
                    1 + Math.floor(Math.random() * (allComicData.length - 1))
                if (allComicData.length > 100 && count < 50) {
                    count = 50
                }
                const comics: number[] = []
                for (let i = 0; i < count; i++) {
                    while (true) {
                        const random =
                            1 +
                            Math.floor(
                                Math.random() * (allComicData.length - 1)
                            )
                        if (!comics.includes(random)) {
                            comics.push(random)
                            break
                        }
                    }
                }
                return res(ctx.json(comics))
            }
        )
    )
    return mswReady ? (
        <ComicList {...args} allComicData={allComicData} />
    ) : (
        <></>
    )
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
