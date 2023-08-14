export type ItemBaseData = {
    id: number
    shortName: string
    name: string
    type: ItemType
}

export type ItemBaseDataWithColor = ItemBaseData & {
    color: string
}

export type ItemData = ItemBaseDataWithColor & {
    first: number
    last: number
    appearances: number
    totalComics: number
    presence: number
    hasImage: boolean
}

export type ItemRelationData = ItemBaseDataWithColor & {
    count: number
}

export type ItemType = 'cast' | 'location' | 'storyline'

export type ItemImageData = {
    id: number
    crc32cHash: number
}
