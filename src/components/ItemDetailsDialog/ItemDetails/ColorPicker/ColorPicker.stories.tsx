import { useState } from 'react'

import { useArgs } from '@storybook/client-api'
import { ComponentMeta, ComponentStory } from '@storybook/react'

import ColorPicker from './ColorPicker'

export default {
    component: ColorPicker,
    argTypes: {
        setColor: { action: 'setColor' },
        resetColor: { action: 'resetColor' },
    },
} as ComponentMeta<typeof ColorPicker>

const Template: ComponentStory<typeof ColorPicker> = (args) => {
    const [initialColor, setInitialColor] = useState(args.color)
    if (initialColor !== args.color) {
        setInitialColor(args.color)
    }
    const [_args, setArgs] = useArgs()
    return (
        <ColorPicker
            {...args}
            setColor={(color) => {
                setArgs({ color, dirty: true })
                args.setColor(color)
            }}
        />
    )
}

export const Default = Template.bind({})
Default.args = {
    color: '#ffaabb',
    isColorDirty: false,
    isSaving: false,
}

export const Dirty = Template.bind({})
Dirty.args = {
    ...Default.args,
    isColorDirty: true,
}

export const Saving = Template.bind({})
Saving.args = {
    ...Default.args,
    isSaving: true,
}
