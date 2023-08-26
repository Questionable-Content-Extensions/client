import ExtraNavButton from './ExtraNavButton'

export default function ExtraNavigation({
    currentComic,
    onSetFirstComic,
    previousComic,
    onSetPreviousComic,
    nextComic,
    onSetNextComic,
    latestComic,
    onSetLatestComic,
    randomComic,
    onSetRandomComic,
    onShowGoToComicDialog,
}: {
    currentComic: number | null
    onSetFirstComic: () => void
    previousComic: number | null
    onSetPreviousComic: () => void
    nextComic: number | null
    onSetNextComic: () => void
    latestComic: number | null
    onSetLatestComic: () => void
    randomComic: number | null
    onSetRandomComic: () => void
    onShowGoToComicDialog: () => void
}) {
    return (
        <div className="flex shadow -mx-2 border-0 border-b border-stone-300">
            <ExtraNavButton
                comicNo={1}
                title="First strip"
                visible={(currentComic || 0) !== 1}
                faClass="fast-backward"
                onClick={onSetFirstComic}
                noLeftBorder
            />
            <ExtraNavButton
                comicNo={previousComic}
                title="Previous strip"
                visible={(currentComic || 0) !== 1}
                faClass="backward"
                onClick={onSetPreviousComic}
            />
            <div className="inline-block flex-auto font-bold text-xs border-solid border-0 border-l border-stone-300">
                <div className="flex flex-col justify-center h-full">
                    <button
                        onClick={() => onShowGoToComicDialog()}
                        title="Go to comic..."
                        className="py-0.5"
                    >
                        <span aria-hidden>
                            {currentComic ? `#${currentComic}` : ''}
                        </span>{' '}
                        <span className="sr-only">Go to comic...</span>
                        <i className="fa fa-expand" aria-hidden="true"></i>
                    </button>
                </div>
            </div>
            <ExtraNavButton
                comicNo={nextComic}
                title="Next strip"
                visible={(currentComic || 0) !== latestComic}
                faClass="forward"
                onClick={onSetNextComic}
            />
            <ExtraNavButton
                comicNo={latestComic}
                title="Latest strip"
                visible={(currentComic || 0) !== latestComic}
                faClass="fast-forward"
                onClick={onSetLatestComic}
            />
            <ExtraNavButton
                comicNo={randomComic}
                title="Random strip"
                visible={true}
                faClass="question"
                onClick={onSetRandomComic}
                smallXPadding
            />
        </div>
    )
}