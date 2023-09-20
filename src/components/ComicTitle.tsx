import { useEffect } from 'react'

import { skipToken } from '@reduxjs/toolkit/dist/query'
import {
    toGetDataQueryArgs,
    useGetComicDataQuery,
} from '@store/api/comicApiSlice'
import { useAppSelector } from '@store/hooks'

export default function ComicTitle() {
    const settings = useAppSelector((state) => state.settings.values)

    const currentComic = useAppSelector((state) => state.comic.current)

    const { data: comicData } = useGetComicDataQuery(
        currentComic === 0 || !settings
            ? skipToken
            : toGetDataQueryArgs(currentComic, settings)
    )

    useEffect(() => {
        if (comicData && comicData.hasData && comicData.title) {
            document.title = `#${comicData.comic}: ${comicData.title} — Questionable Content`
        } else {
            document.title = `#${currentComic} — Questionable Content`
        }
    }, [comicData, currentComic])

    return <></>
}
