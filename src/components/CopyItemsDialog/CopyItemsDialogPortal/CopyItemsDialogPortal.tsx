import DialogPortal from '@components/DialogPortal'
import { setShowCopyItemsDialog } from '@store/dialogSlice'
import { useAppDispatch, useAppSelector } from '@store/hooks'

import CopyItemsDialog from '../CopyItemsDialog'

export default function CopyItemsDialogPortal() {
    const dispatch = useAppDispatch()

    const showCopyItemsDialog = useAppSelector(
        (state) => state.dialog.showCopyItemsDialogFor
    )

    return (
        <DialogPortal
            show={showCopyItemsDialog !== null}
            onClose={() => dispatch(setShowCopyItemsDialog(null))}
        >
            <CopyItemsDialog
                show={showCopyItemsDialog !== null}
                onClose={() => dispatch(setShowCopyItemsDialog(null))}
            />
        </DialogPortal>
    )
}
