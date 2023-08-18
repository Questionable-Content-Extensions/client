import { ItemNavigationData } from '@models/ItemNavigationData'

import { createTintOrShade } from '~/color'

import NavButton from './NavButton'

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
    item: ItemNavigationData
    onSetCurrentComic: (_: number) => void
    useColors: boolean
    onShowInfoFor: (_: ItemNavigationData) => void
    mode: NavElementMode
    editMode?: boolean
    onRemoveItem?: (_: ItemNavigationData) => void
    onAddItem?: (_: ItemNavigationData) => void
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
                                    onRemoveItem(item)
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
                                    onAddItem(item)
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
            <style>
                {`
                    #qc-ext-navelement-${item.id}.with-color {
                        --qc-ext-navelement-bg-color: ${backgroundColor};
                        --qc-ext-navelement-color: ${foregroundColor};
                        --qc-ext-navelement-accent-color: ${hoverFocusColor};
                    }
                `}
            </style>
            <div
                id={`qc-ext-navelement-${item.id}`}
                className={
                    `qc-ext-navelement flex items-center rounded` +
                    (useColors ? ' with-color' : '')
                }
            >
                <NavButton
                    comicNo={item.first}
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
                    onClick={() => onShowInfoFor(item)}
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
                    comicNo={item.last}
                    title={`Last strip with ${item.shortName}`}
                    faClass="fast-forward"
                    onSetCurrentComic={onSetCurrentComic}
                />
            </div>
        </>
    )
}
