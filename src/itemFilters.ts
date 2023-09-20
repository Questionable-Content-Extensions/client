import { ItemType } from '@models/ItemType'

export type FilterItemType = ItemType | 'item'

export function getTypeFromFilter(filter: string) {
    const typeFilter = filter.charAt(0)
    let type: FilterItemType = 'item'
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

export function getFilterWithoutType(filter: string) {
    if (getTypeFromFilter(filter) !== 'item') {
        filter = filter.substring(1)
    }
    return filter
}

type FilterableItem = {
    shortName: string
    name: string
    type: ItemType
}
export function filterItems<I extends FilterableItem>(
    items: I[],
    filter: string
) {
    const type = getTypeFromFilter(filter)

    let filteredByType
    if (type !== 'item') {
        filteredByType = items.filter((i) => i.type === type)
    } else {
        filteredByType = items
    }

    filter = getFilterWithoutType(filter)
    return filteredByType.filter(
        (i) =>
            i.shortName.toUpperCase().indexOf(filter.toUpperCase()) !== -1 ||
            i.name.toUpperCase().indexOf(filter.toUpperCase()) !== -1
    )
}
