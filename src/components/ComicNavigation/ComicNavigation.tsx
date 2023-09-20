import useLockedItem from '@hooks/useLockedItem'
import useNavigationData from '@hooks/useNavigationData'
import { skipToken } from '@reduxjs/toolkit/dist/query'
import {
    toGetDataQueryArgs,
    useGetComicDataQuery,
} from '@store/api/comicApiSlice'
import { setCurrentComic } from '@store/comicSlice'
import { useAppDispatch, useAppSelector } from '@store/hooks'

// eslint-disable-next-line no-empty-pattern
export default function ComicNavigation({}: {}) {
    const dispatch = useAppDispatch()

    const settings = useAppSelector((state) => state.settings.values)

    const currentComic = useAppSelector((state) => state.comic.current)
    const latestComic = useAppSelector((state) => state.comic.latest)
    const lockedToItem = useAppSelector((state) => state.comic.lockedToItem)

    const { isFetching: isFetchingComicData } = useGetComicDataQuery(
        currentComic === 0 || !settings
            ? skipToken
            : toGetDataQueryArgs(currentComic, settings)
    )

    const {
        hasLockedItem,
        refreshRandomLockedItemComic,
        isFetchingRandomLockedItemComic,
    } = useLockedItem(currentComic, settings, lockedToItem)

    const navigationData = useNavigationData()

    return (
        <ul className="menu qc-ext qc-ext-navigation-menu" id="comicnav">
            <li>
                <a
                    href={`view.php?comic=${navigationData.first}`}
                    title={navigationData.firstTitle}
                    onClick={(e) => {
                        e.preventDefault()
                        dispatch(
                            setCurrentComic(navigationData.first, {
                                locked: hasLockedItem,
                            })
                        )
                    }}
                    style={{
                        pointerEvents: isFetchingComicData ? 'none' : '',
                    }}
                >
                    First
                </a>
            </li>
            <li>
                <a
                    href={`view.php?comic=${navigationData.previous}`}
                    title={navigationData.previousTitle}
                    onClick={(e) => {
                        e.preventDefault()
                        dispatch(
                            setCurrentComic(navigationData.previous, {
                                locked: hasLockedItem,
                            })
                        )
                    }}
                    style={{
                        pointerEvents: isFetchingComicData ? 'none' : '',
                    }}
                >
                    Previous
                </a>
            </li>
            <li>
                <a
                    href={`view.php?comic=${navigationData.next}`}
                    title={navigationData.nextTitle}
                    onClick={(e) => {
                        e.preventDefault()
                        dispatch(
                            setCurrentComic(navigationData.next, {
                                locked: hasLockedItem,
                            })
                        )
                    }}
                    style={{
                        pointerEvents: isFetchingComicData ? 'none' : '',
                    }}
                >
                    Next
                </a>
            </li>
            <li>
                <a
                    href={`view.php?comic=${navigationData.last}`}
                    title={navigationData.lastTitle}
                    onClick={(e) => {
                        e.preventDefault()
                        dispatch(
                            setCurrentComic(latestComic, {
                                locked: hasLockedItem,
                            })
                        )
                    }}
                    style={{
                        pointerEvents: isFetchingComicData ? 'none' : '',
                    }}
                >
                    {currentComic === latestComic ? 'Last' : 'Latest'}
                </a>
            </li>
            <li>
                <a
                    href={`view.php?comic=${navigationData.random}`}
                    title={navigationData.randomTitle}
                    onClick={(e) => {
                        e.preventDefault()
                        dispatch(
                            setCurrentComic(navigationData.random, {
                                locked: hasLockedItem,
                            })
                        )
                        if (hasLockedItem) {
                            refreshRandomLockedItemComic()
                        }
                    }}
                    style={{
                        pointerEvents:
                            isFetchingComicData ||
                            isFetchingRandomLockedItemComic
                                ? 'none'
                                : '',
                    }}
                >
                    Random
                </a>
            </li>
        </ul>
    )
}
