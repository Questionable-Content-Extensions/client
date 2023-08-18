import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { ConnectedProps, connect } from 'react-redux'

import useComic from '@hooks/useComic'
import useComicData from '@hooks/useComicData'
import { RootState } from '@store/store'

import { debug, info } from '~/utils'

import ComicImage from './ComicImage'
import ComicRibbon, { RibbonType } from './ComicRibbon'
import FullPageLoader from './FullPageLoader'

const mapState = (state: RootState) => {
    return {
        settings: state.settings.values,
    }
}

const mapDispatch = () => ({})

const connector = connect(mapState, mapDispatch)
type PropsFromRedux = ConnectedProps<typeof connector>
type ComicProps = PropsFromRedux & {
    initialComic: number
    initialComicSrc: string
}

function Comic({ initialComic, initialComicSrc, settings }: ComicProps) {
    const [isInitializing, setIsInitializing] = useState(true)

    const {
        currentComic: [currentComic, _setCurrentComic],
        nextComic: [_nextComic, setNextComic],
    } = useComic()

    useEffect(() => {
        if (settings.scrollToTop) {
            window.scrollTo({
                top: 0,
                behavior: 'smooth', // for smoothly scrolling
            })
            let _comic = currentComic
        }
    }, [settings.scrollToTop, currentComic])

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
        let comicLoadingIndicatorDelay = settings.comicLoadingIndicatorDelay
        if (comicLoadingIndicatorDelay < 0) {
            comicLoadingIndicatorDelay = 0
        }

        debug(`loading timeout is ${comicLoadingIndicatorDelay}`)
        return comicLoadingIndicatorDelay
    }, [settings.comicLoadingIndicatorDelay])

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

    let ribbonType = RibbonType.None
    if (comicData?.hasData) {
        if (comicData.isGuestComic) {
            ribbonType = RibbonType.GuestComic
        } else if (comicData.isNonCanon) {
            ribbonType = RibbonType.NonCanon
        }
    }
    return (
        <div className="relative inline-block">
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
            <ComicRibbon
                ribbonType={ribbonType}
                show={settings.showIndicatorRibbon}
            />
        </div>
    )
}

export default connector(Comic)

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
