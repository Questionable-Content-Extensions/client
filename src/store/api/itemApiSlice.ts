import { DeleteImageBody } from '@models/DeleteImageBody'
import { ImageId } from '@models/ImageId'
import { Item } from '@models/Item'
import { ItemId } from '@models/ItemId'
import { ItemImageList } from '@models/ItemImageList'
import { PatchItemBody } from '@models/PatchItemBody'
import { RelatedItem } from '@models/RelatedItem'
import { SetPrimaryImageBody } from '@models/SetPrimaryImageBody'
import { skipToken } from '@reduxjs/toolkit/dist/query'
import {
    apiSlice,
    transformResponseByJsonParseResultText,
} from '@store/apiSlice'

import constants from '~/constants'

export type GetDataQueryArgs = {
    itemId: number
}

export const itemApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getItemData: builder.query<Item, GetDataQueryArgs>({
            query: ({ itemId }) => {
                return {
                    url: `${constants.itemDataEndpoint}${itemId}`,
                }
            },
            transformResponse: transformResponseByJsonParseResultText,
            providesTags: (result, _error, _args) =>
                result
                    ? [
                          {
                              type: 'Item',
                              id: result.id,
                          },
                          {
                              type: 'Item',
                              id: `${result.id}-data`,
                          },
                      ]
                    : [],
        }),
        imageData: builder.query<ItemImageList[], GetDataQueryArgs>({
            query: ({ itemId }) => {
                return {
                    url: `${constants.itemDataEndpoint}${itemId}/images`,
                }
            },
            transformResponse: transformResponseByJsonParseResultText,
            providesTags: (result, _error, args) =>
                result
                    ? [
                          {
                              type: 'Item',
                              id: `${args.itemId}-images`,
                          },
                          {
                              type: 'Item',
                              id: `${args.itemId}-data`,
                          },
                      ]
                    : [],
        }),
        friendData: builder.query<RelatedItem[], GetDataQueryArgs>({
            query: ({ itemId }) => {
                return {
                    url: `${constants.itemDataEndpoint}${itemId}/friends`,
                }
            },
            transformResponse: transformResponseByJsonParseResultText,
            providesTags: (result, _error, args) =>
                result
                    ? [
                          {
                              type: 'Item',
                              id: `${args.itemId}-friends`,
                          },
                          {
                              type: 'Item',
                              id: `${args.itemId}-data`,
                          },
                      ]
                    : [],
        }),
        locationData: builder.query<RelatedItem[], GetDataQueryArgs>({
            query: ({ itemId }) => {
                return {
                    url: `${constants.itemDataEndpoint}${itemId}/locations`,
                }
            },
            transformResponse: transformResponseByJsonParseResultText,
            providesTags: (result, _error, args) =>
                result
                    ? [
                          {
                              type: 'Item',
                              id: `${args.itemId}-locations`,
                          },
                          {
                              type: 'Item',
                              id: `${args.itemId}-data`,
                          },
                      ]
                    : [],
        }),
        patchItem: builder.mutation<
            string,
            { item: ItemId; body: PatchItemBody }
        >({
            query: ({ item, body }) => {
                const url = `${constants.itemDataEndpoint}${item}`
                return {
                    url,
                    configuration: {
                        data: JSON.stringify(body),
                        method: 'PATCH',
                        headers: {
                            'Content-Type': 'application/json; charset=utf-8',
                        },
                    },
                }
            },
            transformResponse: (response) => response.responseText,
            invalidatesTags: (result, _error, args) =>
                result
                    ? [{ type: 'Comic' }, { type: 'Item', id: args.item }]
                    : [],
        }),
        deleteImage: builder.mutation<
            string,
            { itemId: ItemId; imageId: ImageId; body: DeleteImageBody }
        >({
            query: ({ imageId, body }) => {
                const url = `${constants.itemImageEndpoint}${imageId}`
                return {
                    url,
                    configuration: {
                        data: JSON.stringify(body),
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json; charset=utf-8',
                        },
                    },
                }
            },
            transformResponse: (response) => response.responseText,
            invalidatesTags: (result, _error, args) =>
                result
                    ? [
                          {
                              type: 'Item',
                              id: `${args.itemId}-images`,
                          },
                      ]
                    : [],
        }),
        setPrimaryImage: builder.mutation<
            string,
            { itemId: ItemId; body: SetPrimaryImageBody }
        >({
            query: ({ itemId, body }) => {
                return {
                    url: `${constants.itemDataEndpoint}${itemId}/images/primary`,
                    configuration: {
                        data: JSON.stringify(body),
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json; charset=utf-8',
                        },
                    },
                }
            },
            transformResponse: (response) => response.responseText,
            invalidatesTags: (result, _error, args) =>
                result
                    ? [
                          {
                              type: 'Item',
                              id: args.itemId,
                          },
                      ]
                    : [],
        }),
    }),
})

export const {
    useGetItemDataQuery,
    useImageDataQuery,
    useFriendDataQuery,
    useLocationDataQuery,
    usePatchItemMutation,
    useDeleteImageMutation,
    useSetPrimaryImageMutation,
} = itemApiSlice

export function useAllDataQuery(args: typeof skipToken | GetDataQueryArgs) {
    const {
        isError: isItemDataError,
        isFetching: isItemDataFetching,
        isLoading: isItemDataLoading,
        isSuccess: isItemDataSuccess,
        isUninitialized: isItemDataUninitialized,
        refetch: refetchItemData,
        currentData: currentItemData,
        data: itemData,
        error: itemDataError,
    } = useGetItemDataQuery(args)
    const {
        isError: isImageDataError,
        isFetching: isImageDataFetching,
        isLoading: isImageDataLoading,
        isSuccess: isImageDataSuccess,
        isUninitialized: isImageDataUninitialized,
        refetch: refetchImageData,
        currentData: currentImageData,
        data: imageData,
        error: imageDataError,
    } = useImageDataQuery(args)
    const {
        isError: isFriendDataError,
        isFetching: isFriendDataFetching,
        isLoading: isFriendDataLoading,
        isSuccess: isFriendDataSuccess,
        isUninitialized: isFriendDataUninitialized,
        refetch: refetchFriendData,
        currentData: currentFriendData,
        data: friendData,
        error: friendDataError,
    } = useFriendDataQuery(args)
    const {
        isError: isLocationDataError,
        isFetching: isLocationDataFetching,
        isLoading: isLocationDataLoading,
        isSuccess: isLocationDataSuccess,
        isUninitialized: isLocationDataUninitialized,
        refetch: refetchLocationData,
        currentData: currentLocationData,
        data: locationData,
        error: locationDataError,
    } = useLocationDataQuery(args)

    return {
        isItemDataError,
        isImageDataError,
        isFriendDataError,
        isLocationDataError,
        isError:
            isItemDataError ||
            isImageDataError ||
            isFriendDataError ||
            isLocationDataError,

        isItemDataFetching,
        isImageDataFetching,
        isFriendDataFetching,
        isLocationDataFetching,
        isFetching:
            isItemDataFetching ||
            isImageDataFetching ||
            isFriendDataFetching ||
            isLocationDataFetching,

        isItemDataLoading,
        isImageDataLoading,
        isFriendDataLoading,
        isLocationDataLoading,
        isLoading:
            isItemDataLoading ||
            isImageDataLoading ||
            isFriendDataLoading ||
            isLocationDataLoading,

        isItemDataSuccess,
        isImageDataSuccess,
        isFriendDataSuccess,
        isLocationDataSuccess,
        isSuccess:
            isItemDataSuccess ||
            isImageDataSuccess ||
            isFriendDataSuccess ||
            isLocationDataSuccess,

        isItemDataUninitialized,
        isImageDataUninitialized,
        isFriendDataUninitialized,
        isLocationDataUninitialized,
        isUninitialized:
            isItemDataUninitialized ||
            isImageDataUninitialized ||
            isFriendDataUninitialized ||
            isLocationDataUninitialized,

        refetchGetData: refetchItemData,
        refetchImageData,
        refetchFriendData,
        refetchLocationData,
        refetch: () => {
            refetchItemData()
            refetchImageData()
            refetchFriendData()
            refetchLocationData()
        },

        currentItemData,
        currentImageData,
        currentFriendData,
        currentLocationData,

        itemData,
        imageData,
        friendData,
        locationData,

        itemDataError,
        imageDataError,
        friendDataError,
        locationDataError,
    }
}
