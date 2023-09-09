import { useEffect, useMemo, useState } from 'react'
import { ConnectedProps, connect } from 'react-redux'

import Button from '@components/Button'
import ErrorPresenter from '@components/ErrorPresenter'
import ExtraNavigation from '@components/ExtraNavigation/ExtraNavigation'
import FilteredNavigationData from '@components/FilteredNavigationData/FilteredNavigationData'
import { NavElementMode } from '@components/NavElement/NavElement'
import useHydratedItemData from '@hooks/useHydratedItemData'
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
    setShowChangeLogDialog,
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
        setShowChangeLogDialog: (value: boolean) => {
            dispatch(setShowChangeLogDialog(value))
        },
    }
}

const connector = connect(mapState, mapDispatch)
type PropsFromRedux = ConnectedProps<typeof connector>
type QcExtMainWidgetProps = PropsFromRedux & {}

function ComicDetailsPanel({
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
    setShowChangeLogDialog,
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

    const {
        comicItems,
        allItems,
        isLoading: isLoadingInitialItemData,
        isFetching: isFetchingItemData,
        isError: hasErrorLoadingItemData,
        refetch: refreshItemData,
    } = useHydratedItemData(currentComic, settings)

    const isLoadingInitial =
        isLoadingInitialComicData || isLoadingInitialItemData
    const isFetching = isFetchingComicData || isFetchingItemData

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

    const installUpdate = useMemo(() => {
        const isNew = !!settings && !settings.version
        const isUpdated =
            !!settings &&
            !!settings.version &&
            settings.version !== constants.scriptVersion

        if (isNew) {
            return (
                <>
                    <h1 className="text-xs">Welcome!</h1>
                    <button
                        className="inline-block qc-ext-qc-link hover:underline"
                        onClick={() => setShowChangeLogDialog(true)}
                    >
                        See our change log to remove this welcome message!
                    </button>
                </>
            )
        } else if (isUpdated) {
            return (
                <>
                    <h1 className="text-xs">Updated!</h1>
                    <button
                        className="inline-block qc-ext-qc-link hover:underline"
                        onClick={() => setShowChangeLogDialog(true)}
                    >
                        See what's new!
                    </button>
                </>
            )
        }

        return <></>
    }, [settings, setShowChangeLogDialog])

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
                {installUpdate}
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
                currentComic={currentComic}
                itemNavigationData={comicItems ?? []}
                isLoading={isLoadingInitial}
                isFetching={isFetching}
                useColors={settings.useColors}
                onSetCurrentComic={setCurrentComic}
                onShowInfoFor={setShowItemDetailsDialogFor}
                mode={NavElementMode.Present}
                editMode={settings.editMode}
                onRemoveItem={(itemId) => {
                    removeItem({
                        editModeToken: settings.editModeToken,
                        comicId: currentComic,
                        itemId,
                    })
                }}
            />
            <hr className="my-4 mx-0 border-solid border-b max-w-none" />
            <div className="grid grid-rows-2 space-y-1">
                <div className="grid grid-cols-2 space-x-1">
                    <Button
                        className="py-2"
                        onClick={() => {
                            refreshComicData()
                            if (hasErrorLoadingItemData) {
                                refreshItemData()
                            }
                        }}
                        disabled={isFetching || isSaving}
                    >
                        Refresh
                    </Button>
                    <Button
                        className="py-2"
                        onClick={() => setShowSettingsDialog(true)}
                    >
                        Settings
                    </Button>
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
                            (isLoadingInitial ? ' opacity-75' : '')
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
                        disabled={isLoadingInitial}
                    />
                    <Button
                        className="py-2 px-4 rounded-l-none"
                        disabled={isFetching || isSaving}
                        title="Go to selected comic"
                        type="submit"
                    >
                        <i className="fa fa-arrow-right" aria-hidden="true"></i>
                    </Button>
                </form>
            </div>
            {settings.showAllMembers || settings.editMode ? (
                <>
                    <hr className="my-4 mx-0 border-solid border-b max-w-none" />
                    <FilteredNavigationData
                        currentComic={currentComic}
                        isLoading={isLoadingInitial}
                        isFetching={isFetching}
                        isSaving={isSaving}
                        itemData={allItems ?? []}
                        onSetCurrentComic={setCurrentComic}
                        onShowInfoFor={setShowItemDetailsDialogFor}
                        useColors={settings.useColors}
                        editMode={settings.editMode}
                        onAddItem={(itemBody) => {
                            addItem({
                                token: settings.editModeToken,
                                comicId: currentComic,
                                ...itemBody,
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

export default connector(ComicDetailsPanel)
