import { useArgs } from 'storybook/preview-api'
import { fn, userEvent, within } from 'storybook/test'

import type { Meta, StoryObj } from '@storybook/react-vite'

import DateEditor from './DateEditor'

const NOW = new Date().toISOString()

const meta: Meta<typeof DateEditor> = {
    component: DateEditor,
    args: {
        label: 'Label',
        labelTitle: 'Label Title',
        dateValue: NOW,
        isAccurateValue: false,
        inputId: 'Input Id',
        isDateValueDirty: false,
        isIsAccurateValueDirty: false,
        disabled: false,
        onDateValueChange: fn(),
        onIsAccurateValueChange: fn(),
    },
    render: (args) => {
        const [, setArgs] = useArgs()
        const onDateValueChange = (newValue: string) => {
            setArgs({ dateValue: newValue, isDateValueDirty: true })
            args.onDateValueChange(newValue)
        }
        const onIsAccurateValueChange = (newValue: boolean) => {
            setArgs({
                isAccurateValue: newValue,
                isIsAccurateValueDirty: true,
            })
            args.onIsAccurateValueChange(newValue)
        }
        return (
            <DateEditor
                {...args}
                onDateValueChange={onDateValueChange}
                onIsAccurateValueChange={onIsAccurateValueChange}
            />
        )
    },
}
export default meta

type Story = StoryObj<typeof DateEditor>

export const Default: Story = {}

export const Dirty: Story = {
    args: {
        isDateValueDirty: true,
        isIsAccurateValueDirty: true,
    },
}

export const Disabled: Story = {
    args: {
        disabled: true,
    },
}

export const InvalidInput: Story = {
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)
        const input = canvas.getByPlaceholderText('Label Title')
        await userEvent.clear(input)
    },
}
