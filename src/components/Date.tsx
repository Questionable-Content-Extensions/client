import { ConnectedProps, connect } from 'react-redux'

import { skipToken } from '@reduxjs/toolkit/dist/query'
import { toGetDataQueryArgs, useGetDataQuery } from '@store/api/comicApiSlice'
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
type DateComponentProps = PropsFromRedux & {}

function DateComponent({ settings, currentComic }: DateComponentProps) {
    const { data: comicData, isFetching: comicDataLoading } = useGetDataQuery(
        currentComic === 0 || !settings
            ? skipToken
            : toGetDataQueryArgs(currentComic, settings)
    )

    const useCorrectTimeFormat = settings?.useCorrectTimeFormat ?? true

    let date
    let approximateDate
    if (comicDataLoading || !comicData?.hasData) {
        date = null
        approximateDate = false
    } else if (comicData?.hasData) {
        approximateDate = !comicData.isAccuratePublishDate
        if (comicData.publishDate) {
            date = new Date(comicData.publishDate)
        } else {
            date = null
        }
    }

    var dateOptions = {
        weekday: 'long' as const,
        day: 'numeric' as const,
        month: 'long' as const,
        year: 'numeric' as const,
    }
    var timeOptions = {
        hour: useCorrectTimeFormat
            ? ('2-digit' as const)
            : ('numeric' as const),
        hour12: !useCorrectTimeFormat,
        minute: '2-digit' as const,
    }

    return (
        <div className="qc-ext qc-ext-date">
            <div className="media-object">
                <b>
                    {date ? (
                        new Intl.DateTimeFormat('en-US', dateOptions).format(
                            date
                        )
                    ) : (
                        <>&nbsp;</>
                    )}{' '}
                    {date ? (
                        new Intl.DateTimeFormat('en-US', timeOptions).format(
                            date
                        )
                    ) : (
                        <></>
                    )}{' '}
                    {date && approximateDate ? '(Approximately)' : <></>}
                </b>
            </div>
        </div>
    )
}

export default connector(DateComponent)
