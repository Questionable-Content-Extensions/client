import { useArgs } from '@storybook/preview-api'
import { Meta, StoryFn } from '@storybook/react'

import ValueEditor from './ValueEditor'

export default {
    component: ValueEditor,
} as Meta<typeof ValueEditor>

const Template: StoryFn<typeof ValueEditor> = (args) => {
    const [_args, setArgs] = useArgs()
    return (
        <ValueEditor
            {...args}
            setValue={(value) => {
                setArgs({ value, dirty: true })
            }}
        />
    )
}

export const Default = Template.bind({})
Default.args = {
    dirty: false,
    isSaving: false,
    label: 'Label',
    value: 'Value',
}

export const Dirty = Template.bind({})
Dirty.args = {
    ...Default.args,
    dirty: true,
}

export const Saving = Template.bind({})
Saving.args = {
    ...Default.args,
    isSaving: true,
}
