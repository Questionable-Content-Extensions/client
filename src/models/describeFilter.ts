import { Filter, FilterType } from '@models/Filter'

export function describeFilter(filter: Filter): string {
    switch (filter.type) {
        case FilterType.Text:
            return `contains '${filter.value}' in title/tagline`

        case FilterType.Item:
            return `contains ${filter.value.type} ${filter.value.shortName}`

        case FilterType.IsGuestComic:
            return filter.value ? 'is guest comic' : 'is not guest comic'

        case FilterType.IsNonCanon:
            return filter.value ? 'is non-canon' : 'is not non-canon'
    }
}

export function describeFilters(filters: Filter[]): string {
    const phrases = filters.map(describeFilter)
    if (phrases.length === 0) {
        return ''
    }

    const joined =
        phrases.length === 1
            ? phrases[0]
            : `${phrases.slice(0, -1).join(', ')} and ${
                  phrases[phrases.length - 1]
              }`

    return joined.charAt(0).toUpperCase() + joined.slice(1)
}
