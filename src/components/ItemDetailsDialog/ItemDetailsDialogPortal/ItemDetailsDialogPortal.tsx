import DialogPortal from '@components/DialogPortal'
import { setShowItemDetailsDialogFor } from '@store/dialogSlice'
import { useAppDispatch, useAppSelector } from '@store/hooks'
import { isStateDirtySelector, reset } from '@store/itemEditorSlice'

import ItemDetailsDialog from '../ItemDetailsDialog'

export default function ItemDetailsDialogPortal() {
    const dispatch = useAppDispatch()

    const showItemDetailsDialogFor = useAppSelector(
        (state) => state.dialog.showItemDetailsDialogFor
    )
    const isItemDirty = useAppSelector((state) => isStateDirtySelector(state))

    const onClose = () => {
        if (isItemDirty) {
            if (
                window.confirm(
                    'This item has unsaved changes. Are you sure you want to close?'
                )
            ) {
                dispatch(reset())
                dispatch(setShowItemDetailsDialogFor(null))
            }
        } else {
            dispatch(setShowItemDetailsDialogFor(null))
        }
    }
    return (
        <DialogPortal
            show={showItemDetailsDialogFor !== null}
            onClose={onClose}
        >
            <ItemDetailsDialog
                initialItemId={showItemDetailsDialogFor}
                onClose={onClose}
            />
        </DialogPortal>
    )
}
