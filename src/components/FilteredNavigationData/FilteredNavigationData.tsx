import { useMemo } from 'react'

import { PaddedButton } from '@components/Button'
import ItemNavigation from '@components/ComicDetailsPanel/ItemNavigation/ItemNavigation'
import { NavElementMode } from '@components/NavElement/NavElement'
import useDebouncedFilter from '@hooks/useDebouncedFilter'
import { ComicId } from '@models/ComicId'
import { HydratedItemNavigationData } from '@models/HydratedItemData'
import { ItemBody } from '@models/ItemBody'
import { ItemId } from '@models/ItemId'
import { ItemType } from '@models/ItemType'

export default function FilteredNavigationData({
    isLoading,
    isFetching,
    isSaving,
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
    isSaving: boolean
    hasError: boolean
    itemData: HydratedItemNavigationData[]
    onSetCurrentComic: (comicId: ComicId) => void
    onShowInfoFor: (item: ItemId) => void
    useColors: boolean
    editMode: boolean
    onAddItem: (item: ItemBody) => void
}) {
    const { activeFilter, filter, setFilter } = useDebouncedFilter()

    const filteredItemData = useMemo(
        () => filterItems(itemData, activeFilter),
        [itemData, activeFilter]
    )

    const [filterType, filterName] = useMemo(
        () => [
            getTypeFromFilter(activeFilter),
            getFilterWithoutType(activeFilter),
        ],
        [activeFilter]
    )

    return (
        <>
            <input
                id="qcext-allitems-filter"
                type="text"
                placeholder="Filter non-present"
                title="The value entered here filters the non-present members by their name or abbreviated name"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="w-full border border-qc-header focus:outline-none flex-auto rounded-none pl-2 disabled:opacity-75 mb-2"
                disabled={isLoading || isSaving || hasError}
                onMouseUp={(e) => {
                    // 1 is middle click, supposedly
                    if (e.button === 1) {
                        setFilter('')
                        e.preventDefault()
                    }
                }}
            />

            {filteredItemData.length > 0 || isLoading ? (
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
                        onAddItem={(itemId) =>
                            onAddItem({ new: false, itemId })
                        }
                    />
                </div>
            ) : (
                <p className="italic">
                    No {filterType} found matching '{filterName}'
                </p>
            )}
            {editMode ? (
                <PaddedButton
                    className="mt-2 w-full"
                    onClick={async () => {
                        if (filterType === 'item') {
                            alert(
                                'Prefix the filter by ! for cast, @ for location or # for storyline to choose the type of item to create'
                            )
                        } else {
                            onAddItem({
                                new: true,
                                newItemName: filterName,
                                newItemType: filterType,
                            })
                        }
                    }}
                    disabled={filterName === '' || isSaving}
                    title={
                        filterName === ''
                            ? 'Enter something in the filter box to create an item'
                            : 'Add ' + filterType
                    }
                >
                    Add new {filterType}{' '}
                    {filterName !== '' ? <>named '{filterName}'</> : <></>} to
                    comic
                </PaddedButton>
            ) : (
                <></>
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
