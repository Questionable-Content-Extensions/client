import { PaddedButton } from '@components/Button'
import useOnNextOverlayClosed from '@hooks/useOnNextOverlayClosed'
import ModalDialog from '@modals/ModalDialog/ModalDialog'
import { setShowChangeLogDialog } from '@store/dialogSlice'
import { useAppDispatch, useAppSelector } from '@store/hooks'
import { updateSettings } from '@store/settingsSlice'

import { SettingsUpdaterFunction } from '~/settings'

import SettingsPanel from './SettingsPanel/SettingsPanel'

export default function SettingsDialog({
    show: _show,
    onClose,
}: {
    show: boolean
    onClose: () => void
}) {
    const dispatch = useAppDispatch()

    const settings = useAppSelector((state) => state.settings.values)

    const setShowChangeLogOnClose = useOnNextOverlayClosed(() => {
        dispatch(setShowChangeLogDialog(true))
    })

    if (!settings) {
        return <></>
    }

    const settingsUpdater = (u: SettingsUpdaterFunction) => {
        const updatedSettings = { ...settings }
        u(updatedSettings)
        dispatch(updateSettings(updatedSettings))
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
