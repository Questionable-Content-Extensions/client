import { HttpResponse, http } from 'msw'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'

import { ComicList } from '@models/ComicList'
import type { Meta, StoryObj } from '@storybook/react-vite'

import { ALL_ITEMS } from '~/mocks'

import PickComicDialog from './PickComicDialog'

const COMICS: ComicList[] = [
    {
        comic: 1,
        title: 'A comic about nothing in particular',
        tagline: undefined,
        isGuestComic: false,
        isNonCanon: false,
    },
    {
        comic: 2,
        title: 'The one with the tagline',
        tagline: 'A tale of two taglines',
        isGuestComic: false,
        isNonCanon: false,
    },
    {
        comic: 3,
        title: 'A guest comic',
        tagline: undefined,
        isGuestComic: true,
        isNonCanon: false,
    },
]

const meta: Meta<typeof PickComicDialog> = {
    component: PickComicDialog,
    argTypes: {
        show: {
            table: {
                disable: true,
            },
        },
    },
    args: {
        show: true,
        onClose: fn(),
        onSelectComic: fn(),
    },
    parameters: {
        msw: {
            handlers: [
                http.get('http://localhost:3000/api/v3/comicdata/', () => {
                    return HttpResponse.json(COMICS)
                }),
                http.get('http://localhost:3000/api/v3/itemdata/', () => {
                    return HttpResponse.json(ALL_ITEMS)
                }),
            ],
        },
    },
}
export default meta

type Story = StoryObj<typeof PickComicDialog>

export const Default: Story = {}

export const SelectingAComicInvokesCallback: Story = {
    play: async ({ args, canvasElement }) => {
        const canvas = within(canvasElement)

        const comicButton = await canvas.findByRole('button', {
            name: /A comic about nothing in particular/,
        })
        await userEvent.click(comicButton)

        await expect(args.onSelectComic).toHaveBeenCalledWith(1)
    },
}

export const FilteringByTextNarrowsTheList: Story = {
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)

        await canvas.findByRole('button', {
            name: /A comic about nothing in particular/,
        })

        const filterInput = canvas.getByRole('textbox')
        await userEvent.type(filterInput, 'tagline{enter}')

        await waitFor(() =>
            expect(
                canvas.getByRole('button', { name: /The one with the tagline/ })
            ).toBeInTheDocument()
        )
        await expect(
            canvas.queryByRole('button', {
                name: /A comic about nothing in particular/,
            })
        ).not.toBeInTheDocument()
    },
}

export const CancelInvokesOnClose: Story = {
    play: async ({ args, canvasElement }) => {
        const canvas = within(canvasElement)

        await userEvent.click(canvas.getByRole('button', { name: 'Cancel' }))

        await expect(args.onClose).toHaveBeenCalled()
    },
}
