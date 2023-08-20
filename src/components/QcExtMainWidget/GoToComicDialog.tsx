import { ConnectedProps, connect } from 'react-redux'

import styles from './GoToComicDialog.module.css'

import Spinner from '@components/Spinner'
import ModalDialog from '@modals/ModalDialog'
import { ComicList as ComicDataListing } from '@models/ComicList'
import { skipToken } from '@reduxjs/toolkit/dist/query'
import { useListAllQuery } from '@store/api/comicApiSlice'
import { setCurrentComic } from '@store/comicSlice'
import { AppDispatch, RootState } from '@store/store'

import { debug } from '~/utils'

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

// TODO: Add a search/filter function to this dialog

function GoToComicDialog({
    show,
    onClose,
    settings,
    setCurrentComic,
}: GoToComicDialogProps) {
    const { data: allComicData, isFetching: isLoading } = useListAllQuery(
        !show ? skipToken : undefined
    )
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
                    allComicData={allComicData ?? []}
                    subDivideGotoComics={settings?.subDivideGotoComics ?? true}
                    onGoToComic={(comic) => {
                        setCurrentComic(comic)
                        onClose()
                    }}
                    isLoading={isLoading}
                />
            }
            footer={
                <button
                    className="bg-qc-header hover:bg-qc-header-second focus:bg-qc-header-second text-white py-3 px-4 rounded-sm"
                    onClick={() => onClose()}
                >
                    Close
                </button>
            }
        />
    )
}

export default connector(GoToComicDialog)

export function ComicList({
    allComicData,
    subDivideGotoComics,
    onGoToComic,
    isLoading,
}: {
    allComicData: ComicDataListing[]
    subDivideGotoComics: boolean
    onGoToComic: (comic: number) => void
    isLoading: boolean
}) {
    if (isLoading) {
        return (
            <div className="text-center pt-4">
                <Spinner
                    loadingText="Loading..."
                    height="h-8"
                    width="w-8"
                    textColor="text-black"
                    spinnerBgColor="text-gray-300"
                    spinnerColor="fill-qc-link"
                />
            </div>
        )
    }

    if (subDivideGotoComics) {
        const thousandDividers: JSX.Element[] = []
        if (allComicData) {
            let i = 1
            let hundredDividers: JSX.Element[] = []
            let lastThousand: number = 0
            let lastHundred: number = 0
            let comicEntries: JSX.Element[] = []
            for (const comic of allComicData) {
                comicEntries.push(
                    <li key={comic.comic}>
                        <GoToComicButton
                            comic={comic}
                            onClick={(comic) => onGoToComic(comic.comic)}
                        />
                    </li>
                )

                if (i % 100 === 0) {
                    let start = i - 99
                    let end = i
                    lastHundred = i

                    hundredDividers.push(
                        <CollapsibleComicRange
                            summary={`${start}..${end}`}
                            key={`hundreds-${i}`}
                        >
                            <ul>{comicEntries}</ul>
                        </CollapsibleComicRange>
                    )
                    comicEntries = []
                }

                if (i % 1000 === 0) {
                    let start = i - 999
                    let end = i
                    lastThousand = i

                    thousandDividers.push(
                        <CollapsibleComicRange
                            summary={`${start}..${end}`}
                            key={`thousands-${i}`}
                        >
                            <>{hundredDividers}</>
                        </CollapsibleComicRange>
                    )
                    hundredDividers = []
                }
                i++
            }
            if (comicEntries.length) {
                // Add the last hundred and thousand things
                hundredDividers.push(
                    <CollapsibleComicRange
                        summary={`${lastHundred + 1}..${allComicData.length}`}
                        key="hundreds-last"
                    >
                        <ul>{comicEntries}</ul>
                    </CollapsibleComicRange>
                )
            }
            if (hundredDividers.length) {
                thousandDividers.push(
                    <CollapsibleComicRange
                        summary={`${lastThousand + 1}..${allComicData.length}`}
                        key="thousands-last"
                    >
                        <>{hundredDividers}</>
                    </CollapsibleComicRange>
                )
            }
        }
        return <div>{thousandDividers}</div>
    } else {
        const comicEntries: JSX.Element[] = []
        if (allComicData) {
            debug('Generating comic list', allComicData.length)
            for (const comic of allComicData) {
                comicEntries.push(
                    <li key={comic.comic}>
                        <GoToComicButton
                            comic={comic}
                            onClick={(comic) => onGoToComic(comic.comic)}
                        />
                    </li>
                )
            }
            debug(comicEntries)
        }
        return <ul>{comicEntries}</ul>
    }
}

function CollapsibleComicRange({
    summary,
    children,
}: {
    summary: string
    children: React.ReactChild
}) {
    return (
        <details
            className={
                'mx-1 py-4 border-0 border-b border-solid border-gray-200 ' +
                styles.details
            }
        >
            <summary className="flex items-center font-bold">
                {summary}
                <button className="ml-auto">
                    <svg
                        className="fill-current opacity-75 w-4 h-4 -mr-1"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                    >
                        <path d="M12.95 10.707l.707-.707L8 4.343 6.586 5.757 10.828 10l-4.242 4.243L8 15.657l4.95-4.95z" />
                    </svg>
                </button>
            </summary>

            <div className="mx-5">{children}</div>
        </details>
    )
}

function GoToComicButton({
    comic,
    onClick,
}: {
    comic: ComicDataListing
    onClick: (comic: ComicDataListing) => void
}) {
    return (
        <button
            className="text-left"
            onClick={() => {
                onClick(comic)
            }}
        >
            Comic {comic.comic}: {comic.title}
        </button>
    )
}
