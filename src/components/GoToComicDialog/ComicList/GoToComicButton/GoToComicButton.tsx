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
            {comic.tagline && (
                <>
                    (
                    <HighlightedText
                        text={comic.tagline}
                        highlight={highlight}
                    />
                    )
                </>
            )}
            {comic.isGuestComic ? (
                <span className="bg-qc-header text-white font-bold text-sm rounded-full px-2 py-0.5 ml-2">
                    Guest Comic
                </span>
            ) : comic.isNonCanon ? (
                <span className="bg-qc-non-canon text-white font-bold text-sm rounded-full px-2 py-0.5 ml-2">
                    Non-canon
                </span>
            ) : (
                ''
            )}
        </button>
    )
}
