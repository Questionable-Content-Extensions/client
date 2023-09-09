import { useArgs } from '@storybook/client-api'
import { ComponentMeta, ComponentStory } from '@storybook/react'

import TextEditor from './TextEditor'

export default {
    component: TextEditor,
} as ComponentMeta<typeof TextEditor>

const Template: ComponentStory<typeof TextEditor> = (args) => {
    const [_args, setArgs] = useArgs()
    const onValueChange = (newValue: string) => {
        setArgs({ value: newValue, dirty: true })
        args.onValueChange(newValue)
    }
    return <TextEditor {...args} onValueChange={onValueChange} />
}

export const Default = Template.bind({})
Default.args = {
    label: 'Label',
    labelTitle: 'Label Title',
    value: 'Value',
    inputId: 'Input Id',
    dirty: false,
    disabled: false,
}

export const Dirty = Template.bind({})
Dirty.args = {
    ...Default.args,
    dirty: true,
}

export const Disabled = Template.bind({})
Disabled.args = {
    ...Default.args,
    disabled: true,
}
