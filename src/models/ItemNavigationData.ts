// This file was generated by [ts-rs](https://github.com/Aleph-Alpha/ts-rs). Do not edit this file manually.
import type { ComicId } from './ComicId'
import type { ItemId } from './ItemId'

export interface ItemNavigationData {
    id: ItemId
    first: ComicId | null
    previous: ComicId | null
    next: ComicId | null
    last: ComicId | null
}
