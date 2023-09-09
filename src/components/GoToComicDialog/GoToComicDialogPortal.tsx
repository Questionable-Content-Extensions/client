import { ConnectedProps, connect } from 'react-redux'

import DialogPortal from '@components/DialogPortal'
import { setShowGoToComicDialog } from '@store/dialogSlice'
import { AppDispatch, RootState } from '@store/store'

import GoToComicDialog from './GoToComicDialog'

const mapState = (state: RootState) => {
    return {
        showGoToComicDialog: state.dialog.showGoToComicDialog,
    }
}

const mapDispatch = (dispatch: AppDispatch) => {
    return {
        setShowGoToComicDialog: (value: boolean) => {
            dispatch(setShowGoToComicDialog(value))
        },
    }
}

const connector = connect(mapState, mapDispatch)
type PropsFromRedux = ConnectedProps<typeof connector>
type GoToComicDialogPortalProps = PropsFromRedux & {}

export function GoToComicDialogPortal({
    showGoToComicDialog,
    setShowGoToComicDialog,
}: GoToComicDialogPortalProps) {
    return (
        <DialogPortal
            show={showGoToComicDialog}
            onClose={() => setShowGoToComicDialog(false)}
        >
            <GoToComicDialog
                show={showGoToComicDialog}
                onClose={() => setShowGoToComicDialog(false)}
            />
        </DialogPortal>
    )
}

export default connector(GoToComicDialogPortal)
