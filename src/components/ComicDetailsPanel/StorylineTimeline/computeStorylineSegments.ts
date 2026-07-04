import { ComicId } from '@models/ComicId'
import { StorylineFactSegment } from '@models/StorylineFactSegment'

export type VisualSegmentKind = 'featured' | 'gap' | 'intermittent'

export interface VisualSegment {
    kind: VisualSegmentKind
    widthFraction: number
    fromComicId: ComicId
    toComicId: ComicId
}

export interface StorylineSegmentsResult {
    segments: VisualSegment[]
    currentComicPositionFraction: number | null
    isOpenEnded: boolean
}

export interface ComputeStorylineSegmentsOptions {
    maxGapFractionOfTotal?: number
    minFeaturedWidthFraction?: number
    intermittentToggleWindowFraction?: number
}

export interface ComputeStorylineSegmentsArgs {
    startComicId: ComicId
    endComicId: ComicId | null
    latestKnownComicId: ComicId
    segments: StorylineFactSegment[]
    currentComicId: ComicId
    options?: ComputeStorylineSegmentsOptions
}

const DEFAULT_OPTIONS: Required<ComputeStorylineSegmentsOptions> = {
    maxGapFractionOfTotal: 0.25,
    minFeaturedWidthFraction: 0.02,
    intermittentToggleWindowFraction: 0.08,
}

type RawKind = 'featured' | 'gap'

interface RawSegment {
    kind: RawKind
    fromComicId: ComicId
    toComicId: ComicId
    widthFraction: number
}

interface WorkingSegment {
    kind: VisualSegmentKind
    fromComicId: ComicId
    toComicId: ComicId
    widthFraction: number
}

export default function computeStorylineSegments({
    startComicId,
    endComicId,
    latestKnownComicId,
    segments,
    currentComicId,
    options,
}: ComputeStorylineSegmentsArgs): StorylineSegmentsResult {
    const {
        maxGapFractionOfTotal,
        minFeaturedWidthFraction,
        intermittentToggleWindowFraction,
    } = { ...DEFAULT_OPTIONS, ...options }

    const isOpenEnded = endComicId === null
    // `rightBound`, like every `toComicId` below, is an *exclusive* upper
    // bound — e.g. `[startComicId, rightBound)` — matching `endComicId`'s
    // existing "active iff N < endComicId" semantics from the server.
    const rightBound = Math.max(endComicId ?? latestKnownComicId, startComicId)

    // Degenerate case: zero-width span. Render a single segment and only
    // position the marker if it lands exactly on that one comic.
    if (rightBound === startComicId) {
        const only: VisualSegment = {
            kind: 'gap',
            widthFraction: 1,
            fromComicId: startComicId,
            toComicId: rightBound,
        }
        return {
            segments: [only],
            currentComicPositionFraction:
                currentComicId === startComicId ? 0 : null,
            isOpenEnded,
        }
    }

    const totalCount = rightBound - startComicId

    const filled = coalesceAdjacent(
        fillGaps(segments, startComicId, rightBound)
    )
    const raw: RawSegment[] = filled.map((s) => ({
        kind: s.featured ? 'featured' : 'gap',
        fromComicId: s.fromComicId,
        toComicId: s.toComicId,
        widthFraction: segmentCount(s.fromComicId, s.toComicId) / totalCount,
    }))

    const merged = mergeIntermittentRuns(
        raw,
        totalCount,
        intermittentToggleWindowFraction
    )

    const visual = capAndRenormalize(
        merged,
        maxGapFractionOfTotal,
        minFeaturedWidthFraction
    )

    const currentComicPositionFraction = locateCurrentComicPosition(
        visual,
        currentComicId,
        startComicId,
        rightBound
    )

    return { segments: visual, currentComicPositionFraction, isOpenEnded }
}

function segmentCount(fromComicId: ComicId, toComicId: ComicId): number {
    return toComicId - fromComicId
}

/**
 * Defensively fills any holes in the server-provided factual segments so the
 * working set fully (and only) covers `[start, end)`. The server is expected
 * to already return contiguous coverage; this guards against it not being
 * fully populated yet given the feature is being built ahead of the backend
 * shipping.
 *
 * Segments use a half-open `[fromComicId, toComicId)` range — the server
 * emits `toComicId` as the exclusive next-toggle comic ID (identical to how
 * `endComicId` is already exclusive), so `segment[i + 1].fromComicId` is
 * expected to equal `segment[i].toComicId` with no gap or overlap.
 */
function fillGaps(
    segments: StorylineFactSegment[],
    start: ComicId,
    end: ComicId
): StorylineFactSegment[] {
    const sorted = [...segments].sort((a, b) => a.fromComicId - b.fromComicId)
    const result: StorylineFactSegment[] = []
    let cursor = start
    for (const seg of sorted) {
        const from = Math.max(seg.fromComicId, cursor)
        const to = Math.min(seg.toComicId, end)
        if (to <= from) {
            continue
        }
        if (from > cursor) {
            result.push({
                fromComicId: cursor,
                toComicId: from,
                featured: false,
            })
        }
        result.push({
            fromComicId: from,
            toComicId: to,
            featured: seg.featured,
        })
        cursor = to
    }
    if (cursor < end) {
        result.push({ fromComicId: cursor, toComicId: end, featured: false })
    }
    return result
}

/**
 * Merges adjacent same-`featured` segments into one. `fillGaps` can produce a
 * filler segment immediately next to a factual segment of the same kind (e.g.
 * a trailing filler gap after the last factual segment when the storyline is
 * open-ended and `latestKnownComicId` is past the last known toggle) — left
 * unmerged, those would render as two visually-identical adjacent segments.
 */
function coalesceAdjacent(
    segments: StorylineFactSegment[]
): StorylineFactSegment[] {
    const result: StorylineFactSegment[] = []
    for (const seg of segments) {
        const last = result[result.length - 1]
        if (
            last &&
            last.featured === seg.featured &&
            last.toComicId === seg.fromComicId
        ) {
            last.toComicId = seg.toComicId
        } else {
            result.push({ ...seg })
        }
    }
    return result
}

/**
 * Single-pass greedy merge: slides through consecutive segments, accumulating
 * a run while its combined width stays within the toggle window. A run of 4+
 * segments (i.e. 3+ featured/gap toggles) within that window collapses into
 * one 'intermittent' segment, since individually rendering many rapid toggles
 * doesn't stay readable at typical bar widths.
 */
function mergeIntermittentRuns(
    raw: RawSegment[],
    totalCount: number,
    windowFraction: number
): WorkingSegment[] {
    const windowSize = Math.max(1, Math.round(windowFraction * totalCount))
    const result: WorkingSegment[] = []
    let i = 0
    while (i < raw.length) {
        let width = 0
        let j = i
        while (
            j < raw.length &&
            width + segmentCount(raw[j].fromComicId, raw[j].toComicId) <=
                windowSize
        ) {
            width += segmentCount(raw[j].fromComicId, raw[j].toComicId)
            j++
        }
        const runLength = j - i
        if (runLength >= 4) {
            const run = raw.slice(i, j)
            result.push({
                kind: 'intermittent',
                fromComicId: run[0].fromComicId,
                toComicId: run[run.length - 1].toComicId,
                widthFraction: run.reduce((sum, s) => sum + s.widthFraction, 0),
            })
            i = j
        } else {
            result.push(raw[i])
            i++
        }
    }
    return result
}

/**
 * Caps oversized gap/intermittent segments and enforces a minimum width for
 * featured/intermittent segments.
 *
 * Both adjustments *pin* a segment's final width to a fixed value rather
 * than "raw width plus/minus a shortfall": a capped gap always renders at
 * exactly `maxGapFractionOfTotal`, and a below-floor featured/intermittent
 * segment always renders at exactly `minFeaturedWidthFraction`, regardless
 * of how far its own raw width sits below/above those thresholds. The
 * remaining segments (never pinned) split whatever width is left over,
 * proportional to their own raw widths.
 *
 * Pinning to a fixed value (rather than topping up "raw + shortfall") is
 * deliberate: if a below-floor segment's rendered width depended on its own
 * raw width at all, then attaching one more comic to it — while it's still
 * below the floor — would shrink the *other* segments' shortfall-derived
 * donation less, which paradoxically shrinks the below-floor segment's
 * final share even though its actual coverage just grew. Pinning removes
 * that dependency entirely: a below-floor segment renders identically
 * regardless of small raw-width changes, and only starts growing once its
 * own raw width exceeds the floor on its own.
 *
 * Similarly, space freed by capping a gap is *not* handed to non-pinned
 * featured/intermittent segments — doing so made a storyline's visual
 * weight depend on how many separate gap segments happened to exist rather
 * than how much of it is actually known to be featured (e.g. a single
 * capped trailing gap would balloon a 2-comic featured run to ~75% width,
 * while splitting that same gap into two capped gaps — by attaching one
 * more distant comic — left barely any width for featured at all).
 */
function capAndRenormalize(
    segments: WorkingSegment[],
    maxGapFractionOfTotal: number,
    minFeaturedWidthFraction: number
): VisualSegment[] {
    const isFeaturedLike = (kind: VisualSegmentKind) =>
        kind === 'featured' || kind === 'intermittent'

    const cappedWidths = segments.map((s) =>
        !isFeaturedLike(s.kind) && s.widthFraction > maxGapFractionOfTotal
            ? maxGapFractionOfTotal
            : s.widthFraction
    )

    // 'intermittent' segments are collapsed runs that include featured
    // coverage, so they get the same width floor as a plain 'featured'
    // segment — otherwise a run of rapid toggles can shrink to a sliver
    // even though it represents real content.
    const isPinnedToFloor = (i: number) =>
        isFeaturedLike(segments[i].kind) &&
        cappedWidths[i] < minFeaturedWidthFraction

    const reservedFloorTotal = segments.reduce(
        (sum, _s, i) =>
            isPinnedToFloor(i) ? sum + minFeaturedWidthFraction : sum,
        0
    )
    const remaining = Math.max(0, 1 - reservedFloorTotal)

    const freeSum = segments.reduce(
        (sum, s, i) => (isPinnedToFloor(i) ? sum : sum + cappedWidths[i]),
        0
    )

    const widths = segments.map((s, i) => {
        if (isPinnedToFloor(i)) {
            return minFeaturedWidthFraction
        }
        return freeSum > 0 ? (cappedWidths[i] / freeSum) * remaining : 0
    })

    // Guards a degenerate edge case (e.g. reservedFloorTotal alone exceeds
    // 1 because there are many below-floor segments) by falling back to a
    // straight proportional split so widths still sum to 1.
    const sum = widths.reduce((a, b) => a + b, 0)
    const normalized = sum > 0 ? widths.map((w) => w / sum) : widths

    return segments.map((s, i) => ({
        kind: s.kind,
        fromComicId: s.fromComicId,
        toComicId: s.toComicId,
        widthFraction: normalized[i],
    }))
}

function locateCurrentComicPosition(
    visual: VisualSegment[],
    currentComicId: ComicId,
    startComicId: ComicId,
    rightBound: ComicId
): number | null {
    if (currentComicId < startComicId || currentComicId >= rightBound) {
        return null
    }
    let cumulative = 0
    for (const seg of visual) {
        if (
            currentComicId >= seg.fromComicId &&
            currentComicId < seg.toComicId
        ) {
            const count = segmentCount(seg.fromComicId, seg.toComicId)
            const localFraction =
                count > 0 ? (currentComicId - seg.fromComicId) / count : 0
            return cumulative + localFraction * seg.widthFraction
        }
        cumulative += seg.widthFraction
    }
    return null
}
