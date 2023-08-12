import { useEffect, useState } from 'react'

import useComic from '../../hooks/useComic'
import useComicData from '../../hooks/useComicData'
import useSettings from '../../hooks/useSettings'
import { debug } from '../../utils'
import ModalDialogSeat from '../Modals/ModalDialogSeat'
import ModalPageOverlay from '../Modals/ModalPageOverlay'
import ModalPortal from '../Modals/ModalPortal'
import ExtraNavigation from './ExtraNavigation'
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
    useEffect(() => {
        if (comicData) {
            setComicSelectorNo(comicData.comic.toString())
        }
    }, [comicData])
    const [showSettingsDialog, setShowSettingsDialog] = useState(false)

    // TODO: Add a setting for placing the widget on the left or right side of the comic.

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
            <div className="bg-stone-100 border-solid shadow-md border-0 border-b border-qc-header xl:fixed xl:top-48 xl:right-[50%] xl:-mr-[620px] xl:w-64 xl:border xl:border-stone-300 z-10 p-2">
                <div className="-mx-2 -mt-2 text-center small-caps text-sm font-thin border-b border-solid border-b-stone-300 border-l-0 border-t-0 border-r-0">
                    Questionable Content Extensions
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
                    onShowInfoFor={(item) =>
                        debug(
                            `TODO: show info about ${item.shortName} (${item.id})`
                        )
                    }
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
                            className="min-w-0 border border-qc-header focus:outline-none flex-auto rounded-none pl-2 disabled:opacity-75"
                            disabled={comicDataLoading}
                        />
                        <button
                            className="bg-qc-header hover:bg-qc-header-second focus:bg-qc-header-second text-white py-2 px-4 rounded-l-none rounded-r-sm disabled:opacity-75"
                            onClick={() => {
                                if (
                                    comicSelectorNo &&
                                    /^\d+$/.test(comicSelectorNo)
                                ) {
                                    const comicNo = Number(comicSelectorNo)
                                    if (
                                        comicNo >= 1 &&
                                        comicNo <= (latestComic as number)
                                    ) {
                                        setCurrentComic(comicNo)
                                    }
                                }
                            }}
                            disabled={comicDataLoading}
                        >
                            <i
                                className="fa fa-arrow-right"
                                aria-hidden="true"
                            ></i>
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}
