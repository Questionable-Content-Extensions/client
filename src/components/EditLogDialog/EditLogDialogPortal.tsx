import DialogPortal from '@components/DialogPortal'
import { setShowEditLogDialog } from '@store/dialogSlice'
import { useAppDispatch, useAppSelector } from '@store/hooks'

import EditLogDialog from './EditLogDialog'

export default function EditLogDialogPortal() {
    const dispatch = useAppDispatch()
    const showEditLogDialogFor = useAppSelector(
        (state) => state.dialog.showEditLogDialogFor
    )

    return (
        <DialogPortal
            show={showEditLogDialogFor.kind !== 'closed'}
            onClose={() => dispatch(setShowEditLogDialog({ kind: 'closed' }))}
        >
            <EditLogDialog
                showFor={showEditLogDialogFor}
                onClose={() =>
                    dispatch(setShowEditLogDialog({ kind: 'closed' }))
                }
            />
        </DialogPortal>
    )
}
