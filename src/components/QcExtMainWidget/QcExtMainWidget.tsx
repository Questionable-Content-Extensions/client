import { useEffect, useMemo, useState } from 'react'
import { ConnectedProps, connect } from 'react-redux'

import ModalDialogSeat from '@modals/ModalDialogSeat'
import ModalPageOverlay from '@modals/ModalPageOverlay'
import ModalPortal from '@modals/ModalPortal'
import { ItemNavigationData } from '@models/ItemNavigationData'
import { skipToken } from '@reduxjs/toolkit/dist/query'
import {
    nextComicSelector,
    previousComicSelector,
    toGetDataQueryArgs,
    useAddItemMutation,
    useGetDataQuery,
    useRemoveItemMutation,
} from '@store/api/comicApiSlice'
import { setCurrentComic } from '@store/comicSlice'
import { AppDispatch, RootState } from '@store/store'
import FilteredNavigationData from '@widgets/FilteredNavigationData'

import constants from '~/constants'

import ExtraNavigation from './ExtraNavigation'
import ItemDetailsDialog from './ItemDetailsDialog'
import ItemNavigation from './ItemNavigation'
import { NavElementMode } from './NavElement'
import SettingsDialog from './SettingsDialog'

const mapState = (state: RootState) => {
    return {
        settings: state.settings.values,
        currentComic: state.comic.current,
        latestComic: state.comic.latest,
        randomComic: state.comic.random,
        previousComic: previousComicSelector(state),
        nextComic: nextComicSelector(state),
    }
}

const mapDispatch = (dispatch: AppDispatch) => {
    return {
        setCurrentComic: (comic: number) => {
            dispatch(setCurrentComic(comic))
        },
    }
}

const connector = connect(mapState, mapDispatch)
type PropsFromRedux = ConnectedProps<typeof connector>
type QcExtMainWidgetProps = PropsFromRedux & {}

function QcExtMainWidget({
    settings,
    currentComic,
    latestComic,
    randomComic,
    previousComic,
    nextComic,
    setCurrentComic,
}: QcExtMainWidgetProps) {
    const {
        data: comicData,
        isFetching: isFetchingComicData,
        refetch: refreshComicData,
    } = useGetDataQuery(
        currentComic === 0 || !settings
            ? skipToken
            : toGetDataQueryArgs(currentComic, settings)
    )

    const [addItem, { isLoading: isAddingItem }] = useAddItemMutation()
    const [removeItem, { isLoading: isRemovingItem }] = useRemoveItemMutation()

    const isLoading = isFetchingComicData || isAddingItem || isRemovingItem

    const [comicSelectorNo, setComicSelectorNo] = useState<string | null>(null)
    //const [refreshCheckNeeded, setRefreshCheckNeeded] = useState(true)
    useEffect(() => {
        if (comicData) {
            setComicSelectorNo(comicData.comic.toString())
            //setRefreshCheckNeeded(true)
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

    // TODO: Add a setting for placing the widget on the left or right side of the comic.

    function goToSelectorComic() {
        if (comicSelectorNo && /^\d+$/.test(comicSelectorNo)) {
            const comicNo = Number(comicSelectorNo)
            if (comicNo >= 1 && comicNo <= (latestComic as number)) {
                setCurrentComic(comicNo)
            }
        }
    }

    if (!settings) {
        return <></>
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
            <div
                className={
                    'bg-stone-100 border-solid border-0 border-b border-qc-header lg:border lg:border-stone-300 ' +
                    'shadow-md lg:fixed lg:top-20 xl:top-48 lg:right-[50%] lg:-mr-[620px] lg:w-64 z-10 p-2 lg:max-h-[calc(100vh-5rem)] xl:max-h-[calc(100vh-12rem)] lg:overflow-y-auto'
                }
            >
                <h1 className="-mx-2 -mt-2 mb-0 text-center small-caps text-sm font-thin border-b border-solid border-b-stone-300 border-l-0 border-t-0 border-r-0">
                    Questionable Content Extensions {developmentMode}
                </h1>
                <ExtraNavigation
                    currentComic={currentComic}
                    onSetFirstComic={() => setCurrentComic(1)}
                    previousComic={previousComic}
                    onSetPreviousComic={() => setCurrentComic(previousComic)}
                    nextComic={nextComic}
                    onSetNextComic={() => setCurrentComic(nextComic)}
                    latestComic={latestComic}
                    onSetLatestComic={() => setCurrentComic(latestComic)}
                    randomComic={randomComic}
                    onSetRandomComic={() => setCurrentComic(randomComic)}
                />
                <ItemNavigation
                    itemNavigationData={
                        comicData && comicData.hasData ? comicData.items : []
                    }
                    isLoading={isLoading}
                    useColors={settings.useColors}
                    onSetCurrentComic={setCurrentComic}
                    onShowInfoFor={setShowInfoItem}
                    mode={NavElementMode.Present}
                    editMode={settings.editMode}
                    onRemoveItem={(item) => {
                        removeItem({
                            editModeToken: settings.editModeToken,
                            comicId: currentComic,
                            itemId: item.id,
                        })
                    }}
                />
                <hr className="my-4 mx-0 border-solid border-b max-w-none" />
                <div className="grid grid-rows-2 space-y-1">
                    <div className="grid grid-cols-2 space-x-1">
                        <button
                            className="bg-qc-header hover:bg-qc-header-second focus:bg-qc-header-second text-white py-2 rounded-sm disabled:opacity-75"
                            onClick={() => refreshComicData()}
                            disabled={isLoading}
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
                    <form
                        className="flex min-w-0"
                        onSubmit={(e) => {
                            e.preventDefault()
                            goToSelectorComic()
                        }}
                    >
                        <label
                            title="Comic #"
                            htmlFor="qc-ext-extra-navigation-comic"
                            className={
                                `bg-qc-header text-white py-2 px-4 flex-initial rounded-l-sm rounded-r-none` +
                                (isLoading ? ' opacity-75' : '')
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
                            disabled={isLoading}
                        />
                        <button
                            className="bg-qc-header hover:bg-qc-header-second focus:bg-qc-header-second text-white py-2 px-4 rounded-l-none rounded-r-sm disabled:opacity-75"
                            disabled={isLoading}
                            title="Go to selected comic"
                            type="submit"
                        >
                            <i
                                className="fa fa-arrow-right"
                                aria-hidden="true"
                            ></i>
                        </button>
                    </form>
                </div>
                {settings.showAllMembers ?? false ? (
                    <>
                        <hr className="my-4 mx-0 border-solid border-b max-w-none" />
                        <FilteredNavigationData
                            isLoading={isLoading}
                            itemData={(comicData && comicData.allItems) ?? []}
                            onSetCurrentComic={setCurrentComic}
                            onShowInfoFor={setShowInfoItem}
                            useColors={settings.useColors}
                            editMode={settings.editMode}
                            onAddItem={(item) => {
                                addItem({
                                    editModeToken: settings.editModeToken,
                                    comicId: currentComic,
                                    newItem: false,
                                    itemId: item.id,
                                })
                            }}
                        />
                    </>
                ) : (
                    <></>
                )}
            </div>
        </>
    )
}

export default connector(QcExtMainWidget)
