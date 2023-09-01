import { useEffect, useState } from 'react'

import { ImageType } from '@models/ImageType'

import constants from '~/constants'
import { KnownImageType } from '~/models/KnownImageType'
import { debug, error } from '~/utils'

const comicExtensionCache: { [extension: string]: KnownImageType } = {}

export default function ComicImage({
    imageData,
    initialComicSrc,
    initialComic,

    imageReady,
}: {
    imageData: { comicNo: number | null; imageType: ImageType | null }
    initialComicSrc: string
    initialComic: number
    imageReady: () => void
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
        function tryImage(comic: number, imageType: KnownImageType) {
            const downloadingImage = new Image()
            downloadingImage.onload = function (event) {
                comicExtensionCache[comic] = imageType
                setComicSrc((event.target as HTMLImageElement).src)
                debug(
                    `setting src to ${(event.target as HTMLImageElement).src}`
                )
                imageReady()
            }
            downloadingImage.onerror = function (event) {
                // TODO: Report image error to user
                error(event)
            }
            let imageExtension = imageTypeToExtension(imageType)
            downloadingImage.src = `./comics/${comic}.${imageExtension}`
        }

        let { comicNo, imageType } = previousImageData
        if (comicNo && comicNo in comicExtensionCache) {
            debug(
                `using cached image extension ${comicExtensionCache[comicNo]} for ${comicNo}`
            )
            tryImage(comicNo, comicExtensionCache[comicNo])
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
                debug('succeeded try/fail image extension')
                setComicSrc((event.target as HTMLImageElement).src)
                debug(
                    `setting src to ${(event.target as HTMLImageElement).src}`
                )
                imageReady()
            }
            downloadingImage.onerror = function (event) {
                if (currentExtension < constants.comicExtensions.length - 1) {
                    currentExtension++
                    debug(
                        'fallbackImageLoading -- Trying ' +
                            constants.comicExtensions[currentExtension]
                    )
                    let imageExtension =
                        constants.comicExtensions[currentExtension]
                    downloadingImage.src = `./comics/${comicNo}.${imageExtension}`
                } else {
                    // TODO: Report image error to user
                    error(event)
                }
            }
            debug(
                'fallbackImageLoading -- Trying ' +
                    constants.comicExtensions[currentExtension]
            )
            let imageExtension = constants.comicExtensions[currentExtension]
            downloadingImage.src = `./comics/${comicNo}.${imageExtension}`
        } else {
            debug(
                `comic data isn't ready yet, nothing to do yet for image loading`
            )
        }
    }, [previousImageData, imageReady])

    return (
        <img
            id="strip"
            className="qc-ext qc-ext-comic"
            src={comicSrc}
            alt={`Comic #${previousImageData.comicNo || initialComic}`}
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
