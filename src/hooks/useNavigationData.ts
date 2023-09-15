import {
    nextComicSelector,
    previousComicSelector,
} from '@store/api/comicApiSlice'
import { useAppSelector } from '@store/hooks'

import useLockedItem from './useLockedItem'

export type NavigationData = {
    first: number
    firstTitle: string
    previous: number
    previousTitle: string
    next: number
    nextTitle: string
    last: number
    lastTitle: string
    random: number
    randomTitle: string
}
export default function useNavigationData(): NavigationData {
    const settings = useAppSelector((state) => state.settings.values)

    const currentComic = useAppSelector((state) => state.comic.current)
    const latestComic = useAppSelector((state) => state.comic.latest)
    const randomComic = useAppSelector((state) => state.comic.random)
    const previousComic = useAppSelector((s) => previousComicSelector(s))
    const nextComic = useAppSelector((s) => nextComicSelector(s))
    const lockedToItem = useAppSelector((state) => state.comic.lockedToItem)

    const { hasLockedItem, lockedItem, randomLockedItemComic } = useLockedItem(
        currentComic,
        settings,
        lockedToItem
    )

    if (hasLockedItem) {
        return {
            first: lockedItem.first ?? currentComic,
            firstTitle: `Go to first strip with ${lockedItem.shortName}`,
            previous: lockedItem.previous ?? currentComic,
            previousTitle: `Go to previous strip with ${lockedItem.shortName}`,
            next: lockedItem.next ?? currentComic,
            nextTitle: `Go to next strip with ${lockedItem.shortName}`,
            last: lockedItem.last ?? currentComic,
            lastTitle: `Go to last strip with ${lockedItem.shortName}`,
            random: randomLockedItemComic ?? 0,
            randomTitle: `Go to random strip with ${lockedItem.shortName}`,
        }
    } else {
        return {
            first: 1,
            firstTitle: `Go to first strip`,
            previous: previousComic,
            previousTitle: `Go to previous strip`,
            next: nextComic,
            nextTitle: `Go to next strip`,
            last: latestComic,
            lastTitle: `Go to last strip`,
            random: randomComic,
            randomTitle: `Go to random strip`,
        }
    }
}
