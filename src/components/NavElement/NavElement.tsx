import { ConnectedProps, connect } from 'react-redux'

import NavButton from '@components/ComicDetailsPanel/NavButton/NavButton'
import { HydratedItemNavigationData } from '@models/HydratedItemData'
import { ItemId } from '@models/ItemId'
import { skipToken } from '@reduxjs/toolkit/dist/query'
import { useRandomComicQuery } from '@store/api/itemApiSlice'
import { AppDispatch, RootState } from '@store/store'

import { createTintOrShade } from '~/color'

import { useAlternateLayout } from './useAlternateLayout'

const mapState = (state: RootState) => {
    return {
        settings: state.settings.values,
        currentComic: state.comic.current,
    }
}

const mapDispatch = (_dispatch: AppDispatch) => {
    return {}
}

const connector = connect(mapState, mapDispatch)
type PropsFromRedux = ConnectedProps<typeof connector>
type NavElementProps = PropsFromRedux & {
    item: HydratedItemNavigationData
    onSetCurrentComic: (_: number) => void
    useColors: boolean
    onShowInfoFor: (_: ItemId) => void
    mode: NavElementMode
    editMode?: boolean
    onRemoveItem?: (_: ItemId) => void
    onAddItem?: (_: ItemId) => void
}

export enum NavElementMode {
    Present,
    Missing,
    Preview,
    Editor,
}

export function NavElement({
    settings,
    currentComic,
    item,
    useColors,
    onSetCurrentComic,
    onShowInfoFor,
    mode,
    editMode,
    onRemoveItem,
    onAddItem,
}: NavElementProps) {
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

    let extraStuff = <></>
    if (editMode) {
        switch (mode) {
            case NavElementMode.Present:
                extraStuff = (
                    <>
                        <button
                            className="px-1 text-sm"
                            title={`Remove ${item.shortName} from comic`}
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
                    </>
                )
                break
            case NavElementMode.Missing:
                extraStuff = (
                    <>
                        <button
                            className="px-1 text-sm"
                            title={`Add ${item.shortName} to comic`}
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
                    </>
                )
                break
        }
    }

    const [alternateLayout, selfRef] = useAlternateLayout()

    return (
        <>
            <div
                ref={selfRef}
                id={`qc-ext-navelement-${item.id}`}
                className={
                    `qc-ext-navelement flex items-center rounded` +
                    (useColors ? ' with-color' : '') +
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
                <NavButton
                    comicNo={item.first !== currentComic ? item.first : null}
                    title={`First strip with ${item.shortName}`}
                    faClass="fast-backward"
                    onSetCurrentComic={onSetCurrentComic}
                />
                <NavButton
                    comicNo={item.previous}
                    title={`Previous strip with ${item.shortName}`}
                    faClass="backward"
                    onSetCurrentComic={onSetCurrentComic}
                />
                <button
                    className={
                        'font-bold flex-auto py-1' +
                        (alternateLayout ? ' -order-1 basis-full' : '')
                    }
                    onClick={(e) => {
                        e.preventDefault()
                        onShowInfoFor(item.id)
                    }}
                >
                    <span
                        className="inline-block text-center"
                        title={item.name}
                    >
                        {item.shortName}
                    </span>
                </button>
                {extraStuff}
                <NavButton
                    comicNo={item.next}
                    title={`Next strip with ${item.shortName}`}
                    faClass="forward"
                    onSetCurrentComic={onSetCurrentComic}
                />
                <NavButton
                    comicNo={item.last !== currentComic ? item.last : null}
                    title={`Last strip with ${item.shortName}`}
                    faClass="fast-forward"
                    onSetCurrentComic={onSetCurrentComic}
                />
                {mode === NavElementMode.Present &&
                    settings?.showItemRandomButton && (
                        <NavButton
                            comicNo={randomComic ?? 0}
                            title={`Random strip with ${item.shortName}`}
                            faClass="question"
                            onSetCurrentComic={(c) => {
                                onSetCurrentComic(c)
                                refreshRandomComic()
                            }}
                        />
                    )}
            </div>
        </>
    )
}

export default connector(NavElement)
