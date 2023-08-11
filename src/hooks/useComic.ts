import { useEffect, useState } from 'react'

import comicService from '../services/comicService'

export type UseComic = {
    currentComic: [number | null, (comic: number) => void]
    setFirstComic: () => void
    previousComic: [number | null, () => void]
    nextComic: [number | null, () => void]
    latestComic: [number | null, () => void]
    randomComic: [number | null, () => void]
}

export default function useComic() {
    const [currentComic, setCurrentComic] = useState<number | null>(
        comicService.current()
    )
    const [previousComic, setPreviousComic] = useState<number | null>(
        comicService.previous()
    )
    const [nextComic, setNextComic] = useState<number | null>(
        comicService.next()
    )
    const [latestComic, setLatestComic] = useState<number | null>(
        comicService.latest()
    )
    const [randomComic, setRandomComic] = useState<number | null>(
        comicService.random()
    )

    useEffect(() => {
        function handleComicChange() {
            setCurrentComic(comicService.current())
            setPreviousComic(comicService.previous())
            setNextComic(comicService.next())
            setLatestComic(comicService.latest())
            setRandomComic(comicService.random())
        }

        comicService.subscribe(handleComicChange)
        return () => {
            comicService.unsubscribe(handleComicChange)
        }
    }, [])

    const useComic: UseComic = {
        currentComic: [currentComic, comicService.setCurrentComic],
        setFirstComic: () => comicService.setCurrentComic(1),
        previousComic: [previousComic, comicService.setPrevious],
        nextComic: [nextComic, comicService.setNext],
        latestComic: [latestComic, comicService.setLatest],
        randomComic: [randomComic, comicService.setRandom],
    }

    return useComic
}
