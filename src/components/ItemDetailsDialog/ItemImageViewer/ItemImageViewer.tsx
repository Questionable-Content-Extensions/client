import { useCallback, useState } from 'react'

import { ItemId } from '@models/ItemId'
import { ItemImageList } from '@models/ItemImageList'
import { UploadImageArgs } from '@store/api/itemApiSlice'

import ImageControls from './ImageControls'

export default function ItemImageViewer({
    itemId,
    itemShortName,
    itemDataUrl,
    itemImageData,
    primaryImage,
    editModeToken,
    onDeleteImage,
    onSetPrimaryImage,
    onUploadImage,
    isUploadingImage,
}: {
    itemId: ItemId
    itemShortName: string
    itemDataUrl: string
    itemImageData: ItemImageList[]
    primaryImage: number | null
    editModeToken: string | null
    onDeleteImage: (imageId: number) => void
    onSetPrimaryImage: (imageId: number) => void
    onUploadImage: (args: UploadImageArgs) => Promise<unknown>
    isUploadingImage: boolean
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
    const [currentPrimaryImage, setCurrentPrimaryImage] = useState(primaryImage)

    const [previewImage, setPreviewImage] = useState<string | null>(null)

    if (currentPrimaryImage !== primaryImage) {
        setCurrentPrimaryImage(primaryImage)
        setCurrentImage(primaryImage ? primaryImageIndex(primaryImage) ?? 0 : 0)
    }

    if (currentImages !== itemImageData) {
        setCurrentImages(itemImageData)
        setCurrentImage(primaryImage ? primaryImageIndex(primaryImage) ?? 0 : 0)
    }

    if (!currentImages.length) {
        return (
            <div className="flex flex-col items-center justify-center p-4">
                {previewImage === null ? (
                    <>
                        <i className="fa fa-camera text-5xl text-gray-500"></i>
                        <div className="no-image-text text-gray-500">
                            No image
                        </div>
                    </>
                ) : (
                    <>
                        <img
                            src={previewImage}
                            alt={'preview of upload'}
                            className="max-h-36 max-w-xs"
                        />
                        (Preview)
                    </>
                )}
                <ImageControls
                    itemId={itemId}
                    currentImage={currentImage}
                    setCurrentImage={setCurrentImage}
                    currentImages={currentImages}
                    editModeToken={editModeToken}
                    primaryImage={primaryImage}
                    primaryImageIndex={primaryImageIndex}
                    onSetPrimaryImage={onSetPrimaryImage}
                    onDeleteImage={onDeleteImage}
                    setPreviewImage={setPreviewImage}
                    uploadImage={onUploadImage}
                    isUploadingImage={isUploadingImage}
                />
            </div>
        )
    } else {
        const currentImageData = currentImages[currentImage]
        return (
            <div className="flex flex-col items-center justify-between p-4">
                <img
                    src={
                        previewImage === null
                            ? `${itemDataUrl}image/${currentImageData.id}`
                            : previewImage
                    }
                    alt={
                        previewImage === null
                            ? `#${currentImage + 1} of ${itemShortName}`
                            : 'preview of upload'
                    }
                    className="max-h-36 max-w-xs"
                />
                {previewImage ? '(Preview)' : null}
                <ImageControls
                    itemId={itemId}
                    currentImage={currentImage}
                    setCurrentImage={setCurrentImage}
                    currentImages={currentImages}
                    editModeToken={editModeToken}
                    primaryImage={primaryImage}
                    primaryImageIndex={primaryImageIndex}
                    onSetPrimaryImage={onSetPrimaryImage}
                    onDeleteImage={onDeleteImage}
                    setPreviewImage={setPreviewImage}
                    uploadImage={onUploadImage}
                    isUploadingImage={isUploadingImage}
                />
            </div>
        )
    }
}
