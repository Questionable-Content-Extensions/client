import { ItemNavigationData } from '@models/ComicData'

import { createTintOrShade } from '~/color'

import NavButton from './NavButton'

export default function NavElement({
    item,
    useColors,
    onSetCurrentComic,
    onShowInfoFor,
}: {
    item: ItemNavigationData
    onSetCurrentComic: (_: number) => void
    useColors: boolean
    onShowInfoFor: (_: ItemNavigationData) => void
}) {
    let backgroundColor = item.color
    if (!backgroundColor.startsWith('#')) {
        backgroundColor = `#${backgroundColor}`
    }
    const foregroundColor = createTintOrShade(item.color)
    const hoverFocusColor = createTintOrShade(item.color, 2)

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
                    className="flex-auto py-1 font-bold"
                    onClick={() => onShowInfoFor(item)}
                >
                    <span
                        className="inline-block text-center"
                        title={item.name}
                    >
                        {item.shortName}
                    </span>
                </button>
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
