import { useMemo, useState } from 'react'

import ComicFilter, {
    Filter,
    FilterType,
} from '@components/GoToComicDialog/ComicList/ComicFilter/ComicFilter'
import Spinner from '@components/Spinner'
import { ComicId } from '@models/ComicId'
import { ComicList as ComicListModel } from '@models/ComicList'
import { ItemList } from '@models/ItemList'
import { skipToken } from '@reduxjs/toolkit/dist/query'
import { useGetConainingItemsQuery } from '@store/api/comicApiSlice'

import CollapsibleDetails from '../CollapsibleDetails/CollapsibleDetails'
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
    const [filters, setFilters] = useState<Filter[]>([])
    const requiresServer = useMemo(() => {
        return !!filters.find((f) => f.type === FilterType.Item)
    }, [filters])

    const { data: comicsWithItems } = useGetConainingItemsQuery(
        requiresServer
            ? filters.filter(isItemFilter).map((f) => f.value.id)
            : skipToken
    )

    const filteredComicData = useMemo(
        () =>
            allComicData
                ? filterComics(allComicData, filters, comicsWithItems)
                : allComicData,
        [allComicData, filters, comicsWithItems]
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
                                highlights={filters
                                    .filter(isTextFilter)
                                    .map((f) => f.value)}
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
                        <CollapsibleDetails
                            indentChildren
                            initiallyOpen={count < 100}
                            summary={`${Number(hundredRange) + 1}..${endRange}`}
                            key={hundredRange}
                        >
                            <>{comicEntries[thousandRange][hundredRange]}</>
                        </CollapsibleDetails>
                    )
                }

                let endRange = `${Number(thousandRange) + 1000}`
                if (Number(thousandRange) === lastThousandsRange) {
                    endRange = `${lastComic}`
                }
                thousandDividers.push(
                    <CollapsibleDetails
                        indentChildren
                        initiallyOpen={count < 100}
                        summary={`${Number(thousandRange) + 1}..${endRange}`}
                        key={thousandRange}
                    >
                        <>{hundredDividers}</>
                    </CollapsibleDetails>
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
                                highlights={filters
                                    .filter(isTextFilter)
                                    .map((f) => f.value)}
                            />
                        </li>
                    )
                }
            }
            return [<ul>{comicEntries}</ul>, comicEntries.length]
        }
    }, [filteredComicData, onGoToComic, subDivideGotoComics, filters])

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
        <div className="min-h-[16rem]">
            <ComicFilter filters={filters} setFilters={setFilters} />
            {filters.length !== 0 && (
                <p>{comicCount} comic titles or taglines match your filters</p>
            )}
            {comicList}
        </div>
    )
}

function filterComics(
    allComics: ComicListModel[],
    filters: Filter[],
    comicsWithItems: ComicId[] | undefined
) {
    let filteredComics
    if (comicsWithItems) {
        filteredComics = allComics.filter((c) =>
            comicsWithItems.includes(c.comic)
        )
    } else {
        filteredComics = allComics
    }

    for (const filter of filters) {
        if (!isItemFilter(filter)) {
            switch (filter.type) {
                case FilterType.Text:
                    filteredComics = filteredComics.filter(
                        (c) =>
                            c.title
                                .toUpperCase()
                                .indexOf(filter.value.toUpperCase()) !== -1 ||
                            (c.tagline &&
                                c.tagline
                                    .toUpperCase()
                                    .indexOf(filter.value.toUpperCase()) !== -1)
                    )
                    break

                case FilterType.IsGuestComic:
                    filteredComics = filteredComics.filter(
                        (c) => c.isGuestComic === filter.value
                    )
                    break

                case FilterType.IsNonCanon:
                    filteredComics = filteredComics.filter(
                        (c) => c.isNonCanon === filter.value
                    )
                    break
            }
        }
    }

    return filteredComics
}

function getThousandsRange(comic: ComicId) {
    const rest = comic % 1000
    return comic - rest
}

function getHundredsRange(comic: ComicId) {
    const rest = comic % 100
    return comic - rest
}

function isItemFilter(f: Filter): f is {
    type: FilterType.Item
    value: ItemList
} {
    return f.type === FilterType.Item
}

function isTextFilter(f: Filter): f is {
    type: FilterType.Text
    value: string
} {
    return f.type === FilterType.Text
}
