import { useEffect, useState } from 'react'
import comicDataService, { ComicData } from '../services/comicDataService'

export default function useComicData() {
    let currentlyLoading = comicDataService.currentlyLoading()
    const [comicDataLoading, setComicDataLoading] = useState<
        [boolean, number | null]
    >([currentlyLoading !== null, currentlyLoading])
    const [comicData, setComicData] = useState<ComicData | null>(
        comicDataService.current()
    )

    useEffect(() => {
        function handleComicDataLoading(comic: number) {
            setComicDataLoading([true, comic])
        }
        function handleComicDataLoaded(comicData: ComicData) {
            setComicDataLoading([false, null])
            setComicData(comicData)
        }
        // TODO: Handle errors

        comicDataService.subscribeLoading(handleComicDataLoading)
        comicDataService.subscribeLoaded(handleComicDataLoaded)
        return () => {
            comicDataService.unsubscribeLoading(handleComicDataLoading)
            comicDataService.unsubscribeLoaded(handleComicDataLoaded)
        }
    }, [])

    const useComicData: {
        comicDataLoading: [boolean, number | null]
        comicData: ComicData | null
        refreshComicData: () => void
    } = {
        comicDataLoading,
        comicData,
        refreshComicData: () => comicDataService.refresh(),
    }

    return useComicData
}
