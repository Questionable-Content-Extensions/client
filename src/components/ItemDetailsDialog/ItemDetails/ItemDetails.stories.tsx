import { HttpResponse, http } from 'msw'
import { useState } from 'react'

import { Item } from '@models/Item'
import { useAppDispatch } from '@store/hooks'
import { setFromItem } from '@store/itemEditorSlice'
import type { Meta, StoryObj } from '@storybook/react-vite'

import { ALL_ITEMS, FAYE } from '~/mocks'

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
                http.get('http://localhost:3000/api/v2/itemdata/', () => {
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
