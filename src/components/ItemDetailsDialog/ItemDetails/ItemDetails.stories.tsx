import { useState } from 'react'

import { Item } from '@models/Item'
import { useAppDispatch } from '@store/hooks'
import { setFromItem } from '@store/itemEditorSlice'
import { Meta, StoryFn } from '@storybook/react'

import { ALL_ITEMS, FAYE, useMswReady } from '~/mocks'

import ItemDetails from './ItemDetails'

export default {
    component: ItemDetails,
    argTypes: {
        onGoToComic: { action: 'onGoToComic' },
    },
} as Meta<typeof ItemDetails>

const Template: StoryFn<typeof ItemDetails> = (args) => {
    const mswReady = useMswReady()

    // Let's set up the Redux store to be the way we need
    const dispatch = useAppDispatch()
    const [previousItem, setPreviousItem] = useState<Item | null>(null)
    if (previousItem !== args.item) {
        setPreviousItem(args.item)
        dispatch(setFromItem(args.item))
    }

    // Then, let's fake the necessary REST calls
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
        })
    )

    return mswReady ? <ItemDetails {...args} /> : <></>
}

export const Default = Template.bind({})
Default.args = {
    item: FAYE,
    editMode: false,
}

export const Editor = Template.bind({})
Editor.args = {
    ...Default.args,
    editMode: true,
}
