import { useMemo } from 'react'

import { HydratedItemNavigationData } from '@models/HydratedItemData'

export default function useItemNavigationDataByType(
    itemNavigationData: HydratedItemNavigationData[] | undefined
) {
    return useMemo(() => {
        let itemNavigationDataByType: {
            cast: HydratedItemNavigationData[]
            location: HydratedItemNavigationData[]
            storyline: HydratedItemNavigationData[]
        } = {
            cast: [],
            location: [],
            storyline: [],
        }
        if (itemNavigationData) {
            for (const item of itemNavigationData) {
                itemNavigationDataByType[item.type].push(item)
            }
        }
        return itemNavigationDataByType
    }, [itemNavigationData])
}
