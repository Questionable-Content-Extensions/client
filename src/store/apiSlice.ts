import { EndpointBuilder } from '@reduxjs/toolkit/dist/query/endpointDefinitions'
import { BaseQueryFn, createApi } from '@reduxjs/toolkit/query/react'

import constants from '~/constants'
import { fetch } from '~/utils'

type GreaseMonkeyError =
    | {
          type: 'TRY_CATCH'
          error: any
      }
    | {
          type: 'MAINTENANCE'
      }
    | {
          type: 'STATUS_ERROR'
          response: GM.Response<undefined>
      }

type GreasemonkeyBaseQuery = BaseQueryFn<
    {
        url: string
        configuration?: {
            context?: undefined
            method?:
                | 'GET'
                | 'POST'
                | 'PUT'
                | 'DELETE'
                | 'PATCH'
                | 'HEAD'
                | 'TRACE'
                | 'OPTIONS'
                | 'CONNECT'
            data?: string
            headers?: {
                [header: string]: string
            }
            overrideMimeType?: string
            user?: string
            password?: string
        }
    },
    GM.Response<undefined>,
    GreaseMonkeyError,
    {}, // DefinitionExtraOptions
    {} // Meta
>
const greasemonkeyBaseQuery = ({
    baseUrl,
}: {
    baseUrl: string
}): GreasemonkeyBaseQuery => {
    return async ({ url, configuration }, _api, _extraOptions) => {
        let response
        try {
            response = await fetch(`${baseUrl}${url}`, configuration)
        } catch (e) {
            return {
                error: {
                    type: 'TRY_CATCH',
                    error: e,
                },
            }
        }
        if (response.status === 503) {
            return { error: { type: 'MAINTENANCE' } }
        } else if (response.status >= 300 || response.status === 0) {
            return { error: { type: 'STATUS_ERROR', response: response } }
        }
        return { data: response }
    }
}

export type Builder = EndpointBuilder<
    GreasemonkeyBaseQuery,
    'Comic' | 'Item',
    'qcExtApi'
>

export const apiSlice = createApi({
    baseQuery: greasemonkeyBaseQuery({
        baseUrl: constants.webserviceBaseUrl,
    }),
    tagTypes: ['Comic', 'Item'],
    endpoints: () => ({}),
})
