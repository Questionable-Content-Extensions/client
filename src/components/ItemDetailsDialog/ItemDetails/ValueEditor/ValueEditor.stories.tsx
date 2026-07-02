import { useArgs } from 'storybook/preview-api'

import type { Meta, StoryObj } from '@storybook/react-vite'

import ValueEditor from './ValueEditor'

const meta: Meta<typeof ValueEditor> = {
    component: ValueEditor,
    args: {
        dirty: false,
        isSaving: false,
        label: 'Label',
        value: 'Value',
    },
    render: (args) => {
        const [, setArgs] = useArgs()
        return (
            <ValueEditor
                {...args}
                setValue={(value) => {
                    setArgs({ value, dirty: true })
                }}
            />
        )
    },
}
export default meta

type Story = StoryObj<typeof ValueEditor>

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
