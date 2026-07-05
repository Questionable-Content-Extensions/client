import { HttpResponse, http } from 'msw'
import { useArgs } from 'storybook/preview-api'

import type { Meta, StoryObj } from '@storybook/react-vite'

import { ALL_ITEMS } from '~/mocks'

import ComicIdEditor from './ComicIdEditor'

// Always renders `PickComicDialog` (just visually hidden via `show`), whose
// `ComicList` -> `ComicFilter` calls `useAllItemsQuery` unconditionally -
// mock it so every story here is self-contained instead of relying on some
// other story's cache still being populated.
const mswHandlers = [
    http.get('http://localhost:3000/api/v3/itemdata/', () =>
        HttpResponse.json(ALL_ITEMS)
    ),
]

const meta: Meta<typeof ComicIdEditor> = {
    component: ComicIdEditor,
    parameters: {
        msw: {
            handlers: mswHandlers,
        },
    },
    args: {
        dirty: false,
        isSaving: false,
        label: 'Start comic',
        value: 666,
    },
    render: (args) => {
        const [, setArgs] = useArgs()
        return (
            <ComicIdEditor
                {...args}
                setValue={(value) => {
                    setArgs({ value, dirty: true })
                }}
            />
        )
    },
}
export default meta

type Story = StoryObj<typeof ComicIdEditor>

export const Default: Story = {}

export const Dirty: Story = {
    args: {
        dirty: true,
    },
}

export const Saving: Story = {
    args: {
        isSaving: true,
    },
}
