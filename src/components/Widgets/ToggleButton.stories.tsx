import { useArgs } from '@storybook/client-api'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import ToggleButton, { Kind } from '@widgets/ToggleButton'

export default {
    component: ToggleButton,
    argTypes: {
        onChange: { action: 'onChange' },
        kind: {
            control: 'select',
            options: [Kind[Kind.Skinny], Kind[Kind.Thick]],
        },
    },
} as ComponentMeta<typeof ToggleButton>

const Template: ComponentStory<typeof ToggleButton> = (args) => {
    const [_, setArgs] = useArgs()

    // For better Storybook experience, we pretend this field is a string
    // and then turn it into a number here
    const kind = args.kind
    if (typeof kind === 'string') {
        args.kind = Kind[kind] as unknown as Kind
    }

    return (
        <ToggleButton
            {...args}
            onChange={(e) => {
                if (args.onChange) {
                    args.onChange(e)
                }
                setArgs({ checked: e.target.checked })
            }}
        />
    )
}

export const Default = Template.bind({})
Default.args = {
    label: 'Toggle me!',
    // For better Storybook experience, pretend this field is a string
    kind: Kind[Kind.Skinny] as unknown as Kind,
    checked: false,
    disabled: false,
}

export const Disabled = Template.bind({})
Disabled.args = {
    ...Default.args,
    disabled: true,
}
