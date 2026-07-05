import { setSettings } from '@store/settingsSlice'
import store from '@store/store'
import type { Meta, StoryObj } from '@storybook/react-vite'

import Settings from '~/Settings'
import constants from '~/constants'

import ChangeLogDialog from './ChangeLogDialog'

const meta: Meta<typeof ChangeLogDialog> = {
    component: ChangeLogDialog,
    argTypes: {
        show: {
            table: {
                disable: true,
            },
        },
    },
    args: {
        show: true,
        onClose: () => {
            alert('In the userscript, this window would close now.')
        },
    },
}
export default meta

type Story = StoryObj<typeof ChangeLogDialog>

export const FirstInstall: Story = {
    loaders: [
        () => {
            store.dispatch(setSettings(Settings.DEFAULTS))
        },
    ],
}

export const LaterInstalled: Story = {
    loaders: [
        () => {
            store.dispatch(
                setSettings({
                    ...Settings.DEFAULTS,
                    version: constants.scriptVersion,
                })
            )
        },
    ],
}

export const Updated: Story = {
    loaders: [
        () => {
            store.dispatch(
                setSettings({ ...Settings.DEFAULTS, version: 'OldVersion' })
            )
        },
    ],
}
