import { useMemo } from 'react'

import Spinner from '@components/Spinner'
import useDebouncedFilter from '@hooks/useDebouncedFilter'
import { ComicId } from '@models/ComicId'
import { ComicList as ComicListModel } from '@models/ComicList'

import CollapsibleComicRange from '../CollapsibleComicRange/CollapsibleComicRange'
import GoToComicButton from './GoToComicButton/GoToComicButton'

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
    const { activeFilter, filter, setFilter } = useDebouncedFilter()

    const filteredComicData = useMemo(
        () =>
            allComicData
                ? filterComics(allComicData, activeFilter)
                : allComicData,
        [allComicData, activeFilter]
    )

    const [comicList, comicCount] = useMemo(() => {
        const comicEntries: {
            [thousandRange: number]: {
                [hundredRange: number]: JSX.Element[]
            }
        } = {}
        if (subDivideGotoComics) {
            let lastThousandsRange = -1
            let lastHundredsRange = -1
            let lastComic = -1
            let count = 0
            if (filteredComicData) {
                for (const comic of filteredComicData) {
                    const thousandsRange = getThousandsRange(comic.comic)
                    const hundredsRange = getHundredsRange(comic.comic)
                    if (!(thousandsRange in comicEntries)) {
                        comicEntries[thousandsRange] = {}
                    }
                    if (!(hundredsRange in comicEntries[thousandsRange])) {
                        comicEntries[thousandsRange][hundredsRange] = []
                    }

                    comicEntries[thousandsRange][hundredsRange].push(
                        <li key={comic.comic}>
                            <GoToComicButton
                                comic={comic}
                                onClick={(comic) => onGoToComic(comic.comic)}
                                highlight={activeFilter}
                            />
                        </li>
                    )
                    lastThousandsRange = thousandsRange
                    lastHundredsRange = hundredsRange
                    lastComic = comic.comic
                    count++
                }
            }
            const thousandDividers: JSX.Element[] = []
            for (const thousandRange in comicEntries) {
                const hundredDividers: JSX.Element[] = []
                for (const hundredRange in comicEntries[thousandRange]) {
                    let endRange = `${Number(hundredRange) + 100}`
                    if (Number(hundredRange) === lastHundredsRange) {
                        endRange = `${lastComic}`
                    }
                    hundredDividers.push(
                        <CollapsibleComicRange
                            initiallyOpen={count < 100}
                            summary={`${Number(hundredRange) + 1}..${endRange}`}
                            key={hundredRange}
                        >
                            <>{comicEntries[thousandRange][hundredRange]}</>
                        </CollapsibleComicRange>
                    )
                }

                let endRange = `${Number(thousandRange) + 1000}`
                if (Number(thousandRange) === lastThousandsRange) {
                    endRange = `${lastComic}`
                }
                thousandDividers.push(
                    <CollapsibleComicRange
                        initiallyOpen={count < 100}
                        summary={`${Number(thousandRange) + 1}..${endRange}`}
                        key={thousandRange}
                    >
                        <>{hundredDividers}</>
                    </CollapsibleComicRange>
                )
            }

            return [<div>{thousandDividers}</div>, count]
        } else {
            const comicEntries: JSX.Element[] = []
            if (filteredComicData) {
                for (const comic of filteredComicData) {
                    comicEntries.push(
                        <li key={comic.comic}>
                            <GoToComicButton
                                comic={comic}
                                onClick={(comic) => onGoToComic(comic.comic)}
                                highlight={activeFilter}
                            />
                        </li>
                    )
                }
            }
            return [<ul>{comicEntries}</ul>, comicEntries.length]
        }
    }, [filteredComicData, onGoToComic, subDivideGotoComics, activeFilter])

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

    return (
        <>
            <input
                id="qcext-allitems-filter"
                type="text"
                placeholder="Filter comics"
                title="The value entered here filters the comics by their title"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="w-full border border-qc-header focus:outline-none flex-auto rounded-none pl-2 disabled:opacity-75 mb-2"
                disabled={isLoading}
                onMouseUp={(e) => {
                    // 1 is middle click, supposedly
                    if (e.button === 1) {
                        setFilter('')
                        e.preventDefault()
                    }
                }}
            />
            {activeFilter !== '' ? (
                <p>
                    {comicCount} comic titles or taglines match '{activeFilter}'
                </p>
            ) : (
                <></>
            )}
            {comicList}
        </>
    )
}

function filterComics(allComics: ComicListModel[], filter: string) {
    return allComics.filter(
        (c) =>
            c.title.toUpperCase().indexOf(filter.toUpperCase()) !== -1 ||
            (c.tagline &&
                c.tagline.toUpperCase().indexOf(filter.toUpperCase()) !== -1)
    )
}

function getThousandsRange(comic: ComicId) {
    const rest = comic % 1000
    return comic - rest
}

function getHundredsRange(comic: ComicId) {
    const rest = comic % 100
    return comic - rest
}
