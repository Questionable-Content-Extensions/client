import { useState } from 'react'
import { ConnectedProps, connect } from 'react-redux'

import ModalDialog from '@modals/ModalDialog/ModalDialog'
import { skipToken } from '@reduxjs/toolkit/dist/query'
import { useAllDataQuery } from '@store/api/itemApiSlice'
import { setCurrentComic } from '@store/comicSlice'
import { AppDispatch, RootState } from '@store/store'

import constants from '~/constants'

import ItemDataPanel from './ItemDataPanel/ItemDataPanel'

const mapState = (state: RootState) => {
    return {
        settings: state.settings.values,
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
type ItemDetailsDialogProps = PropsFromRedux & {
    onClose: () => void
    initialItemId: number | null
}

// TODO: Keep showing item until dialog has vanished again
// TODO: Allow editing item when editor

function ItemDetailsDialog({
    onClose,
    initialItemId,
    settings,
    setCurrentComic,
}: ItemDetailsDialogProps) {
    const [previousItemId, setPreviousItemId] = useState(initialItemId)
    const [itemId, setItemId] = useState<number | null>(null)

    if (previousItemId !== initialItemId) {
        setPreviousItemId(initialItemId)
        setItemId(initialItemId)
    }

    const { itemData, imageData, friendData, locationData } = useAllDataQuery(
        itemId ? { itemId } : skipToken
    )

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
                    onShowItemData={(itemId: number) => {
                        setItemId(itemId)
                    }}
                />
            }
            footer={
                <button
                    className="bg-qc-header hover:bg-qc-header-second focus:bg-qc-header-second text-white py-3 px-4 rounded-sm"
                    onClick={() => onClose()}
                >
                    Close
                </button>
            }
        />
    )
}

export default connector(ItemDetailsDialog)
