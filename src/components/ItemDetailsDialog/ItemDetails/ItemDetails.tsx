import styles from './ItemDetails.module.css'

import NavElement, { NavElementMode } from '@components/NavElement/NavElement'
import useLockedItem from '@hooks/useLockedItem'
import { Item } from '@models/Item'
import { ItemType } from '@models/ItemType'
import { useAppDispatch, useAppSelector } from '@store/hooks'
import {
    isColorDirtySelector,
    isEndComicIdDirtySelector,
    isNameDirtySelector,
    isShortNameDirtySelector,
    isStartComicIdDirtySelector,
    isTypeDirtySelector,
    setColor,
    setEndComicId,
    setName,
    setShortName,
    setStartComicId,
    setType,
} from '@store/itemEditorSlice'

import { createTintOrShade } from '~/color'

import ColorPicker from './ColorPicker/ColorPicker'
import ComicIdEditor from './ComicIdEditor/ComicIdEditor'
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
    const startComicId = useAppSelector(
        (state) => state.itemEditor.startComicId
    )
    const isStartComicIdDirty = useAppSelector((state) =>
        isStartComicIdDirtySelector(state)
    )
    const endComicId = useAppSelector((state) => state.itemEditor.endComicId)
    const isEndComicIdDirty = useAppSelector((state) =>
        isEndComicIdDirtySelector(state)
    )
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

    // `endComicId` is stored/transmitted as an exclusive upper bound (a
    // storyline is active while `N < endComicId`), which matches the
    // segment RLE the server sends but isn't how an editor thinks about "the
    // last comic this storyline appears in" — so the editor-facing value is
    // shifted to be inclusive (`endComicId - 1`) here, at the UI boundary.
    const displayedEndComicId = endComicId !== null ? endComicId - 1 : null

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
            {editMode && type === 'storyline' && (
                <>
                    <p>
                        <ComicIdEditor
                            label="Start comic"
                            dirty={isStartComicIdDirty}
                            value={startComicId}
                            setValue={(v) => dispatch(setStartComicId(v))}
                            isSaving={isSaving}
                        />
                    </p>
                    <p>
                        <label className="font-bold">
                            Ongoing (no end comic):{' '}
                            <input
                                type="checkbox"
                                checked={endComicId === null}
                                disabled={isSaving}
                                onChange={(e) =>
                                    dispatch(
                                        setEndComicId(
                                            e.target.checked
                                                ? null
                                                : // Default to just past the
                                                  // last comic this storyline
                                                  // has actually appeared in,
                                                  // rather than an empty
                                                  // one-comic range at the
                                                  // start.
                                                  Math.max(
                                                      item.last,
                                                      startComicId
                                                  ) + 1
                                        )
                                    )
                                }
                            />
                        </label>
                    </p>
                    {displayedEndComicId !== null && (
                        <p>
                            <ComicIdEditor
                                label="End comic"
                                dirty={isEndComicIdDirty}
                                value={displayedEndComicId}
                                setValue={(v) => dispatch(setEndComicId(v + 1))}
                                isSaving={isSaving}
                            />
                        </p>
                    )}
                    {displayedEndComicId !== null &&
                        displayedEndComicId < startComicId && (
                            <p className="text-[#ff3030]">
                                End comic must not be before the start comic.
                            </p>
                        )}
                </>
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
                    startComicId: type === 'storyline' ? startComicId : null,
                    endComicId: type === 'storyline' ? endComicId : null,
                }}
                useColors={true}
                onSetCurrentComic={() => {}}
                onShowInfoFor={() => {}}
                mode={NavElementMode.Preview}
            />
        </div>
    )
}
