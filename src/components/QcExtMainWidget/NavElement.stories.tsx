import { ComponentMeta, ComponentStory } from '@storybook/react'

import { MARTEN } from '~/mocks'

import NavElement, { NavElementMode } from './NavElement'

export default {
    component: NavElement,
    argTypes: {
        mode: {
            control: 'select',
            options: [
                NavElementMode[NavElementMode.Present],
                NavElementMode[NavElementMode.Missing],
                NavElementMode[NavElementMode.Editor],
                NavElementMode[NavElementMode.Preview],
            ],
        },
    },
} as ComponentMeta<typeof NavElement>

const Template: ComponentStory<typeof NavElement> = (args) => {
    // For better Storybook experience, we pretend this field is a string
    // and then turn it into a number here
    const mode = args.mode
    if (typeof mode === 'string') {
        args.mode = NavElementMode[mode] as unknown as NavElementMode
    }

    return <NavElement {...args} />
}

export const Default = Template.bind({})
Default.args = {
    item: MARTEN,
    useColors: true,
    mode: NavElementMode[NavElementMode.Present] as unknown as NavElementMode,
    editMode: false,
}

export const WithoutColor = Template.bind({})
WithoutColor.args = {
    ...Default.args,
    useColors: false,
}

export const EditModePresent = Template.bind({})
EditModePresent.args = {
    ...Default.args,
    editMode: true,
}

export const EditModeMissing = Template.bind({})
EditModeMissing.args = {
    ...Default.args,
    editMode: true,
    mode: NavElementMode[NavElementMode.Missing] as unknown as NavElementMode,
}
