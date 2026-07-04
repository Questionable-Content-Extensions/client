import { useCallback, useEffect, useMemo } from 'react'

import ChaserUnderline from '@components/ChaserUnderline'
import NavElement, { NavElementMode } from '@components/NavElement/NavElement'
import Spinner from '@components/Spinner'
import useActiveStorylines from '@hooks/useActiveStorylines'
import useItemNavigationDataByType from '@hooks/useItemNavigationDataByType'
import { ComicId } from '@models/ComicId'
import { HydratedItemNavigationData } from '@models/HydratedItemData'
import { ItemId } from '@models/ItemId'
import { usePatchItemMutation } from '@store/api/itemApiSlice'
import { setFilteredComics } from '@store/comicFilterSlice'
import { setShowGoToComicDialog } from '@store/dialogSlice'
import { useAppDispatch, useAppSelector } from '@store/hooks'

import { PickEnum } from '~/tsUtils'

import StorylineTimeline from '../StorylineTimeline/StorylineTimeline'
import FilteredComicsNavElement from './FilteredComicsNavElement/FilteredComicsNavElement'

export default function ItemNavigation({
    itemNavigationData,
    isLoading,
    isFetching,
    useColors,
    orderMembersByLastAppearance,
    onSetCurrentComic,
    onShowInfoFor,
    mode,
    editMode,
    onRemoveItem,
    onAddItem,
    onAddFirstMatchChange,
    lockedToItemId,
}: {
    itemNavigationData: HydratedItemNavigationData[]
    isLoading: boolean
    isFetching: boolean
    useColors: boolean
    orderMembersByLastAppearance: boolean
    onSetCurrentComic: (comicNo: ComicId, locked: boolean) => void
    onShowInfoFor: (item: ItemId) => void
    mode: PickEnum<
        NavElementMode,
        NavElementMode.Present | NavElementMode.Missing
    >
    editMode?: boolean
    onRemoveItem?: (_: ItemId) => void
    onAddItem?: (_: ItemId) => void
    // Lets the caller (e.g. a filter box) trigger "add" on whichever item
    // is first in this component's display order
    onAddFirstMatchChange?: (add: (() => void) | undefined) => void
    lockedToItemId?: ItemId
}) {
    const dispatch = useAppDispatch()
    const [patchItem] = usePatchItemMutation()
    const currentComic = useAppSelector((state) => state.comic.current)
    const settings = useAppSelector((state) => state.settings.values)
    const filteredComics = useAppSelector(
        (state) => state.comicFilter.filteredComics
    )
    const filters = useAppSelector((state) => state.comicFilter.filters)
    const showFilteredComicsNav =
        mode === NavElementMode.Present && filteredComics.length !== 0
    const showStorylineTimelines = mode === NavElementMode.Present

    const { cast, location, locked, storyline } = useItemNavigationDataByType(
        itemNavigationData,
        lockedToItemId
    )

    const { activeStorylines } = useActiveStorylines(currentComic, settings)

    const activeStorylineIds = useMemo(
        () => new Set(activeStorylines.map((s) => s.id)),
        [activeStorylines]
    )

    // Storylines attached to this comic but without lifecycle data set yet
    // (e.g. just created via the item filter's "Add new storyline" flow) —
    // the backend won't include them in `activeStorylines` until an editor
    // sets a start comic, so surface them here instead of letting them
    // silently vanish.
    const unconfiguredStorylines = useMemo(
        () =>
            storyline.filter(
                (item) => !activeStorylines.some((as) => as.id === item.id)
            ),
        [storyline, activeStorylines]
    )

    const itemNavigationToNavElement = useCallback(
        (item: HydratedItemNavigationData) => {
            return (
                <NavElement
                    key={item.id}
                    item={item}
                    onSetCurrentComic={onSetCurrentComic}
                    useColors={useColors}
                    onShowInfoFor={onShowInfoFor}
                    mode={mode}
                    editMode={editMode}
                    onAddItem={onAddItem}
                    onRemoveItem={onRemoveItem}
                />
            )
        },
        [
            editMode,
            mode,
            onAddItem,
            onRemoveItem,
            onSetCurrentComic,
            onShowInfoFor,
            useColors,
        ]
    )

    // Attaching a storyline that isn't active at the current comic (no start
    // comic set yet, or the comic falls outside its start/end range) would
    // create a confusing state — attached here, but not shown as active.
    // Rather than silently allowing that or blocking the action outright,
    // extend the storyline's lifecycle just enough to cover this comic too,
    // after the editor confirms.
    const handleAddStoryline = useCallback(
        (item: HydratedItemNavigationData) => {
            if (!settings) {
                return
            }

            let newStartComicId: ComicId | undefined
            let newEndComicId: ComicId | null | undefined
            let message: string | undefined

            if (item.startComicId === null) {
                newStartComicId = currentComic
                message =
                    `${item.shortName} doesn't have a start comic set yet. ` +
                    `Attaching it here will also set its start comic to #${currentComic}. Continue?`
            } else if (currentComic < item.startComicId) {
                newStartComicId = currentComic
                message =
                    `${item.shortName}'s start comic is #${item.startComicId}. ` +
                    `Attaching it here will move its start comic back to #${currentComic} to include this comic. Continue?`
            } else if (
                item.endComicId !== null &&
                currentComic >= item.endComicId
            ) {
                newEndComicId = currentComic + 1
                // `endComicId` is exclusive internally, but editors think of
                // "end comic" as the last comic the storyline appears in, so
                // both the old and new values are shown here minus one.
                message =
                    `${item.shortName}'s end comic is #${item.endComicId - 1}. ` +
                    `Attaching it here will move its end comic forward to #${currentComic} to include this comic. Continue?`
            }

            if (message && !window.confirm(message)) {
                return
            }

            if (newStartComicId !== undefined || newEndComicId !== undefined) {
                patchItem({
                    item: item.id,
                    body: {
                        token: settings.editModeToken,
                        ...(newStartComicId !== undefined
                            ? { startComicId: newStartComicId }
                            : {}),
                        ...(newEndComicId !== undefined
                            ? { endComicId: newEndComicId }
                            : {}),
                    },
                })
            }

            if (onAddItem) {
                onAddItem(item.id)
            }
        },
        [currentComic, onAddItem, patchItem, settings]
    )

    // Mirrors the display order used below (grouped by type, or flattened
    // when ordering by last appearance) so that "the first search result"
    // means the same thing here as it does visually.
    const firstOrderedItem = useMemo(() => {
        const nonActiveStoryline = storyline.filter(
            (item) => !activeStorylineIds.has(item.id)
        )
        const ordered = orderMembersByLastAppearance
            ? itemNavigationData.filter(
                  (item) =>
                      item.type !== 'storyline' ||
                      !activeStorylineIds.has(item.id)
              )
            : [...cast, ...location, ...nonActiveStoryline]
        return ordered[0]
    }, [
        cast,
        location,
        storyline,
        activeStorylineIds,
        itemNavigationData,
        orderMembersByLastAppearance,
    ])

    const addFirstMatch = useMemo(() => {
        if (!editMode || mode !== NavElementMode.Missing || !firstOrderedItem) {
            return undefined
        }
        const item = firstOrderedItem
        return () => {
            if (item.type === 'storyline') {
                handleAddStoryline(item)
            } else {
                onAddItem?.(item.id)
            }
        }
    }, [editMode, mode, firstOrderedItem, handleAddStoryline, onAddItem])

    useEffect(() => {
        onAddFirstMatchChange?.(addFirstMatch)
        return () => onAddFirstMatchChange?.(undefined)
    }, [addFirstMatch, onAddFirstMatchChange])

    const storylineNavigationToNavElement = useCallback(
        (item: HydratedItemNavigationData) => {
            return (
                <NavElement
                    key={item.id}
                    item={item}
                    onSetCurrentComic={onSetCurrentComic}
                    useColors={useColors}
                    onShowInfoFor={onShowInfoFor}
                    mode={mode}
                    editMode={editMode}
                    onAddItem={() => handleAddStoryline(item)}
                    onRemoveItem={onRemoveItem}
                />
            )
        },
        [
            editMode,
            handleAddStoryline,
            mode,
            onRemoveItem,
            onSetCurrentComic,
            onShowInfoFor,
            useColors,
        ]
    )

    const itemNavElements = useMemo(() => {
        return {
            cast: cast.map(itemNavigationToNavElement),
            location: location.map(itemNavigationToNavElement),
            locked: locked.map(itemNavigationToNavElement),
            // Only used in Missing mode (see below) — in Present mode,
            // storylines get their own lifecycle-aware StorylineTimeline
            // rendering instead. Active storylines are excluded here even
            // though they're not attached to this comic, since they already
            // have their own +/- control in the Storylines section above —
            // listing them again here would be confusing/duplicate.
            storyline: storyline
                .filter((item) => !activeStorylineIds.has(item.id))
                .map(storylineNavigationToNavElement),
            // In Present mode, storylines have their own lifecycle-aware nav
            // semantics (see StorylineTimeline below), so they're excluded
            // from the attachment-order-based "Recent" flattened view. In
            // Missing mode there's no lifecycle rendering to defer to, so
            // non-active storylines are included like any other non-present
            // item (active ones are still excluded, see above).
            all: itemNavigationData
                .filter(
                    (item) =>
                        item.type !== 'storyline' ||
                        (mode === NavElementMode.Missing &&
                            !activeStorylineIds.has(item.id))
                )
                .map((item) =>
                    item.type === 'storyline'
                        ? storylineNavigationToNavElement(item)
                        : itemNavigationToNavElement(item)
                ),
        }
    }, [
        cast,
        location,
        locked,
        storyline,
        itemNavigationData,
        itemNavigationToNavElement,
        storylineNavigationToNavElement,
        mode,
        activeStorylineIds,
    ])

    const attachedStorylineIds = useMemo(
        () => new Set(storyline.map((item) => item.id)),
        [storyline]
    )

    const storylineTimelineElements = useMemo(
        () =>
            activeStorylines.map((activeStoryline) => (
                <StorylineTimeline
                    key={activeStoryline.id}
                    storyline={activeStoryline}
                    currentComicId={currentComic}
                    useColors={useColors}
                    isAttachedToCurrentComic={attachedStorylineIds.has(
                        activeStoryline.id
                    )}
                    editMode={editMode}
                    onShowInfoFor={onShowInfoFor}
                    onSetCurrentComic={onSetCurrentComic}
                    onAddItem={onAddItem}
                    onRemoveItem={onRemoveItem}
                />
            )),
        [
            activeStorylines,
            attachedStorylineIds,
            currentComic,
            editMode,
            onAddItem,
            onRemoveItem,
            onSetCurrentComic,
            onShowInfoFor,
            useColors,
        ]
    )

    const unconfiguredStorylineElements = useMemo(
        () => unconfiguredStorylines.map(itemNavigationToNavElement),
        [unconfiguredStorylines, itemNavigationToNavElement]
    )

    if (isLoading) {
        return (
            <div className="text-center pt-4">
                <Spinner
                    loadingText="Loading..."
                    height="h-8"
                    width="w-8"
                    textColor="text-black"
                    spinnerBgColor="text-gray-300"
                    spinnerColor="fill-qc-link"
                />
            </div>
        )
    }

    if (
        !itemNavigationData.length &&
        !showFilteredComicsNav &&
        !storylineTimelineElements.length
    ) {
        return <></>
    }

    const storylineSection = showStorylineTimelines &&
        (!!storylineTimelineElements.length ||
            (editMode && !!unconfiguredStorylineElements.length)) && (
            <>
                <h1 className="text-base font-normal text-center mx-2 mb-0 mt-4">
                    <ChaserUnderline active={isFetching}>
                        Storylines
                    </ChaserUnderline>
                </h1>
                <div className="flex flex-col gap-1 px-2">
                    {storylineTimelineElements}
                </div>
                {editMode && !!unconfiguredStorylineElements.length && (
                    <>
                        <h2 className="text-xs font-normal text-center mt-1">
                            Needs a start comic set before it will appear as
                            active:
                        </h2>
                        {unconfiguredStorylineElements}
                    </>
                )}
            </>
        )

    if (!orderMembersByLastAppearance) {
        return (
            <div className="text-center">
                {!!itemNavElements.locked.length && (
                    <ItemTypeSection
                        header="Navigation Locked"
                        isFetching={isFetching}
                        mode={mode}
                        elements={itemNavElements.locked}
                    />
                )}
                {showFilteredComicsNav && (
                    <ItemTypeSection
                        header="Filtered Navigation"
                        isFetching={isFetching}
                        mode={mode}
                        elements={[
                            <FilteredComicsNavElement
                                key="filtered-comics"
                                filteredComics={filteredComics}
                                filters={filters}
                                currentComic={currentComic}
                                onSetCurrentComic={onSetCurrentComic}
                                onReopenDialog={() =>
                                    dispatch(setShowGoToComicDialog(true))
                                }
                                onClear={() =>
                                    dispatch(
                                        setFilteredComics({
                                            comics: [],
                                            filters: [],
                                        })
                                    )
                                }
                            />,
                        ]}
                    />
                )}
                {!!itemNavElements.cast.length && (
                    <ItemTypeSection
                        header="Cast Members"
                        isFetching={isFetching}
                        mode={mode}
                        elements={itemNavElements.cast}
                    />
                )}
                {!!itemNavElements.location.length && (
                    <ItemTypeSection
                        header="Locations"
                        isFetching={isFetching}
                        mode={mode}
                        elements={itemNavElements.location}
                    />
                )}
                {mode === NavElementMode.Missing &&
                    !!itemNavElements.storyline.length && (
                        <ItemTypeSection
                            header="Storylines"
                            isFetching={isFetching}
                            mode={mode}
                            elements={itemNavElements.storyline}
                        />
                    )}
                {storylineSection}
            </div>
        )
    } else {
        return (
            <div className="text-center">
                <ItemTypeSection
                    header="Recent"
                    isFetching={isFetching}
                    mode={mode}
                    elements={itemNavElements.all}
                />
                {storylineSection}
            </div>
        )
    }
}

function ItemTypeSection({
    header,
    isFetching,
    mode,
    elements,
}: {
    header: string
    isFetching: boolean
    mode: NavElementMode
    elements: JSX.Element[]
}) {
    return (
        <>
            <h1 className="text-base font-normal text-center mx-2 mb-0 mt-4">
                <ChaserUnderline active={isFetching}>{header}</ChaserUnderline>
            </h1>
            {mode === NavElementMode.Missing ? (
                <h2 className="text-xs font-normal text-center">
                    (Non-Present)
                </h2>
            ) : (
                <></>
            )}
            {elements}
        </>
    )
}
