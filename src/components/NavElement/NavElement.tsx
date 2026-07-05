import NavButton from '@components/ComicDetailsPanel/NavButton/NavButton'
import { ComicId } from '@models/ComicId'
import { HydratedItemNavigationData } from '@models/HydratedItemData'
import { ItemId } from '@models/ItemId'
import { skipToken } from '@reduxjs/toolkit/dist/query'
import { useRandomComicQuery } from '@store/api/itemApiSlice'
import { setLockedToItem } from '@store/comicSlice'
import { useAppDispatch, useAppSelector } from '@store/hooks'

import { createTintOrShade } from '~/color'

import { useAlternateLayout } from './useAlternateLayout'

export enum NavElementMode {
    Present,
    Missing,
    Preview,
    Editor,
}

export default function NavElement({
    item,
    useColors,
    onSetCurrentComic,
    onShowInfoFor,
    mode,
    editMode,
    onRemoveItem,
    onAddItem,
}: {
    item: HydratedItemNavigationData
    onSetCurrentComic: (comic: ComicId, locked: boolean) => void
    useColors: boolean
    onShowInfoFor: (_: ItemId) => void
    mode: NavElementMode
    editMode?: boolean
    onRemoveItem?: (_: ItemId) => void
    onAddItem?: (_: ItemId) => void
}) {
    const dispatch = useAppDispatch()

    const settings = useAppSelector((state) => state.settings.values)
    const currentComic = useAppSelector((state) => state.comic.current)
    const lockedToItem = useAppSelector((state) => state.comic.lockedToItem)

    let backgroundColor = item.color
    if (!backgroundColor.startsWith('#')) {
        backgroundColor = `#${backgroundColor}`
    }
    const foregroundColor = createTintOrShade(item.color)
    const hoverFocusColor = createTintOrShade(item.color, 2)

    const { data: randomComic, refetch: refreshRandomComic } =
        useRandomComicQuery(
            mode === NavElementMode.Present && settings?.showItemRandomButton
                ? {
                      currentComic,
                      itemId: item.id,
                      skipGuest: settings.skipGuest,
                      skipNonCanon: settings.skipNonCanon,
                  }
                : skipToken
        )

    // `interactive` is false for the hidden measurement mirror, which must not duplicate `title` text.
    function renderExtraStuff(interactive: boolean) {
        switch (mode) {
            case NavElementMode.Present:
                return (
                    editMode && (
                        <button
                            className="px-1 text-sm"
                            title={
                                interactive
                                    ? `Remove ${item.shortName} from comic`
                                    : undefined
                            }
                            onClick={(e) => {
                                e.preventDefault()
                                if (onRemoveItem) {
                                    onRemoveItem(item.id)
                                }
                            }}
                        >
                            <span className="sr-only">{`Remove ${item.shortName} from comic`}</span>
                            <i className={`fa fa-minus`} aria-hidden></i>
                        </button>
                    )
                )
            case NavElementMode.Missing:
                return (
                    editMode && (
                        <button
                            className="px-1 text-sm"
                            title={
                                interactive
                                    ? `Add ${item.shortName} to comic`
                                    : undefined
                            }
                            onClick={(e) => {
                                e.preventDefault()
                                if (onAddItem) {
                                    onAddItem(item.id)
                                }
                            }}
                        >
                            <span className="sr-only">{`Add ${item.shortName} to comic`}</span>
                            <i className={`fa fa-plus`} aria-hidden></i>
                        </button>
                    )
                )
            default:
                return <></>
        }
    }

    const [alternateLayout, selfRef, measureRef] = useAlternateLayout()

    const locked = lockedToItem !== null && lockedToItem === item.id

    // Shared by the visible element and its hidden measurement mirror below.
    function renderButtons(alternate: boolean, interactive: boolean) {
        return (
            <>
                <NavButton
                    comicNo={item.first !== currentComic ? item.first : null}
                    title={
                        interactive
                            ? `First strip with ${item.shortName}`
                            : undefined
                    }
                    faClass="fast-backward"
                    onSetCurrentComic={(c) => onSetCurrentComic(c, locked)}
                />
                <NavButton
                    comicNo={item.previous}
                    title={
                        interactive
                            ? `Previous strip with ${item.shortName}`
                            : undefined
                    }
                    faClass="backward"
                    onSetCurrentComic={(c) => onSetCurrentComic(c, locked)}
                />
                {settings?.showItemChainButton &&
                    (locked ? (
                        <button
                            title={
                                interactive
                                    ? `Unlock page navigation from ${item.shortName}`
                                    : undefined
                            }
                            className={'flex-none px-2 block'}
                            onClick={(e) => {
                                e.preventDefault()
                                dispatch(setLockedToItem(null))
                            }}
                        >
                            <i className={`fa fa-chain`}></i>
                        </button>
                    ) : (
                        mode === NavElementMode.Present && (
                            <button
                                title={
                                    interactive
                                        ? `Lock page navigation to ${item.shortName}`
                                        : undefined
                                }
                                className={'flex-none px-2 block'}
                                onClick={(e) => {
                                    e.preventDefault()
                                    dispatch(setLockedToItem(item.id))
                                }}
                            >
                                <i className={`fa fa-chain-broken`}></i>
                            </button>
                        )
                    ))}
                <button
                    className={
                        'font-bold flex-auto' +
                        (alternate ? ' -order-1 basis-full' : '')
                    }
                    onClick={(e) => {
                        e.preventDefault()
                        onShowInfoFor(item.id)
                    }}
                >
                    <span
                        className="inline-block text-center"
                        title={interactive ? item.name : undefined}
                    >
                        {item.shortName}
                    </span>
                </button>
                {renderExtraStuff(interactive)}
                <NavButton
                    comicNo={item.next}
                    title={
                        interactive
                            ? `Next strip with ${item.shortName}`
                            : undefined
                    }
                    faClass="forward"
                    onSetCurrentComic={(c) => onSetCurrentComic(c, locked)}
                />
                <NavButton
                    comicNo={item.last !== currentComic ? item.last : null}
                    title={
                        interactive
                            ? `Last strip with ${item.shortName}`
                            : undefined
                    }
                    faClass="fast-forward"
                    onSetCurrentComic={(c) => onSetCurrentComic(c, locked)}
                />
                {mode === NavElementMode.Present &&
                    settings?.showItemRandomButton && (
                        <NavButton
                            comicNo={randomComic ?? 0}
                            title={
                                interactive
                                    ? `Random strip with ${item.shortName}`
                                    : undefined
                            }
                            faClass="question"
                            onSetCurrentComic={(c) => {
                                onSetCurrentComic(c, locked)
                                refreshRandomComic()
                            }}
                        />
                    )}
            </>
        )
    }

    const baseClassName =
        `qc-ext-navelement flex items-center rounded` +
        (useColors ? ' with-color' : '')

    return (
        <>
            <div
                ref={selfRef}
                id={`qc-ext-navelement-${item.id}`}
                className={
                    baseClassName +
                    (alternateLayout ? ' flex-wrap justify-between' : '')
                }
                style={
                    useColors
                        ? {
                              '--qc-ext-navelement-bg-color': backgroundColor,
                              '--qc-ext-navelement-color': foregroundColor,
                              '--qc-ext-navelement-accent-color':
                                  hoverFocusColor,
                          }
                        : undefined
                }
            >
                {renderButtons(alternateLayout, true)}
            </div>
            {/* Hidden mirror measuring natural width; see useAlternateLayout.ts */}
            <div
                ref={measureRef}
                aria-hidden="true"
                className={baseClassName}
                style={{
                    position: 'absolute',
                    visibility: 'hidden',
                    pointerEvents: 'none',
                    flexWrap: 'nowrap',
                    whiteSpace: 'nowrap',
                    top: 0,
                    left: 0,
                }}
            >
                {renderButtons(false, false)}
            </div>
        </>
    )
}
