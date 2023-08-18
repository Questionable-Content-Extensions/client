import { AnyAction } from 'redux'
import { ThunkDispatch } from 'redux-thunk'

import { QueryStatus } from '@reduxjs/toolkit/dist/query'
import { RootState } from '@reduxjs/toolkit/dist/query/core/apiState'
import { EndpointBuilder } from '@reduxjs/toolkit/dist/query/endpointDefinitions'
import {
    BaseQueryFn,
    FetchArgs,
    FetchBaseQueryError,
    FetchBaseQueryMeta,
    createApi,
    fetchBaseQuery,
} from '@reduxjs/toolkit/query/react'

export const qcExtApi = createApi({
    reducerPath: 'qcExtApi',
    baseQuery: fetchBaseQuery({
        baseUrl: '/api/v2/',
    }),
    tagTypes: ['Comic', 'Item'],
    endpoints: (builder) => ({}),
})

export const {} = qcExtApi
