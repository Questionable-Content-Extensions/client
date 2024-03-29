// This file was generated by [ts-rs](https://github.com/Aleph-Alpha/ts-rs). Do not edit this file manually.
import type { ComicId } from './ComicId'
import type { ItemId } from './ItemId'
import type { ItemType } from './ItemType'

export interface Item {
    id: ItemId
    shortName: string
    name: string
    type: ItemType
    color: string
    first: ComicId
    last: ComicId
    appearances: number
    totalComics: number
    presence: number
    hasImage: boolean
    primaryImage: number | null
}
