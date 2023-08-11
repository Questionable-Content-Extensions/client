import useComic from '../hooks/useComic'

export default function ComicNavigation() {
    const {
        currentComic: [currentComic, setCurrentComic],
        previousComic: [previousComic, setPreviousComic],
        nextComic: [nextComic, setNextComic],
        latestComic: [latestComic, setLatestComic],
        randomComic: [randomComic, setRandomComic],
    } = useComic()

    // TODO: Switch to useComicData when data is loaded (for exclusions) with fallback to useComic otherwise.

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
                        setPreviousComic()
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
                        setNextComic()
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
                        setLatestComic()
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
                        setRandomComic()
                    }}
                >
                    Random
                </a>
            </li>
        </ul>
    )
}
