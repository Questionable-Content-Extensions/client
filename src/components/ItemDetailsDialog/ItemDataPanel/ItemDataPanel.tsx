import Spinner from '@components/Spinner'
import { ComicId } from '@models/ComicId'
import { ImageId } from '@models/ImageId'
import { Item as ItemData } from '@models/Item'
import { ItemId } from '@models/ItemId'
import { ItemImageList as ItemImageData } from '@models/ItemImageList'
import { ItemType } from '@models/ItemType'
import { RelatedItem as ItemRelationData } from '@models/RelatedItem'
import { UploadImageArgs } from '@store/api/itemApiSlice'
import { useAppSelector } from '@store/hooks'

import { createTintOrShade } from '~/color'

import DonutGraph from '../DonutGraph/DonutGraph'
import ItemDetails from '../ItemDetails/ItemDetails'
import ItemImageViewer from '../ItemImageViewer/ItemImageViewer'
import ListRelations from '../ListRelations/ListRelations'

export default function ItemDataPanel({
    itemData,
    itemImageData,
    itemFriendData,
    itemLocationData,
    editModeToken,
    onGoToComic,
    itemDataUrl,
    onShowItemData,
    onDeleteImage,
    onSetPrimaryImage,
    hasError,
    onUploadImage,
    isUploadingImage,
}: {
    itemData: ItemData | null
    itemImageData: ItemImageData[] | null
    itemFriendData: ItemRelationData[] | null
    itemLocationData: ItemRelationData[] | null
    editModeToken: string | null
    onGoToComic: (comicId: ComicId, locked: boolean) => void
    itemDataUrl: string
    onShowItemData: (itemId: ItemId) => void
    onDeleteImage: (imageId: ImageId) => void
    onSetPrimaryImage: (imageId: ImageId) => void
    hasError: boolean
    onUploadImage: (args: UploadImageArgs) => Promise<unknown>
    isUploadingImage: boolean
}) {
    const shortName = useAppSelector((state) => state.itemEditor.shortName)
    const color = useAppSelector((state) => state.itemEditor.color)

    if (hasError) {
        return (
            <div className="text-center">
                <i className={`fa fa-warning`} aria-hidden="true"></i>
                <br />
                An error occurred loading the item data
            </div>
        )
    }

    const isLoading =
        itemData === null ||
        itemImageData === null ||
        itemFriendData === null ||
        itemLocationData === null
    if (isLoading) {
        return (
            <div className="text-center pt-4">
                <Spinner
                    loadingText="Loading..."
                    height="h-8"
                    width="w-8"
                    textColor="text-black"
                    spinnerBgColor="text-gray-300"
                    spinnerColor="fill-qc-link"
                />
            </div>
        )
    }

    let backgroundColor = color
    if (!backgroundColor.startsWith('#')) {
        backgroundColor = `#${backgroundColor}`
    }
    const foregroundColor = createTintOrShade(color)

    return (
        <>
            <div className="grid grid-cols-2 gap-4">
                <ItemImageViewer
                    itemId={itemData.id}
                    itemShortName={shortName}
                    primaryImage={itemData.primaryImage}
                    itemImageData={itemImageData}
                    itemDataUrl={itemDataUrl}
                    editModeToken={editModeToken}
                    onDeleteImage={onDeleteImage}
                    onSetPrimaryImage={onSetPrimaryImage}
                    onUploadImage={onUploadImage}
                    isUploadingImage={isUploadingImage}
                />
                <DonutGraph
                    amount={itemData.appearances}
                    totalAmount={itemData.totalComics}
                    fillColor={foregroundColor}
                    backgroundColor={backgroundColor}
                />
            </div>

            <ItemDetails
                item={itemData}
                onGoToComic={onGoToComic}
                editMode={editModeToken !== null}
            />

            <div
                className={
                    'mt-4 pt-2 border-0 border-t border-solid border-gray-400 ' +
                    'grid grid-cols-1 sm:grid-cols-2 gap-4'
                }
            >
                <div>
                    <p>Most often {involvesLocationText(itemData.type)}:</p>
                    <ListRelations
                        itemRelationData={itemLocationData}
                        editMode={editModeToken !== null}
                        totalComics={itemData.appearances}
                        onShowInfoFor={onShowItemData}
                    />
                </div>
                <div>
                    <p>Most often {involvesCastText(itemData.type)}:</p>
                    <ListRelations
                        itemRelationData={itemFriendData}
                        editMode={editModeToken !== null}
                        totalComics={itemData.appearances}
                        onShowInfoFor={onShowItemData}
                    />
                </div>
            </div>
        </>
    )
}

function involvesLocationText(type: ItemType) {
    switch (type) {
        case 'cast':
            return 'spotted at'
        case 'location':
            return 'visited simultaneously with'
        case 'storyline':
            return 'involves the places'
    }
}

function involvesCastText(type: ItemType) {
    switch (type) {
        case 'cast':
            return 'spotted with'
        case 'location':
            return 'visited by'
        case 'storyline':
            return 'involves the people'
    }
}
