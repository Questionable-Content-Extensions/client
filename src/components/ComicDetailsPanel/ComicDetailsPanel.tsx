import { useEffect, useMemo, useState } from 'react'

import Button from '@components/Button'
import ErrorPresenter from '@components/ErrorPresenter'
import ExtraNavigation from '@components/ExtraNavigation/ExtraNavigation'
import FilteredNavigationData from '@components/FilteredNavigationData/FilteredNavigationData'
import { NavElementMode } from '@components/NavElement/NavElement'
import useHydratedItemData from '@hooks/useHydratedItemData'
import useLockedItem from '@hooks/useLockedItem'
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
import { setCurrentComic, setRandomComic } from '@store/comicSlice'
import {
    setShowChangeLogDialog,
    setShowGoToComicDialog,
    setShowItemDetailsDialogFor,
    setShowSettingsDialog,
} from '@store/dialogSlice'
import { useAppDispatch, useAppSelector } from '@store/hooks'

import constants from '~/constants'

import ItemNavigation from './ItemNavigation/ItemNavigation'

export default function ComicDetailsPanel() {
    const dispatch = useAppDispatch()

    const settings = useAppSelector((state) => state.settings.values)

    const currentComic = useAppSelector((state) => state.comic.current)
    const latestComic = useAppSelector((state) => state.comic.latest)
    const randomComic = useAppSelector((state) => state.comic.random)
    const previousComic = useAppSelector((s) => previousComicSelector(s))
    const nextComic = useAppSelector((s) => nextComicSelector(s))
    const lockedToItem = useAppSelector((state) => state.comic.lockedToItem)

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

    const {
        hasLockedItem,
        lockedItem,
        randomLockedItemComic,
        refreshRandomLockedItemComic,
    } = useLockedItem(currentComic, settings, lockedToItem)

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
            constants.developmentMode && (
                <>
                    <br />
                    <span
                        className="text-xs text-red-600"
                        title={`Server endpoint is ${constants.webserviceBaseUrl}`}
                    >
                        (Development Mode)
                    </span>
                </>
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
                        onClick={() => dispatch(setShowChangeLogDialog(true))}
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
                        onClick={() => dispatch(setShowChangeLogDialog(true))}
                    >
                        See what's new!
                    </button>
                </>
            )
        }

        return <></>
    }, [settings, dispatch])

    function goToSelectorComic() {
        if (comicSelectorNo && /^\d+$/.test(comicSelectorNo)) {
            const comicNo = Number(comicSelectorNo)
            if (comicNo >= 1 && comicNo <= (latestComic as number)) {
                dispatch(setCurrentComic(comicNo, { locked: false }))
            }
        }
    }

    if (!settings) {
        return <></>
    }

    let navigationData: {
        first: number
        previous: number
        next: number
        last: number
        random: number
    }
    if (hasLockedItem) {
        navigationData = {
            first: lockedItem.first ?? currentComic,
            previous: lockedItem.previous ?? currentComic,
            next: lockedItem.next ?? currentComic,
            last: lockedItem.last ?? currentComic,
            random: randomLockedItemComic ?? 0,
        }
    } else {
        navigationData = {
            first: 1,
            previous: previousComic,
            next: nextComic,
            last: latestComic,
            random: randomComic,
        }
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
                withItem={lockedItem?.shortName ?? null}
                currentComic={currentComic}
                firstComic={navigationData.first}
                onSetFirstComic={() =>
                    dispatch(
                        setCurrentComic(navigationData.first, {
                            locked: hasLockedItem,
                        })
                    )
                }
                previousComic={navigationData.previous}
                onSetPreviousComic={() =>
                    dispatch(
                        setCurrentComic(navigationData.previous, {
                            locked: hasLockedItem,
                        })
                    )
                }
                nextComic={navigationData.next}
                onSetNextComic={() =>
                    dispatch(
                        setCurrentComic(navigationData.next, {
                            locked: hasLockedItem,
                        })
                    )
                }
                latestComic={navigationData.last}
                onSetLatestComic={() =>
                    dispatch(
                        setCurrentComic(navigationData.last, {
                            locked: hasLockedItem,
                        })
                    )
                }
                randomComic={navigationData.random}
                onSetRandomComic={() => {
                    dispatch(
                        setCurrentComic(navigationData.random, {
                            locked: hasLockedItem,
                        })
                    )
                    if (hasLockedItem) {
                        refreshRandomLockedItemComic()
                    }
                }}
                onShowGoToComicDialog={() =>
                    dispatch(setShowGoToComicDialog(true))
                }
            />
            {!settings.editMode && hasErrorLoadingComicData && (
                <ErrorPresenter error={comicDataError} />
            )}
            <ItemNavigation
                itemNavigationData={comicItems ?? []}
                isLoading={isLoadingInitial}
                isFetching={isFetching}
                useColors={settings.useColors}
                orderMembersByLastAppearance={false}
                onSetCurrentComic={(c, locked) =>
                    dispatch(setCurrentComic(c, { locked }))
                }
                onShowInfoFor={(i) => dispatch(setShowItemDetailsDialogFor(i))}
                mode={NavElementMode.Present}
                editMode={settings.editMode}
                onRemoveItem={(itemId) => {
                    removeItem({
                        editModeToken: settings.editModeToken,
                        comicId: currentComic,
                        itemId,
                    })
                }}
                lockedToItemId={lockedItem?.id}
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
                        onClick={() => dispatch(setShowSettingsDialog(true))}
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
            {settings.showAllMembers ||
                (settings.editMode && (
                    <>
                        <hr className="my-4 mx-0 border-solid border-b max-w-none" />
                        <FilteredNavigationData
                            isLoading={isLoadingInitial}
                            isFetching={isFetching}
                            isSaving={isSaving}
                            itemData={allItems ?? []}
                            onSetCurrentComic={(c) =>
                                dispatch(setCurrentComic(c))
                            }
                            onShowInfoFor={(i) =>
                                dispatch(setShowItemDetailsDialogFor(i))
                            }
                            useColors={settings.useColors}
                            editMode={settings.editMode}
                            orderMembersByLastAppearance={
                                settings.orderMembersByLastAppearance
                            }
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
                ))}
        </div>
    )
}
