import { ComicId } from '@models/ComicId'

export interface FilteredComicsNavigation {
    first: ComicId | null
    previous: ComicId | null
    next: ComicId | null
    last: ComicId | null
}

export default function computeFilteredComicsNavigation(
    filteredComics: ComicId[],
    currentComic: ComicId
): FilteredComicsNavigation {
    if (filteredComics.length === 0) {
        return { first: null, previous: null, next: null, last: null }
    }

    let previous: ComicId | null = null
    let next: ComicId | null = null
    for (const comic of filteredComics) {
        if (comic < currentComic) {
            previous = comic
        } else if (comic > currentComic && next === null) {
            next = comic
        }
    }

    const firstComic = filteredComics[0]
    const lastComic = filteredComics[filteredComics.length - 1]

    return {
        first: firstComic !== currentComic ? firstComic : null,
        previous,
        next,
        last: lastComic !== currentComic ? lastComic : null,
    }
}
