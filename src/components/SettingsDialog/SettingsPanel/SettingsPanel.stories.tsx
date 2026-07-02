import { useArgs } from 'storybook/preview-api'

import type { Meta, StoryObj } from '@storybook/react-vite'

import Settings, { SettingsUpdaterFunction } from '~/Settings'

import SettingsPanel from './SettingsPanel'

const meta: Meta<typeof SettingsPanel> = {
    component: SettingsPanel,
    argTypes: {
        updateSettings: { action: 'updateSettings' },
    },
    args: {
        settings: {
            ...Settings.DEFAULTS,
            editModeToken: '00000000-0000-0000-0000-000000000000',
        },
    },
    render: (args) => {
        const [, setArgs] = useArgs()
        const updateSettings = (s: SettingsUpdaterFunction) => {
            if (args.updateSettings) {
                args.updateSettings(s)
            }

            s(args.settings)
            setArgs({ settings: args.settings })
        }
        return <SettingsPanel {...args} updateSettings={updateSettings} />
    },
}
export default meta

type Story = StoryObj<typeof SettingsPanel>

export const Default: Story = {}
