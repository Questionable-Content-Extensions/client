import { useMemo } from 'react'

import InlineSpinner from '@components/InlineSpinner'
import Spinner from '@components/Spinner'
import ToggleButton from '@components/ToggleButton/ToggleButton'
import useItemNavigationDataByType from '@hooks/useItemNavigationDataByType'
import { ComicId } from '@models/ComicId'
import { ComicList } from '@models/ComicList'
import { HydratedItemNavigationData } from '@models/HydratedItemData'

export default function CopyItemsDialogPanel({
    allComics,
    isLoading,
    isFetching,
    selectedComic,
    onChangeSelectedComic,
    comicItems,
    selectedItems,
    onUpdateSelectedItems,
}: {
    allComics: ComicList[] | undefined
    isLoading: boolean
    isFetching: boolean
    selectedComic: ComicId | undefined
    onChangeSelectedComic: (selectedComic: number) => void
    comicItems: HydratedItemNavigationData[] | undefined
    selectedItems: {
        [id: number]: boolean
    }
    onUpdateSelectedItems: (
        _: (selectedItemUpdaterFunction: { [id: number]: boolean }) => {
            [id: number]: boolean
        }
    ) => void
}) {
    const allComicOptions = useMemo(() => {
        if (!allComics) {
            return []
        }
        const allComicOptions: JSX.Element[] = []
        for (const comic of allComics) {
            allComicOptions.push(
                <option value={comic.comic} key={comic.comic}>
                    {comic.comic}: {comic.title}
                </option>
            )
        }

        return allComicOptions
    }, [allComics])

    const { cast, location, storyline } =
        useItemNavigationDataByType(comicItems)
    const comicItemCheckboxes = useMemo(() => {
        if (!comicItems) {
            return <></>
        }

        const itemNavigationDataToCheckBoxes = (
            itemNavigationData: HydratedItemNavigationData
        ) => (
            <div key={itemNavigationData.id}>
                <ToggleButton
                    label={itemNavigationData.shortName}
                    disabled={isFetching}
                    checked={
                        itemNavigationData.id in selectedItems
                            ? selectedItems[itemNavigationData.id]
                            : true
                    }
                    onChange={(e) => {
                        onUpdateSelectedItems((s) => {
                            s[itemNavigationData.id] = e.target.checked
                            return { ...s }
                        })
                    }}
                />
            </div>
        )

        const castCheckboxes: JSX.Element[] = cast.map(
            itemNavigationDataToCheckBoxes
        )
        const locationCheckboxes: JSX.Element[] = location.map(
            itemNavigationDataToCheckBoxes
        )
        const storylineCheckboxes: JSX.Element[] = storyline.map(
            itemNavigationDataToCheckBoxes
        )

        return (
            <>
                {castCheckboxes.length ? (
                    <>
                        <h2 className="text-base font-normal my-2">
                            Cast Members
                            <span
                                className={
                                    'inline-block align-middle' +
                                    (!isFetching ? ' invisible' : '')
                                }
                            >
                                <InlineSpinner />
                            </span>
                        </h2>
                        {castCheckboxes}
                    </>
                ) : (
                    <></>
                )}
                {locationCheckboxes.length ? (
                    <>
                        <h2 className="text-base font-normal my-2">
                            Locations
                            <span
                                className={
                                    'inline-block align-middle' +
                                    (!isFetching ? ' invisible' : '')
                                }
                            >
                                <InlineSpinner />
                            </span>
                        </h2>
                        {locationCheckboxes}
                    </>
                ) : (
                    <></>
                )}
                {storylineCheckboxes.length ? (
                    <>
                        <h2 className="text-base font-normal my-2">
                            Storylines
                            <span
                                className={
                                    'inline-block align-middle' +
                                    (!isFetching ? ' invisible' : '')
                                }
                            >
                                <InlineSpinner />
                            </span>
                        </h2>
                        {storylineCheckboxes}
                    </>
                ) : (
                    <></>
                )}
            </>
        )
    }, [
        comicItems,
        selectedItems,
        cast,
        location,
        storyline,
        isFetching,
        onUpdateSelectedItems,
    ])

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
        <div>
            <div className="flex">
                <button
                    className="flex-none border-solid border bg-stone-200 border-stone-300 px-1 mr-2 disabled:opacity-75"
                    onClick={() => {
                        if (selectedComic && selectedComic > 1) {
                            onChangeSelectedComic(selectedComic - 1)
                        }
                    }}
                    disabled={isFetching}
                >
                    <i className="fa fa-backward" aria-hidden="true"></i>
                </button>
                <select
                    id="qcext-copyitems-selector"
                    className={isFetching ? 'cursor-not-allowed' : ''}
                    value={selectedComic}
                    onChange={(e) => {
                        onChangeSelectedComic(Number(e.target.value))
                    }}
                    disabled={isFetching}
                >
                    {allComicOptions}
                </select>
                <button
                    className="flex-none border-solid border bg-stone-200 border-stone-300 px-1 ml-2 disabled:opacity-75"
                    onClick={() => {
                        if (allComics) {
                            const latestComic = getLatestComic(allComics)
                            if (selectedComic && selectedComic < latestComic) {
                                onChangeSelectedComic(selectedComic + 1)
                            }
                        }
                    }}
                    disabled={isFetching}
                >
                    <i className="fa fa-forward" aria-hidden="true"></i>
                </button>
            </div>
            <h1 className="text-lg font-normal my-2">
                Select items to copy over
            </h1>
            {comicItemCheckboxes}
        </div>
    )
}

function getLatestComic(allComics: ComicList[]) {
    let latest = allComics[0].comic

    for (let comic of allComics) {
        if (comic.comic > latest) {
            latest = comic.comic
        }
    }

    return latest
}
