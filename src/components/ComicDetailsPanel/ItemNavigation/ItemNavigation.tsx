import { useCallback, useMemo } from 'react'

import ChaserUnderline from '@components/ChaserUnderline'
import NavElement, { NavElementMode } from '@components/NavElement/NavElement'
import Spinner from '@components/Spinner'
import useItemNavigationDataByType from '@hooks/useItemNavigationDataByType'
import { ComicId } from '@models/ComicId'
import { HydratedItemNavigationData } from '@models/HydratedItemData'
import { ItemId } from '@models/ItemId'
import { setFilteredComics } from '@store/comicFilterSlice'
import { setShowGoToComicDialog } from '@store/dialogSlice'
import { useAppDispatch, useAppSelector } from '@store/hooks'

import { PickEnum } from '~/tsUtils'

import FilteredComicsNavElement from './FilteredComicsNavElement/FilteredComicsNavElement'

export default function ItemNavigation({
    itemNavigationData,
    isLoading,
    isFetching,
    useColors,
    orderMembersByLastAppearance,
    onSetCurrentComic,
    onShowInfoFor,
    mode,
    editMode,
    onRemoveItem,
    onAddItem,
    lockedToItemId,
}: {
    itemNavigationData: HydratedItemNavigationData[]
    isLoading: boolean
    isFetching: boolean
    useColors: boolean
    orderMembersByLastAppearance: boolean
    onSetCurrentComic: (comicNo: ComicId, locked: boolean) => void
    onShowInfoFor: (item: ItemId) => void
    mode: PickEnum<
        NavElementMode,
        NavElementMode.Present | NavElementMode.Missing
    >
    editMode?: boolean
    onRemoveItem?: (_: ItemId) => void
    onAddItem?: (_: ItemId) => void
    lockedToItemId?: ItemId
}) {
    const dispatch = useAppDispatch()
    const currentComic = useAppSelector((state) => state.comic.current)
    const filteredComics = useAppSelector(
        (state) => state.comicFilter.filteredComics
    )
    const filters = useAppSelector((state) => state.comicFilter.filters)
    const showFilteredComicsNav =
        mode === NavElementMode.Present && filteredComics.length !== 0

    const { cast, location, storyline, locked } = useItemNavigationDataByType(
        itemNavigationData,
        lockedToItemId
    )

    const itemNavigationToNavElement = useCallback(
        (item: HydratedItemNavigationData) => {
            return (
                <NavElement
                    key={item.id}
                    item={item}
                    onSetCurrentComic={onSetCurrentComic}
                    useColors={useColors}
                    onShowInfoFor={onShowInfoFor}
                    mode={mode}
                    editMode={editMode}
                    onAddItem={onAddItem}
                    onRemoveItem={onRemoveItem}
                />
            )
        },
        [
            editMode,
            mode,
            onAddItem,
            onRemoveItem,
            onSetCurrentComic,
            onShowInfoFor,
            useColors,
        ]
    )

    const itemNavElements = useMemo(() => {
        return {
            cast: cast.map(itemNavigationToNavElement),
            location: location.map(itemNavigationToNavElement),
            storyline: storyline.map(itemNavigationToNavElement),
            locked: locked.map(itemNavigationToNavElement),
            all: itemNavigationData.map(itemNavigationToNavElement),
        }
    }, [
        cast,
        location,
        storyline,
        locked,
        itemNavigationData,
        itemNavigationToNavElement,
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

    if (!itemNavigationData.length && !showFilteredComicsNav) {
        return <></>
    }

    if (!orderMembersByLastAppearance) {
        return (
            <div className="text-center">
                {!!itemNavElements.locked.length && (
                    <ItemTypeSection
                        header="Navigation Locked"
                        isFetching={isFetching}
                        mode={mode}
                        elements={itemNavElements.locked}
                    />
                )}
                {showFilteredComicsNav && (
                    <ItemTypeSection
                        header="Filtered Navigation"
                        isFetching={isFetching}
                        mode={mode}
                        elements={[
                            <FilteredComicsNavElement
                                key="filtered-comics"
                                filteredComics={filteredComics}
                                filters={filters}
                                currentComic={currentComic}
                                onSetCurrentComic={onSetCurrentComic}
                                onReopenDialog={() =>
                                    dispatch(setShowGoToComicDialog(true))
                                }
                                onClear={() =>
                                    dispatch(
                                        setFilteredComics({
                                            comics: [],
                                            filters: [],
                                        })
                                    )
                                }
                            />,
                        ]}
                    />
                )}
                {!!itemNavElements.cast.length && (
                    <ItemTypeSection
                        header="Cast Members"
                        isFetching={isFetching}
                        mode={mode}
                        elements={itemNavElements.cast}
                    />
                )}
                {!!itemNavElements.location.length && (
                    <ItemTypeSection
                        header="Locations"
                        isFetching={isFetching}
                        mode={mode}
                        elements={itemNavElements.location}
                    />
                )}
                {!!itemNavElements.storyline.length && (
                    <ItemTypeSection
                        header="Storylines"
                        isFetching={isFetching}
                        mode={mode}
                        elements={itemNavElements.storyline}
                    />
                )}
            </div>
        )
    } else {
        return (
            <div className="text-center">
                <ItemTypeSection
                    header="Recent"
                    isFetching={isFetching}
                    mode={mode}
                    elements={itemNavElements.all}
                />
            </div>
        )
    }
}

function ItemTypeSection({
    header,
    isFetching,
    mode,
    elements,
}: {
    header: string
    isFetching: boolean
    mode: NavElementMode
    elements: JSX.Element[]
}) {
    return (
        <>
            <h1 className="text-base font-normal text-center mx-2 mb-0 mt-4">
                <ChaserUnderline active={isFetching}>{header}</ChaserUnderline>
            </h1>
            {mode === NavElementMode.Missing ? (
                <h2 className="text-xs font-normal text-center">
                    (Non-Present)
                </h2>
            ) : (
                <></>
            )}
            {elements}
        </>
    )
}
