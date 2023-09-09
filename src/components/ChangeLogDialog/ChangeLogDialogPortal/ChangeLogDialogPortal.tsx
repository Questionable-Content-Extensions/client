import { ConnectedProps, connect } from 'react-redux'

import DialogPortal from '@components/DialogPortal'
import { setShowChangeLogDialog } from '@store/dialogSlice'
import { AppDispatch, RootState } from '@store/store'

import ChangeLogDialog from '../ChangeLogDialog'

const mapState = (state: RootState) => {
    return {
        showChangeLogDialog: state.dialog.showChangeLogDialog,
    }
}

const mapDispatch = (dispatch: AppDispatch) => {
    return {
        setShowChangeLogDialog: (value: boolean) => {
            dispatch(setShowChangeLogDialog(value))
        },
    }
}

const connector = connect(mapState, mapDispatch)
type PropsFromRedux = ConnectedProps<typeof connector>
type ChangeLogDialogPortalProps = PropsFromRedux & {}

export function ChangeLogDialogPortal({
    showChangeLogDialog,
    setShowChangeLogDialog,
}: ChangeLogDialogPortalProps) {
    return (
        <DialogPortal
            show={showChangeLogDialog}
            onClose={() => setShowChangeLogDialog(false)}
        >
            <ChangeLogDialog
                show={showChangeLogDialog}
                onClose={() => setShowChangeLogDialog(false)}
            />
        </DialogPortal>
    )
}

export default connector(ChangeLogDialogPortal)
