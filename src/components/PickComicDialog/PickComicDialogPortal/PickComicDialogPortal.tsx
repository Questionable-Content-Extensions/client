import DialogPortal from '@components/DialogPortal'
import { ComicId } from '@models/ComicId'

import PickComicDialog from '../PickComicDialog'

export default function PickComicDialogPortal({
    show,
    onClose,
    onSelectComic,
}: {
    show: boolean
    onClose: () => void
    onSelectComic: (comic: ComicId) => void
}) {
    return (
        <DialogPortal show={show} onClose={onClose}>
            <PickComicDialog
                show={show}
                onClose={onClose}
                onSelectComic={onSelectComic}
            />
        </DialogPortal>
    )
}
