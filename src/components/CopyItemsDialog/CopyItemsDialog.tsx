import { useEffect, useMemo, useState } from 'react'
import { ConnectedProps, connect } from 'react-redux'

import { PaddedButton } from '@components/Button'
import useHydratedItemData from '@hooks/useHydratedItemData'
import ModalDialog from '@modals/ModalDialog/ModalDialog'
import { skipToken } from '@reduxjs/toolkit/dist/query'
import { useAddItemsMutation, useListAllQuery } from '@store/api/comicApiSlice'
import { AppDispatch, RootState } from '@store/store'

import CopyItemsDialogPanel from './CopyItemsDialogPanel/CopyItemsDialogPanel'

const mapState = (state: RootState) => {
    return {
        settings: state.settings.values,
        initialComic: state.dialog.showCopyItemsDialogFor,
        currentComic: state.comic.current,
    }
}

const mapDispatch = (_dispatch: AppDispatch) => {
    return {}
}

const connector = connect(mapState, mapDispatch)
type PropsFromRedux = ConnectedProps<typeof connector>
type CopyItemsDialogProps = PropsFromRedux & {
    show: boolean
    onClose: () => void
}

export function CopyItemsDialog({
    initialComic,
    settings,
    currentComic,
    show,
    onClose,
}: CopyItemsDialogProps) {
    const {
        data: allComicData,
        isFetching: isFetchingAllComicData,
        isLoading: isLoadingAllComicData,
    } = useListAllQuery(!show ? skipToken : undefined)

    const reverseAllComicData = useMemo(() => {
        if (allComicData) {
            const reverseAllComicData = [...allComicData]
            reverseAllComicData.reverse()
            return reverseAllComicData
        }
    }, [allComicData])

    const [previousInitialComic, setPreviousInitialComic] =
        useState(initialComic)
    const [selectedComic, setSelectedComic] = useState<number | null>(
        previousInitialComic
    )
    if (previousInitialComic !== initialComic) {
        setPreviousInitialComic(initialComic)
        if (initialComic) {
            setSelectedComic(initialComic > 1 ? initialComic - 1 : initialComic)
        }
    } else if (!selectedComic && reverseAllComicData) {
        setSelectedComic(reverseAllComicData[0].comic)
    }

    const {
        comicItems,
        isLoading: isLoadingInitialItemData,
        isFetching: isFetchingItemData,
    } = useHydratedItemData(selectedComic ?? 0, settings)

    const [selectedItems, setSelectedItems] = useState<{
        [id: number]: boolean
    }>({})
    useEffect(() => {
        let selectedItems: { [id: number]: boolean } = {}
        if (comicItems) {
            for (const item of comicItems) {
                selectedItems[item.id] = true
            }
            setSelectedItems(selectedItems)
        }
    }, [comicItems])

    const [addItems, { isLoading: isAddingItems }] = useAddItemsMutation()

    const onCopy = async () => {
        const itemsToAdd: number[] = []
        for (const item in selectedItems) {
            if (selectedItems[item]) {
                itemsToAdd.push(Number(item))
            }
        }
        const result = await addItems({
            token: settings!.editModeToken,
            comicId: currentComic,
            items: itemsToAdd.map((itemId) => ({
                new: false,
                itemId,
            })),
        })
        if ('data' in result) {
            onClose()
        }
    }

    return (
        <ModalDialog
            onCloseClicked={onClose}
            header={
                <h5 className="m-0 text-xl font-medium leading-normal text-gray-800">
                    Copy items from another comic
                </h5>
            }
            body={
                <CopyItemsDialogPanel
                    allComics={reverseAllComicData}
                    isLoading={
                        isLoadingAllComicData || isLoadingInitialItemData
                    }
                    isFetching={
                        isFetchingAllComicData ||
                        isFetchingItemData ||
                        isAddingItems
                    }
                    selectedComic={selectedComic ?? undefined}
                    comicItems={comicItems}
                    onChangeSelectedComic={setSelectedComic}
                    selectedItems={selectedItems}
                    onUpdateSelectedItems={setSelectedItems}
                />
            }
            footer={
                <>
                    <PaddedButton onClick={onCopy}>
                        Copy selected into current comic
                    </PaddedButton>
                    <PaddedButton onClick={onClose}>Close</PaddedButton>
                </>
            }
        />
    )
}

export default connector(CopyItemsDialog)
