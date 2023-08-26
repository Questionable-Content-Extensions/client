import { useEffect, useState } from 'react'

import ItemNavigation from '@components/ComicDetailsPanel/ItemNavigation/ItemNavigation'
import { NavElementMode } from '@components/NavElement/NavElement'
import { ComicId } from '@models/ComicId'
import { HydratedItemNavigationData } from '@models/HydratedItemData'
import { ItemId } from '@models/ItemId'

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

    return (
        <>
            {/* TODO: Right clicking filter makes it empty and focused(?) */}
            {/* TODO: Add back support for prefixing ! for cast, @ for location, # for storyline */}
            {/* TODO: Add back support for adding a new item */}
            <input
                type="text"
                placeholder="Filter non-present"
                title="The value entered here filters the non-present members by their name or abbreviated name"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="w-full border border-qc-header focus:outline-none flex-auto rounded-none pl-2 disabled:opacity-75 mb-2"
                disabled={isLoading || hasError}
            />

            <div className="overflow-y-auto overflow-x-hidden max-h-52">
                {/* TODO: Show indication that no items matched the filter(?) */}
                <ItemNavigation
                    itemNavigationData={filterItems(itemData, activeFilter)}
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
        </>
    )
}

function filterItems(
    allNavigationItems: HydratedItemNavigationData[],
    filter: string
) {
    return allNavigationItems.filter(
        (i) =>
            i.shortName.toUpperCase().indexOf(filter.toUpperCase()) !== -1 ||
            i.name.toUpperCase().indexOf(filter.toUpperCase()) !== -1
    )
}
