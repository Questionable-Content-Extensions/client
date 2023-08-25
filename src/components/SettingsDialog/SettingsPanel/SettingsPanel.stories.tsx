//import { SettingsUpdater } from '@hooks/useSettings'
import { useArgs } from '@storybook/client-api'
import { ComponentMeta, ComponentStory } from '@storybook/react'

import Settings from '~/settings'

import SettingsPanel, { SettingsUpdater } from './SettingsPanel'

export default {
    component: SettingsPanel,
    argTypes: {
        updateSettings: { action: 'updateSettings' },
    },
} as ComponentMeta<typeof SettingsPanel>

const Template: ComponentStory<typeof SettingsPanel> = (args) => {
    const [_, setArgs] = useArgs()
    const updateSettings = (s: SettingsUpdater) => {
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
