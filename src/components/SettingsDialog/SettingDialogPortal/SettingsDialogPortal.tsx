import { ConnectedProps, connect } from 'react-redux'

import DialogPortal from '@components/DialogPortal'
import { setShowSettingsDialog } from '@store/dialogSlice'
import { AppDispatch, RootState } from '@store/store'

import SettingsDialog from '../SettingsDialog'

const mapState = (state: RootState) => {
    return {
        showSettingsDialog: state.dialog.showSettingsDialog,
    }
}

const mapDispatch = (dispatch: AppDispatch) => {
    return {
        setShowSettingsDialog: (value: boolean) => {
            dispatch(setShowSettingsDialog(value))
        },
    }
}

const connector = connect(mapState, mapDispatch)
type PropsFromRedux = ConnectedProps<typeof connector>
type SettingsDialogPortalProps = PropsFromRedux & {}

export function SettingsDialogPortal({
    showSettingsDialog,
    setShowSettingsDialog,
}: SettingsDialogPortalProps) {
    return (
        <DialogPortal
            show={showSettingsDialog}
            onClose={() => setShowSettingsDialog(false)}
        >
            <SettingsDialog
                show={showSettingsDialog}
                onClose={() => setShowSettingsDialog(false)}
            />
        </DialogPortal>
    )
}

export default connector(SettingsDialogPortal)
