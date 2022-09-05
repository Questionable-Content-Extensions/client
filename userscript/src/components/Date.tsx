import { useEffect, useState } from 'react'
import useComicData from '../hooks/useComicData'
import Settings from '../settings'

export default function DateComponent() {
    const {
        comicDataLoading: [comicDataLoading, _comicDataComicLoading],
        comicData,
    } = useComicData()

    const [settings, setSettings] = useState<Settings>()
    useEffect(() => {
        async function loadSavedSettings() {
            setSettings(await Settings.loadSettings())
        }
        loadSavedSettings()
    })
    let useCorrectTimeFormat
    if (!settings) {
        useCorrectTimeFormat = true
    } else {
        useCorrectTimeFormat = settings.values.useCorrectTimeFormat
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
                    {approximateDate ? '(Approximately)' : <></>}
                </b>
            </div>
        </div>
    )
}
