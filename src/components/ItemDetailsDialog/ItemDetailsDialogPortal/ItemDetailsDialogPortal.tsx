import { ConnectedProps, connect } from 'react-redux'

import DialogPortal from '@components/DialogPortal'
import { setShowItemDetailsDialogFor } from '@store/dialogSlice'
import { AppDispatch, RootState } from '@store/store'

import ItemDetailsDialog from '../ItemDetailsDialog'

const mapState = (state: RootState) => {
    return {
        showItemDetailsDialogFor: state.dialog.showItemDetailsDialogFor,
    }
}

const mapDispatch = (dispatch: AppDispatch) => {
    return {
        setShowItemDetailsDialogFor: (value: number | null) => {
            dispatch(setShowItemDetailsDialogFor(value))
        },
    }
}

const connector = connect(mapState, mapDispatch)
type PropsFromRedux = ConnectedProps<typeof connector>
type SettingsDialogPortalProps = PropsFromRedux & {}

export function ItemDetailsDialogPortal({
    showItemDetailsDialogFor,
    setShowItemDetailsDialogFor,
}: SettingsDialogPortalProps) {
    return (
        <DialogPortal
            show={showItemDetailsDialogFor !== null}
            onClose={() => setShowItemDetailsDialogFor(null)}
        >
            <ItemDetailsDialog
                initialItemId={showItemDetailsDialogFor}
                onClose={() => setShowItemDetailsDialogFor(null)}
            />
        </DialogPortal>
    )
}

export default connector(ItemDetailsDialogPortal)
