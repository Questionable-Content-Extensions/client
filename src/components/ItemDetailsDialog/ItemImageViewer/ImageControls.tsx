import { useState } from 'react'

import { PaddedButton } from '@components/Button'
import InlineSpinner from '@components/InlineSpinner'
import Popup from '@components/Popup'
import { ItemId } from '@models/ItemId'
import { ItemImageList } from '@models/ItemImageList'
import { UploadImageArgs } from '@store/api/itemApiSlice'

import { readFileToDataURL } from '~/utils'

type ImageControlsProps = {
    itemId: ItemId
    currentImage: number
    setCurrentImage: (value: React.SetStateAction<number>) => void
    currentImages: ItemImageList[]
    editModeToken: string | null
    primaryImage: number | null
    primaryImageIndex: (image: number) => number | null
    onSetPrimaryImage: (image: number) => void
    onDeleteImage: (image: number) => void
    setPreviewImage: (image: string | null) => void
    uploadImage: (args: UploadImageArgs) => Promise<unknown>
    isUploadingImage: boolean
}

export default function ImageControls({
    itemId,
    currentImage,
    setCurrentImage,
    currentImages,
    editModeToken,
    primaryImage,
    primaryImageIndex,
    onSetPrimaryImage,
    onDeleteImage,
    setPreviewImage,
    uploadImage,
    isUploadingImage,
}: ImageControlsProps) {
    const currentImageData = currentImages[currentImage]

    const [showImageUploadPopup, setShowImageUploadPopup] = useState(false)
    const [imageUploadPosition, setImageUploadPopupPosition] = useState<
        [number, number]
    >([0, 0])

    const [hasImage, setHasImage] = useState(false)

    return (
        <div className="flex flex-col mt-1">
            <div
                className={'flex' + (currentImages.length < 2 ? ' hidden' : '')}
            >
                <button
                    title={`Go to previous image`}
                    className="flex-none px-3 py-0.5 block text-xs text-black hover:text-gray-500 focus:text-black visited:text-black disabled:opacity-50"
                    onClick={() => {
                        setCurrentImage((currentImage) => currentImage - 1)
                    }}
                    disabled={!(currentImage !== 0)}
                >
                    <span className="sr-only">Go to previous image</span>
                    <i className="fa fa-step-backward" aria-hidden></i>
                </button>
                <div>
                    {currentImages.length > 1 && (
                        <>
                            {currentImage + 1} / {currentImages.length}{' '}
                        </>
                    )}
                </div>
                <button
                    title={`Go to next image`}
                    className="flex-none px-3 py-0.5 block text-xs text-black hover:text-gray-500 focus:text-black visited:text-black disabled:opacity-50"
                    onClick={() => {
                        setCurrentImage((currentImage) => currentImage + 1)
                    }}
                    disabled={!(currentImage !== currentImages.length - 1)}
                >
                    <span className="sr-only">Go to next image</span>
                    <i className="fa fa-step-forward" aria-hidden></i>
                </button>
            </div>
            {editModeToken !== null && (
                <div className="flex justify-center">
                    {currentImages.length !== 0 &&
                        (primaryImage === null ||
                            primaryImageIndex(primaryImage) !==
                                currentImage) && (
                            <>
                                {' '}
                                <button
                                    className="mr-1"
                                    title="Make primary image"
                                    onClick={() => {
                                        onSetPrimaryImage(currentImageData.id)
                                    }}
                                >
                                    <i
                                        className="fa fa-bookmark"
                                        aria-hidden="true"
                                    ></i>
                                </button>
                            </>
                        )}
                    {currentImages.length !== 0 && (
                        <button
                            className="ml-1"
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
                            <i className="fa fa-trash" aria-hidden="true"></i>
                        </button>
                    )}
                    <button
                        className="ml-1"
                        title="Upload image..."
                        onClick={(e) => {
                            const target = e.currentTarget
                            setImageUploadPopupPosition([
                                target.offsetLeft + target.clientWidth / 2,
                                target.offsetTop + target.clientHeight / 2,
                            ])
                            setShowImageUploadPopup(true)
                        }}
                    >
                        <i className="fa fa-upload" aria-hidden="true"></i>
                    </button>
                    <Popup
                        show={showImageUploadPopup}
                        onClose={() => {
                            setShowImageUploadPopup(false)
                            setPreviewImage(null)
                            setHasImage(false)
                        }}
                        position={imageUploadPosition}
                        preventClose={isUploadingImage}
                    >
                        <div className="px-2 py-1 bg-stone-100 border border-solid border-stone-300 w-72 flex flex-col content-start gap-2 relative">
                            <input
                                id="qcext-image-upload"
                                type="file"
                                aria-label="Image"
                                onChange={async (e) => {
                                    const files = e.target.files
                                    if (files) {
                                        const imageData =
                                            await readFileToDataURL(files[0])
                                        setPreviewImage(imageData)
                                        setHasImage(true)
                                    }
                                }}
                                disabled={isUploadingImage}
                            />

                            <PaddedButton
                                onClick={async () => {
                                    const imageUpload = document.getElementById(
                                        'qcext-image-upload'
                                    ) as HTMLInputElement
                                    const files = imageUpload.files
                                    if (files) {
                                        await uploadImage({
                                            image: files[0],
                                            imageFileName: files[0].name,
                                            itemId,
                                            token: editModeToken,
                                        })
                                        setShowImageUploadPopup(false)
                                        setPreviewImage(null)
                                        setHasImage(false)
                                    }
                                }}
                                disabled={!hasImage || isUploadingImage}
                            >
                                <div className="flex justify-center">
                                    <div
                                        className={
                                            '-mt-0.5 -mb-1' +
                                            (isUploadingImage
                                                ? ''
                                                : ' invisible')
                                        }
                                    >
                                        <InlineSpinner color="text-qc-background" />
                                    </div>
                                    {!hasImage
                                        ? '👆 Choose file'
                                        : isUploadingImage
                                        ? 'Uploading...'
                                        : 'Upload'}
                                    <div className="invisible -mt-0.5 -mb-1">
                                        <InlineSpinner color="text-qc-background" />
                                    </div>
                                </div>
                            </PaddedButton>
                        </div>
                    </Popup>
                </div>
            )}
        </div>
    )
}
