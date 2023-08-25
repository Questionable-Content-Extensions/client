import Spinner from '@components/Spinner'
import { ComicList as ComicListModel } from '@models/ComicList'

import CollapsibleComicRange from '../CollapsibleComicRange/CollapsibleComicRange'

export default function ComicList({
    allComicData,
    subDivideGotoComics,
    onGoToComic,
    isLoading,
}: {
    allComicData: ComicListModel[]
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
        }
        return <ul>{comicEntries}</ul>
    }
}

function GoToComicButton({
    comic,
    onClick,
}: {
    comic: ComicListModel
    onClick: (comic: ComicListModel) => void
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
