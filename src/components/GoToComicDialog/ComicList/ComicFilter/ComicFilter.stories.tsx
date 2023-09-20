import { useState } from 'react'

import { Meta, StoryObj } from '@storybook/react'

import { ALL_ITEMS, useMswReady } from '~/mocks'

import ComicFilter, { Filter } from './ComicFilter'

export default {
    component: ComicFilter,
} as Meta<typeof ComicFilter>

export const Default: StoryObj<typeof ComicFilter> = {
    render: (args) => {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const mswReady = useMswReady()

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
            )
        )

        // eslint-disable-next-line react-hooks/rules-of-hooks
        const [filters, setFilters] = useState<Filter[]>([])

        return mswReady ? (
            <ComicFilter {...args} filters={filters} setFilters={setFilters} />
        ) : (
            <></>
        )
    },
}
