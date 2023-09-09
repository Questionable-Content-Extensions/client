import NavButton from '@components/ComicDetailsPanel/NavButton/NavButton'
import { ComicId } from '@models/ComicId'
import { HydratedItemNavigationData } from '@models/HydratedItemData'
import { ItemId } from '@models/ItemId'

import { createTintOrShade } from '~/color'

export enum NavElementMode {
    Present,
    Missing,
    Preview,
    Editor,
}

export default function NavElement({
    item,
    useColors,
    currentComic,
    onSetCurrentComic,
    onShowInfoFor,
    mode,
    editMode,
    onRemoveItem,
    onAddItem,
}: {
    item: HydratedItemNavigationData
    currentComic: ComicId
    onSetCurrentComic: (_: number) => void
    useColors: boolean
    onShowInfoFor: (_: ItemId) => void
    mode: NavElementMode
    editMode?: boolean
    onRemoveItem?: (_: ItemId) => void
    onAddItem?: (_: ItemId) => void
}) {
    let backgroundColor = item.color
    if (!backgroundColor.startsWith('#')) {
        backgroundColor = `#${backgroundColor}`
    }
    const foregroundColor = createTintOrShade(item.color)
    const hoverFocusColor = createTintOrShade(item.color, 2)

    let extraStuff = <></>
    if (editMode) {
        switch (mode) {
            case NavElementMode.Present:
                extraStuff = (
                    <>
                        <button
                            className="px-1 text-sm"
                            title={`Remove ${item.shortName} from comic`}
                            onClick={() => {
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
                            onClick={() => {
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

    return (
        <>
            <div
                id={`qc-ext-navelement-${item.id}`}
                className={
                    `qc-ext-navelement flex items-center rounded` +
                    (useColors ? ' with-color' : '')
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
                    className="font-bold flex-auto py-1"
                    onClick={() => onShowInfoFor(item.id)}
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
            </div>
        </>
    )
}
