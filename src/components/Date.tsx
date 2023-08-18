import { ConnectedProps, connect } from 'react-redux'

import useComicData from '@hooks/useComicData'
import { RootState } from '@store/store'

const mapState = (state: RootState) => {
    return {
        settings: state.settings.values,
    }
}

const mapDispatch = () => ({})

const connector = connect(mapState, mapDispatch)
type PropsFromRedux = ConnectedProps<typeof connector>
type DateComponentProps = PropsFromRedux & {}

function DateComponent({ settings }: DateComponentProps) {
    const {
        comicDataLoading: [comicDataLoading, _comicDataComicLoading],
        comicData,
    } = useComicData()

    let useCorrectTimeFormat
    if (!settings) {
        useCorrectTimeFormat = true
    } else {
        useCorrectTimeFormat = settings.useCorrectTimeFormat
    }

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
