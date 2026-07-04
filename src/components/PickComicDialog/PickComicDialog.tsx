import { useState } from 'react'

import { PaddedButton } from '@components/Button'
import DialogPortal from '@components/DialogPortal'
import ComicList from '@components/GoToComicDialog/ComicList/ComicList'
import ModalDialog from '@components/Modals/ModalDialog/ModalDialog'
import { ComicId } from '@models/ComicId'
import { ComicList as ComicListModel } from '@models/ComicList'
import { skipToken } from '@reduxjs/toolkit/dist/query'
import { useListAllQuery } from '@store/api/comicApiSlice'
import { useAppSelector } from '@store/hooks'

export default function PickComicDialog({
    show,
    onClose,
    onSelectComic,
}: {
    show: boolean
    onClose: () => void
    onSelectComic: (comic: ComicId) => void
}) {
    const settings = useAppSelector((state) => state.settings.values)

    const [currentData, setCurrentData] = useState<ComicListModel[] | null>(
        null
    )
    const { data: allComicData, isFetching: isLoading } = useListAllQuery(
        !show ? skipToken : undefined
    )
    if (allComicData && currentData !== allComicData) {
        setCurrentData(allComicData)
    }

    return (
        <DialogPortal show={show} onClose={onClose}>
            <ModalDialog
                onCloseClicked={onClose}
                header={
                    <h5 className="m-0 text-xl font-medium leading-normal text-gray-800">
                        Pick a comic
                    </h5>
                }
                body={
                    <ComicList
                        allComicData={currentData ?? []}
                        subDivideGotoComics={
                            settings?.subDivideGotoComics ?? true
                        }
                        onGoToComic={(comic) => onSelectComic(comic)}
                        isLoading={isLoading}
                    />
                }
                footer={
                    <PaddedButton onClick={() => onClose()}>
                        Cancel
                    </PaddedButton>
                }
            />
        </DialogPortal>
    )
}
