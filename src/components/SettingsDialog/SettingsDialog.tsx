import { ConnectedProps, connect } from 'react-redux'

import { PaddedButton } from '@components/Button'
import useOnNextOverlayClosed from '@hooks/useOnNextOverlayClosed'
import ModalDialog from '@modals/ModalDialog/ModalDialog'
import { setShowChangeLogDialog } from '@store/dialogSlice'
import { updateSettings } from '@store/settingsSlice'
import { AppDispatch, RootState } from '@store/store'

import { SettingValues, SettingsUpdaterFunction } from '~/settings'

import SettingsPanel from './SettingsPanel/SettingsPanel'

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
        setShowChangeLogDialog: (value: boolean) => {
            dispatch(setShowChangeLogDialog(value))
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
    settings,
    updateSettings,
    setShowChangeLogDialog,
    show: _show,
    onClose,
}: SettingsDialogProps) {
    const setShowChangeLogOnClose = useOnNextOverlayClosed(() => {
        setShowChangeLogDialog(true)
    })

    if (!settings) {
        return <></>
    }

    const settingsUpdater = (u: SettingsUpdaterFunction) => {
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
                <>
                    <PaddedButton
                        className="mr-2"
                        onClick={() => {
                            onClose()
                            setShowChangeLogOnClose(true)
                        }}
                    >
                        Show change log
                    </PaddedButton>
                    <PaddedButton onClick={() => onClose()}>Close</PaddedButton>
                </>
            }
        />
    )
}

export default connector(SettingsDialog)
