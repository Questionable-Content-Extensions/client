import { skipToken } from '@reduxjs/toolkit/dist/query'
import {
    toGetDataQueryArgs,
    useGetComicDataQuery,
} from '@store/api/comicApiSlice'
import { useAppSelector } from '@store/hooks'

import { debug, nl2br } from '~/utils'

export default function News({ initialNews }: { initialNews: string }) {
    const settings = useAppSelector((state) => state.settings.values)

    const currentComic = useAppSelector((state) => state.comic.current)

    const { data: comicData, isFetching: comicDataLoading } =
        useGetComicDataQuery(
            currentComic === 0 || !settings
                ? skipToken
                : toGetDataQueryArgs(currentComic, settings)
        )

    let news
    if (comicDataLoading) {
        news = `Loading news for comic ${currentComic}...`
    } else if (comicData) {
        if (comicData.hasData && comicData.news !== null) {
            news = nl2br(comicData.news)
        } else {
            news = ''
        }
    } else {
        debug(
            'Comic data not yet initialized, using `initialNews` in the meantime'
        )
        news = initialNews
    }

    return (
        <div
            id="news"
            className="qc-ext qc-ext-news"
            dangerouslySetInnerHTML={{ __html: news }}
        ></div>
    )
}
