import { LogByIdQuery } from '@models/LogByIdQuery'
import { LogQuery } from '@models/LogQuery'
import { LogResponse } from '@models/LogResponse'
import {
    apiSlice,
    transformResponseByJsonParseResultText,
} from '@store/apiSlice'

import constants from '~/constants'

export const logApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getLogs: builder.query<LogResponse, LogQuery>({
            query: (args) => {
                const urlQuery = new URLSearchParams({
                    token: args.token,
                    page: '' + args.page,
                }).toString()

                return {
                    url: `${constants.editLogEndpoint}?${urlQuery}`,
                }
            },
            transformResponse: transformResponseByJsonParseResultText,
            providesTags: (result, _error, args) =>
                result
                    ? [
                          {
                              type: 'Log',
                              id: 'ALL',
                          },
                          {
                              type: 'Log',
                              id: 'FULL',
                          },
                          { type: 'Log', id: `page-${args.page}` },
                      ]
                    : [],
        }),
        getLogsForComic: builder.query<LogResponse, LogByIdQuery>({
            query: (args) => {
                const urlQuery = new URLSearchParams({
                    token: args.token,
                    page: '' + args.page,
                    id: '' + args.id,
                }).toString()

                return {
                    url: `${constants.editLogEndpoint}comic?${urlQuery}`,
                }
            },
            transformResponse: transformResponseByJsonParseResultText,
            providesTags: (result, _error, args) =>
                result
                    ? [
                          {
                              type: 'Log',
                              id: 'ALL',
                          },
                          {
                              type: 'Log',
                              id: `comic-${args.id}`,
                          },
                          {
                              type: 'Log',
                              id: `comic-${args.id}-page-${args.page}`,
                          },
                      ]
                    : [],
        }),
        getLogsForItem: builder.query<LogResponse, LogByIdQuery>({
            query: (args) => {
                const urlQuery = new URLSearchParams({
                    token: args.token,
                    page: '' + args.page,
                    id: '' + args.id,
                }).toString()

                return {
                    url: `${constants.editLogEndpoint}item?${urlQuery}`,
                }
            },
            transformResponse: transformResponseByJsonParseResultText,
            providesTags: (result, _error, args) =>
                result
                    ? [
                          {
                              type: 'Log',
                              id: 'ALL',
                          },
                          {
                              type: 'Log',
                              id: `item-${args.id}`,
                          },
                          {
                              type: 'Log',
                              id: `item-${args.id}-page-${args.page}`,
                          },
                      ]
                    : [],
        }),
    }),
})

export const {
    useGetLogsQuery,
    useGetLogsForComicQuery,
    useGetLogsForItemQuery,
} = logApiSlice
