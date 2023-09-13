import { useMemo } from 'react'

import { HydratedItemNavigationData } from '@models/HydratedItemData'
import { ItemId } from '@models/ItemId'

export default function useItemNavigationDataByType(
    itemNavigationData: HydratedItemNavigationData[] | undefined,
    lockedToItemId?: ItemId
) {
    return useMemo(() => {
        let itemNavigationDataByType: {
            cast: HydratedItemNavigationData[]
            location: HydratedItemNavigationData[]
            storyline: HydratedItemNavigationData[]
            locked: HydratedItemNavigationData[]
        } = {
            cast: [],
            location: [],
            storyline: [],
            locked: [],
        }
        if (itemNavigationData) {
            for (const item of itemNavigationData) {
                if (lockedToItemId && item.id === lockedToItemId) {
                    itemNavigationDataByType['locked'].push(item)
                } else {
                    itemNavigationDataByType[item.type].push(item)
                }
            }
        }
        return itemNavigationDataByType
    }, [itemNavigationData, lockedToItemId])
}
