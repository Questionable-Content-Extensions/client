import { useArgs } from '@storybook/preview-api'
import { Meta, StoryFn } from '@storybook/react'

import TextEditor from './TextEditor'

export default {
    component: TextEditor,
} as Meta<typeof TextEditor>

const Template: StoryFn<typeof TextEditor> = (args) => {
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
