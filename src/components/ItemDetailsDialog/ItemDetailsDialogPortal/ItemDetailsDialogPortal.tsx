import { ConnectedProps, connect } from 'react-redux'

import DialogPortal from '@components/DialogPortal'
import { setShowItemDetailsDialogFor } from '@store/dialogSlice'
import { isStateDirtySelector, reset } from '@store/itemEditorSlice'
import { AppDispatch, RootState } from '@store/store'

import ItemDetailsDialog from '../ItemDetailsDialog'

const mapState = (state: RootState) => {
    return {
        showItemDetailsDialogFor: state.dialog.showItemDetailsDialogFor,
        isItemDirty: isStateDirtySelector(state),
    }
}

const mapDispatch = (dispatch: AppDispatch) => {
    return {
        setShowItemDetailsDialogFor: (value: number | null) => {
            dispatch(setShowItemDetailsDialogFor(value))
        },
        reset: () => {
            dispatch(reset())
        },
    }
}

const connector = connect(mapState, mapDispatch)
type PropsFromRedux = ConnectedProps<typeof connector>
type SettingsDialogPortalProps = PropsFromRedux & {}

export function ItemDetailsDialogPortal({
    showItemDetailsDialogFor,
    isItemDirty,
    setShowItemDetailsDialogFor,
    reset,
}: SettingsDialogPortalProps) {
    const onClose = () => {
        if (isItemDirty) {
            if (
                window.confirm(
                    'This item has unsaved changes. Are you sure you want to close?'
                )
            ) {
                reset()
                setShowItemDetailsDialogFor(null)
            }
        } else {
            setShowItemDetailsDialogFor(null)
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

export default connector(ItemDetailsDialogPortal)
