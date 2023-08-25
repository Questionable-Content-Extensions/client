import { useEffect, useMemo, useState } from 'react'
import { ConnectedProps, connect } from 'react-redux'

import ErrorPresenter from '@components/ErrorPresenter'
import ExtraNavigation from '@components/ExtraNavigation/ExtraNavigation'
import FilteredNavigationData from '@components/FilteredNavigationData/FilteredNavigationData'
import { NavElementMode } from '@components/NavElement/NavElement'
import { skipToken } from '@reduxjs/toolkit/dist/query'
import {
    nextComicSelector,
    previousComicSelector,
    toGetDataQueryArgs,
    toGetExcludedQueryArgs,
    useAddItemMutation,
    useGetComicDataQuery,
    useGetExcludedQuery,
    useRemoveItemMutation,
} from '@store/api/comicApiSlice'
import { setCurrentComic, setRandom as setRandomComic } from '@store/comicSlice'
import {
    setShowGoToComicDialog,
    setShowItemDetailsDialogFor,
    setShowSettingsDialog,
} from '@store/dialogSlice'
import { useAppDispatch } from '@store/hooks'
import { AppDispatch, RootState } from '@store/store'

import constants from '~/constants'

import ItemNavigation from './ItemNavigation/ItemNavigation'

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
        setShowGoToComicDialog: (value: boolean) => {
            dispatch(setShowGoToComicDialog(value))
        },
        setShowSettingsDialog: (value: boolean) => {
            dispatch(setShowSettingsDialog(value))
        },
        setShowItemDetailsDialogFor: (value: number | null) => {
            dispatch(setShowItemDetailsDialogFor(value))
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
    setShowGoToComicDialog,
    setShowSettingsDialog,
    setShowItemDetailsDialogFor,
}: QcExtMainWidgetProps) {
    const dispatch = useAppDispatch()

    const {
        data: comicData,
        isFetching: isFetchingComicData,
        isLoading: isLoadingInitialComicData,
        isError: hasErrorLoadingComicData,
        error: comicDataError,
        refetch: refreshComicData,
    } = useGetComicDataQuery(
        currentComic === 0 || !settings
            ? skipToken
            : toGetDataQueryArgs(currentComic, settings)
    )

    const excludedQueryArgs = settings ? toGetExcludedQueryArgs(settings) : null
    const { data: excludedComicData } = useGetExcludedQuery(
        !excludedQueryArgs ||
            !(excludedQueryArgs.skipGuest || excludedQueryArgs.skipNonCanon)
            ? skipToken
            : excludedQueryArgs
    )
    const excludedComics = useMemo(
        () => (excludedComicData ? excludedComicData.map((c) => c.comic) : []),
        [excludedComicData]
    )
    useEffect(() => {
        if (
            randomComic === 0 ||
            randomComic === currentComic ||
            excludedComics.includes(randomComic)
        ) {
            let newRandomComic = currentComic
            while (
                newRandomComic === currentComic ||
                excludedComics.includes(newRandomComic)
            ) {
                newRandomComic = Math.floor(Math.random() * (latestComic + 1))
            }

            dispatch(setRandomComic(newRandomComic))
        }
    }, [dispatch, randomComic, currentComic, excludedComics, latestComic])

    const [addItem, { isLoading: isAddingItem }] = useAddItemMutation()
    const [removeItem, { isLoading: isRemovingItem }] = useRemoveItemMutation()

    const isSaving = isAddingItem || isRemovingItem

    const [comicSelectorNo, setComicSelectorNo] = useState<string | null>(null)
    useEffect(() => {
        if (comicData) {
            setComicSelectorNo(comicData.comic.toString())
        }
    }, [comicData])

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
                onShowGoToComicDialog={() => setShowGoToComicDialog(true)}
            />
            {!settings.editMode && hasErrorLoadingComicData ? (
                <ErrorPresenter error={comicDataError} />
            ) : (
                <></>
            )}
            <ItemNavigation
                itemNavigationData={
                    comicData && comicData.hasData ? comicData.items : []
                }
                isLoading={isLoadingInitialComicData}
                isFetching={isFetchingComicData}
                useColors={settings.useColors}
                onSetCurrentComic={setCurrentComic}
                onShowInfoFor={(item) => setShowItemDetailsDialogFor(item.id)}
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
                        disabled={isFetchingComicData || isSaving}
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
                            (isLoadingInitialComicData ? ' opacity-75' : '')
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
                        disabled={isLoadingInitialComicData}
                    />
                    <button
                        className="bg-qc-header hover:bg-qc-header-second focus:bg-qc-header-second text-white py-2 px-4 rounded-l-none rounded-r-sm disabled:opacity-75"
                        disabled={isFetchingComicData || isSaving}
                        title="Go to selected comic"
                        type="submit"
                    >
                        <i className="fa fa-arrow-right" aria-hidden="true"></i>
                    </button>
                </form>
            </div>
            {settings.showAllMembers || settings.editMode ? (
                <>
                    <hr className="my-4 mx-0 border-solid border-b max-w-none" />
                    {/* TODO: show recent items before all items when in edit mode */}
                    <FilteredNavigationData
                        isLoading={isLoadingInitialComicData}
                        isFetching={isFetchingComicData}
                        itemData={(comicData && comicData.allItems) ?? []}
                        onSetCurrentComic={setCurrentComic}
                        onShowInfoFor={(item) =>
                            setShowItemDetailsDialogFor(item.id)
                        }
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
                        hasError={hasErrorLoadingComicData}
                    />
                </>
            ) : (
                <></>
            )}
        </div>
    )
}

export default connector(QcExtMainWidget)
