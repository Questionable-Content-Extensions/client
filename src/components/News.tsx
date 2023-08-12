import useComicData from '@hooks/useComicData'

import { debug, nl2br } from '~/utils'

export default function News({ initialNews }: { initialNews: string }) {
    const {
        comicDataLoading: [comicDataLoading, comicDataComicLoading],
        comicData,
    } = useComicData()

    let news
    if (comicDataLoading) {
        news = `Loading news for #${comicDataComicLoading}...`
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
