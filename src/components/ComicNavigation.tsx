import { ConnectedProps, connect } from 'react-redux'

import useLockedItem from '@hooks/useLockedItem'
import {
    nextComicSelector,
    previousComicSelector,
} from '@store/api/comicApiSlice'
import { setCurrentComic } from '@store/comicSlice'
import { AppDispatch, RootState } from '@store/store'

const mapState = (state: RootState) => {
    return {
        settings: state.settings.values,
        lockedToItem: state.comic.lockedToItem,
        currentComic: state.comic.current,
        latestComic: state.comic.latest,
        randomComic: state.comic.random,
        previousComic: previousComicSelector(state),
        nextComic: nextComicSelector(state),
    }
}

const mapDispatch = (dispatch: AppDispatch) => {
    return {
        setCurrentComic: (comic: number, locked: boolean) => {
            dispatch(setCurrentComic(comic, { locked }))
        },
    }
}

const connector = connect(mapState, mapDispatch)
type PropsFromRedux = ConnectedProps<typeof connector>
type ComicNavigationProps = PropsFromRedux & {}

function ComicNavigation({
    settings,
    lockedToItem,
    currentComic,
    latestComic,
    previousComic,
    nextComic,
    randomComic,
    setCurrentComic,
}: ComicNavigationProps) {
    const {
        hasLockedItem,
        lockedItem,
        randomLockedItemComic,
        refreshRandomLockedItemComic,
    } = useLockedItem(currentComic, settings, lockedToItem)

    let navigationData: {
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
    if (hasLockedItem) {
        navigationData = {
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
        navigationData = {
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

    return (
        <ul className="menu qc-ext qc-ext-navigation-menu" id="comicnav">
            <li>
                <a
                    href={`view.php?comic=${navigationData.first}`}
                    title={navigationData.firstTitle}
                    onClick={(e) => {
                        e.preventDefault()
                        setCurrentComic(navigationData.first, hasLockedItem)
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
                        setCurrentComic(navigationData.previous, hasLockedItem)
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
                        setCurrentComic(navigationData.next, hasLockedItem)
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
                        setCurrentComic(latestComic, hasLockedItem)
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
                        setCurrentComic(navigationData.random, hasLockedItem)
                        refreshRandomLockedItemComic()
                    }}
                >
                    Random
                </a>
            </li>
        </ul>
    )
}

export default connector(ComicNavigation)
