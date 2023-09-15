import DialogPortal from '@components/DialogPortal'
import { setShowChangeLogDialog } from '@store/dialogSlice'
import { useAppDispatch, useAppSelector } from '@store/hooks'

import ChangeLogDialog from '../ChangeLogDialog'

export default function ChangeLogDialogPortal() {
    const dispatch = useAppDispatch()

    const showChangeLogDialog = useAppSelector(
        (state) => state.dialog.showChangeLogDialog
    )

    return (
        <DialogPortal
            show={showChangeLogDialog}
            onClose={() => dispatch(setShowChangeLogDialog(false))}
        >
            <ChangeLogDialog
                show={showChangeLogDialog}
                onClose={() => dispatch(setShowChangeLogDialog(false))}
            />
        </DialogPortal>
    )
}
