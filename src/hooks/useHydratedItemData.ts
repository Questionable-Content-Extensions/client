import { useMemo } from 'react'

import { ComicId } from '@models/ComicId'
import { HydratedItemNavigationData } from '@models/HydratedItemData'
import { skipToken } from '@reduxjs/toolkit/dist/query'
import {
    toGetDataQueryArgs,
    useGetComicDataQuery,
} from '@store/api/comicApiSlice'
import { useAllItemsQuery } from '@store/api/itemApiSlice'

import { SettingValues } from '~/settings'
import { error } from '~/utils'

export default function useHydratedItemData(
    currentComic: ComicId,
    settings: SettingValues | null
) {
    const { data: itemData, isLoading, isFetching } = useAllItemsQuery()

    const { data: comicData } = useGetComicDataQuery(
        currentComic === 0 || !settings
            ? skipToken
            : toGetDataQueryArgs(currentComic, settings)
    )

    return useMemo<{
        comicItems?: HydratedItemNavigationData[]
        allItems?: HydratedItemNavigationData[]
        isLoading: boolean
        isFetching: boolean
    }>(() => {
        if (itemData && comicData) {
            let hydratedComicItemData: HydratedItemNavigationData[] | undefined
            if (comicData.hasData) {
                hydratedComicItemData = []
                for (const comicItem of comicData.items) {
                    const item = itemData.find((i) => i.id === comicItem.id)
                    if (!item) {
                        error('Item present in comic data but not item data!')
                        continue
                    }
                    hydratedComicItemData.push({ ...comicItem, ...item })
                }
            }
            const hydratedAllItemData: HydratedItemNavigationData[] = []
            if (comicData.allItems) {
                for (const comicItem of comicData.allItems) {
                    const item = itemData.find((i) => i.id === comicItem.id)
                    if (!item) {
                        error('Item present in comic data but not item data!')
                        continue
                    }
                    hydratedAllItemData.push({ ...comicItem, ...item })
                }
            }
            return {
                comicItems: hydratedComicItemData,
                allItems: hydratedAllItemData,
                isLoading,
                isFetching,
            }
        } else {
            return {
                isLoading,
                isFetching,
            }
        }
    }, [itemData, comicData, isLoading, isFetching])
}
