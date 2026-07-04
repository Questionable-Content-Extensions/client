import { useMemo } from 'react'

import { ComicId } from '@models/ComicId'
import { HydratedActiveStoryline } from '@models/StorylineLifecycle'
import { skipToken } from '@reduxjs/toolkit/dist/query'
import {
    toGetDataQueryArgs,
    useGetComicDataQuery,
} from '@store/api/comicApiSlice'
import { useAllItemsQuery } from '@store/api/itemApiSlice'

import { SettingValues } from '~/Settings'
import { error } from '~/utils'

export default function useActiveStorylines(
    currentComic: ComicId,
    settings: SettingValues | null
) {
    const {
        data: itemData,
        isLoading: isLoadingAllItems,
        isFetching: isFetchingAllItems,
    } = useAllItemsQuery()

    const {
        data: comicData,
        isLoading: isLoadingComicData,
        isFetching: isFetchingComicData,
    } = useGetComicDataQuery(
        currentComic === 0 || !settings
            ? skipToken
            : toGetDataQueryArgs(currentComic, settings)
    )

    const activeStorylines = useMemo<HydratedActiveStoryline[]>(() => {
        if (!itemData || !comicData?.hasData) {
            return []
        }
        const result: HydratedActiveStoryline[] = []
        for (const storyline of comicData.activeStorylines) {
            const item = itemData.find((i) => i.id === storyline.id)
            if (!item) {
                error(
                    'Active storyline present in comic data but not item data!'
                )
                continue
            }
            result.push({ ...item, ...storyline })
        }
        return result
    }, [itemData, comicData])

    return {
        activeStorylines,
        isLoading: isLoadingAllItems || isLoadingComicData,
        isFetching: isFetchingAllItems || isFetchingComicData,
    }
}
