import { useArgs, useState } from '@storybook/client-api'
import { ComponentMeta, ComponentStory } from '@storybook/react'

import { SettingsUpdater, UpdateSettings } from '../../hooks/useSettings'
import Settings from '../../settings'
import { SettingsPanel } from './SettingsDialog'

export default {
    component: SettingsPanel,
    title: 'Components/QcExtMainWidget/SettingsPanel',
    argTypes: {
        updateSettings: { action: 'updateSettings' },
    },
} as ComponentMeta<typeof SettingsPanel>

const Template: ComponentStory<typeof SettingsPanel> = (args) => {
    //const [settings, setSettings] = useState(args.settings)
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
        editModeToken: 'SuperSecretSauce',
    },
}
