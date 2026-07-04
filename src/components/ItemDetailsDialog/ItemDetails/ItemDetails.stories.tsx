import { HttpResponse, http } from 'msw'
import { useState } from 'react'
import { expect, within } from 'storybook/test'

import { Item } from '@models/Item'
import { useAppDispatch } from '@store/hooks'
import { setFromItem } from '@store/itemEditorSlice'
import type { Meta, StoryObj } from '@storybook/react-vite'

import { ALL_ITEMS, FAYE, STORYLINE_ONGOING_ITEM } from '~/mocks'

import ItemDetails from './ItemDetails'

const meta: Meta<typeof ItemDetails> = {
    component: ItemDetails,
    argTypes: {
        onGoToComic: { action: 'onGoToComic' },
    },
    args: {
        item: FAYE,
        editMode: false,
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
    render: (args) => {
        const dispatch = useAppDispatch()
        const [previousItem, setPreviousItem] = useState<Item | null>(null)
        if (previousItem !== args.item) {
            setPreviousItem(args.item)
            dispatch(setFromItem(args.item))
        }

        return <ItemDetails {...args} />
    },
}
export default meta

type Story = StoryObj<typeof ItemDetails>

export const Default: Story = {}

export const Editor: Story = {
    args: {
        editMode: true,
    },
}

// Regression coverage for a bug where unchecking "Ongoing" always defaulted
// `endComicId` to just past `startComicId` (an empty one-comic range),
// regardless of how far the storyline had actually been attached to comics.
// It should default to just past the last comic the storyline appeared in.
export const EditorTogglingOngoingStoryline: Story = {
    args: {
        editMode: true,
        item: STORYLINE_ONGOING_ITEM,
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)

        const ongoingCheckbox = canvas.getByLabelText<HTMLInputElement>(
            /Ongoing \(no end comic\)/
        )
        expect(ongoingCheckbox.checked).toBe(true)

        await ongoingCheckbox.click()

        // `endComicId` is exclusive, displayed inclusive at the UI boundary,
        // so unchecking should land on `item.last` (850), not `startComicId`
        // (400).
        expect(canvas.getByLabelText(/End comic/)).toHaveValue(
            STORYLINE_ONGOING_ITEM.last
        )
    },
}
