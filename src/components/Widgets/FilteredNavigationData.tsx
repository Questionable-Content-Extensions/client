import { useEffect, useState } from 'react'

import ItemNavigation from '@components/QcExtMainWidget/ItemNavigation'
import { NavElementMode } from '@components/QcExtMainWidget/NavElement'
import { ItemNavigationData } from '@models/ComicData'

export default function FilteredNavigationData({
    isLoading,
    itemData,
    onSetCurrentComic,
    onShowInfoFor,
    useColors,
    editMode,
    onAddItem,
}: {
    isLoading: boolean
    itemData: ItemNavigationData[]
    onSetCurrentComic: (comicId: number) => void
    onShowInfoFor: (item: ItemNavigationData) => void
    useColors: boolean
    editMode: boolean
    onAddItem: (item: ItemNavigationData) => void
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
            <input
                type="text"
                placeholder="Filter non-present"
                title="The value entered here filters the non-present members by their name or abbreviated name"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="w-full border border-qc-header focus:outline-none flex-auto rounded-none pl-2 disabled:opacity-75 mb-2"
                disabled={isLoading}
            />
            <div className="overflow-y-auto overflow-x-hidden max-h-80">
                <ItemNavigation
                    itemNavigationData={filterItems(itemData, activeFilter)}
                    isLoading={isLoading}
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

function filterItems(allItems: ItemNavigationData[], filter: string) {
    return allItems.filter(
        (i) =>
            i.shortName.toUpperCase().indexOf(filter.toUpperCase()) !== -1 ||
            i.name.toUpperCase().indexOf(filter.toUpperCase()) !== -1
    )
}
