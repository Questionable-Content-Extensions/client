import { Item as ItemData } from '@models/Item'
import { ItemImageList as ItemImageData } from '@models/ItemImageList'
import { RelatedItem as ItemRelationData } from '@models/RelatedItem'

import constants from '~/constants'
import { error, fetch, warn } from '~/utils'

async function getItemData(itemId: number) {
    const response = await fetch(constants.itemDataUrl + itemId)

    if (response.status === 503) {
        // TODO: Enter Maintenance mode
        warn('Maintenance', response.responseText)
        return
    } else if (response.status !== 200) {
        error(
            `Got error when loading the item data for item with id ${itemId}:`,
            response.responseText
        )
        return
    }

    const itemData = JSON.parse(response.responseText) as ItemData
    return itemData
}

async function getItemImageData(itemId: number) {
    const response = await fetch(constants.itemDataUrl + itemId + '/images')

    if (response.status === 503) {
        // TODO: Enter Maintenance mode
        warn('Maintenance', response.responseText)
        return
    } else if (response.status !== 200) {
        error(
            `Got error when loading the item image data for item with id ${itemId}:`,
            response.responseText
        )
        return
    }

    const itemImageData = JSON.parse(response.responseText) as ItemImageData[]
    return itemImageData
}

async function getItemFriendData(itemId: number) {
    const response = await fetch(constants.itemDataUrl + itemId + '/friends')

    if (response.status === 503) {
        // TODO: Enter Maintenance mode
        warn('Maintenance', response.responseText)
        return
    } else if (response.status !== 200) {
        error(
            `Got error when loading the item image data for item with id ${itemId}:`,
            response.responseText
        )
        return
    }

    const itemImageData = JSON.parse(
        response.responseText
    ) as ItemRelationData[]
    return itemImageData
}

async function getItemLocationData(itemId: number) {
    const response = await fetch(constants.itemDataUrl + itemId + '/locations')

    if (response.status === 503) {
        // TODO: Enter Maintenance mode
        warn('Maintenance', response.responseText)
        return
    } else if (response.status !== 200) {
        error(
            `Got error when loading the item image data for item with id ${itemId}:`,
            response.responseText
        )
        return
    }

    const itemImageData = JSON.parse(
        response.responseText
    ) as ItemRelationData[]
    return itemImageData
}

export type AllItemData = {
    itemData: ItemData
    imageData: ItemImageData[]
    friendData: ItemRelationData[]
    locationData: ItemRelationData[]
}

async function getAllItemData(itemId: number) {
    const itemDataRequest = getItemData(itemId)
    const imageDataRequest = getItemImageData(itemId)
    const friendDataRequest = getItemFriendData(itemId)
    const locationDataRequest = getItemLocationData(itemId)

    const [itemData, imageData, friendData, locationData] = await Promise.all([
        itemDataRequest,
        imageDataRequest,
        friendDataRequest,
        locationDataRequest,
    ])

    if (!itemData || !imageData || !friendData || !locationData) {
        return
    }

    const result: AllItemData = {
        itemData,
        imageData,
        friendData,
        locationData,
    }
    return result
}

const itemDataService = {
    getItemData,
    getItemImageData,
    getItemFriendData,
    getItemLocationData,
    getAllItemData,
}
export default itemDataService
