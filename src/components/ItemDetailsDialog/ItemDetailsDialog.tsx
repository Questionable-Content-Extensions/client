import { useEffect, useMemo, useState } from 'react'
import { ConnectedProps, connect } from 'react-redux'

import { PaddedButton } from '@components/Button'
import EditLogPanel from '@components/EditLogDialog/EditLogPanel/EditLogPanel'
import Pagination from '@components/EditLogDialog/Pagination/Pagination'
import CollapsibleDetails from '@components/GoToComicDialog/CollapsibleDetails/CollapsibleDetails'
import useHydratedItemData from '@hooks/useHydratedItemData'
import ModalDialog from '@modals/ModalDialog/ModalDialog'
import { Item } from '@models/Item'
import { ItemId } from '@models/ItemId'
import { skipToken } from '@reduxjs/toolkit/dist/query'
import {
    useAddItemMutation,
    useRemoveItemMutation,
} from '@store/api/comicApiSlice'
import {
    useAllDataQuery,
    useDeleteImageMutation,
    useSetPrimaryImageMutation,
    useUploadImageMutation,
} from '@store/api/itemApiSlice'
import { useGetLogsForItemQuery } from '@store/api/logApiSlice'
import { setCurrentComic } from '@store/comicSlice'
import {
    isStateDirtySelector,
    saveChanges,
    setFromItem,
} from '@store/itemEditorSlice'
import { AppDispatch, RootState } from '@store/store'

import constants from '~/constants'

import ItemDataPanel from './ItemDataPanel/ItemDataPanel'

const mapState = (state: RootState) => {
    return {
        settings: state.settings.values,
        editorItemId: state.itemEditor.id,
        isItemDirty: isStateDirtySelector(state),
        currentComic: state.comic.current,
    }
}

const mapDispatch = (dispatch: AppDispatch) => {
    return {
        setCurrentComic: (comic: number) => {
            dispatch(setCurrentComic(comic))
        },
        setFromItem: (item: Item) => {
            dispatch(setFromItem(item))
        },
        saveChanges: () => {
            dispatch(saveChanges())
        },
    }
}

const connector = connect(mapState, mapDispatch)
type PropsFromRedux = ConnectedProps<typeof connector>
type ItemDetailsDialogProps = PropsFromRedux & {
    onClose: () => void
    initialItemId: number | null
}

// TODO: Find a way to list all comics this item is in

function ItemDetailsDialog({
    settings,
    editorItemId,
    isItemDirty,
    currentComic,
    onClose,
    initialItemId,
    setCurrentComic,
    setFromItem,
    saveChanges,
}: ItemDetailsDialogProps) {
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
            setFromItem(itemData)
        }
    }, [itemData, editorItemId, setFromItem])

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
        return itemData?.name ?? 'Loading...'
    }, [hasAllItemDataError, hasItemDataError, isItemDataFetching, itemData])

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
                        onGoToComic={(comicId) => {
                            setCurrentComic(comicId)
                            onClose()
                        }}
                        onShowItemData={(itemId: ItemId) => {
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
                                onClick={() => saveChanges()}
                            >
                                {isItemDirty ? 'Save changes' : 'No changes'}
                            </PaddedButton>
                        </>
                    ) : (
                        <></>
                    )}

                    <PaddedButton className="ml-2" onClick={onClose}>
                        Close
                    </PaddedButton>
                </>
            }
        />
    )
}

export default connector(ItemDetailsDialog)
