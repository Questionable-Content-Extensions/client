import { apiSlice } from '@store/apiSlice'
import { setCurrentComic } from '@store/comicSlice'
import store from '@store/store'
import { Meta, StoryFn } from '@storybook/react'

import { COMIC_DATA_666, useMswReady } from '~/mocks'

import Date from './Date'

export default {
    component: Date,
} as Meta<typeof Date>

const Template: StoryFn<typeof Date> = (args) => {
    const mswReady = useMswReady()

    store.dispatch(apiSlice.util.resetApiState())

    // Let's set up the Redux store to be the way we need
    const state = store.getState()

    if (state.comic.current === 0) {
        store.dispatch(setCurrentComic(666))
    }

    // Then, let's fake the necessary REST calls
    const { worker, rest } = window.msw
    worker.use(
        rest.get(
            'http://localhost:3000/api/v2/comicdata/:comicId',
            (req, res, ctx) => {
                // We pretend this takes 1-2 seconds so we get to
                // observe the loading UX
                return res(
                    ctx.delay(1000 + Math.random() * 1000),
                    ctx.json(COMIC_DATA_666)
                )
            }
        )
    )

    return mswReady ? (
        <div className="relative inline-block mt-4 mr-4">
            <Date {...args} />
        </div>
    ) : (
        <></>
    )
}

export const Default = Template.bind({})

const ErrorTemplate: StoryFn<typeof Date> = (args) => {
    const mswReady = useMswReady()

    store.dispatch(apiSlice.util.resetApiState())

    // Let's set up the Redux store to be the way we need
    const state = store.getState()

    if (state.comic.current === 0) {
        store.dispatch(setCurrentComic(666))
    }

    // Then, let's fake the necessary REST calls
    const { worker, rest } = window.msw
    worker.use(
        rest.get(
            'http://localhost:3000/api/v2/comicdata/:comicId',
            (req, res, ctx) => {
                return res(
                    ctx.delay(1000 + Math.random() * 1000),
                    ctx.status(500),
                    ctx.text('Error!')
                )
            }
        )
    )

    return mswReady ? (
        <div className="relative inline-block mt-4 mr-4">
            <Date {...args} />
        </div>
    ) : (
        <></>
    )
}

export const Error = ErrorTemplate.bind({})
