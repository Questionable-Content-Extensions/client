import DialogPortal from '@components/DialogPortal'
import { setShowGoToComicDialog } from '@store/dialogSlice'
import { useAppDispatch, useAppSelector } from '@store/hooks'

import GoToComicDialog from './GoToComicDialog'

export default function GoToComicDialogPortal() {
    const dispatch = useAppDispatch()
    const showGoToComicDialog = useAppSelector(
        (state) => state.dialog.showGoToComicDialog
    )
    return (
        <DialogPortal
            show={showGoToComicDialog}
            onClose={() => dispatch(setShowGoToComicDialog(false))}
        >
            <GoToComicDialog
                show={showGoToComicDialog}
                onClose={() => dispatch(setShowGoToComicDialog(false))}
            />
        </DialogPortal>
    )
}
