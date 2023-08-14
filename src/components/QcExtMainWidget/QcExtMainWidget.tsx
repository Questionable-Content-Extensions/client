import { useEffect, useMemo, useState } from 'react'

import useComic from '@hooks/useComic'
import useComicData from '@hooks/useComicData'
import useSettings from '@hooks/useSettings'
import ModalDialogSeat from '@modals/ModalDialogSeat'
import ModalPageOverlay from '@modals/ModalPageOverlay'
import ModalPortal from '@modals/ModalPortal'
import { ItemNavigationData } from '@models/ComicData'

import constants from '~/constants'
import { debug } from '~/utils'

import ExtraNavigation from './ExtraNavigation'
import ItemDetailsDialog from './ItemDetailsDialog'
import ItemNavigation from './ItemNavigation'
import SettingsDialog from './SettingsDialog'

export default function QcExtMainWidget() {
    const [settings, _updateSettings] = useSettings()
    const {
        setFirstComic,
        previousComic: [previousComic, setPreviousComic],
        currentComic: [currentComic, setCurrentComic],
        nextComic: [nextComic, setNextComic],
        latestComic: [latestComic, setLatestComic],
        randomComic: [randomComic, setRandomComic],
    } = useComic()
    const {
        comicDataLoading: [comicDataLoading, _comicDataComicLoading],
        comicData,
        refreshComicData,
    } = useComicData()

    const [comicSelectorNo, setComicSelectorNo] = useState<string | null>(null)
    const [refreshCheckNeeded, setRefreshCheckNeeded] = useState(true)
    useEffect(() => {
        if (comicData) {
            setComicSelectorNo(comicData.comic.toString())
            setRefreshCheckNeeded(true)
        }
    }, [comicData])
    const [showSettingsDialog, setShowSettingsDialog] = useState(false)
    const [showInfoItem, setShowInfoItem] = useState<ItemNavigationData | null>(
        null
    )
    const developmentMode = useMemo(
        () =>
            constants.developmentMode ? (
                <>
                    <br />
                    <span
                        className="text-xs text-red-600"
                        title={`Server endpoint is ${constants.webserviceBaseUrl}`}
                    >
                        (Development Mode)
                    </span>
                </>
            ) : (
                <></>
            ),
        []
    )
    useEffect(() => {
        if (!refreshCheckNeeded) {
            return
        }

        // We need to reload the comic data *if* `showAllMembers` was enabled
        // and the currently loaded comic data does not have it
        if (
            settings.showAllMembers &&
            comicData?.hasData &&
            !comicData.allItems
        ) {
            setRefreshCheckNeeded(false)

            debug(
                'Refreshing comic data because `showAllMembers` was enabled ' +
                    "when it previously wasn't"
            )
            refreshComicData()
        }
    }, [
        settings,
        comicData?.hasData,
        comicData?.allItems,
        refreshComicData,
        refreshCheckNeeded,
    ])
    const [filter, setFilter] = useState('')
    const [activeFilter, setActiveFilter] = useState('')
    useEffect(() => {
        let filterDebounceTimeout: ReturnType<typeof setTimeout> | null =
            setTimeout(() => {
                setActiveFilter(filter)
                filterDebounceTimeout = null
            }, 500)
        return () => {
            if (filterDebounceTimeout !== null) {
                clearTimeout(filterDebounceTimeout)
                filterDebounceTimeout = null
            }
        }
    }, [filter])

    // TODO: Add a setting for placing the widget on the left or right side of the comic.

    function goToSelectorComic() {
        if (comicSelectorNo && /^\d+$/.test(comicSelectorNo)) {
            const comicNo = Number(comicSelectorNo)
            if (comicNo >= 1 && comicNo <= (latestComic as number)) {
                setCurrentComic(comicNo)
            }
        }
    }

    return (
        <>
            <ModalPortal>
                <>
                    <ModalPageOverlay show={showSettingsDialog} />
                    <ModalDialogSeat
                        show={showSettingsDialog}
                        onClick={() => setShowSettingsDialog(false)}
                    >
                        <SettingsDialog
                            show={showSettingsDialog}
                            onClose={() => setShowSettingsDialog(false)}
                        />
                    </ModalDialogSeat>
                </>
            </ModalPortal>
            <ModalPortal>
                <>
                    <ModalPageOverlay show={showInfoItem !== null} />
                    <ModalDialogSeat
                        show={showInfoItem !== null}
                        onClick={() => setShowInfoItem(null)}
                    >
                        <ItemDetailsDialog
                            initialItemId={showInfoItem?.id ?? null}
                            onClose={() => setShowInfoItem(null)}
                        />
                    </ModalDialogSeat>
                </>
            </ModalPortal>
            <div className="bg-stone-100 border-solid shadow-md border-0 border-b border-qc-header xl:fixed xl:top-48 xl:right-[50%] xl:-mr-[620px] xl:w-64 xl:border xl:border-stone-300 z-10 p-2">
                <div className="-mx-2 -mt-2 text-center small-caps text-sm font-thin border-b border-solid border-b-stone-300 border-l-0 border-t-0 border-r-0">
                    Questionable Content Extensions {developmentMode}
                </div>
                <ExtraNavigation
                    currentComic={currentComic}
                    onSetFirstComic={setFirstComic}
                    previousComic={previousComic}
                    onSetPreviousComic={setPreviousComic}
                    nextComic={nextComic}
                    onSetNextComic={setNextComic}
                    latestComic={latestComic}
                    onSetLatestComic={setLatestComic}
                    randomComic={randomComic}
                    onSetRandomComic={setRandomComic}
                />
                {/* TODO: Fix navigation not showing `allItems` */}
                <ItemNavigation
                    itemNavigationData={
                        comicData && comicData.hasData ? comicData.items : []
                    }
                    isLoading={comicDataLoading}
                    useColors={settings.useColors}
                    onSetCurrentComic={setCurrentComic}
                    onShowInfoFor={setShowInfoItem}
                />
                <hr className="my-4 mx-0 border-solid border-b max-w-none" />
                <div className="grid grid-rows-2 space-y-1">
                    <div className="grid grid-cols-2 space-x-1">
                        <button
                            className="bg-qc-header hover:bg-qc-header-second focus:bg-qc-header-second text-white py-2 rounded-sm disabled:opacity-75"
                            onClick={() => refreshComicData()}
                            disabled={comicDataLoading}
                        >
                            Refresh
                        </button>
                        <button
                            className="bg-qc-header hover:bg-qc-header-second focus:bg-qc-header-second text-white py-2 rounded-sm"
                            onClick={() => setShowSettingsDialog(true)}
                        >
                            Settings
                        </button>
                    </div>
                    <div className="flex min-w-0">
                        <label
                            title="Comic #"
                            htmlFor="qc-ext-extra-navigation-comic"
                            className={
                                `bg-qc-header text-white py-2 px-4 flex-initial rounded-l-sm rounded-r-none` +
                                (comicDataLoading ? ' opacity-75' : '')
                            }
                        >
                            #
                        </label>
                        <input
                            id="qc-ext-extra-navigation-comic"
                            type="number"
                            placeholder="Comic #"
                            min={1}
                            max={latestComic ?? 1}
                            value={comicSelectorNo ?? ''}
                            onChange={(e) => setComicSelectorNo(e.target.value)}
                            onKeyPress={(e) => {
                                if (e.code === 'Enter') {
                                    goToSelectorComic()
                                }
                            }}
                            className="min-w-0 border border-qc-header focus:outline-none flex-auto rounded-none pl-2 disabled:opacity-75"
                            disabled={comicDataLoading}
                        />
                        <button
                            className="bg-qc-header hover:bg-qc-header-second focus:bg-qc-header-second text-white py-2 px-4 rounded-l-none rounded-r-sm disabled:opacity-75"
                            onClick={goToSelectorComic}
                            disabled={comicDataLoading}
                            title="Go to selected comic"
                        >
                            <i
                                className="fa fa-arrow-right"
                                aria-hidden="true"
                            ></i>
                        </button>
                    </div>
                </div>
                {settings.showAllMembers ? (
                    <>
                        <hr className="my-4 mx-0 border-solid border-b max-w-none" />
                        <input
                            type="text"
                            placeholder="Filter non-present"
                            title="The value entered here filters the non-present members by their name or abbreviated name"
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            className="w-full border border-qc-header focus:outline-none flex-auto rounded-none pl-2 disabled:opacity-75"
                            disabled={comicDataLoading}
                        />
                        <div className="max-h-[20em] overflow-y-auto overflow-x-hidden">
                            <ItemNavigation
                                itemNavigationData={
                                    comicData && comicData.hasData
                                        ? filterItems(
                                              comicData.allItems ?? [],
                                              activeFilter
                                          )
                                        : []
                                }
                                isLoading={false}
                                useColors={settings.useColors}
                                onSetCurrentComic={setCurrentComic}
                                onShowInfoFor={setShowInfoItem}
                                isAllItems
                            />
                        </div>
                    </>
                ) : (
                    <></>
                )}
            </div>
        </>
    )
}

function filterItems(allItems: ItemNavigationData[], filter: string) {
    return allItems.filter(
        (i) =>
            i.shortName.toUpperCase().indexOf(filter.toUpperCase()) !== -1 ||
            i.name.toUpperCase().indexOf(filter.toUpperCase()) !== -1
    )
}
