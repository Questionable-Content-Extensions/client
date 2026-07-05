import { useState } from 'react'
import { useArgs } from 'storybook/preview-api'

import type { Meta, StoryObj } from '@storybook/react-vite'

import ColorPicker from './ColorPicker'

const meta: Meta<typeof ColorPicker> = {
    component: ColorPicker,
    argTypes: {
        setColor: { action: 'setColor' },
        resetColor: { action: 'resetColor' },
    },
    args: {
        color: '#ffaabb',
        isColorDirty: false,
        isSaving: false,
    },
    render: (args) => {
        const [initialColor, setInitialColor] = useState(args.color)
        if (initialColor !== args.color) {
            setInitialColor(args.color)
        }
        const [, setArgs] = useArgs()
        return (
            <ColorPicker
                {...args}
                setColor={(color) => {
                    setArgs({ color, dirty: true })
                    args.setColor(color)
                }}
            />
        )
    },
}
export default meta

type Story = StoryObj<typeof ColorPicker>

export const Default: Story = {}

export const Dirty: Story = {
    args: {
        isColorDirty: true,
    },
}

export const Saving: Story = {
    args: {
        isSaving: true,
    },
}
