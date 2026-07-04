import { HttpResponse, http } from 'msw'

import { apiSlice } from '@store/apiSlice'
import { setCurrentComic } from '@store/comicSlice'
import store from '@store/store'
import type { Meta, StoryObj } from '@storybook/react-vite'

import { COMIC_DATA_666 } from '~/mocks'
import { mockNetworkDelay } from '~/storybook/mockNetworkDelay'

import Date from './Date'

const meta: Meta<typeof Date> = {
    component: Date,
    render: (args) => (
        <div className="relative inline-block mt-4 mr-4">
            <Date {...args} />
        </div>
    ),
    loaders: [
        () => {
            store.dispatch(apiSlice.util.resetApiState())

            const state = store.getState()

            if (state.comic.current === 0) {
                store.dispatch(setCurrentComic(666))
            }
        },
    ],
}
export default meta

type Story = StoryObj<typeof Date>

export const Default: Story = {
    parameters: {
        msw: {
            handlers: [
                http.get(
                    'http://localhost:3000/api/v3/comicdata/:comicId',
                    async () => {
                        // We pretend this takes 1-2 seconds so we get to
                        // observe the loading UX
                        await mockNetworkDelay()
                        return HttpResponse.json(COMIC_DATA_666)
                    }
                ),
            ],
        },
    },
}

export const Error: Story = {
    parameters: {
        msw: {
            handlers: [
                http.get(
                    'http://localhost:3000/api/v3/comicdata/:comicId',
                    async () => {
                        await mockNetworkDelay()
                        return HttpResponse.text('Error!', { status: 500 })
                    }
                ),
            ],
        },
    },
}
