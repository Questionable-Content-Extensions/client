import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import useComic from '../hooks/useComic'
import useComicData from '../hooks/useComicData'
import useSettings from '../hooks/useSettings'
import { debug, info } from '../utils'
import ComicImage from './ComicImage'
import FullPageLoader from './FullPageLoader'

export default function Comic({
    initialComic,
    initialComicSrc,
}: {
    initialComic: number
    initialComicSrc: string
}) {
    const [settings, _updateSettings] = useSettings()
    const [isInitializing, setIsInitializing] = useState(true)

    const {
        currentComic: [currentComic, _setCurrentComic],
        nextComic: [_nextComic, setNextComic],
    } = useComic()

    useEffect(() => {
        if (settings.values.scrollToTop) {
            window.scrollTo({
                top: 0,
                behavior: 'smooth', // for smoothly scrolling
            })
            let _comic = currentComic
        }
    }, [settings.values.scrollToTop, currentComic])

    const {
        comicDataLoading: [_comicDataLoading, _comicDataComicLoading],
        comicData,
    } = useComicData()

    if (comicData && isInitializing) {
        setIsInitializing(false)
    }

    const comicNo = useMemo(() => {
        if (!currentComic) {
            return initialComic
        } else {
            return currentComic
        }
    }, [currentComic, initialComic])

    let comicLoadingTimeout = useMemo(() => {
        let comicLoadingIndicatorDelay =
            settings.values.comicLoadingIndicatorDelay
        if (comicLoadingIndicatorDelay < 0) {
            comicLoadingIndicatorDelay = 0
        }

        debug(`loading timeout is ${comicLoadingIndicatorDelay}`)
        return comicLoadingIndicatorDelay
    }, [settings.values.comicLoadingIndicatorDelay])

    let [isLoading, doneLoading] = useComicLoaderTimeout(
        currentComic,
        comicLoadingTimeout
    )

    let imageData = useMemo(() => {
        let imageType
        if (comicData?.hasData) {
            imageType = comicData.imageType
        } else {
            imageType = null
        }
        return {
            comicNo: comicData?.comic || null,
            imageType,
        }
    }, [comicData])

    let imageReady = useCallback(() => {
        doneLoading()
        info('Comic data and image loaded.')
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [comicData])
    return (
        <div className="relative">
            <a
                className="qc-ext qc-ext-comic-anchor"
                href={`view.php?comic=${currentComic}`}
                onClick={(e) => {
                    e.preventDefault()
                    setNextComic()
                }}
            >
                <ComicImage
                    imageData={imageData}
                    initialComicSrc={initialComicSrc}
                    initialComic={initialComic}
                    imageReady={imageReady}
                />
            </a>
            <FullPageLoader
                height="h-10"
                width="w-10"
                loadingText={`Loading comic ${comicNo}...`}
                show={!isInitializing && isLoading}
            />
            {/* TODO: Ribbon */}
        </div>
    )
}

function useComicLoaderTimeout(
    currentComic: number | null,
    timeout: number
): [boolean, () => void] {
    const comicLoadingTimeout: React.MutableRefObject<ReturnType<
        typeof setTimeout
    > | null> = useRef(null)
    const [isLoading, __setIsLoading] = useState(false)
    function doneLoading() {
        if (comicLoadingTimeout.current) {
            clearTimeout(comicLoadingTimeout.current)
            comicLoadingTimeout.current = null
        }

        __setIsLoading(false)
    }
    useEffect(() => {
        let _comic = currentComic
        comicLoadingTimeout.current = setTimeout(() => {
            __setIsLoading(true)
            debug('imageLoadingTimeout triggered')
        }, timeout)
        return () => {
            if (comicLoadingTimeout.current) {
                clearTimeout(comicLoadingTimeout.current)
                comicLoadingTimeout.current = null
            }
        }
    }, [currentComic, timeout])

    return [isLoading, doneLoading]
}
