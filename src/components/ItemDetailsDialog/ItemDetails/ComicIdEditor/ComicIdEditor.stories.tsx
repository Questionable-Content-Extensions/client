import { useArgs } from 'storybook/preview-api'

import type { Meta, StoryObj } from '@storybook/react-vite'

import ComicIdEditor from './ComicIdEditor'

const meta: Meta<typeof ComicIdEditor> = {
    component: ComicIdEditor,
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
