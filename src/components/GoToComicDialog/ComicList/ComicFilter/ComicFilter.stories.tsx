import { HttpResponse, http } from 'msw'
import { useState } from 'react'

import { Filter } from '@models/Filter'
import type { Meta, StoryObj } from '@storybook/react-vite'

import { ALL_ITEMS } from '~/mocks'

import ComicFilter from './ComicFilter'

const meta: Meta<typeof ComicFilter> = {
    component: ComicFilter,
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
                    })
                    return HttpResponse.json(all)
                }),
            ],
        },
    },
    render: (args) => {
        const [filters, setFilters] = useState<Filter[]>([])

        return (
            <ComicFilter {...args} filters={filters} setFilters={setFilters} />
        )
    },
}
export default meta

type Story = StoryObj<typeof ComicFilter>

export const Default: Story = {}
