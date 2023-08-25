import styles from './ItemDetails.module.css'

import NavElement, { NavElementMode } from '@components/NavElement/NavElement'
import { Item } from '@models/Item'

import { createTintOrShade } from '~/color'

export default function ItemDetails({
    item,
    editMode,
    onGoToComic,
}: {
    item: Item
    editMode: boolean
    onGoToComic: (comicId: number) => void
}) {
    let backgroundColor = item.color
    if (!backgroundColor.startsWith('#')) {
        backgroundColor = `#${backgroundColor}`
    }
    const foregroundColor = createTintOrShade(item.color)
    const hoverFocusColor = createTintOrShade(item.color, 2)

    return (
        <div className={styles.smallGapped}>
            {editMode ? (
                <p>
                    <i
                        className="fa fa-id-card"
                        aria-hidden="true"
                        title="Item ID"
                    ></i>{' '}
                    {item.id}
                </p>
            ) : (
                <></>
            )}
            <p>
                <strong>Full name:</strong> {item.name}
            </p>
            <p>
                <strong>Abbreviated name:</strong> {item.shortName}
            </p>
            <p>
                <strong>First appearance:</strong>{' '}
                <button
                    className="text-qc-link hover:underline"
                    title={`Go to comic ${item.first}`}
                    onClick={() => onGoToComic(item.first)}
                >
                    Comic {item.first}
                </button>
            </p>
            <p>
                <strong>Latest appearance:</strong>{' '}
                <button
                    className="text-qc-link hover:underline"
                    title={`Go to comic ${item.last}`}
                    onClick={() => onGoToComic(item.last)}
                >
                    Comic {item.last}
                </button>
            </p>
            <p>
                <strong>Number of appearances:</strong> {item.appearances} of{' '}
                {item.totalComics} ({Math.round(item.presence * 10) / 10}%)
            </p>
            <p className="align-baseline">
                <strong>Associated colors:</strong>{' '}
                <span
                    className="inline-block h-4 w-4 align-middle"
                    style={{ backgroundColor: backgroundColor }}
                    title={`Background RGB color ${backgroundColor}`}
                ></span>
                <span
                    className="inline-block h-4 w-4 align-middle"
                    style={{ backgroundColor: foregroundColor }}
                    title={`Foreground RGB color ${foregroundColor}`}
                ></span>
                <span
                    className="inline-block h-4 w-4 align-middle"
                    style={{ backgroundColor: hoverFocusColor }}
                    title={`Highlight RGB color ${hoverFocusColor}`}
                ></span>
            </p>
            <p>
                <strong>Navigation bar preview:</strong>
            </p>
            <NavElement
                item={{
                    ...item,
                    previous: item.first,
                    next: item.last,
                    count: item.appearances,
                }}
                useColors={true}
                onSetCurrentComic={() => {}}
                onShowInfoFor={() => {}}
                mode={NavElementMode.Preview}
            />
        </div>
    )
}
