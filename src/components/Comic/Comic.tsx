import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import useLockedItem from '@hooks/useLockedItem'
import { skipToken } from '@reduxjs/toolkit/dist/query'
import {
    nextComicSelector,
    toGetDataQueryArgs,
    useGetComicDataQuery,
} from '@store/api/comicApiSlice'
import { setCurrentComic } from '@store/comicSlice'
import { useAppDispatch, useAppSelector } from '@store/hooks'

import { debug, info } from '~/utils'

import FullPageLoader from '../FullPageLoader'
import ComicImage from './ComicImage/ComicImage'
import ComicRibbon, { RibbonType } from './ComicRibbon/ComicRibbon'

export default function Comic({
    initialComic,
    initialComicSrc,
}: {
    initialComic: number
    initialComicSrc: string
}) {
    const dispatch = useAppDispatch()

    const settings = useAppSelector((state) => state.settings.values)

    const currentComic = useAppSelector((state) => state.comic.current)
    const nextComic = useAppSelector((s) => nextComicSelector(s))
    const lockedToItem = useAppSelector((state) => state.comic.lockedToItem)

    const [isInitializing, setIsInitializing] = useState(true)

    const { data: comicData, isError: hasComicDataError } =
        useGetComicDataQuery(
            currentComic === 0 || !settings
                ? skipToken
                : toGetDataQueryArgs(currentComic, settings)
        )

    const { hasLockedItem, lockedItem } = useLockedItem(
        currentComic,
        settings,
        lockedToItem
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
                href={`view.php?comic=${
                    hasLockedItem
                        ? lockedItem.next
                            ? lockedItem.next
                            : currentComic
                        : nextComic
                }`}
                onClick={(e) => {
                    e.preventDefault()
                    if (hasLockedItem && lockedItem.next) {
                        dispatch(
                            setCurrentComic(lockedItem.next, { locked: true })
                        )
                    } else {
                        if (nextComic) {
                            dispatch(setCurrentComic(nextComic))
                        }
                    }
                }}
            >
                <ComicImage
                    imageData={imageData}
                    initialComicSrc={initialComicSrc}
                    initialComic={initialComic}
                    imageReady={imageReady}
                    tagline={
                        settings?.showTaglineAsTooltip && comicData?.hasData
                            ? comicData.tagline
                            : null
                    }
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

function useComicLoaderTimeout(
    nextComic: number | null,
    timeout: number
): [boolean, () => void] {
    const [currentComic, setCurrentComic] = useState(nextComic)
    if (currentComic !== nextComic) {
        setCurrentComic(nextComic)
    }

    const comicLoadingTimeoutId: React.MutableRefObject<ReturnType<
        typeof setTimeout
    > | null> = useRef(null)
    const [isLoading, setIsLoading] = useState(false)
    const doneLoading = useCallback(function () {
        if (comicLoadingTimeoutId.current) {
            clearTimeout(comicLoadingTimeoutId.current)
            comicLoadingTimeoutId.current = null
        }

        setIsLoading(false)
    }, [])
    useEffect(() => {
        // I do this just to make the effect "need" the value as a dependency;
        // it's not actually used at all here.
        let _comic = currentComic
        debug('Starting imageLoadingTimeout...')
        comicLoadingTimeoutId.current = setTimeout(() => {
            setIsLoading(true)
            debug('...imageLoadingTimeout triggered')
        }, timeout)
        return () => {
            if (comicLoadingTimeoutId.current) {
                clearTimeout(comicLoadingTimeoutId.current)
                comicLoadingTimeoutId.current = null
            }
        }

        // It's really frowned upon in the React community to not use
        // an exhaustive dependency array, but by leaving `timeout` out
        // of it, it behaves exactly like it should, and trying to re-create
        // that behavior manually adds a lot of extra unnecessary complexity,
        // so I've made an executive decision to override this lint in this
        // particular instance.
        //
        // If you find yourself needing to edit this hook later, disable this
        // lint override momentarily to make sure you don't miss any other
        // potential dependency issues.
        //
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentComic /* , timeout */])

    return [isLoading, doneLoading]
}
