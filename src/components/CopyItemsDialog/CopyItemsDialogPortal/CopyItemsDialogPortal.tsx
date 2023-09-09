import { ConnectedProps, connect } from 'react-redux'

import DialogPortal from '@components/DialogPortal'
import { ComicId } from '@models/ComicId'
import { setShowCopyItemsDialog } from '@store/dialogSlice'
import { AppDispatch, RootState } from '@store/store'

import CopyItemsDialog from '../CopyItemsDialog'

const mapState = (state: RootState) => {
    return {
        showCopyItemsDialog: state.dialog.showCopyItemsDialogFor,
    }
}

const mapDispatch = (dispatch: AppDispatch) => {
    return {
        setShowCopyItemsDialog: (comicId: ComicId | null) => {
            dispatch(setShowCopyItemsDialog(comicId))
        },
    }
}

const connector = connect(mapState, mapDispatch)
type PropsFromRedux = ConnectedProps<typeof connector>
type CopyItemsDialogPortalProps = PropsFromRedux & {}

export function CopyItemsDialogPortal({
    showCopyItemsDialog,
    setShowCopyItemsDialog,
}: CopyItemsDialogPortalProps) {
    return (
        <DialogPortal
            show={showCopyItemsDialog !== null}
            onClose={() => setShowCopyItemsDialog(null)}
        >
            <CopyItemsDialog
                show={showCopyItemsDialog !== null}
                onClose={() => setShowCopyItemsDialog(null)}
            />
        </DialogPortal>
    )
}

export default connector(CopyItemsDialogPortal)
