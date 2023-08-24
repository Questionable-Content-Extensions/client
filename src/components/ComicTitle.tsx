import { useEffect } from 'react'
import { ConnectedProps, connect } from 'react-redux'

import { skipToken } from '@reduxjs/toolkit/dist/query'
import {
    toGetDataQueryArgs,
    useGetComicDataQuery,
} from '@store/api/comicApiSlice'
import { RootState } from '@store/store'

const mapState = (state: RootState) => {
    return {
        settings: state.settings.values,
        currentComic: state.comic.current,
    }
}

const mapDispatch = () => ({})

const connector = connect(mapState, mapDispatch)
type PropsFromRedux = ConnectedProps<typeof connector>
type ComicProps = PropsFromRedux & {}

function ComicTitle({ settings, currentComic }: ComicProps) {
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

export default connector(ComicTitle)
