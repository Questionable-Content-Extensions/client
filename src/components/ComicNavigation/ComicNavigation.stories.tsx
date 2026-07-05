import { HttpResponse, http } from 'msw'
import { expect, userEvent, waitFor, within } from 'storybook/test'

import { Comic } from '@models/Comic'
import { PresentComic } from '@models/PresentComic'
import { apiSlice } from '@store/apiSlice'
import {
    setCurrentComic,
    setLatestComic,
    setLockedToItem,
    setRandomComic,
} from '@store/comicSlice'
import store from '@store/store'
import type { Meta, StoryObj } from '@storybook/react-vite'

import { ALL_ITEMS, COMIC_DATA_666 } from '~/mocks'
import { mockNetworkDelay } from '~/storybook/mockNetworkDelay'

import ComicNavigation from './ComicNavigation'

const meta: Meta<typeof ComicNavigation> = {
    component: ComicNavigation,
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
                http.get(
                    'http://localhost:3000/api/v3/comicdata/:comicId',
                    async ({ params }) => {
                        const { comicId } = params
                        if (comicId === '666') {
                            await mockNetworkDelay()
                            return HttpResponse.json(COMIC_DATA_666)
                        } else {
                            const comic: Comic = {
                                ...COMIC_DATA_666,
                                comic: Number(comicId),
                                previous: Number(comicId) - 1,
                                next: Number(comicId) + 1,
                                items: [
                                    ...(COMIC_DATA_666 as PresentComic).items,
                                    {
                                        id: -1,
                                        first: 0,
                                        last: 0,
                                        next: 0,
                                        previous: 0,
                                    },
                                ],
                            } as unknown as Comic
                            return HttpResponse.json(comic)
                        }
                    }
                ),
                http.get(
                    'http://localhost:3000/api/v3/itemdata/:itemId/comics/random',
                    () => HttpResponse.json(420)
                ),
            ],
        },
    },
    loaders: [
        () => {
            store.dispatch(apiSlice.util.resetApiState())

            const state = store.getState()

            if (state.comic.current === 0) {
                store.dispatch(setCurrentComic(666))
                store.dispatch(setLatestComic(4269))
                store.dispatch(setRandomComic(420))
            }
        },
    ],
}
export default meta

type Story = StoryObj<typeof ComicNavigation>

export const Default: Story = {
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)

        store.dispatch(setCurrentComic(666))
        store.dispatch(setLatestComic(4269))
        store.dispatch(setRandomComic(420))

        await waitFor(async () =>
            expect(
                canvas.getByTitle('Go to previous strip')
            ).toBeInTheDocument()
        )
        await expect(store.getState().comic.current).toEqual(666)

        await waitFor(
            async () =>
                expect(
                    canvas.getByTitle('Go to previous strip')
                ).not.toHaveStyle('pointer-events: none'),
            { timeout: 3000 }
        )
        await userEvent.click(canvas.getByTitle('Go to previous strip'))
        await expect(store.getState().comic.current).toEqual(665)

        await waitFor(async () =>
            expect(canvas.getByTitle('Go to next strip')).not.toHaveStyle(
                'pointer-events: none'
            )
        )
        await userEvent.click(canvas.getByTitle('Go to next strip'))
        await expect(store.getState().comic.current).toEqual(666)

        await waitFor(async () =>
            expect(canvas.getByTitle('Go to first strip')).not.toHaveStyle(
                'pointer-events: none'
            )
        )
        await userEvent.click(canvas.getByTitle('Go to first strip'))
        await expect(store.getState().comic.current).toEqual(1)

        await waitFor(async () =>
            expect(canvas.getByTitle('Go to last strip')).not.toHaveStyle(
                'pointer-events: none'
            )
        )
        await userEvent.click(canvas.getByTitle('Go to last strip'))
        await expect(store.getState().comic.current).toEqual(4269)

        await waitFor(async () =>
            expect(canvas.getByTitle('Go to random strip')).not.toHaveStyle(
                'pointer-events: none'
            )
        )
        await userEvent.click(canvas.getByTitle('Go to random strip'))
        await expect(store.getState().comic.current).toEqual(420)
    },
}

export const LockedToItem: Story = {
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)

        store.dispatch(setCurrentComic(666))
        store.dispatch(setLatestComic(5000))
        store.dispatch(setLockedToItem(4))

        // Item id 4 ("Faye", from COMIC_DATA_666) last appears in comic
        // 4805, which differs from the site's overall latest comic (5000)
        // set above. Clicking "Last" while locked to an item must honor
        // the locked item's last appearance, not the global latest comic.
        await waitFor(async () =>
            expect(
                canvas.getByTitle('Go to last strip with Faye')
            ).not.toHaveStyle('pointer-events: none')
        )
        await userEvent.click(canvas.getByTitle('Go to last strip with Faye'))
        await expect(store.getState().comic.current).toEqual(4805)
    },
}
