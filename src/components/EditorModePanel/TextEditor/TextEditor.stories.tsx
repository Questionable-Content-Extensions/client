import { useArgs } from 'storybook/preview-api'

import type { Meta, StoryObj } from '@storybook/react-vite'

import TextEditor from './TextEditor'

const meta: Meta<typeof TextEditor> = {
    component: TextEditor,
    args: {
        label: 'Label',
        labelTitle: 'Label Title',
        value: 'Value',
        inputId: 'Input Id',
        dirty: false,
        disabled: false,
    },
    render: (args) => {
        const [, setArgs] = useArgs()
        const onValueChange = (newValue: string) => {
            setArgs({ value: newValue, dirty: true })
            args.onValueChange(newValue)
        }
        return <TextEditor {...args} onValueChange={onValueChange} />
    },
}
export default meta

type Story = StoryObj<typeof TextEditor>

export const Default: Story = {}

export const Dirty: Story = {
    args: {
        dirty: true,
    },
}

export const Disabled: Story = {
    args: {
        disabled: true,
    },
}
