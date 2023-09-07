import { ConnectedProps, connect } from 'react-redux'

import styles from './ItemDetails.module.css'

import NavElement, { NavElementMode } from '@components/NavElement/NavElement'
import { Item } from '@models/Item'
import { ItemType } from '@models/ItemType'
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
import { AppDispatch, RootState } from '@store/store'

import { createTintOrShade } from '~/color'

import ColorPicker from './ColorPicker/ColorPicker'
import ValueEditor from './ValueEditor/ValueEditor'

const mapState = (state: RootState) => {
    return {
        isEditorSaving: state.itemEditor.isSaving,
        name: state.itemEditor.name,
        isNameDirty: isNameDirtySelector(state),
        shortName: state.itemEditor.shortName,
        isShortNameDirty: isShortNameDirtySelector(state),
        color: state.itemEditor.color,
        isColorDirty: isColorDirtySelector(state),
        type: state.itemEditor.type,
        isTypeDirty: isTypeDirtySelector(state),
        isSaving: state.itemEditor.isSaving,
    }
}

const mapDispatch = (dispatch: AppDispatch) => {
    return {
        setName: (name: string) => {
            dispatch(setName(name))
        },
        setShortName: (shortName: string) => {
            dispatch(setShortName(shortName))
        },
        setColor: (color: string) => {
            dispatch(setColor(color))
        },
        setType: (type: ItemType) => {
            dispatch(setType(type))
        },
    }
}

const connector = connect(mapState, mapDispatch)
type PropsFromRedux = ConnectedProps<typeof connector>
type ItemDetailsProps = PropsFromRedux & {
    editMode: boolean
    item: Item
    onGoToComic: (comicId: number) => void
}

export function ItemDetails({
    name,
    isNameDirty,
    shortName,
    isShortNameDirty,
    color,
    isColorDirty,
    type,
    isTypeDirty,
    isSaving,
    setName,
    setShortName,
    setColor,
    setType,
    editMode,
    item,
    onGoToComic,
}: ItemDetailsProps) {
    let backgroundColor = color
    if (!backgroundColor.startsWith('#')) {
        backgroundColor = `#${backgroundColor}`
    }
    const foregroundColor = createTintOrShade(color)
    const hoverFocusColor = createTintOrShade(color, 2)

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
                                setType(e.target.value as ItemType)
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
                        setValue={setName}
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
                        setValue={setShortName}
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
                    onClick={() => onGoToComic(item.first)}
                >
                    Comic {item.first}
                </button>
            </p>
            <p>
                <strong>Latest appearance:</strong>{' '}
                <button
                    className="qc-ext-qc-link hover:underline"
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
                            setColor={setColor}
                            resetColor={() => setColor(item.color)}
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
                    shortName: item.shortName,
                    name: item.name,
                    type: item.type,
                    color: item.color,
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

export default connector(ItemDetails)
