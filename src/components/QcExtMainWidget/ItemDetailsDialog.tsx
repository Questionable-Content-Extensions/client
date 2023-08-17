import { useEffect, useMemo, useState } from 'react'

import styles from './ItemDetailsDialog.module.css'

import ModalDialog from '@components/Modals/ModalDialog'
import Spinner from '@components/Spinner'
import useComic from '@hooks/useComic'
import useSettings from '@hooks/useSettings'
import {
    ItemData,
    ItemImageData,
    ItemRelationData,
    ItemType,
} from '@models/ItemData'
import itemDataService, { AllItemData } from '@services/itemDataService'

import { createTintOrShade } from '~/color'
import constants from '~/constants'
import { debug } from '~/utils'

import NavElement, { NavElementMode } from './NavElement'

export default function ItemDetailsDialog({
    onClose,
    initialItemId,
}: {
    onClose: () => void
    initialItemId: number | null
}) {
    const [settings, _updateSettings] = useSettings()
    const [itemId, setItemId] = useState<number | null>(null)
    const [_isLoading, setIsLoading] = useState(0)
    const [itemData, setItemData] = useState<AllItemData | null>(null)
    const {
        currentComic: [_currentComic, setCurrentComic],
    } = useComic()
    useEffect(() => {
        setItemId(initialItemId)
    }, [initialItemId])
    useEffect(() => {
        const fetchItemData = async (itemId: number) => {
            const itemData = await itemDataService.getAllItemData(itemId)
            if (itemData) {
                setItemData(itemData)
            } else {
                // TOOD: Report error?
            }
            setIsLoading((l) => l - 1)
        }
        if (itemId !== null && itemData === null) {
            debug('Fetching item')
            setIsLoading((l) => l + 1)
            fetchItemData(itemId)
        } else if (itemId === null && itemData !== null) {
            debug('Clearing item')
            setItemData(null)
        }
    }, [itemId, itemData, setIsLoading, setItemData])

    return (
        <ModalDialog
            onCloseClicked={onClose}
            header={
                <h5 className="m-0 text-xl font-medium leading-normal text-gray-800">
                    {itemData?.itemData.name ?? 'Loading...'}
                </h5>
            }
            body={
                <ItemDataPanel
                    itemDataUrl={constants.itemDataUrl}
                    itemData={itemData?.itemData ?? null}
                    itemImageData={itemData?.imageData ?? null}
                    itemFriendData={itemData?.friendData ?? null}
                    itemLocationData={itemData?.locationData ?? null}
                    editMode={settings.editMode}
                    onGoToComic={(comicId) => {
                        setCurrentComic(comicId)
                        onClose()
                    }}
                    onShowItemData={(itemId: number) => {
                        setItemData(null)
                        setItemId(itemId)
                    }}
                />
            }
            footer={
                <button
                    className="bg-qc-header hover:bg-qc-header-second focus:bg-qc-header-second text-white py-3 px-4 rounded-sm"
                    onClick={() => onClose()}
                >
                    Close
                </button>
            }
        />
    )
}

export function ItemDataPanel({
    itemData,
    itemImageData,
    itemFriendData,
    itemLocationData,
    editMode,
    onGoToComic,
    itemDataUrl,
    onShowItemData,
}: {
    itemData: ItemData | null
    itemImageData: ItemImageData[] | null
    itemFriendData: ItemRelationData[] | null
    itemLocationData: ItemRelationData[] | null
    editMode: boolean
    onGoToComic: (comicId: number) => void
    itemDataUrl: string
    onShowItemData: (itemId: number) => void
}) {
    const isLoading =
        itemData === null ||
        itemImageData === null ||
        itemFriendData === null ||
        itemLocationData === null
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

    let backgroundColor = itemData.color
    if (!backgroundColor.startsWith('#')) {
        backgroundColor = `#${backgroundColor}`
    }
    const foregroundColor = createTintOrShade(itemData.color)
    const hoverFocusColor = createTintOrShade(itemData.color, 2)

    return (
        <>
            <div className="grid grid-cols-2 gap-4">
                <ItemImageViewer
                    itemShortName={itemData.shortName}
                    itemImageData={itemImageData}
                    itemDataUrl={itemDataUrl}
                />
                <DonutGraph
                    amount={itemData.appearances}
                    totalAmount={itemData.totalComics}
                    fillColor={foregroundColor}
                    backgroundColor={backgroundColor}
                />
            </div>

            <div className={styles.smallGapped}>
                {editMode ? (
                    <p>
                        <i
                            className="fa fa-id-card"
                            aria-hidden="true"
                            title="Item ID"
                        ></i>{' '}
                        {itemData.id}
                    </p>
                ) : (
                    <></>
                )}
                <p>
                    <strong>Full name:</strong> {itemData.name}
                </p>
                <p>
                    <strong>Abbreviated name:</strong> {itemData.shortName}
                </p>
                <p>
                    <strong>First appearance:</strong>{' '}
                    <button
                        className="text-qc-link hover:underline"
                        title={`Go to comic ${itemData.first}`}
                        onClick={() => onGoToComic(itemData.first)}
                    >
                        Comic {itemData.first}
                    </button>
                </p>
                <p>
                    <strong>Latest appearance:</strong>{' '}
                    <button
                        className="text-qc-link hover:underline"
                        title={`Go to comic ${itemData.last}`}
                        onClick={() => onGoToComic(itemData.last)}
                    >
                        Comic {itemData.last}
                    </button>
                </p>
                <p>
                    <strong>Number of appearances:</strong>{' '}
                    {itemData.appearances} of {itemData.totalComics} (
                    {Math.round(itemData.presence * 10) / 10}%)
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
                        ...itemData,
                        previous: itemData.first,
                        next: itemData.last,
                        count: itemData.appearances,
                    }}
                    useColors={true}
                    onSetCurrentComic={() => {}}
                    onShowInfoFor={() => {}}
                    mode={NavElementMode.Preview}
                />
            </div>
            <div
                className={
                    'mt-4 pt-2 border-0 border-t border-solid border-gray-400 ' +
                    'grid grid-cols-1 sm:grid-cols-2 gap-4'
                }
            >
                <div>
                    <p>Most often {involvesLocation(itemData.type)}:</p>
                    <ListRelations
                        itemRelationData={itemLocationData}
                        editMode={editMode}
                        totalComics={itemData.appearances}
                        onShowInfoFor={onShowItemData}
                    />
                </div>
                <div>
                    <p>Most often {involvesCast(itemData.type)}:</p>
                    <ListRelations
                        itemRelationData={itemFriendData}
                        editMode={editMode}
                        totalComics={itemData.appearances}
                        onShowInfoFor={onShowItemData}
                    />
                </div>
            </div>
        </>
    )
}

function ItemImageViewer({
    itemShortName,
    itemDataUrl,
    itemImageData,
}: {
    itemShortName: string
    itemDataUrl: string
    itemImageData: ItemImageData[]
}) {
    const [currentImage, setCurrentImage] = useState(0)
    useEffect(() => {
        // Reset when image data changes
        // TODO: Reset to "prefered" image (not yet implemented on server-side)
        setCurrentImage(0)
    }, [itemImageData])

    const image = useMemo(() => {
        if (!itemImageData.length) {
            return (
                <div className="flex flex-col items-center p-4">
                    <i className="fa fa-camera text-5xl text-gray-500"></i>
                    <div className="no-image-text text-gray-500">No image</div>
                </div>
            )
        } else {
            const currentImageData = itemImageData[currentImage]
            let navigator
            if (itemImageData.length > 1) {
                // Show navigator
                navigator = (
                    <div className="flex">
                        <button
                            title={`Go to previous image`}
                            className={
                                `flex-none px-4 py-0.5 block text-xs text-black hover:text-gray-500 focus:text-black visited:text-black ` +
                                (!(currentImage !== 0)
                                    ? ' pointer-events-none'
                                    : '')
                            }
                            onClick={() => {
                                setCurrentImage(
                                    (currentImage) => currentImage - 1
                                )
                            }}
                            tabIndex={!(currentImage !== 0) ? -1 : undefined}
                        >
                            <span className="sr-only">
                                Go to previous image
                            </span>
                            <i
                                className={
                                    `fa fa-step-backward` +
                                    (!(currentImage !== 0) ? ' invisible' : '')
                                }
                                aria-hidden
                            ></i>
                        </button>
                        <div>
                            {currentImage + 1} / {itemImageData.length}
                        </div>
                        <button
                            title={`Go to next image`}
                            className={
                                `flex-none px-4 py-0.5 block text-xs text-black hover:text-gray-500 focus:text-black visited:text-black ` +
                                (!(currentImage !== itemImageData.length - 1)
                                    ? ' pointer-events-none'
                                    : '')
                            }
                            onClick={() => {
                                setCurrentImage(
                                    (currentImage) => currentImage + 1
                                )
                            }}
                            tabIndex={
                                !(currentImage !== itemImageData.length - 1)
                                    ? -1
                                    : undefined
                            }
                        >
                            <span className="sr-only">Go to next image</span>
                            <i
                                className={
                                    `fa fa-step-forward` +
                                    (!(
                                        currentImage !==
                                        itemImageData.length - 1
                                    )
                                        ? ' invisible'
                                        : '')
                                }
                                aria-hidden
                            ></i>
                        </button>
                    </div>
                )
            } else {
                navigator = <></>
            }
            return (
                <div className="flex flex-col items-center p-4">
                    <img
                        src={`${itemDataUrl}image/${currentImageData.id}`}
                        alt={itemShortName}
                    />
                    {navigator}
                </div>
            )
        }
    }, [itemDataUrl, itemImageData, itemShortName, currentImage])

    return <>{image}</>
}

function DonutGraph({
    amount,
    totalAmount,
    fillColor,
    backgroundColor,
}: {
    amount: number
    totalAmount: number
    fillColor: string
    backgroundColor: string
}) {
    const percent = (amount / totalAmount) * 100
    const degrees = Math.round((percent / 100) * 360)
    return (
        <div className="flex flex-col items-center justify-center">
            <div className="relative">
                <div
                    className="h-36 w-36 rounded-full"
                    style={{
                        background: `conic-gradient(${fillColor} ${degrees}deg, ${backgroundColor} ${degrees}deg 360deg)`, // <- 🥳
                    }}
                />
                <div
                    className="h-36 w-36 rounded-full absolute left-0 top-0 bg-white flex flex-col items-center justify-center"
                    style={{ clipPath: 'circle(36%)' }}
                >
                    <p className="mb-0 font-bold text-lg">
                        {Math.round(percent * 100) / 100}%
                    </p>
                    <p className="mb-0">
                        {amount}/{totalAmount}
                    </p>
                </div>
            </div>
        </div>
    )
}

function involvesLocation(type: ItemType) {
    switch (type) {
        case 'cast':
            return 'spotted at'
        case 'location':
            return 'visited simultaneously with'
        case 'storyline':
            return 'involves the places'
    }
}

function involvesCast(type: ItemType) {
    switch (type) {
        case 'cast':
            return 'spotted with'
        case 'location':
            return 'visited by'
        case 'storyline':
            return 'involves the people'
    }
}

function ListRelations({
    itemRelationData,
    editMode,
    totalComics,
    onShowInfoFor,
}: {
    itemRelationData: ItemRelationData[]
    editMode: boolean
    totalComics: number
    onShowInfoFor: (id: number) => void
}) {
    if (itemRelationData.length > 0) {
        const output: JSX.Element[] = []
        for (const relation of itemRelationData) {
            output.push(
                <li key={relation.id}>
                    <button
                        className="text-qc-link hover:underline"
                        onClick={() => onShowInfoFor(relation.id)}
                    >
                        {relation.shortName}
                    </button>{' '}
                    {editMode ? (
                        <span>
                            (
                            <i
                                className="fa fa-id-card"
                                aria-hidden="true"
                                title="Item ID"
                            ></i>{' '}
                            {relation.id})
                        </span>
                    ) : (
                        <></>
                    )}{' '}
                    in {relation.count} comics (
                    {Math.round((relation.count * 1000) / totalComics) / 10}%)
                </li>
            )
        }

        return <ul>{output}</ul>
    } else {
        return (
            <ul>
                <li>None</li>
            </ul>
        )
    }
}
