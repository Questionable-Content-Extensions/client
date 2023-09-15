import { Comic } from '@models/Comic'
import { PresentComic } from '@models/PresentComic'
import { apiSlice } from '@store/apiSlice'
import {
    setCurrentComic,
    setLatestComic,
    setRandomComic,
} from '@store/comicSlice'
import store from '@store/store'
import { expect } from '@storybook/jest'
import { Meta, StoryObj } from '@storybook/react'
import { userEvent, waitFor, within } from '@storybook/testing-library'

import { ALL_ITEMS, COMIC_DATA_666, useMswReady } from '~/mocks'

import ComicNavigation from './ComicNavigation'

export default {
    component: ComicNavigation,
} as Meta<typeof ComicNavigation>

export const Default: StoryObj<typeof ComicNavigation> = {
    render: (args) => {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const mswReady = useMswReady()

        store.dispatch(apiSlice.util.resetApiState())

        // Let's set up the Redux store to be the way we need
        const state = store.getState()

        if (state.comic.current === 0) {
            store.dispatch(setCurrentComic(666))
            store.dispatch(setLatestComic(4269))
            store.dispatch(setRandomComic(420))
        }

        // Then, let's fake the necessary REST calls
        const { worker, rest } = window.msw
        worker.use(
            rest.get(
                'http://localhost:3000/api/v2/itemdata/',
                (req, res, ctx) => {
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
                }
            ),
            rest.get(
                'http://localhost:3000/api/v2/comicdata/:comicId',
                (req, res, ctx) => {
                    const { comicId } = req.params
                    if (comicId === '666') {
                        return res(
                            ctx.delay(1000 + Math.random() * 1000),
                            ctx.json(COMIC_DATA_666)
                        )
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
                        } as any
                        return res(ctx.json(comic))
                    }
                }
            )
        )

        return mswReady ? <ComicNavigation {...args} /> : <></>
    },
    play: async ({ canvasElement, args: _args }) => {
        const canvas = within(canvasElement)

        store.dispatch(setCurrentComic(666))
        store.dispatch(setLatestComic(4269))
        store.dispatch(setRandomComic(420))

        await waitFor(() =>
            expect(
                canvas.getByTitle('Go to previous strip')
            ).toBeInTheDocument()
        )
        expect(store.getState().comic.current).toEqual(666)

        await waitFor(
            () =>
                expect(
                    canvas.getByTitle('Go to previous strip')
                ).not.toHaveStyle('pointer-events: none'),
            { timeout: 3000 }
        )
        await userEvent.click(canvas.getByTitle('Go to previous strip'))
        expect(store.getState().comic.current).toEqual(665)

        await waitFor(() =>
            expect(canvas.getByTitle('Go to next strip')).not.toHaveStyle(
                'pointer-events: none'
            )
        )
        await userEvent.click(canvas.getByTitle('Go to next strip'))
        expect(store.getState().comic.current).toEqual(666)

        await waitFor(() =>
            expect(canvas.getByTitle('Go to first strip')).not.toHaveStyle(
                'pointer-events: none'
            )
        )
        await userEvent.click(canvas.getByTitle('Go to first strip'))
        expect(store.getState().comic.current).toEqual(1)

        await waitFor(() =>
            expect(canvas.getByTitle('Go to last strip')).not.toHaveStyle(
                'pointer-events: none'
            )
        )
        await userEvent.click(canvas.getByTitle('Go to last strip'))
        expect(store.getState().comic.current).toEqual(4269)

        await waitFor(() =>
            expect(canvas.getByTitle('Go to random strip')).not.toHaveStyle(
                'pointer-events: none'
            )
        )
        await userEvent.click(canvas.getByTitle('Go to random strip'))
        expect(store.getState().comic.current).toEqual(420)
    },
}
