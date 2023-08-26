import Spinner from '@components/Spinner'
import { ComicId } from '@models/ComicId'
import { ImageId } from '@models/ImageId'
import { Item as ItemData } from '@models/Item'
import { ItemId } from '@models/ItemId'
import { ItemImageList as ItemImageData } from '@models/ItemImageList'
import { ItemType } from '@models/ItemType'
import { RelatedItem as ItemRelationData } from '@models/RelatedItem'

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
    editMode,
    onGoToComic,
    itemDataUrl,
    onShowItemData,
    onDeleteImage,
    onSetPrimaryImage,
}: {
    itemData: ItemData | null
    itemImageData: ItemImageData[] | null
    itemFriendData: ItemRelationData[] | null
    itemLocationData: ItemRelationData[] | null
    editMode: boolean
    onGoToComic: (comicId: ComicId) => void
    itemDataUrl: string
    onShowItemData: (itemId: ItemId) => void
    onDeleteImage: (imageId: ImageId) => void
    onSetPrimaryImage: (imageId: ImageId) => void
}) {
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

    let backgroundColor = itemData.color
    if (!backgroundColor.startsWith('#')) {
        backgroundColor = `#${backgroundColor}`
    }
    const foregroundColor = createTintOrShade(itemData.color)

    return (
        <>
            <div className="grid grid-cols-2 gap-4">
                <ItemImageViewer
                    itemShortName={itemData.shortName}
                    itemImageData={itemImageData}
                    itemDataUrl={itemDataUrl}
                    primaryImage={itemData.primaryImage}
                    editMode={editMode}
                    onDeleteImage={onDeleteImage}
                    onSetPrimaryImage={onSetPrimaryImage}
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
                editMode={editMode}
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
                        editMode={editMode}
                        totalComics={itemData.appearances}
                        onShowInfoFor={onShowItemData}
                    />
                </div>
                <div>
                    <p>Most often {involvesCastText(itemData.type)}:</p>
                    <ListRelations
                        itemRelationData={itemFriendData}
                        editMode={editMode}
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
