import { ComicList } from '@models/ComicList'

import HighlightedText from '../HighlightedText/HighlightedText'

export default function GoToComicButton({
    comic,
    onClick,
    highlight,
}: {
    comic: ComicList
    onClick: (comic: ComicList) => void
    highlight: string
}) {
    return (
        <button
            className="text-left"
            onClick={() => {
                onClick(comic)
            }}
        >
            Comic {comic.comic}:{' '}
            <HighlightedText text={comic.title} highlight={highlight} />{' '}
            {comic.tagline ? (
                <>
                    (
                    <HighlightedText
                        text={comic.tagline}
                        highlight={highlight}
                    />
                    )
                </>
            ) : (
                <></>
            )}
        </button>
    )
}
