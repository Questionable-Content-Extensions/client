import { useCallback, useMemo } from 'react'

import InlineSpinner from '@components/InlineSpinner'
import NavElement, { NavElementMode } from '@components/NavElement/NavElement'
import Spinner from '@components/Spinner'
import useItemNavigationDataByType from '@hooks/useItemNavigationDataByType'
import { ComicId } from '@models/ComicId'
import { HydratedItemNavigationData } from '@models/HydratedItemData'
import { ItemId } from '@models/ItemId'

import { PickEnum } from '~/tsUtils'

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

    if (!itemNavigationData.length) {
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
            <h1 className="text-base font-normal text-center m-2">
                <span className="invisible">
                    <InlineSpinner />
                </span>
                {header}
                <span
                    className={
                        'inline-block align-middle' +
                        (!isFetching ? ' invisible' : '')
                    }
                >
                    <InlineSpinner />
                </span>
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
