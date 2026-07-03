import DialogPortal from '@components/DialogPortal'
import { setShowAddAdvanceComicDialog } from '@store/dialogSlice'
import { useAppDispatch, useAppSelector } from '@store/hooks'

import AddAdvanceComicDialog from '../AddAdvanceComicDialog'

export default function AddAdvanceComicDialogPortal() {
    const dispatch = useAppDispatch()

    const showAddAdvanceComicDialog = useAppSelector(
        (state) => state.dialog.showAddAdvanceComicDialog
    )

    return (
        <DialogPortal
            show={showAddAdvanceComicDialog}
            onClose={() => dispatch(setShowAddAdvanceComicDialog(false))}
        >
            <AddAdvanceComicDialog
                show={showAddAdvanceComicDialog}
                onClose={() => dispatch(setShowAddAdvanceComicDialog(false))}
            />
        </DialogPortal>
    )
}
