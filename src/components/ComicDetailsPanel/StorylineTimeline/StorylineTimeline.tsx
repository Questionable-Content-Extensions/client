import { useMemo } from 'react'

import styles from './StorylineTimeline.module.css'

import NavButton from '@components/ComicDetailsPanel/NavButton/NavButton'
import { ComicId } from '@models/ComicId'
import { ItemId } from '@models/ItemId'
import { HydratedActiveStoryline } from '@models/StorylineLifecycle'
import { useAppSelector } from '@store/hooks'

import { createTintOrShade, hexColorToRgb } from '~/color'

import computeStorylineNavigation from './computeStorylineNavigation'
import computeStorylineSegments from './computeStorylineSegments'

export default function StorylineTimeline({
    storyline,
    currentComicId,
    useColors,
    isAttachedToCurrentComic,
    editMode,
    onShowInfoFor,
    onSetCurrentComic,
    onAddItem,
    onRemoveItem,
}: {
    storyline: HydratedActiveStoryline
    currentComicId: ComicId
    useColors: boolean
    isAttachedToCurrentComic: boolean
    editMode?: boolean
    onShowInfoFor: (_: ItemId) => void
    onSetCurrentComic: (comic: ComicId, locked: boolean) => void
    onAddItem?: (_: ItemId) => void
    onRemoveItem?: (_: ItemId) => void
}) {
    const latestComic = useAppSelector((state) => state.comic.latest)

    let backgroundColor = storyline.color
    if (!backgroundColor.startsWith('#')) {
        backgroundColor = `#${backgroundColor}`
    }
    // Chip background is the item's own (usually dark/saturated) color, like
    // NavElement. The text and progress bar fill need to sit on top of that,
    // so they use progressively lighter tints for contrast instead of the
    // raw color.
    const foregroundColor = createTintOrShade(backgroundColor)
    const accentColor = createTintOrShade(backgroundColor, 2)
    const accentRgb = hexColorToRgb(accentColor).join(', ')

    const { segments, currentComicPositionFraction, isOpenEnded } = useMemo(
        () =>
            computeStorylineSegments({
                startComicId: storyline.startComicId,
                endComicId: storyline.endComicId,
                latestKnownComicId: latestComic,
                segments: storyline.segments,
                currentComicId,
            }),
        [storyline, latestComic, currentComicId]
    )

    const { first, previous, next, last } = useMemo(
        () => computeStorylineNavigation(storyline.segments, currentComicId),
        [storyline, currentComicId]
    )

    return (
        <div
            id={`qc-ext-storyline-${storyline.id}`}
            className={
                'qc-ext-storyline-timeline rounded px-1 py-0.5' +
                (useColors ? ' with-color' : '')
            }
            style={
                useColors
                    ? {
                          '--qc-ext-storyline-bg-color': backgroundColor,
                          '--qc-ext-storyline-color': foregroundColor,
                          '--qc-ext-storyline-accent-color': accentColor,
                          '--qc-ext-storyline-accent-rgb': accentRgb,
                      }
                    : undefined
            }
        >
            <div className="flex items-center">
                <NavButton
                    comicNo={first}
                    title={`First strip with ${storyline.shortName}`}
                    faClass="fast-backward"
                    onSetCurrentComic={(c) => onSetCurrentComic(c, false)}
                />
                <NavButton
                    comicNo={previous}
                    title={`Previous strip with ${storyline.shortName}`}
                    faClass="backward"
                    onSetCurrentComic={(c) => onSetCurrentComic(c, false)}
                />
                <button
                    className="block flex-auto truncate text-center text-xs leading-tight font-bold"
                    title={storyline.name}
                    onClick={(e) => {
                        e.preventDefault()
                        onShowInfoFor(storyline.id)
                    }}
                >
                    {storyline.shortName}
                </button>
                <NavButton
                    comicNo={next}
                    title={`Next strip with ${storyline.shortName}`}
                    faClass="forward"
                    onSetCurrentComic={(c) => onSetCurrentComic(c, false)}
                />
                <NavButton
                    comicNo={last}
                    title={`Last strip with ${storyline.shortName}`}
                    faClass="fast-forward"
                    onSetCurrentComic={(c) => onSetCurrentComic(c, false)}
                />
            </div>
            <div className="flex items-center gap-2">
                <div className="qc-ext-storyline-controls flex items-center shrink-0">
                    {editMode && !isAttachedToCurrentComic && (
                        <button
                            className="px-1 text-sm"
                            title={`Add ${storyline.shortName} to comic`}
                            onClick={(e) => {
                                e.preventDefault()
                                if (onAddItem) {
                                    onAddItem(storyline.id)
                                }
                            }}
                        >
                            <span className="sr-only">{`Add ${storyline.shortName} to comic`}</span>
                            <i className={`fa fa-plus`} aria-hidden></i>
                        </button>
                    )}
                    {editMode && isAttachedToCurrentComic && (
                        <button
                            className="px-1 text-sm"
                            title={`Remove ${storyline.shortName} from comic`}
                            onClick={(e) => {
                                e.preventDefault()
                                if (onRemoveItem) {
                                    onRemoveItem(storyline.id)
                                }
                            }}
                        >
                            <span className="sr-only">{`Remove ${storyline.shortName} from comic`}</span>
                            <i className={`fa fa-minus`} aria-hidden></i>
                        </button>
                    )}
                </div>
                <div className="relative h-2 flex-1">
                    <div
                        className={
                            'relative flex h-2 w-full overflow-hidden rounded-sm' +
                            (isOpenEnded ? ' ' + styles.openEnded : '')
                        }
                    >
                        {segments.map((segment) => (
                            <button
                                key={`${segment.fromComicId}-${segment.toComicId}`}
                                type="button"
                                className={
                                    segment.kind === 'featured'
                                        ? styles.featured
                                        : segment.kind === 'intermittent'
                                          ? styles.intermittent
                                          : styles.gap
                                }
                                style={{
                                    flex: `${segment.widthFraction} 0 0%`,
                                    backgroundColor:
                                        useColors && segment.kind === 'featured'
                                            ? foregroundColor
                                            : undefined,
                                }}
                                title={
                                    // `toComicId` is exclusive, so the last
                                    // comic actually covered by this segment
                                    // is `toComicId - 1`.
                                    segment.toComicId - segment.fromComicId ===
                                    1
                                        ? `#${segment.fromComicId}`
                                        : `#${segment.fromComicId}–#${segment.toComicId - 1}`
                                }
                                onClick={(e) => {
                                    e.preventDefault()
                                    onSetCurrentComic(
                                        segment.fromComicId,
                                        false
                                    )
                                }}
                            />
                        ))}
                    </div>
                    {currentComicPositionFraction !== null && (
                        // Rendered as a sibling of the overflow-hidden bar
                        // above (rather than inside it) so it can poke
                        // slightly past the bar's top/bottom edges to stand
                        // out, without that clipping affecting the bar's own
                        // segments.
                        <span
                            className={styles.marker}
                            style={{
                                left: `${currentComicPositionFraction * 100}%`,
                            }}
                            title={`Currently at comic #${currentComicId}`}
                        />
                    )}
                </div>
            </div>
        </div>
    )
}
