import DialogPortal from '@components/DialogPortal'
import { setShowSettingsDialog } from '@store/dialogSlice'
import { useAppDispatch, useAppSelector } from '@store/hooks'

import SettingsDialog from '../SettingsDialog'

export default function SettingsDialogPortal() {
    const dispatch = useAppDispatch()

    const showSettingsDialog = useAppSelector(
        (state) => state.dialog.showSettingsDialog
    )

    return (
        <DialogPortal
            show={showSettingsDialog}
            onClose={() => dispatch(setShowSettingsDialog(false))}
        >
            <SettingsDialog
                show={showSettingsDialog}
                onClose={() => dispatch(setShowSettingsDialog(false))}
            />
        </DialogPortal>
    )
}
