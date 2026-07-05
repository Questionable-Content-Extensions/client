import { HttpResponse, http } from 'msw'
import { expect, waitFor, within } from 'storybook/test'

import { apiSlice } from '@store/apiSlice'
import { setCurrentComic } from '@store/comicSlice'
import store from '@store/store'
import type { Meta, StoryObj } from '@storybook/react-vite'

import { COMIC_DATA_666 } from '~/mocks'
import { mockNetworkDelay } from '~/storybook/mockNetworkDelay'
import { withSuppressedExpectedErrorAsync } from '~/util/testUtils'

import Date from './Date'

const meta: Meta<typeof Date> = {
    component: Date,
    render: () => (
        <div className="relative inline-block mt-4 mr-4">
            <Date />
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
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)

        await withSuppressedExpectedErrorAsync(
            'Got unexpected response from server',
            async () => {
                await waitFor(() =>
                    expect(
                        canvas.getByText('Error loading comic data')
                    ).toBeInTheDocument()
                )
            }
        )
    },
}
