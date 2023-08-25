import { useMemo, useState } from 'react'

import { ItemImageList } from '@models/ItemImageList'

export default function ItemImageViewer({
    itemShortName,
    itemDataUrl,
    itemImageData,
}: {
    itemShortName: string
    itemDataUrl: string
    itemImageData: ItemImageList[]
}) {
    const [currentImages, setCurrentImages] = useState(itemImageData)
    const [currentImage, setCurrentImage] = useState(0)

    if (currentImages !== itemImageData) {
        setCurrentImages(itemImageData)
        // TODO: Reset to "prefered" image instead of image 0
        // (not yet implemented on server-side)
        setCurrentImage(0)
    }

    const image = useMemo(() => {
        if (!itemImageData.length) {
            return (
                <div className="flex flex-col items-center justify-center p-4">
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
                <div className="flex flex-col items-center justify-between p-4">
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
