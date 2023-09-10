import { useArgs } from '@storybook/preview-api'
import { Meta, StoryFn } from '@storybook/react'

import DateEditor from './DateEditor'

export default {
    component: DateEditor,
} as Meta<typeof DateEditor>

const Template: StoryFn<typeof DateEditor> = (args) => {
    const [_args, setArgs] = useArgs()
    const onDateValueChange = (newValue: string) => {
        console.log(newValue)
        setArgs({ dateValue: newValue, isDateValueDirty: true })
        args.onDateValueChange(newValue)
    }
    const onIsAccurateValueChange = (newValue: boolean) => {
        setArgs({ isAccurateValue: newValue, isIsAccurateValueDirty: true })
        args.onIsAccurateValueChange(newValue)
    }
    return (
        <DateEditor
            {...args}
            onDateValueChange={onDateValueChange}
            onIsAccurateValueChange={onIsAccurateValueChange}
        />
    )
}

const NOW = new Date().toISOString()

export const Default = Template.bind({})
Default.args = {
    label: 'Label',
    labelTitle: 'Label Title',
    dateValue: NOW,
    isAccurateValue: false,
    inputId: 'Input Id',
    isDateValueDirty: false,
    isIsAccurateValueDirty: false,
    disabled: false,
}

export const Dirty = Template.bind({})
Dirty.args = {
    ...Default.args,
    isDateValueDirty: true,
    isIsAccurateValueDirty: true,
}

export const Disabled = Template.bind({})
Disabled.args = {
    ...Default.args,
    disabled: true,
}
