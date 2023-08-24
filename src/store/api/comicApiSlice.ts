import { AddItemToComicBody } from '@models/AddItemToComicBody'
import { Comic } from '@models/Comic'
import { ComicId } from '@models/ComicId'
import { ComicList } from '@models/ComicList'
import { FlagType } from '@models/FlagType'
import { ItemId } from '@models/ItemId'
import { ItemType } from '@models/ItemType'
import { PatchComicBody } from '@models/PatchComicBody'
import { RemoveItemFromComicBody } from '@models/RemoveItemFromComicBody'
import { Token } from '@models/Token'
import { createSelector } from '@reduxjs/toolkit'
import { TagDescription } from '@reduxjs/toolkit/dist/query'
import { RootState } from '@store/store'

import constants from '~/constants'
import { SettingValues } from '~/settings'

import { apiSlice } from '../apiSlice'

export type GetDataQueryArgs = {
    comic: number
    editModeToken?: string
    skipGuest: boolean
    skipNonCanon: boolean
    showAllMembers: boolean
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

export type AddItemMutationArgs = SharedMutationArgs &
    (
        | { newItem: true; newItemName: string; newItemType: ItemType }
        | { newItem: false; itemId: ItemId }
    )

export type RemoveItemMutationArgs = SharedMutationArgs & {
    itemId: ItemId
}

export const comicApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getData: builder.query<Comic, GetDataQueryArgs>({
            query: ({
                comic,
                editModeToken,
                skipGuest,
                skipNonCanon,
                showAllMembers,
            }) => {
                const urlParameters: {
                    token?: string
                    exclude?: 'guest' | 'non-canon'
                    include?: 'all'
                } = {}
                if (editModeToken) {
                    urlParameters.token = editModeToken
                }
                if (skipGuest) {
                    urlParameters.exclude = 'guest'
                } else if (skipNonCanon) {
                    urlParameters.exclude = 'non-canon'
                }
                if (showAllMembers || editModeToken) {
                    urlParameters.include = 'all'
                }
                const urlQuery = new URLSearchParams(urlParameters).toString()

                return {
                    url: `${constants.comicDataEndpoint}${comic}?${urlQuery}`,
                }
            },
            transformResponse: (response) => {
                return JSON.parse(response.responseText) as Comic
            },
            providesTags: (result) =>
                result ? [{ type: 'Comic', id: result.comic }] : [],
        }),
        getExcluded: builder.query<ComicList[], GetExcludedQueryArgs>({
            query: ({ skipGuest, skipNonCanon }) => {
                const urlParameters: { exclusion?: 'guest' | 'non-canon' } = {}

                if (skipGuest) {
                    urlParameters.exclusion = 'guest'
                } else if (skipNonCanon) {
                    urlParameters.exclusion = 'non-canon'
                }
                const urlQuery = new URLSearchParams(urlParameters).toString()

                return {
                    url: `${constants.excludedComicsEndpoint}?${urlQuery}`,
                }
            },
            transformResponse: (response) => {
                return JSON.parse(response.responseText) as ComicList[]
            },
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
        listAll: builder.query<ComicList[], void>({
            query: () => {
                return {
                    url: constants.comicDataEndpoint,
                }
            },
            transformResponse: (response) => {
                return JSON.parse(response.responseText) as ComicList[]
            },
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
        patchComic: builder.mutation<
            string,
            { comic: ComicId; body: PatchComicBody }
        >({
            query: ({ comic, body }) => {
                const url = `${constants.comicDataEndpoint}${comic}`
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
            onQueryStarted: async (
                { comic, body },
                { dispatch, queryFulfilled }
            ) => {
                try {
                    await queryFulfilled

                    const tags: TagDescription<'Comic' | 'Item'>[] = []
                    tags.push({ type: 'Comic', id: comic })
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

                    dispatch(apiSlice.util.invalidateTags(tags))
                } catch {}
            },
            transformResponse: (response) => response.responseText,
        }),
        addItem: builder.mutation<string, AddItemMutationArgs>({
            query: (args) => {
                const sharedData = {
                    token: args.editModeToken,
                    comicId: args.comicId,
                }
                let data: AddItemToComicBody
                if (args.newItem) {
                    data = {
                        ...sharedData,
                        new: true,
                        newItemName: args.newItemName,
                        newItemType: args.newItemType,
                    }
                } else {
                    data = { ...sharedData, new: false, itemId: args.itemId }
                }
                const url = constants.addItemToComicEndpoint
                return {
                    url,
                    configuration: {
                        data: JSON.stringify(data),
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json; charset=utf-8',
                        },
                    },
                }
            },
            transformResponse: (response) => response.responseText,
            invalidatesTags: (result, _error, args) => {
                return result ? [{ type: 'Comic', id: args.comicId }] : []
            },
        }),
        removeItem: builder.mutation<string, RemoveItemMutationArgs>({
            query: (args) => {
                const data: RemoveItemFromComicBody = {
                    token: args.editModeToken,
                    comicId: args.comicId,
                    itemId: args.itemId,
                }
                const url = constants.removeItemFromComicEndpoint
                return {
                    url,
                    configuration: {
                        data: JSON.stringify(data),
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json; charset=utf-8',
                        },
                    },
                }
            },
            transformResponse: (response) => response.responseText,
            invalidatesTags: (result, _error, args) => {
                return result ? [{ type: 'Comic', id: args.comicId }] : []
            },
        }),
    }),
})

export const {
    useGetDataQuery,
    useGetExcludedQuery,
    useListAllQuery,
    usePatchComicMutation,
    useAddItemMutation,
    useRemoveItemMutation,
} = comicApiSlice

export function toGetDataQueryArgs(
    comic: number,
    settings: SettingValues
): GetDataQueryArgs {
    return {
        comic,
        editModeToken: settings.editModeToken,
        showAllMembers: settings.showAllMembers,
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
            return comicApiSlice.endpoints.getData.select(
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
