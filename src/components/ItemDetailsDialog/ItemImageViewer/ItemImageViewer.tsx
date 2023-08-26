import { useCallback, useMemo, useState } from 'react'

import { ItemImageList } from '@models/ItemImageList'

export default function ItemImageViewer({
    itemShortName,
    itemDataUrl,
    itemImageData,
    primaryImage,
    editMode,
    onDeleteImage,
    onSetPrimaryImage,
}: {
    itemShortName: string
    itemDataUrl: string
    itemImageData: ItemImageList[]
    primaryImage: number | null
    editMode: boolean
    onDeleteImage: (imageId: number) => void
    onSetPrimaryImage: (imageId: number) => void
}) {
    const primaryImageIndex = useCallback(
        (primaryImageId: number) => {
            let i = 0
            for (const itemImage of itemImageData) {
                if (itemImage.id === primaryImageId) {
                    return i
                }
                i += 1
            }
            return null
        },
        [itemImageData]
    )

    const [currentImages, setCurrentImages] = useState(itemImageData)
    const [currentImage, setCurrentImage] = useState(
        primaryImage ? primaryImageIndex(primaryImage) ?? 0 : 0
    )

    if (currentImages !== itemImageData) {
        setCurrentImages(itemImageData)
        setCurrentImage(primaryImage ? primaryImageIndex(primaryImage) ?? 0 : 0)
    }

    const image = useMemo(() => {
        if (!currentImages.length) {
            return (
                <div className="flex flex-col items-center justify-center p-4">
                    <i className="fa fa-camera text-5xl text-gray-500"></i>
                    <div className="no-image-text text-gray-500">No image</div>
                </div>
            )
        } else {
            const currentImageData = currentImages[currentImage]
            let navigator
            if (currentImages.length > 1) {
                // Show navigator
                navigator = (
                    <div className="flex mt-1">
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
                            {currentImage + 1} / {itemImageData.length}{' '}
                            {editMode ? (
                                <>
                                    {' '}
                                    |{' '}
                                    {primaryImage === null ||
                                    primaryImageIndex(primaryImage) !==
                                        currentImage ? (
                                        <>
                                            {' '}
                                            <button
                                                className="mr-1"
                                                title="Make primary image"
                                                onClick={() => {
                                                    onSetPrimaryImage(
                                                        currentImageData.id
                                                    )
                                                }}
                                            >
                                                <i
                                                    className="fa fa-bookmark"
                                                    aria-hidden="true"
                                                ></i>
                                            </button>
                                            |
                                        </>
                                    ) : (
                                        <></>
                                    )}
                                    <button
                                        className="ml-1"
                                        title="Delete image"
                                        onClick={() => {
                                            if (
                                                window.confirm(
                                                    'Are you sure you want to delete this image?'
                                                )
                                            ) {
                                                onDeleteImage(
                                                    currentImageData.id
                                                )
                                            }
                                        }}
                                    >
                                        <i
                                            className="fa fa-trash"
                                            aria-hidden="true"
                                        ></i>
                                    </button>
                                </>
                            ) : (
                                <></>
                            )}
                        </div>
                        <button
                            title={`Go to next image`}
                            className={
                                `flex-none px-4 py-0.5 block text-xs text-black hover:text-gray-500 focus:text-black visited:text-black ` +
                                (!(currentImage !== currentImages.length - 1)
                                    ? ' pointer-events-none'
                                    : '')
                            }
                            onClick={() => {
                                setCurrentImage(
                                    (currentImage) => currentImage + 1
                                )
                            }}
                            tabIndex={
                                !(currentImage !== currentImages.length - 1)
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
                                        currentImages.length - 1
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
                if (!editMode) {
                    navigator = <></>
                } else {
                    navigator = (
                        <div className="flex mt-1">
                            <button
                                title="Delete image"
                                onClick={() => {
                                    if (
                                        window.confirm(
                                            'Are you sure you want to delete this image?'
                                        )
                                    ) {
                                        onDeleteImage(currentImageData.id)
                                    }
                                }}
                            >
                                <i
                                    className="fa fa-trash"
                                    aria-hidden="true"
                                ></i>
                            </button>
                        </div>
                    )
                }
            }
            return (
                <div className="flex flex-col items-center justify-between p-4">
                    <img
                        src={`${itemDataUrl}image/${currentImageData.id}`}
                        alt={`#${currentImage + 1} of ${itemShortName}`}
                    />
                    {navigator}
                </div>
            )
        }
    }, [
        itemDataUrl,
        itemImageData,
        itemShortName,
        currentImage,
        currentImages,
        editMode,
        onDeleteImage,
        onSetPrimaryImage,
        primaryImage,
        primaryImageIndex,
    ])

    return <>{image}</>
}
