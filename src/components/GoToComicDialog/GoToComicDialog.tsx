import { useState } from 'react'
import { ConnectedProps, connect } from 'react-redux'

import { PaddedButton } from '@components/Button'
import ModalDialog from '@modals/ModalDialog/ModalDialog'
import { ComicList as ComicListModel } from '@models/ComicList'
import { skipToken } from '@reduxjs/toolkit/dist/query'
import { useListAllQuery } from '@store/api/comicApiSlice'
import { setCurrentComic } from '@store/comicSlice'
import { AppDispatch, RootState } from '@store/store'

import ComicList from './ComicList/ComicList'

const mapState = (state: RootState) => {
    return {
        settings: state.settings.values,
    }
}

const mapDispatch = (dispatch: AppDispatch) => {
    return {
        setCurrentComic: (comic: number) => {
            dispatch(setCurrentComic(comic))
        },
    }
}

const connector = connect(mapState, mapDispatch)
type PropsFromRedux = ConnectedProps<typeof connector>
type GoToComicDialogProps = PropsFromRedux & {
    show: boolean
    onClose: () => void
}

// TODO: Show Guest Comic/Non Canon status as pill

export function GoToComicDialog({
    show,
    onClose,
    settings,
    setCurrentComic,
}: GoToComicDialogProps) {
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
                        setCurrentComic(comic)
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

export default connector(GoToComicDialog)
