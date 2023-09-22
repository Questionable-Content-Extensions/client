import styles from './ItemDetails.module.css'

import NavElement, { NavElementMode } from '@components/NavElement/NavElement'
import useLockedItem from '@hooks/useLockedItem'
import { Item } from '@models/Item'
import { ItemType } from '@models/ItemType'
import { useAppDispatch, useAppSelector } from '@store/hooks'
import {
    isColorDirtySelector,
    isNameDirtySelector,
    isShortNameDirtySelector,
    isTypeDirtySelector,
    setColor,
    setName,
    setShortName,
    setType,
} from '@store/itemEditorSlice'

import { createTintOrShade } from '~/color'

import ColorPicker from './ColorPicker/ColorPicker'
import ValueEditor from './ValueEditor/ValueEditor'

export default function ItemDetails({
    editMode,
    item,
    onGoToComic,
}: {
    editMode: boolean
    item: Item
    onGoToComic: (comicId: number, locked: boolean) => void
}) {
    const dispatch = useAppDispatch()

    const name = useAppSelector((state) => state.itemEditor.name)
    const isNameDirty = useAppSelector((state) => isNameDirtySelector(state))
    const shortName = useAppSelector((state) => state.itemEditor.shortName)
    const isShortNameDirty = useAppSelector((state) =>
        isShortNameDirtySelector(state)
    )
    const color = useAppSelector((state) => state.itemEditor.color)
    const isColorDirty = useAppSelector((state) => isColorDirtySelector(state))
    const type = useAppSelector((state) => state.itemEditor.type)
    const isTypeDirty = useAppSelector((state) => isTypeDirtySelector(state))
    const isSaving = useAppSelector((state) => state.itemEditor.isSaving)
    const settings = useAppSelector((state) => state.settings.values)
    const currentComic = useAppSelector((state) => state.comic.current)
    const lockedToItem = useAppSelector((state) => state.comic.lockedToItem)

    let backgroundColor = color
    if (!backgroundColor.startsWith('#')) {
        backgroundColor = `#${backgroundColor}`
    }
    const foregroundColor = createTintOrShade(color)
    const hoverFocusColor = createTintOrShade(color, 2)

    const { hasLockedItem, lockedItem } = useLockedItem(
        currentComic,
        settings,
        lockedToItem
    )

    const isLockedItem = hasLockedItem && lockedItem.id === item.id

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
            {editMode ? (
                <p>
                    <label
                        className={
                            'font-bold' +
                            (isTypeDirty ? ' italic' : '') +
                            (isTypeDirty ? ' bg-amber-100' : '')
                        }
                    >
                        Type
                        {isTypeDirty ? '*' : ''}:{' '}
                        <select
                            className="font-normal not-italic disabled:opacity-50 w-52"
                            value={type}
                            onChange={(e) =>
                                dispatch(setType(e.target.value as ItemType))
                            }
                            disabled={isSaving}
                        >
                            <option value="cast">Cast</option>
                            <option value="location">Location</option>
                            <option value="storyline">Storyline</option>
                        </select>
                    </label>
                </p>
            ) : (
                <></>
            )}
            {editMode ? (
                <p>
                    <ValueEditor
                        label="Full name"
                        dirty={isNameDirty}
                        value={name}
                        setValue={(v) => dispatch(setName(v))}
                        isSaving={isSaving}
                    />
                </p>
            ) : (
                <p>
                    <strong>Full name:</strong> {item.name}
                </p>
            )}

            {editMode ? (
                <p>
                    <ValueEditor
                        label="Abbreviated name"
                        dirty={isShortNameDirty}
                        value={shortName}
                        setValue={(v) => dispatch(setShortName(v))}
                        isSaving={isSaving}
                    />
                </p>
            ) : (
                <p>
                    <strong>Abbreviated name:</strong> {item.shortName}
                </p>
            )}
            <p>
                <strong>First appearance:</strong>{' '}
                <button
                    className="qc-ext-qc-link hover:underline"
                    title={`Go to comic ${item.first}`}
                    onClick={() => onGoToComic(item.first, isLockedItem)}
                >
                    Comic {item.first}
                </button>
            </p>
            <p>
                <strong>Latest appearance:</strong>{' '}
                <button
                    className="qc-ext-qc-link hover:underline"
                    title={`Go to comic ${item.last}`}
                    onClick={() => onGoToComic(item.last, isLockedItem)}
                >
                    Comic {item.last}
                </button>
            </p>
            <p>
                <strong>Number of appearances:</strong> {item.appearances} of{' '}
                {item.totalComics} ({Math.round(item.presence * 10) / 10}%)
            </p>
            <div className="align-baseline">
                <span
                    className={
                        'font-bold' +
                        (isColorDirty ? ' italic' : '') +
                        (isColorDirty ? ' bg-amber-100' : '')
                    }
                >
                    Associated colors{isColorDirty ? '*' : ''}:
                </span>{' '}
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
                {editMode ? (
                    <>
                        <ColorPicker
                            color={backgroundColor}
                            setColor={(c) => dispatch(setColor(c))}
                            resetColor={() => dispatch(setColor(item.color))}
                            isColorDirty={isColorDirty}
                            isSaving={isSaving}
                        />
                    </>
                ) : (
                    <></>
                )}
            </div>
            <p>
                <strong>Navigation bar preview:</strong>
            </p>
            <NavElement
                item={{
                    id: item.id,
                    shortName: shortName,
                    name: name,
                    type: item.type,
                    color: color,
                    first: item.first,
                    previous: item.first,
                    next: item.last,
                    last: item.last,
                    count: item.totalComics,
                }}
                useColors={true}
                onSetCurrentComic={() => {}}
                onShowInfoFor={() => {}}
                mode={NavElementMode.Preview}
            />
        </div>
    )
}
