import { ConnectedProps, connect } from 'react-redux'

import { skipToken } from '@reduxjs/toolkit/dist/query'
import {
    toGetDataQueryArgs,
    useGetComicDataQuery,
} from '@store/api/comicApiSlice'
import { RootState } from '@store/store'

import { debug, nl2br } from '~/utils'

const mapState = (state: RootState) => {
    return {
        settings: state.settings.values,
        currentComic: state.comic.current,
    }
}

const mapDispatch = () => ({})

const connector = connect(mapState, mapDispatch)
type PropsFromRedux = ConnectedProps<typeof connector>
type NewsProps = PropsFromRedux & { initialNews: string }

function News({ initialNews, settings, currentComic }: NewsProps) {
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

export default connector(News)
