import { ConnectedProps, connect } from 'react-redux'

import DialogPortal from '@components/DialogPortal'
import { setShowEditLogDialog } from '@store/dialogSlice'
import { AppDispatch, RootState } from '@store/store'

import EditLogDialog from './EditLogDialog'

const mapState = (state: RootState) => {
    return {
        showEditLogDialogFor: state.dialog.showEditLogDialogFor,
    }
}

const mapDispatch = (dispatch: AppDispatch) => {
    return {
        setShowEditLogDialog: (value: boolean) => {
            dispatch(setShowEditLogDialog(value))
        },
    }
}

const connector = connect(mapState, mapDispatch)
type PropsFromRedux = ConnectedProps<typeof connector>
type EditLogDialogPortalProps = PropsFromRedux & {}

export function EditLogDialogPortal({
    showEditLogDialogFor,
    setShowEditLogDialog,
}: EditLogDialogPortalProps) {
    return (
        <DialogPortal
            show={showEditLogDialogFor !== false}
            onClose={() => setShowEditLogDialog(false)}
        >
            <EditLogDialog
                showFor={showEditLogDialogFor}
                onClose={() => setShowEditLogDialog(false)}
            />
        </DialogPortal>
    )
}

export default connector(EditLogDialogPortal)
