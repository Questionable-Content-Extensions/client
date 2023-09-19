import { useEffect, useMemo, useState } from 'react'

import { PaddedButton } from '@components/Button'
import EditLogPanel from '@components/EditLogDialog/EditLogPanel/EditLogPanel'
import Pagination from '@components/EditLogDialog/Pagination/Pagination'
import CollapsibleDetails from '@components/GoToComicDialog/CollapsibleDetails/CollapsibleDetails'
import ComicList from '@components/GoToComicDialog/ComicList/ComicList'
import useHydratedItemData from '@hooks/useHydratedItemData'
import ModalDialog from '@modals/ModalDialog/ModalDialog'
import { ItemId } from '@models/ItemId'
import { skipToken } from '@reduxjs/toolkit/dist/query'
import {
    useAddItemMutation,
    useRemoveItemMutation,
} from '@store/api/comicApiSlice'
import {
    useAllDataQuery,
    useComicsQuery,
    useDeleteImageMutation,
    useSetPrimaryImageMutation,
    useUploadImageMutation,
} from '@store/api/itemApiSlice'
import { useGetLogsForItemQuery } from '@store/api/logApiSlice'
import { setCurrentComic } from '@store/comicSlice'
import { useAppDispatch, useAppSelector } from '@store/hooks'
import {
    isStateDirtySelector,
    saveChanges,
    setFromItem,
} from '@store/itemEditorSlice'

import constants from '~/constants'

import ItemDataPanel from './ItemDataPanel/ItemDataPanel'

export default function ItemDetailsDialog({
    onClose,
    initialItemId,
}: {
    onClose: () => void
    initialItemId: number | null
}) {
    const dispatch = useAppDispatch()

    const settings = useAppSelector((state) => state.settings.values)
    const editorItemId = useAppSelector((state) => state.itemEditor.id)
    const isItemDirty = useAppSelector((state) => isStateDirtySelector(state))
    const currentComic = useAppSelector((state) => state.comic.current)
    const lockedToItem = useAppSelector((state) => state.comic.lockedToItem)
    const itemName = useAppSelector((state) => state.itemEditor.name)

    const [previousInitialItemId, setPreviousInitialItemId] = useState<
        number | null
    >(null)
    const [currentItemId, setCurrentItemId] = useState<number | null>(null)
    const [currentLogPage, setCurrentLogPage] = useState(1)

    if (previousInitialItemId !== initialItemId) {
        setPreviousInitialItemId(initialItemId)
        setCurrentItemId(initialItemId)
        setCurrentLogPage(1)
    }

    const {
        itemData,
        imageData,
        friendData,
        locationData,
        isError: hasItemDataError,
        isFetching: isItemDataFetching,
    } = useAllDataQuery(currentItemId ? { itemId: currentItemId } : skipToken)

    const [previousItem, setPreviousItem] = useState(itemData)
    if (previousItem !== itemData && itemData) {
        setPreviousItem(itemData)
    }

    useEffect(() => {
        if (itemData && itemData.id !== editorItemId) {
            dispatch(setFromItem(itemData))
        }
    }, [itemData, editorItemId, dispatch])

    const [deleteImage, { isLoading: _isDeletingImage }] =
        useDeleteImageMutation()

    const [setPrimaryImage, { isLoading: _isSettingPrimaryImage }] =
        useSetPrimaryImageMutation()

    const {
        comicItems,
        isFetching: isFetchingItemData,
        isError: hasAllItemDataError,
    } = useHydratedItemData(
        settings?.editMode ?? false ? currentComic : 0,
        settings
    )

    const existsInComic = useMemo(
        () =>
            !!comicItems &&
            comicItems.find((i) => i.id === currentItemId) !== undefined,
        [comicItems, currentItemId]
    )

    const [addItem] = useAddItemMutation()
    const [removeItem] = useRemoveItemMutation()
    const [uploadImage, { isLoading: isUploadingImage }] =
        useUploadImageMutation()

    const dialogTitle = useMemo(() => {
        if (hasItemDataError || hasAllItemDataError) {
            return 'Error'
        }
        if (isItemDataFetching) {
            return 'Loading...'
        }
        return itemName ?? 'Loading...'
    }, [hasAllItemDataError, hasItemDataError, isItemDataFetching, itemName])

    const {
        data: itemLogs,
        isLoading: isLoadingItemLogs,
        isFetching: isFetchingItemLogs,
        isError: hasItemLogsError,
        //refetch: reloadItemLog,
    } = useGetLogsForItemQuery(
        itemData && settings?.editMode && currentItemId
            ? {
                  token: settings.editModeToken,
                  page: currentLogPage,
                  id: currentItemId,
              }
            : skipToken
    )

    const [loadComics, setLoadComics] = useState(false)
    const { data: itemComics, isLoading: itemComicsIsLoading } = useComicsQuery(
        loadComics && currentItemId ? { itemId: currentItemId } : skipToken
    )

    return (
        <ModalDialog
            onCloseClicked={onClose}
            header={
                <h5 className="m-0 text-xl font-medium leading-normal text-gray-800">
                    {dialogTitle}
                </h5>
            }
            body={
                <>
                    <ItemDataPanel
                        itemDataUrl={
                            constants.webserviceBaseUrl +
                            constants.itemDataEndpoint
                        }
                        itemData={itemData ?? null}
                        itemImageData={imageData ?? null}
                        itemFriendData={friendData ?? null}
                        itemLocationData={locationData ?? null}
                        editModeToken={
                            settings?.editMode ? settings?.editModeToken : null
                        }
                        onGoToComic={(comicId, locked) => {
                            dispatch(setCurrentComic(comicId, { locked }))
                            onClose()
                        }}
                        onShowItemData={(itemId: ItemId) => {
                            setLoadComics(false)
                            setCurrentItemId(itemId)
                        }}
                        onDeleteImage={(imageId: number) => {
                            deleteImage({
                                itemId: editorItemId,
                                imageId,
                                body: { token: settings!.editModeToken },
                            })
                        }}
                        onSetPrimaryImage={(imageId) =>
                            setPrimaryImage({
                                itemId: editorItemId,
                                body: {
                                    token: settings!.editModeToken,
                                    imageId,
                                },
                            })
                        }
                        hasError={hasItemDataError || hasAllItemDataError}
                        onUploadImage={uploadImage}
                        isUploadingImage={isUploadingImage}
                    />
                    <CollapsibleDetails
                        summary="Comics item is featured in"
                        onToggle={(e) => {
                            setLoadComics(e.currentTarget.open)
                        }}
                        initiallyOpen={loadComics}
                    >
                        <ComicList
                            allComicData={itemComics ?? []}
                            isLoading={itemComicsIsLoading}
                            subDivideGotoComics={
                                settings?.subDivideGotoComics ?? true
                            }
                            onGoToComic={(comic) => {
                                setLoadComics(false)
                                setCurrentComic(comic, {
                                    locked:
                                        lockedToItem && itemData
                                            ? lockedToItem === itemData.id
                                            : false,
                                })
                                onClose()
                            }}
                        />
                    </CollapsibleDetails>
                    {settings?.editMode ? (
                        <CollapsibleDetails summary="Edit log for item">
                            <EditLogPanel
                                logs={itemLogs}
                                isLoading={isLoadingItemLogs}
                                isFetching={isFetchingItemLogs}
                                hasError={hasItemLogsError}
                                useCorrectTimeFormat={
                                    settings?.useCorrectTimeFormat ?? true
                                }
                            />
                            {itemLogs && itemLogs.pageCount > 1 ? (
                                <div className="flex justify-center">
                                    <Pagination
                                        page={currentLogPage}
                                        count={itemLogs.pageCount}
                                        isFetching={isFetchingItemLogs}
                                        onGoToPage={(page) =>
                                            setCurrentLogPage(page)
                                        }
                                        boundaryCount={2}
                                        siblingCount={2}
                                    />
                                </div>
                            ) : (
                                <></>
                            )}
                        </CollapsibleDetails>
                    ) : (
                        <></>
                    )}
                </>
            }
            footer={
                <>
                    {settings?.editMode ?? false ? (
                        <>
                            <PaddedButton
                                onClick={() => {
                                    if (existsInComic) {
                                        removeItem({
                                            comicId: currentComic,
                                            editModeToken:
                                                settings!.editModeToken,
                                            itemId: currentItemId!,
                                        })
                                    } else {
                                        addItem({
                                            comicId: currentComic,
                                            token: settings!.editModeToken,
                                            new: false,
                                            itemId: currentItemId!,
                                        })
                                    }
                                }}
                                disabled={isFetchingItemData}
                            >
                                {isFetchingItemData
                                    ? 'Loading...'
                                    : !existsInComic
                                    ? 'Add item to current comic'
                                    : 'Remove item from current comic'}
                            </PaddedButton>
                            <PaddedButton
                                className="ml-2"
                                disabled={!isItemDirty}
                                onClick={() => dispatch(saveChanges())}
                            >
                                {isItemDirty ? 'Save changes' : 'No changes'}
                            </PaddedButton>
                        </>
                    ) : (
                        <></>
                    )}

                    <PaddedButton onClick={onClose}>Close</PaddedButton>
                </>
            }
        />
    )
}
