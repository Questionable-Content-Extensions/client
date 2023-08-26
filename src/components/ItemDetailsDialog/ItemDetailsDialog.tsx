import { useEffect, useState } from 'react'
import { ConnectedProps, connect } from 'react-redux'

import ModalDialog from '@modals/ModalDialog/ModalDialog'
import { Item } from '@models/Item'
import { ItemId } from '@models/ItemId'
import { skipToken } from '@reduxjs/toolkit/dist/query'
import {
    useAllDataQuery,
    useDeleteImageMutation,
    useSetPrimaryImageMutation,
} from '@store/api/itemApiSlice'
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

function ItemDetailsDialog({
    settings,
    editorItemId,
    isItemDirty,
    onClose,
    initialItemId,
    setCurrentComic,
    setFromItem,
    saveChanges,
}: ItemDetailsDialogProps) {
    const [previousInitialItemId, setPreviousInitialItemId] =
        useState(initialItemId)
    const [currentItemId, setCurrentItemId] = useState<number | null>(null)

    if (previousInitialItemId !== initialItemId) {
        setPreviousInitialItemId(initialItemId)
        setCurrentItemId(initialItemId)
    }

    const { itemData, imageData, friendData, locationData } = useAllDataQuery(
        currentItemId ? { itemId: currentItemId } : skipToken
    )

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

    return (
        <ModalDialog
            onCloseClicked={onClose}
            header={
                <h5 className="m-0 text-xl font-medium leading-normal text-gray-800">
                    {itemData?.name ?? 'Loading...'}
                </h5>
            }
            body={
                <ItemDataPanel
                    itemDataUrl={
                        constants.webserviceBaseUrl + constants.itemDataEndpoint
                    }
                    itemData={itemData ?? null}
                    itemImageData={imageData ?? null}
                    itemFriendData={friendData ?? null}
                    itemLocationData={locationData ?? null}
                    editMode={settings?.editMode ?? false}
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
                            body: { token: settings!.editModeToken, imageId },
                        })
                    }
                />
            }
            footer={
                <>
                    {settings?.editMode ?? false ? (
                        <button
                            className="bg-qc-header hover:bg-qc-header-second focus:bg-qc-header-second text-white py-3 px-4 rounded-sm disabled:opacity-75"
                            disabled={!isItemDirty}
                            onClick={() => saveChanges()}
                        >
                            {isItemDirty ? 'Save changes' : 'No changes'}
                        </button>
                    ) : (
                        <></>
                    )}

                    <button
                        className="bg-qc-header hover:bg-qc-header-second focus:bg-qc-header-second text-white py-3 px-4 rounded-sm ml-2"
                        onClick={onClose}
                    >
                        Close
                    </button>
                </>
            }
        />
    )
}

export default connector(ItemDetailsDialog)
