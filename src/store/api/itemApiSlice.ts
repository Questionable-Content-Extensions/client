import DeleteItemdataImageImageIdSpec, {
    DeleteItemdataImageImageIdResponse,
} from '@endpoints/DeleteItemdataImageImageId'
import GetItemdataSpec, { GetItemdataResponse } from '@endpoints/GetItemdata'
import GetItemdataItemIdSpec, {
    GetItemdataItemIdResponse,
} from '@endpoints/GetItemdataItemId'
import GetItemdataItemIdComicsSpec, {
    GetItemdataItemIdComicsResponse,
} from '@endpoints/GetItemdataItemIdComics'
import GetItemdataItemIdComicsRandomSpec, {
    GetItemdataItemIdComicsRandomQuery,
    GetItemdataItemIdComicsRandomResponse,
} from '@endpoints/GetItemdataItemIdComicsRandom'
import GetItemdataItemIdFriendsSpec, {
    GetItemdataItemIdFriendsResponse,
} from '@endpoints/GetItemdataItemIdFriends'
import GetItemdataItemIdImagesSpec, {
    GetItemdataItemIdImagesResponse,
} from '@endpoints/GetItemdataItemIdImages'
import GetItemdataItemIdLocationsSpec, {
    GetItemdataItemIdLocationsResponse,
} from '@endpoints/GetItemdataItemIdLocations'
import PatchItemdataItemIdSpec, {
    PatchItemdataItemIdResponse,
} from '@endpoints/PatchItemdataItemId'
import PostItemdataItemIdImagesPrimarySpec, {
    PostItemdataItemIdImagesPrimaryResponse,
} from '@endpoints/PostItemdataItemIdImagesPrimary'
import { ImageId } from '@models/ImageId'
import { ItemId } from '@models/ItemId'
import { PatchItemBody } from '@models/PatchItemBody'
import { SetPrimaryImageBody } from '@models/SetPrimaryImageBody'
import { skipToken } from '@reduxjs/toolkit/dist/query'
import {
    apiSlice,
    queryFromSpec,
    transformResponseByJsonParseResultText,
} from '@store/apiSlice'
import toastSuccess from '@store/toastSuccess'

import constants from '~/constants'
import { buildMultipartFormData } from '~/utils'

export type GetDataQueryArgs = {
    itemId: number
}

export type UploadImageArgs = {
    itemId: ItemId
    image: Blob
    imageFileName: string
}

export type GetRandomComicQueryArgs = {
    currentComic: number
    itemId: ItemId
    skipGuest: boolean
    skipNonCanon: boolean
}

export const itemApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        allItems: builder.query<GetItemdataResponse, void>({
            query: () => queryFromSpec(GetItemdataSpec),
            transformResponse:
                transformResponseByJsonParseResultText<GetItemdataResponse>,
            providesTags: (result, _error, _args) =>
                result
                    ? [
                          {
                              type: 'Item',
                              id: 'LIST-ALL',
                          },
                      ]
                    : [],
            //keepUnusedDataFor: 60 * 60 * 24,
        }),
        getItemData: builder.query<GetItemdataItemIdResponse, GetDataQueryArgs>(
            {
                query: ({ itemId }) =>
                    queryFromSpec(GetItemdataItemIdSpec, {
                        pathParams: itemId,
                    }),
                transformResponse:
                    transformResponseByJsonParseResultText<GetItemdataItemIdResponse>,
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
            }
        ),
        comics: builder.query<
            GetItemdataItemIdComicsResponse,
            GetDataQueryArgs
        >({
            query: ({ itemId }) =>
                queryFromSpec(GetItemdataItemIdComicsSpec, {
                    pathParams: itemId,
                }),
            transformResponse:
                transformResponseByJsonParseResultText<GetItemdataItemIdComicsResponse>,
            providesTags: (result, _error, args) =>
                result
                    ? [
                          {
                              type: 'Item',
                              id: `${args.itemId}-comics`,
                          },
                          {
                              type: 'Item',
                              id: `${args.itemId}-data`,
                          },
                      ]
                    : [],
        }),
        randomComic: builder.query<
            GetItemdataItemIdComicsRandomResponse,
            GetRandomComicQueryArgs
        >({
            query: ({ currentComic, itemId, skipGuest, skipNonCanon }) => {
                const query: GetItemdataItemIdComicsRandomQuery = {
                    'current-comic': currentComic.toString(),
                }
                if (skipNonCanon) {
                    query.exclude = 'non-canon'
                } else if (skipGuest) {
                    query.exclude = 'guest'
                }

                return queryFromSpec(GetItemdataItemIdComicsRandomSpec, {
                    pathParams: itemId,
                    query,
                })
            },
            transformResponse:
                transformResponseByJsonParseResultText<GetItemdataItemIdComicsRandomResponse>,
            providesTags: (result, _error, args) =>
                result !== undefined
                    ? [
                          {
                              type: 'Item',
                              id: `${args.itemId}-random-comic`,
                          },
                      ]
                    : [],
        }),
        imageData: builder.query<
            GetItemdataItemIdImagesResponse,
            GetDataQueryArgs
        >({
            query: ({ itemId }) =>
                queryFromSpec(GetItemdataItemIdImagesSpec, {
                    pathParams: itemId,
                }),
            transformResponse:
                transformResponseByJsonParseResultText<GetItemdataItemIdImagesResponse>,
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
        friendData: builder.query<
            GetItemdataItemIdFriendsResponse,
            GetDataQueryArgs
        >({
            query: ({ itemId }) =>
                queryFromSpec(GetItemdataItemIdFriendsSpec, {
                    pathParams: itemId,
                }),
            transformResponse:
                transformResponseByJsonParseResultText<GetItemdataItemIdFriendsResponse>,
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
        locationData: builder.query<
            GetItemdataItemIdLocationsResponse,
            GetDataQueryArgs
        >({
            query: ({ itemId }) =>
                queryFromSpec(GetItemdataItemIdLocationsSpec, {
                    pathParams: itemId,
                }),
            transformResponse:
                transformResponseByJsonParseResultText<GetItemdataItemIdLocationsResponse>,
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
            PatchItemdataItemIdResponse,
            { item: ItemId; body: PatchItemBody }
        >({
            query: ({ item, body }) =>
                queryFromSpec(PatchItemdataItemIdSpec, {
                    pathParams: item,
                    body,
                }),
            onQueryStarted: toastSuccess,
            transformResponse:
                transformResponseByJsonParseResultText<PatchItemdataItemIdResponse>,
            invalidatesTags: (result, _error, args) =>
                result
                    ? [
                          { type: 'Comic' },
                          { type: 'Item', id: args.item },
                          { type: 'Item', id: 'LIST-ALL' },
                          {
                              type: 'Log',
                              id: 'FULL',
                          },
                          {
                              type: 'Log',
                              id: `item-${args.item}`,
                          },
                      ]
                    : [],
        }),
        deleteImage: builder.mutation<
            DeleteItemdataImageImageIdResponse,
            { itemId: ItemId; imageId: ImageId }
        >({
            query: ({ imageId }) =>
                queryFromSpec(DeleteItemdataImageImageIdSpec, {
                    pathParams: imageId,
                }),
            transformResponse:
                transformResponseByJsonParseResultText<DeleteItemdataImageImageIdResponse>,
            onQueryStarted: toastSuccess,
            invalidatesTags: (result, _error, args) =>
                result
                    ? [
                          {
                              type: 'Item',
                              id: `${args.itemId}-images`,
                          },
                          {
                              type: 'Log',
                              id: 'FULL',
                          },
                          {
                              type: 'Log',
                              id: `item-${args.itemId}`,
                          },
                      ]
                    : [],
        }),
        setPrimaryImage: builder.mutation<
            PostItemdataItemIdImagesPrimaryResponse,
            { itemId: ItemId; body: SetPrimaryImageBody }
        >({
            query: ({ itemId, body }) =>
                queryFromSpec(PostItemdataItemIdImagesPrimarySpec, {
                    pathParams: itemId,
                    body,
                }),
            onQueryStarted: toastSuccess,
            transformResponse:
                transformResponseByJsonParseResultText<PostItemdataItemIdImagesPrimaryResponse>,
            invalidatesTags: (result, _error, args) =>
                result
                    ? [
                          {
                              type: 'Item',
                              id: args.itemId,
                          },
                          {
                              type: 'Log',
                              id: 'FULL',
                          },
                          {
                              type: 'Log',
                              id: `item-${args.itemId}`,
                          },
                      ]
                    : [],
        }),
        uploadImage: builder.mutation<string, UploadImageArgs>({
            queryFn: async (
                { itemId, image, imageFileName },
                _api,
                _extraOptions,
                baseQuery
            ) => {
                const { body, contentType } = await buildMultipartFormData(
                    'image',
                    image,
                    imageFileName
                )
                const result = await baseQuery({
                    url: `${constants.itemDataEndpoint}${itemId}/images`,
                    configuration: {
                        data: body,
                        method: 'POST',
                        headers: { 'Content-Type': contentType },
                    },
                })
                if (result.error) return { error: result.error }
                return { data: result.data.responseText }
            },
            onQueryStarted: toastSuccess,
            invalidatesTags: (result, _error, args) =>
                result
                    ? [
                          {
                              type: 'Item',
                              id: `${args.itemId}-images`,
                          },
                          {
                              type: 'Log',
                              id: 'FULL',
                          },
                          {
                              type: 'Log',
                              id: `item-${args.itemId}`,
                          },
                      ]
                    : [],
        }),
    }),
})

export const {
    useAllItemsQuery,
    useGetItemDataQuery,
    useComicsQuery,
    useRandomComicQuery,
    useImageDataQuery,
    useFriendDataQuery,
    useLocationDataQuery,
    usePatchItemMutation,
    useDeleteImageMutation,
    useSetPrimaryImageMutation,
    useUploadImageMutation,
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
