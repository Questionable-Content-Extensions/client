import { useState } from 'react'

import { PaddedButton } from '@components/Button'
import ModalDialog from '@modals/ModalDialog/ModalDialog'
import { ComicList as ComicListModel } from '@models/ComicList'
import { skipToken } from '@reduxjs/toolkit/dist/query'
import { useListAllQuery } from '@store/api/comicApiSlice'
import { setCurrentComic } from '@store/comicSlice'
import { useAppDispatch, useAppSelector } from '@store/hooks'

import ComicList from './ComicList/ComicList'

export default function GoToComicDialog({
    show,
    onClose,
}: {
    show: boolean
    onClose: () => void
}) {
    const dispatch = useAppDispatch()

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
        <ModalDialog
            onCloseClicked={onClose}
            header={
                <h5 className="m-0 text-xl font-medium leading-normal text-gray-800">
                    Go to comic
                </h5>
            }
            body={
                <ComicList
                    allComicData={currentData ?? []}
                    subDivideGotoComics={settings?.subDivideGotoComics ?? true}
                    onGoToComic={(comic) => {
                        dispatch(setCurrentComic(comic))
                        onClose()
                    }}
                    isLoading={isLoading}
                />
            }
            footer={
                <PaddedButton onClick={() => onClose()}>Close</PaddedButton>
            }
        />
    )
}
