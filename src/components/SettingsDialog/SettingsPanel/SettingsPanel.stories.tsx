import { useArgs } from '@storybook/preview-api'
import { Meta, StoryFn } from '@storybook/react'

import Settings, { SettingsUpdaterFunction } from '~/settings'

import SettingsPanel from './SettingsPanel'

export default {
    component: SettingsPanel,
    argTypes: {
        updateSettings: { action: 'updateSettings' },
    },
} as Meta<typeof SettingsPanel>

const Template: StoryFn<typeof SettingsPanel> = (args) => {
    const [_, setArgs] = useArgs()
    const updateSettings = (s: SettingsUpdaterFunction) => {
        if (args.updateSettings) {
            args.updateSettings(s)
        }

        s(args.settings)
        setArgs({ settings: args.settings })
    }
    return <SettingsPanel {...args} updateSettings={updateSettings} />
}

export const Default = Template.bind({})
Default.args = {
    settings: {
        ...Settings.DEFAULTS,
        editModeToken: '00000000-0000-0000-0000-000000000000',
    },
}
