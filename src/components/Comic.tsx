import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { ConnectedProps, connect } from 'react-redux'

import { skipToken } from '@reduxjs/toolkit/dist/query'
import {
    nextComicSelector,
    toGetDataQueryArgs,
    useGetDataQuery,
} from '@store/api/comicApiSlice'
import { setCurrentComic } from '@store/comicSlice'
import { AppDispatch, RootState } from '@store/store'

import { debug, info } from '~/utils'

import ComicImage from './ComicImage'
import ComicRibbon, { RibbonType } from './ComicRibbon'
import FullPageLoader from './FullPageLoader'

const mapState = (state: RootState) => {
    return {
        settings: state.settings.values,
        currentComic: state.comic.current,
        nextComic: nextComicSelector(state),
    }
}

const mapDispatch = (dispatch: AppDispatch) => {
    return {
        setCurrentComic: (comic: number) => {
            dispatch(setCurrentComic(comic))
        },
    }
}

const connector = connect(mapState, mapDispatch)
type PropsFromRedux = ConnectedProps<typeof connector>
type ComicProps = PropsFromRedux & {
    initialComic: number
    initialComicSrc: string
}

function Comic({
    initialComic,
    initialComicSrc,
    settings,
    currentComic,
    nextComic,
    setCurrentComic,
}: ComicProps) {
    const [isInitializing, setIsInitializing] = useState(true)

    const { data: comicData, isError: hasComicDataError } = useGetDataQuery(
        currentComic === 0 || !settings
            ? skipToken
            : toGetDataQueryArgs(currentComic, settings)
    )

    useEffect(() => {
        if (settings?.scrollToTop ?? true) {
            window.scrollTo({
                top: 0,
                behavior: 'smooth', // for smoothly scrolling
            })
            let _comic = currentComic
        }
    }, [settings?.scrollToTop, currentComic])

    useEffect(() => {
        if (comicData && isInitializing) {
            setIsInitializing(false)
        }
    }, [comicData, isInitializing, setIsInitializing])

    const comicNo = useMemo(() => {
        if (!currentComic) {
            return initialComic
        } else {
            return currentComic
        }
    }, [currentComic, initialComic])

    let comicLoadingTimeout = useMemo(() => {
        let comicLoadingIndicatorDelay =
            settings?.comicLoadingIndicatorDelay ?? 0
        if (comicLoadingIndicatorDelay < 0) {
            comicLoadingIndicatorDelay = 0
        }

        debug(`loading timeout is ${comicLoadingIndicatorDelay}`)
        return comicLoadingIndicatorDelay
    }, [settings?.comicLoadingIndicatorDelay])

    let [loadingTimedOut, doneLoadingWithTimeout] = useComicLoaderTimeout(
        currentComic,
        comicLoadingTimeout
    )

    let imageData = useMemo(() => {
        if (!hasComicDataError) {
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
        } else {
            return { comicNo, imageType: null }
        }
    }, [comicData, hasComicDataError, comicNo])

    let imageReady = useCallback(() => {
        const _comicData = comicData
        doneLoadingWithTimeout()
        info('Comic image loaded.')
    }, [comicData, doneLoadingWithTimeout])

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
                    if (nextComic) {
                        setCurrentComic(nextComic)
                    }
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
                show={!isInitializing && loadingTimedOut}
            />
            <ComicRibbon
                ribbonType={ribbonType}
                show={settings?.showIndicatorRibbon ?? true}
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
