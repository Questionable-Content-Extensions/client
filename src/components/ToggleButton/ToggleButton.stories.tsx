import { useArgs } from 'storybook/preview-api'

import type { Meta, StoryObj } from '@storybook/react-vite'

import ToggleButton, { Kind } from './ToggleButton'

const meta: Meta<typeof ToggleButton> = {
    component: ToggleButton,
    argTypes: {
        onChange: { action: 'onChange' },
        kind: {
            control: 'select',
            options: [Kind[Kind.Skinny], Kind[Kind.Thick]],
        },
    },
    args: {
        label: 'Toggle me!',
        // For better Storybook experience, pretend this field is a string
        kind: Kind[Kind.Skinny] as unknown as Kind,
        checked: false,
        disabled: false,
    },
    render: (args) => {
        const [, setArgs] = useArgs()

        // For better Storybook experience, we pretend this field is a string
        // and then turn it into a number here
        const kind =
            typeof args.kind === 'string'
                ? (Kind[args.kind] as unknown as Kind)
                : args.kind

        return (
            <ToggleButton
                {...args}
                kind={kind}
                onChange={(e) => {
                    args.onChange?.(e)
                    setArgs({ checked: e.target.checked })
                }}
            />
        )
    },
}
export default meta

type Story = StoryObj<typeof ToggleButton>

export const Default: Story = {}

export const Disabled: Story = {
    args: {
        disabled: true,
    },
}
