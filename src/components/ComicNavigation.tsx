import { ConnectedProps, connect } from 'react-redux'

import {
    nextComicSelector,
    previousComicSelector,
} from '@store/api/comicApiSlice'
import { setCurrentComic } from '@store/comicSlice'
import { AppDispatch, RootState } from '@store/store'

const mapState = (state: RootState) => {
    return {
        settings: state.settings.values,
        currentComic: state.comic.current,
        latestComic: state.comic.latest,
        randomComic: state.comic.random,
        previousComic: previousComicSelector(state),
        nextComic: nextComicSelector(state),
    }
}

const mapDispatch = (dispatch: AppDispatch) => {
    return {
        setCurrentComic: (comic: number) => {
            dispatch(setCurrentComic(comic))
        },
    }
}

const connector = connect(mapState, mapDispatch)
type PropsFromRedux = ConnectedProps<typeof connector>
type ComicNavigationProps = PropsFromRedux & {}

function ComicNavigation({
    currentComic,
    latestComic,
    previousComic,
    nextComic,
    randomComic,
    setCurrentComic,
}: ComicNavigationProps) {
    return (
        <ul className="menu qc-ext qc-ext-navigation-menu" id="comicnav">
            <li>
                <a
                    href="view.php?comic=1"
                    onClick={(e) => {
                        e.preventDefault()
                        setCurrentComic(1)
                    }}
                >
                    First
                </a>
            </li>
            <li>
                <a
                    href={'view.php?comic=' + previousComic}
                    onClick={(e) => {
                        e.preventDefault()
                        setCurrentComic(previousComic)
                    }}
                >
                    Previous
                </a>
            </li>
            <li>
                <a
                    href={'view.php?comic=' + nextComic}
                    onClick={(e) => {
                        e.preventDefault()
                        setCurrentComic(nextComic)
                    }}
                >
                    Next
                </a>
            </li>
            <li>
                <a
                    href={'view.php?comic=' + latestComic}
                    onClick={(e) => {
                        e.preventDefault()
                        setCurrentComic(latestComic)
                    }}
                >
                    {currentComic === latestComic ? 'Last' : 'Latest'}
                </a>
            </li>
            <li>
                <a
                    href={'view.php?comic=' + randomComic}
                    onClick={(e) => {
                        e.preventDefault()
                        setCurrentComic(randomComic)
                    }}
                >
                    Random
                </a>
            </li>
        </ul>
    )
}

export default connector(ComicNavigation)
