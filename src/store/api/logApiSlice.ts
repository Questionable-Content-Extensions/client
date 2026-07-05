import GetLogSpec, { GetLogQuery, GetLogResponse } from '@endpoints/GetLog'
import GetLogComicSpec, {
    GetLogComicQuery,
    GetLogComicResponse,
} from '@endpoints/GetLogComic'
import GetLogItemSpec, {
    GetLogItemQuery,
    GetLogItemResponse,
} from '@endpoints/GetLogItem'
import {
    apiSlice,
    queryFromSpec,
    transformResponseByJsonParseResultText,
} from '@store/apiSlice'

export const logApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getLogs: builder.query<GetLogResponse, GetLogQuery>({
            query: (query) => queryFromSpec(GetLogSpec, { query }),
            transformResponse:
                transformResponseByJsonParseResultText<GetLogResponse>,
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
        getLogsForComic: builder.query<GetLogComicResponse, GetLogComicQuery>({
            query: (query) => queryFromSpec(GetLogComicSpec, { query }),
            transformResponse:
                transformResponseByJsonParseResultText<GetLogComicResponse>,
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
        getLogsForItem: builder.query<GetLogItemResponse, GetLogItemQuery>({
            query: (query) => queryFromSpec(GetLogItemSpec, { query }),
            transformResponse:
                transformResponseByJsonParseResultText<GetLogItemResponse>,
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
