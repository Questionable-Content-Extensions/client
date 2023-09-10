import { setSettings } from '@store/settingsSlice'
import store from '@store/store'
import { Meta, StoryFn } from '@storybook/react'

import constants from '~/constants'
import Settings from '~/settings'

import ChangeLogDialog from './ChangeLogDialog'

export default {
    component: ChangeLogDialog,
    argTypes: {
        show: {
            table: {
                disable: true,
            },
        },
    },
} as Meta<typeof ChangeLogDialog>

type ChangeLogDialogStoryThis = {
    kind: 'FirstInstall' | 'LaterInstalled' | 'Updated'
}
const Template: StoryFn<typeof ChangeLogDialog> = function (
    this: ChangeLogDialogStoryThis,
    args
) {
    // Let's set up the Redux store to be the way we need
    if (this.kind === 'FirstInstall') {
        store.dispatch(setSettings(Settings.DEFAULTS))
    } else if (this.kind === 'LaterInstalled') {
        store.dispatch(
            setSettings({
                ...Settings.DEFAULTS,
                version: constants.scriptVersion,
            })
        )
    } else {
        store.dispatch(
            setSettings({ ...Settings.DEFAULTS, version: 'OldVersion' })
        )
    }

    const onClose = () => {
        alert('In the userscript, this window would close now.')
    }

    return <ChangeLogDialog {...args} onClose={onClose} />
}

export const FirstInstall = Template.bind({ kind: 'FirstInstall' })
FirstInstall.args = {
    show: true,
}

export const LaterInstalled = Template.bind({ kind: 'LaterInstalled' })
LaterInstalled.args = {
    show: true,
}

export const Updated = Template.bind({ kind: 'Updated' })
Updated.args = {
    show: true,
}
