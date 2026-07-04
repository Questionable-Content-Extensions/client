import { HttpResponse, http } from 'msw'
import { getWorker } from 'msw-storybook-addon'
import type { ComponentProps } from 'react'

import { ComicList as ComicDataListing } from '@models/ComicList'
import type { Meta, StoryObj } from '@storybook/react-vite'

import { ALL_ITEMS, generateRandomName } from '~/mocks'

import ComicList from './ComicList'

interface ExtraArgs {
    // Not a real prop of `ComicList` — a Storybook-only control used to
    // auto-generate `allComicData` when it's left empty.
    comicCount: number
}

const meta: Meta<ComponentProps<typeof ComicList> & ExtraArgs> = {
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
    args: {
        allComicData: [],
        subDivideGotoComics: true,
        comicCount: 5110,
        isLoading: false,
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
            ],
        },
    },
    loaders: [
        (context) => {
            let allComicData: ComicDataListing[]
            if (!context.args.allComicData.length) {
                allComicData = []
                for (let c = 1; c <= context.args.comicCount; c++) {
                    allComicData.push({
                        comic: c,
                        title: generateRandomName(
                            Math.floor(Math.random() * 10) + 5
                        ),
                        tagline:
                            c % 3 === 0
                                ? generateRandomName(
                                      Math.floor(Math.random() * 10) + 5
                                  )
                                : undefined,
                        isGuestComic: c % 5 === 0,
                        isNonCanon: c % 7 === 0,
                    })
                }
            } else {
                allComicData = context.args.allComicData
            }

            getWorker().use(
                http.get(
                    'http://localhost:3000/api/v3/comicdata/containing-items',
                    () => {
                        let count =
                            1 +
                            Math.floor(
                                Math.random() * (allComicData.length - 1)
                            )
                        if (allComicData.length > 100 && count < 50) {
                            count = 50
                        }
                        const comics: number[] = []
                        for (let i = 0; i < count; i++) {
                            while (true) {
                                const random =
                                    1 +
                                    Math.floor(
                                        Math.random() *
                                            (allComicData.length - 1)
                                    )
                                if (!comics.includes(random)) {
                                    comics.push(random)
                                    break
                                }
                            }
                        }
                        return HttpResponse.json(comics)
                    }
                )
            )

            return { allComicData }
        },
    ],
    render: (args, { loaded }) => (
        <ComicList {...args} allComicData={loaded.allComicData} />
    ),
}
export default meta

type Story = StoryObj<typeof ComicList>

export const Default: Story = {}

export const Loading: Story = {
    args: {
        isLoading: true,
    },
}

export const NonSubDivided: Story = {
    name: 'Non-Subdivided',
    args: {
        subDivideGotoComics: false,
    },
}
