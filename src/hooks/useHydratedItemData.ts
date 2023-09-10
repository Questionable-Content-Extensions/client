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

export type HydratedItemData = {
    comicItems?: HydratedItemNavigationData[]
    allItems?: HydratedItemNavigationData[]
    isLoading: boolean
    isFetching: boolean
    refetch: () => void
}

export default function useHydratedItemData(
    currentComic: ComicId,
    settings: SettingValues | null
) {
    const {
        data: itemData,
        isLoading: isLoadingAllItems,
        isFetching: isFetchingAllItems,
        isError: isErrorAllItems,
        refetch: refetchAllItems,
    } = useAllItemsQuery()

    const {
        data: comicData,
        isLoading: isLoadingComicData,
        isFetching: isFetchingComicData,
        isError: isErrorComicData,
        refetch: refetchComicData,
    } = useGetComicDataQuery(
        currentComic === 0 || !settings
            ? skipToken
            : toGetDataQueryArgs(currentComic, settings)
    )

    const [hydratedComicItemData, hydratedAllItemData] = useMemo<
        [
            HydratedItemNavigationData[] | undefined,
            HydratedItemNavigationData[] | undefined,
        ]
    >(() => {
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
            let hydratedAllItemData: HydratedItemNavigationData[] | undefined
            if (comicData.allItems) {
                hydratedAllItemData = []
                for (const comicItem of comicData.allItems) {
                    const item = itemData.find((i) => i.id === comicItem.id)
                    if (!item) {
                        error('Item present in comic data but not item data!')
                        continue
                    }
                    hydratedAllItemData.push({ ...comicItem, ...item })
                }
            }

            return [hydratedComicItemData, hydratedAllItemData]
        }
        return [undefined, undefined]
    }, [itemData, comicData])

    return {
        comicItems: hydratedComicItemData,
        allItems: hydratedAllItemData,
        isLoading: isLoadingAllItems || isLoadingComicData,
        isFetching: isFetchingAllItems || isFetchingComicData,
        isError: isErrorAllItems || isErrorComicData,
        refetch: () => {
            refetchAllItems()
            refetchComicData()
        },
    }
}
