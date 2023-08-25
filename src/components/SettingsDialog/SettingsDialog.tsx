import { ConnectedProps, connect } from 'react-redux'

import ModalDialog from '@modals/ModalDialog/ModalDialog'
import { updateSettings } from '@store/settingsSlice'
import { AppDispatch, RootState } from '@store/store'

import { SettingValues } from '~/settings'

import SettingsPanel, { SettingsUpdater } from './SettingsPanel/SettingsPanel'

const mapState = (state: RootState) => {
    return {
        settings: state.settings.values,
    }
}

const mapDispatch = (dispatch: AppDispatch) => {
    return {
        updateSettings: (values: SettingValues) => {
            dispatch(updateSettings(values))
        },
    }
}

const connector = connect(mapState, mapDispatch)
type PropsFromRedux = ConnectedProps<typeof connector>
type SettingsDialogProps = PropsFromRedux & {
    show: boolean
    onClose: () => void
}

function SettingsDialog({
    show: _show,
    onClose,
    settings,
    updateSettings,
}: SettingsDialogProps) {
    if (!settings) {
        return <></>
    }

    const settingsUpdater = (u: SettingsUpdater) => {
        const updatedSettings = { ...settings }
        u(updatedSettings)
        updateSettings(updatedSettings)
    }

    return (
        <ModalDialog
            onCloseClicked={onClose}
            header={
                <h5 className="m-0 text-xl font-medium leading-normal text-gray-800">
                    Settings
                </h5>
            }
            body={
                <SettingsPanel
                    settings={settings}
                    updateSettings={settingsUpdater}
                />
            }
            footer={
                <button
                    className="bg-qc-header hover:bg-qc-header-second focus:bg-qc-header-second text-white py-3 px-4 rounded-sm"
                    onClick={() => onClose()}
                >
                    Close
                </button>
            }
        />
    )
}

export default connector(SettingsDialog)
