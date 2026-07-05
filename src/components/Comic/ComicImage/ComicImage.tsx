import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

import { ImageType } from '@models/ImageType'

import constants from '~/constants'
import { KnownImageType } from '~/models/KnownImageType'
import { debug, error } from '~/utils'

const comicImageTypeCache: { [comicNo: number]: KnownImageType } = {}

export default function ComicImage({
    imageData,
    initialComicSrc,
    initialComic,
    imageReady,
    tagline,
}: {
    imageData: { comicNo: number | null; imageType: ImageType | null }
    initialComicSrc: string
    initialComic: number
    imageReady: () => void
    tagline: string | null
}) {
    const [comicSrc, setComicSrc] = useState(initialComicSrc)
    const [previousImageData, setPreviousImageData] = useState(imageData)

    // We need this "buffer" here because for each navigation event, we get a new
    // `imageData` which has *the same exact values* but is a new object, and thus
    // would cause the `useEffect` below to trigger. So by only calling
    // `setPreviousImageData` when the *fields* are different, we prevent this
    // unwanted extraneous `useEffect` cycle.
    if (
        previousImageData.comicNo !== imageData.comicNo ||
        previousImageData.imageType !== imageData.imageType
    ) {
        setPreviousImageData(imageData)
    }

    useEffect(() => {
        let cancelled = false

        function tryImage(comic: number, imageType: KnownImageType) {
            const downloadingImage = new Image()
            downloadingImage.onload = function (event) {
                if (cancelled) {
                    return
                }
                comicImageTypeCache[comic] = imageType
                setComicSrc((event.target as HTMLImageElement).src)
                debug(
                    `setting src to ${(event.target as HTMLImageElement).src}`
                )
                imageReady()
            }
            downloadingImage.onerror = function (event) {
                if (cancelled) {
                    return
                }
                error(event)
                toast.error(`Failed to load the image for comic #${comic}`, {
                    autoClose: 15000,
                    toastId: `comic-image-error-${comic}`,
                })
            }
            const imageExtension = imageTypeToExtension(imageType)
            downloadingImage.src = `./comics/${comic}.${imageExtension}`
        }

        const { comicNo, imageType } = previousImageData
        if (comicNo && comicNo in comicImageTypeCache) {
            debug(
                `using cached image extension ${comicImageTypeCache[comicNo]} for ${comicNo}`
            )
            tryImage(comicNo, comicImageTypeCache[comicNo])
        } else if (comicNo && imageType && imageType !== 'unknown') {
            debug(
                `using hard-coded image extension ${imageType} for ${comicNo}`
            )
            tryImage(comicNo, imageType)
        } else if (comicNo) {
            debug(`using try/fail image extension for ${comicNo}`)
            let currentExtension = 0
            const downloadingImage = new Image()
            downloadingImage.onload = function (event) {
                if (cancelled) {
                    return
                }
                debug('succeeded try/fail image extension')
                setComicSrc((event.target as HTMLImageElement).src)
                debug(
                    `setting src to ${(event.target as HTMLImageElement).src}`
                )
                imageReady()
            }
            downloadingImage.onerror = function (event) {
                if (cancelled) {
                    return
                }
                if (currentExtension < constants.comicExtensions.length - 1) {
                    currentExtension++
                    debug(
                        'fallbackImageLoading -- Trying ' +
                            constants.comicExtensions[currentExtension]
                    )
                    const imageExtension =
                        constants.comicExtensions[currentExtension]
                    downloadingImage.src = `./comics/${comicNo}.${imageExtension}`
                } else {
                    error(event)
                    toast.error(
                        `Failed to load the image for comic #${comicNo}`,
                        {
                            autoClose: 15000,
                            toastId: `comic-image-error-${comicNo}`,
                        }
                    )
                }
            }
            debug(
                'fallbackImageLoading -- Trying ' +
                    constants.comicExtensions[currentExtension]
            )
            const imageExtension = constants.comicExtensions[currentExtension]
            downloadingImage.src = `./comics/${comicNo}.${imageExtension}`
        } else {
            debug(
                `comic data isn't ready yet, nothing to do yet for image loading`
            )
        }

        return () => {
            cancelled = true
        }
    }, [previousImageData, imageReady])

    return (
        <img
            id="strip"
            className="qc-ext qc-ext-comic"
            src={comicSrc}
            alt={`Comic #${previousImageData.comicNo || initialComic}`}
            title={tagline ?? undefined}
        />
    )
}

function imageTypeToExtension(imageType: KnownImageType) {
    if (imageType === 'jpeg') {
        return 'jpg'
    } else {
        return imageType
    }
}
