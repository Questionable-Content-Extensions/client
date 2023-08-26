import { useEffect, useMemo, useState } from 'react'

import ItemNavigation from '@components/ComicDetailsPanel/ItemNavigation/ItemNavigation'
import { NavElementMode } from '@components/NavElement/NavElement'
import { ComicId } from '@models/ComicId'
import { HydratedItemNavigationData } from '@models/HydratedItemData'
import { ItemId } from '@models/ItemId'
import { ItemType } from '@models/ItemType'

export default function FilteredNavigationData({
    isLoading,
    isFetching,
    hasError,
    itemData,
    onSetCurrentComic,
    onShowInfoFor,
    useColors,
    editMode,
    onAddItem,
}: {
    isLoading: boolean
    isFetching: boolean
    hasError: boolean
    itemData: HydratedItemNavigationData[]
    onSetCurrentComic: (comicId: ComicId) => void
    onShowInfoFor: (item: ItemId) => void
    useColors: boolean
    editMode: boolean
    onAddItem: (item: ItemId) => void
}) {
    const [filter, setFilter] = useState('')
    const [activeFilter, setActiveFilter] = useState('')
    useEffect(() => {
        let filterDebounceTimeout: ReturnType<typeof setTimeout> | null =
            setTimeout(() => {
                setActiveFilter(filter)
                filterDebounceTimeout = null
            }, 500)
        return () => {
            if (filterDebounceTimeout !== null) {
                clearTimeout(filterDebounceTimeout)
                filterDebounceTimeout = null
            }
        }
    }, [filter])

    const filteredItemData = useMemo(
        () => filterItems(itemData, activeFilter),
        [itemData, activeFilter]
    )

    return (
        <>
            {/* TODO: Add back support for adding a new item */}
            <input
                type="text"
                placeholder="Filter non-present"
                title="The value entered here filters the non-present members by their name or abbreviated name"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="w-full border border-qc-header focus:outline-none flex-auto rounded-none pl-2 disabled:opacity-75 mb-2"
                disabled={isLoading || hasError}
                onMouseUp={(e) => {
                    // 1 is middle click, supposedly
                    if (e.button === 1) {
                        setFilter('')
                    }
                }}
            />

            {filteredItemData.length > 0 ? (
                <div className="overflow-y-auto overflow-x-hidden max-h-52">
                    <ItemNavigation
                        itemNavigationData={filteredItemData}
                        isLoading={isLoading}
                        isFetching={isFetching}
                        useColors={useColors}
                        onSetCurrentComic={onSetCurrentComic}
                        onShowInfoFor={onShowInfoFor}
                        mode={NavElementMode.Missing}
                        editMode={editMode}
                        onAddItem={onAddItem}
                    />
                </div>
            ) : (
                <p className="italic">
                    No {getTypeFromFilter(activeFilter)} found matching '
                    {getFilterWithoutType(activeFilter)}'
                </p>
            )}
        </>
    )
}

function filterItems(
    allNavigationItems: HydratedItemNavigationData[],
    filter: string
) {
    const type = getTypeFromFilter(filter)

    let filteredByType
    if (type !== 'item') {
        filteredByType = allNavigationItems.filter((i) => i.type === type)
    } else {
        filteredByType = allNavigationItems
    }

    filter = getFilterWithoutType(filter)
    return filteredByType.filter(
        (i) =>
            i.shortName.toUpperCase().indexOf(filter.toUpperCase()) !== -1 ||
            i.name.toUpperCase().indexOf(filter.toUpperCase()) !== -1
    )
}

function getTypeFromFilter(filter: string) {
    const typeFilter = filter.charAt(0)
    let type: ItemType | 'item' = 'item'
    switch (typeFilter) {
        case '!':
            type = 'cast'
            break
        case '@':
            type = 'location'
            break
        case '#':
            type = 'storyline'
            break
    }
    return type
}

function getFilterWithoutType(filter: string) {
    if (getTypeFromFilter(filter) !== 'item') {
        filter = filter.substring(1)
    }
    return filter
}
