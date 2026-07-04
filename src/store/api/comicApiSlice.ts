import { toast } from 'react-toastify'

import GetComicdataSpec, {
    GetComicdataQuery,
    GetComicdataResponse,
} from '@endpoints/GetComicdata'
import GetComicdataAdvanceSpec, {
    GetComicdataAdvanceQuery,
    GetComicdataAdvanceResponse,
} from '@endpoints/GetComicdataAdvance'
import GetComicdataComicIdSpec, {
    GetComicdataComicIdQuery,
    GetComicdataComicIdResponse,
} from '@endpoints/GetComicdataComicId'
import GetComicdataContainingItemsSpec, {
    GetComicdataContainingItemsResponse,
} from '@endpoints/GetComicdataContainingItems'
import GetComicdataExcludedSpec, {
    GetComicdataExcludedQuery,
    GetComicdataExcludedResponse,
} from '@endpoints/GetComicdataExcluded'
import PatchComicdataComicIdSpec, {
    PatchComicdataComicIdResponse,
} from '@endpoints/PatchComicdataComicId'
import PostComicdataAdditemSpec, {
    PostComicdataAdditemResponse,
} from '@endpoints/PostComicdataAdditem'
import PostComicdataAdditemsSpec, {
    PostComicdataAdditemsResponse,
} from '@endpoints/PostComicdataAdditems'
import PostComicdataAdvanceSpec, {
    PostComicdataAdvanceResponse,
} from '@endpoints/PostComicdataAdvance'
import PostComicdataAdvanceRunUpdaterSpec, {
    PostComicdataAdvanceRunUpdaterResponse,
} from '@endpoints/PostComicdataAdvanceRunUpdater'
import PostComicdataRemoveitemSpec, {
    PostComicdataRemoveitemResponse,
} from '@endpoints/PostComicdataRemoveitem'
import { AddAdvanceComicBody } from '@models/AddAdvanceComicBody'
import { AddItemToComicBody } from '@models/AddItemToComicBody'
import { AddItemsToComicBody } from '@models/AddItemsToComicBody'
import { ComicId } from '@models/ComicId'
import { FlagType } from '@models/FlagType'
import { ItemId } from '@models/ItemId'
import { PatchComicBody } from '@models/PatchComicBody'
import { RemoveItemFromComicBody } from '@models/RemoveItemFromComicBody'
import { RunComicUpdaterBody } from '@models/RunComicUpdaterBody'
import { Token } from '@models/Token'
import { createSelector } from '@reduxjs/toolkit'
import { TagDescription } from '@reduxjs/toolkit/dist/query'
import {
    apiSlice,
    queryFromSpec,
    transformResponseByJsonParseResultText,
} from '@store/apiSlice'
import { RootState } from '@store/store'
import toastSuccess from '@store/toastSuccess'

import { SettingValues } from '~/Settings'
import { EndpointBuilderTagTypeExtractor } from '~/tsUtils'

export type GetDataQueryArgs = {
    comic: number
    editModeToken?: string
    skipGuest: boolean
    skipNonCanon: boolean
    showAllMembers: boolean
    orderMembersByLastAppearance: boolean
}

export type GetExcludedQueryArgs = {
    skipGuest: boolean
    skipNonCanon: boolean
}

type SharedMutationArgs = {
    editModeToken: Token
    comicId: ComicId
}

export type SetFlagMutationArgs = SharedMutationArgs & {
    flagType: FlagType
    value: boolean
}

export type SetTextMutationArgs = SharedMutationArgs & {
    value: string
}

export type SetPublishDateMutationArgs = SharedMutationArgs & {
    publishDate: string
    isAccuratePublishDate: boolean
}

export type AddItemMutationArgs = AddItemToComicBody

export type RemoveItemMutationArgs = SharedMutationArgs & {
    itemId: ItemId
}

export type AddItemsMutationArgs = AddItemsToComicBody

export type AddAdvanceComicMutationArgs = AddAdvanceComicBody

export type ListAdvanceComicsQueryArgs = { editModeToken: Token }

export type RunComicUpdaterMutationArgs = RunComicUpdaterBody

export const comicApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getComicData: builder.query<
            GetComicdataComicIdResponse,
            GetDataQueryArgs
        >({
            query: ({
                comic,
                editModeToken,
                skipGuest,
                skipNonCanon,
                showAllMembers,
                orderMembersByLastAppearance,
            }) => {
                const query: GetComicdataComicIdQuery = {}
                if (editModeToken) {
                    query.token = editModeToken
                }
                if (skipNonCanon) {
                    query.exclude = 'non-canon'
                } else if (skipGuest) {
                    query.exclude = 'guest'
                }
                if (showAllMembers || editModeToken) {
                    query.include = 'all'
                }
                query.sorting = orderMembersByLastAppearance
                    ? 'by-last-appearance'
                    : 'by-count'

                return queryFromSpec(GetComicdataComicIdSpec, {
                    pathParams: comic,
                    query,
                })
            },
            transformResponse:
                transformResponseByJsonParseResultText<GetComicdataComicIdResponse>,
            providesTags: (result) =>
                result ? [{ type: 'Comic', id: result.comic }] : [],
        }),
        getExcluded: builder.query<
            GetComicdataExcludedResponse,
            GetExcludedQueryArgs
        >({
            query: ({ skipGuest, skipNonCanon }) => {
                const query: GetComicdataExcludedQuery = {}

                if (skipGuest) {
                    query.exclusion = 'guest'
                } else if (skipNonCanon) {
                    query.exclusion = 'non-canon'
                }

                return queryFromSpec(GetComicdataExcludedSpec, { query })
            },
            transformResponse:
                transformResponseByJsonParseResultText<GetComicdataExcludedResponse>,
            providesTags: (result, error, args) =>
                result
                    ? [
                          {
                              type: 'Comic',
                              id: `EXCLUDED-${args.skipGuest}-${args.skipNonCanon}`,
                          },
                          {
                              type: 'Comic',
                              id: 'EXCLUDED',
                          },
                      ]
                    : [],
        }),
        listAll: builder.query<GetComicdataResponse, void>({
            query: () => {
                const query: GetComicdataQuery = {}
                return queryFromSpec(GetComicdataSpec, { query })
            },
            transformResponse:
                transformResponseByJsonParseResultText<GetComicdataResponse>,
            providesTags: (result, _error, _args) =>
                result
                    ? [
                          {
                              type: 'Comic',
                              id: 'ALL',
                          },
                      ]
                    : [],
        }),
        getConainingItems: builder.query<
            GetComicdataContainingItemsResponse,
            ItemId[]
        >({
            query: (args) => {
                return queryFromSpec(GetComicdataContainingItemsSpec, {
                    query: { 'item-id': args },
                })
            },
            transformResponse:
                transformResponseByJsonParseResultText<GetComicdataContainingItemsResponse>,
            providesTags: (result, _error, _args) =>
                result
                    ? [
                          {
                              type: 'Comic',
                              id: 'ITEMS',
                          },
                      ]
                    : [],
        }),
        patchComic: builder.mutation<
            PatchComicdataComicIdResponse,
            { comic: ComicId; body: PatchComicBody }
        >({
            query: ({ comic, body }) =>
                queryFromSpec(PatchComicdataComicIdSpec, {
                    pathParams: comic,
                    body,
                }),
            onQueryStarted: toastSuccess,
            invalidatesTags: (result, _error, { body, comic }) => {
                const tags: TagDescription<
                    EndpointBuilderTagTypeExtractor<typeof builder>
                >[] = []
                if (result) {
                    tags.push({ type: 'Comic', id: comic })
                    tags.push(
                        {
                            type: 'Log',
                            id: 'FULL',
                        },
                        {
                            type: 'Log',
                            id: `comic-${comic}`,
                        },
                        {
                            type: 'Comic',
                            id: 'ADVANCE',
                        }
                    )
                    if (body.isGuestComic || body.isNonCanon) {
                        tags.push({
                            type: 'Comic',
                            id: 'EXCLUDED',
                        })
                    }
                    if (body.title || body.isGuestComic || body.isNonCanon) {
                        tags.push({
                            type: 'Comic',
                            id: 'ALL',
                        })
                    }
                }

                return tags
            },
            transformResponse:
                transformResponseByJsonParseResultText<PatchComicdataComicIdResponse>,
        }),
        addItem: builder.mutation<
            PostComicdataAdditemResponse,
            AddItemMutationArgs
        >({
            query: (body) => queryFromSpec(PostComicdataAdditemSpec, { body }),
            onQueryStarted: toastSuccess,
            transformResponse:
                transformResponseByJsonParseResultText<PostComicdataAdditemResponse>,
            invalidatesTags: (result, _error, args) => {
                const tags: TagDescription<
                    EndpointBuilderTagTypeExtractor<typeof builder>
                >[] = []
                if (result) {
                    // Untagged, so it invalidates every cached comic, not
                    // just `args.comicId` — an added storyline can affect
                    // `activeStorylines` on any other comic within its
                    // (possibly open-ended) start/end range, matching
                    // `patchItem`'s invalidation of the same tag.
                    tags.push({ type: 'Comic' })
                    tags.push({ type: 'Comic', id: 'ITEMS' })
                    if (!args.new) {
                        tags.push(
                            {
                                type: 'Log',
                                id: 'FULL',
                            },
                            {
                                type: 'Log',
                                id: `comic-${args.comicId}`,
                            },
                            {
                                type: 'Log',
                                id: `item-${args.itemId}`,
                            }
                        )
                    } else {
                        // If there's a new item, we need to reload the items
                        tags.push({
                            type: 'Item',
                            id: 'LIST-ALL',
                        })
                        // TODO: When reworking the response data, add data
                        // that can make this invalidation less broad. Currently
                        // we have no idea what the item id of a new item is
                        // after it gets created on the client side.
                        tags.push({
                            type: 'Log',
                            id: 'ALL',
                        })
                    }
                }
                return tags
            },
        }),
        removeItem: builder.mutation<
            PostComicdataRemoveitemResponse,
            RemoveItemMutationArgs
        >({
            query: (args) => {
                const body: RemoveItemFromComicBody = {
                    token: args.editModeToken,
                    comicId: args.comicId,
                    itemId: args.itemId,
                }
                return queryFromSpec(PostComicdataRemoveitemSpec, { body })
            },
            onQueryStarted: toastSuccess,
            transformResponse:
                transformResponseByJsonParseResultText<PostComicdataRemoveitemResponse>,
            invalidatesTags: (result, _error, args) => {
                return result
                    ? [
                          // Untagged, so it invalidates every cached comic —
                          // see the matching comment in `addItem`.
                          { type: 'Comic' },
                          { type: 'Comic', id: 'ITEMS' },

                          {
                              type: 'Log',
                              id: 'FULL',
                          },
                          {
                              type: 'Log',
                              id: `comic-${args.comicId}`,
                          },
                          {
                              type: 'Log',
                              id: `item-${args.itemId}`,
                          },
                      ]
                    : []
            },
        }),
        addItems: builder.mutation<
            PostComicdataAdditemsResponse,
            AddItemsMutationArgs
        >({
            query: (body) => queryFromSpec(PostComicdataAdditemsSpec, { body }),
            onQueryStarted: async (args, api) => {
                try {
                    const result = await api.queryFulfilled
                    // TODO: Instead of matching on return text (fragile) maybe re-think the return format entirely?
                    // Take inspiration from WM.org(?)
                    if (result.data.startsWith('No new')) {
                        toast.info(result.data)
                    } else {
                        toast.success(result.data)
                    }
                } catch {
                    // Errors are handled by rtkQueryErrorLogger
                }
            },
            transformResponse:
                transformResponseByJsonParseResultText<PostComicdataAdditemsResponse>,
            invalidatesTags: (result, _error, args) => {
                const tags: TagDescription<
                    EndpointBuilderTagTypeExtractor<typeof builder>
                >[] = []
                if (result) {
                    // Untagged, so it invalidates every cached comic — see
                    // the matching comment in `addItem`.
                    tags.push({ type: 'Comic' })
                    tags.push({ type: 'Comic', id: 'ITEMS' })

                    tags.push(
                        {
                            type: 'Log',
                            id: 'FULL',
                        },
                        {
                            type: 'Log',
                            id: `comic-${args.comicId}`,
                        }
                    )
                    for (const item of args.items) {
                        tags.push({
                            type: 'Log',
                            id: `item-${item.itemId}`,
                        })
                    }
                }
                return tags
            },
        }),
        listAdvanceComics: builder.query<
            GetComicdataAdvanceResponse,
            ListAdvanceComicsQueryArgs
        >({
            query: ({ editModeToken }) => {
                const query: GetComicdataAdvanceQuery = { token: editModeToken }
                return queryFromSpec(GetComicdataAdvanceSpec, { query })
            },
            transformResponse:
                transformResponseByJsonParseResultText<GetComicdataAdvanceResponse>,
            providesTags: (result) =>
                result
                    ? [
                          {
                              type: 'Comic',
                              id: 'ADVANCE',
                          },
                      ]
                    : [],
        }),
        addAdvanceComic: builder.mutation<
            PostComicdataAdvanceResponse,
            AddAdvanceComicMutationArgs
        >({
            query: (body) => queryFromSpec(PostComicdataAdvanceSpec, { body }),
            onQueryStarted: toastSuccess,
            transformResponse:
                transformResponseByJsonParseResultText<PostComicdataAdvanceResponse>,
            invalidatesTags: (result) =>
                result
                    ? [
                          { type: 'Comic', id: 'ADVANCE' },
                          { type: 'Comic', id: 'ALL' },
                      ]
                    : [],
        }),
        runComicUpdater: builder.mutation<
            PostComicdataAdvanceRunUpdaterResponse,
            RunComicUpdaterMutationArgs
        >({
            query: (body) =>
                queryFromSpec(PostComicdataAdvanceRunUpdaterSpec, { body }),
            onQueryStarted: toastSuccess,
            transformResponse:
                transformResponseByJsonParseResultText<PostComicdataAdvanceRunUpdaterResponse>,
        }),
    }),
})

export const {
    useGetComicDataQuery,
    useGetExcludedQuery,
    useListAllQuery,
    useGetConainingItemsQuery,
    usePatchComicMutation,
    useAddItemMutation,
    useRemoveItemMutation,
    useAddItemsMutation,
    useListAdvanceComicsQuery,
    useAddAdvanceComicMutation,
    useRunComicUpdaterMutation,
} = comicApiSlice

export function toGetDataQueryArgs(
    comic: number,
    settings: SettingValues
): GetDataQueryArgs {
    return {
        comic,
        editModeToken: settings.editMode ? settings.editModeToken : undefined,
        showAllMembers: settings.showAllMembers,
        orderMembersByLastAppearance: settings.orderMembersByLastAppearance,
        skipGuest: settings.skipGuest,
        skipNonCanon: settings.skipNonCanon,
    }
}

export function toGetExcludedQueryArgs(
    settings: SettingValues
): GetExcludedQueryArgs {
    return {
        skipGuest: settings.skipGuest,
        skipNonCanon: settings.skipNonCanon,
    }
}

const getComicDataSelector = createSelector(
    (state: RootState) => state.comic.current,
    (state: RootState) => state.settings.values,
    (currentComic, settings) => {
        if (settings) {
            return comicApiSlice.endpoints.getComicData.select(
                toGetDataQueryArgs(currentComic, settings)
            )
        } else {
            return null
        }
    }
)

export const previousComicSelector = createSelector(
    (state: RootState) => state.comic.current,
    (state: RootState) => {
        const selector = getComicDataSelector(state)
        if (selector) {
            return selector(state)
        } else {
            return null
        }
    },
    (currentComic, comicQuery) => {
        if (
            comicQuery &&
            comicQuery.data &&
            comicQuery.data.hasData &&
            comicQuery.data.previous
        ) {
            return comicQuery.data.previous
        }

        // If we don't have any data, rely on plain ol' math
        if (currentComic > 1) {
            return currentComic - 1
        } else {
            return currentComic
        }
    }
)

export const nextComicSelector = createSelector(
    (state: RootState) => state.comic.current,
    (state: RootState) => state.comic.latest,
    (state: RootState) => {
        const selector = getComicDataSelector(state)
        if (selector) {
            return selector(state)
        } else {
            return null
        }
    },
    (currentComic, latestComic, comicQuery) => {
        if (
            comicQuery &&
            comicQuery.data &&
            comicQuery.data.hasData &&
            comicQuery.data.next
        ) {
            return comicQuery.data.next
        }

        if (currentComic < latestComic) {
            return currentComic + 1
        } else {
            return currentComic
        }
    }
)
