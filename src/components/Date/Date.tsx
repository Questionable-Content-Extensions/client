import { useMemo } from 'react'
import { ConnectedProps, connect } from 'react-redux'

import InlineSpinner from '@components/InlineSpinner'
import { skipToken } from '@reduxjs/toolkit/dist/query'
import {
    toGetDataQueryArgs,
    useGetComicDataQuery,
} from '@store/api/comicApiSlice'
import { RootState } from '@store/store'

import { formatDate } from '~/utils'

const mapState = (state: RootState) => {
    return {
        settings: state.settings.values,
        currentComic: state.comic.current,
    }
}

const mapDispatch = () => ({})

const connector = connect(mapState, mapDispatch)
type PropsFromRedux = ConnectedProps<typeof connector>
type DateComponentProps = PropsFromRedux & {}

export function DateComponent({ settings, currentComic }: DateComponentProps) {
    const {
        data: comicData,
        isLoading: comicDataLoading,
        isFetching: comicDataFetching,
        isError: comicDataHasError,
    } = useGetComicDataQuery(
        currentComic === 0 || !settings
            ? skipToken
            : toGetDataQueryArgs(currentComic, settings)
    )

    const [date, approximateDate] = useMemo(() => {
        let date = null
        let approximateDate = false
        if (!comicDataLoading && comicData?.hasData) {
            approximateDate = !comicData.isAccuratePublishDate
            if (comicData.publishDate) {
                date = new Date(comicData.publishDate)
            }
        }

        return [date, approximateDate]
    }, [comicData, comicDataLoading])

    const dateTimeString = useMemo(() => {
        const useCorrectTimeFormat = settings?.useCorrectTimeFormat ?? true

        if (date) {
            const dateString = formatDate(date, useCorrectTimeFormat)
            const approximateString =
                date && approximateDate ? ' (Approximately)' : ''
            return `${dateString}${approximateString}`
        } else {
            return null
        }
    }, [date, approximateDate, settings])

    if (!comicDataHasError) {
        return (
            <div className="qc-ext qc-ext-date">
                <div className="media-object">
                    <b>
                        {dateTimeString}
                        {comicDataLoading ? (
                            <>
                                Loading...
                                <span className="inline-block align-middle">
                                    <InlineSpinner />
                                </span>
                            </>
                        ) : comicDataFetching ? (
                            <span className="inline-block align-middle">
                                <InlineSpinner />
                            </span>
                        ) : (
                            <></>
                        )}
                    </b>
                </div>
            </div>
        )
    } else {
        return (
            <div className="qc-ext qc-ext-date">
                <div className="media-object">
                    <b className="text-red-500">Error loading comic data</b>
                </div>
            </div>
        )
    }
}

export default connector(DateComponent)
