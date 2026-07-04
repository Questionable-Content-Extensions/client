import { ComicId } from '@models/ComicId'
import { StorylineFactSegment } from '@models/StorylineFactSegment'

export interface StorylineNavigation {
    first: ComicId | null
    previous: ComicId | null
    next: ComicId | null
    last: ComicId | null
}

/**
 * Computes first/previous/next/last featured-comic navigation for a
 * storyline, mirroring `computeFilteredComicsNavigation`'s semantics but
 * scanning half-open `featured` ranges instead of a flat comic-id array —
 * a storyline's "appearances" are runs of comics, not discrete ids, so
 * previous/next must be able to land on any featured id within a run, not
 * just at its start/end.
 */
export default function computeStorylineNavigation(
    segments: StorylineFactSegment[],
    currentComicId: ComicId
): StorylineNavigation {
    const featured = segments
        .filter((s) => s.featured)
        .sort((a, b) => a.fromComicId - b.fromComicId)

    if (featured.length === 0) {
        return { first: null, previous: null, next: null, last: null }
    }

    let previous: ComicId | null = null
    let next: ComicId | null = null
    for (const seg of featured) {
        if (seg.fromComicId < currentComicId) {
            const candidate = Math.min(seg.toComicId, currentComicId) - 1
            if (candidate >= seg.fromComicId) {
                previous = candidate
            }
        }
        if (next === null && seg.toComicId - 1 > currentComicId) {
            const candidate = Math.max(seg.fromComicId, currentComicId + 1)
            if (candidate < seg.toComicId) {
                next = candidate
            }
        }
    }

    const firstComic = featured[0].fromComicId
    const lastComic = featured[featured.length - 1].toComicId - 1

    return {
        first: firstComic !== currentComicId ? firstComic : null,
        previous,
        next,
        last: lastComic !== currentComicId ? lastComic : null,
    }
}
