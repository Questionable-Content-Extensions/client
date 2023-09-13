import { ComicId } from '@models/ComicId'
import { HydratedItemNavigationData } from '@models/HydratedItemData'
import { ItemId } from '@models/ItemId'
import { skipToken } from '@reduxjs/toolkit/dist/query'
import { useRandomComicQuery } from '@store/api/itemApiSlice'

import { SettingValues } from '~/settings'

import useHydratedItemData from './useHydratedItemData'

export type LockedItem = {
    randomLockedItemComic: ItemId | null
    refreshRandomLockedItemComic: () => void
} & (
    | {
          hasLockedItem: true
          lockedItem: HydratedItemNavigationData
      }
    | {
          hasLockedItem: false
          lockedItem: null
      }
)

export default function useLockedItem(
    currentComic: ComicId,
    settings: SettingValues | null,
    lockedToItem: ItemId | null
): LockedItem {
    const { comicItems } = useHydratedItemData(currentComic, settings)

    const lockedItem =
        lockedToItem !== null && comicItems !== undefined
            ? comicItems.find((i) => i.id === lockedToItem) ?? null
            : null
    const hasLockedItem = lockedItem !== null

    const {
        data: randomLockedItemComic,
        refetch: refreshRandomLockedItemComic,
    } = useRandomComicQuery(
        hasLockedItem
            ? {
                  currentComic,
                  itemId: lockedItem.id,
                  skipGuest: settings?.skipGuest ?? false,
                  skipNonCanon: settings?.skipNonCanon ?? false,
              }
            : skipToken
    )

    if (hasLockedItem) {
        return {
            hasLockedItem,
            lockedItem,
            randomLockedItemComic: randomLockedItemComic ?? null,
            refreshRandomLockedItemComic,
        }
    } else {
        return {
            hasLockedItem,
            lockedItem,
            randomLockedItemComic: randomLockedItemComic ?? null,
            refreshRandomLockedItemComic,
        }
    }
}
