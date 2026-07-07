import { useMemo } from 'react'

import NavButton from '@components/ComicDetailsPanel/NavButton/NavButton'
import { ComicId } from '@models/ComicId'
import { Filter } from '@models/Filter'
import { describeFilters } from '@models/describeFilter'

import computeFilteredComicsNavigation from './computeFilteredComicsNavigation'

export default function FilteredComicsNavElement({
    filteredComics,
    filters,
    currentComic,
    onSetCurrentComic,
    onReopenDialog,
    onClear,
}: {
    filteredComics: ComicId[]
    filters: Filter[]
    currentComic: ComicId
    onSetCurrentComic: (comic: ComicId, locked: boolean) => void
    onReopenDialog: () => void
    onClear: () => void
}) {
    const { first, previous, next, last } = useMemo(
        () => computeFilteredComicsNavigation(filteredComics, currentComic),
        [filteredComics, currentComic]
    )

    const title = useMemo(() => {
        const count = filteredComics.length
        return (
            `Filter: ${describeFilters(filters)}\n` +
            `${count} ${count === 1 ? 'comic matches' : 'comics match'} the filter`
        )
    }, [filters, filteredComics.length])

    return (
        <div className="qc-ext-navelement flex items-center rounded">
            <NavButton
                comicNo={first}
                title="First strip matching filter"
                faClass="fast-backward"
                onSetCurrentComic={(c) => onSetCurrentComic(c, false)}
            />
            <NavButton
                comicNo={previous}
                title="Previous strip matching filter"
                faClass="backward"
                onSetCurrentComic={(c) => onSetCurrentComic(c, false)}
            />
            <button
                className="font-bold flex-auto py-1 text-center"
                title={title}
                onClick={(e) => {
                    e.preventDefault()
                    onReopenDialog()
                }}
            >
                Filtered Results
            </button>
            <NavButton
                comicNo={next}
                title="Next strip matching filter"
                faClass="forward"
                onSetCurrentComic={(c) => onSetCurrentComic(c, false)}
            />
            <NavButton
                comicNo={last}
                title="Last strip matching filter"
                faClass="fast-forward"
                onSetCurrentComic={(c) => onSetCurrentComic(c, false)}
            />
            <button
                className={'flex-none px-2 block'}
                title="Clear filtered results navigation"
                onClick={(e) => {
                    e.preventDefault()
                    onClear()
                }}
            >
                <span className="sr-only">
                    Clear filtered results navigation
                </span>
                <i className="fa fa-close" aria-hidden></i>
            </button>
        </div>
    )
}
