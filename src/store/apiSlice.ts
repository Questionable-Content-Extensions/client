import { EndpointBuilder } from '@reduxjs/toolkit/dist/query/endpointDefinitions'
import { BaseQueryFn, createApi } from '@reduxjs/toolkit/query/react'

import constants from '~/constants'
import { error, fetch, warn } from '~/utils'

export type GreasemonkeyError =
    | {
          type: 'TRY_CATCH'
          error: GM.Response<undefined> | any
      }
    | {
          type: 'MAINTENANCE'
      }
    | {
          type: 'STATUS_ERROR'
          response: GM.Response<undefined>
      }

export function isGreasemonkeyResponse(
    possibleResponse: any
): possibleResponse is GM.Response<undefined> {
    return 'finalUrl' in possibleResponse
}

export type GreasemonkeyBaseQuery = BaseQueryFn<
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
    GreasemonkeyError,
    {}, // DefinitionExtraOptions
    {} // Meta
>
const greasemonkeyBaseQuery = ({
    baseUrl,
}: {
    baseUrl: string
}): GreasemonkeyBaseQuery => {
    return async ({ url, configuration }, _api, _extraOptions) => {
        const requestUrl = `${baseUrl}${url}`
        let response
        try {
            response = await fetch(requestUrl, configuration)
        } catch (e) {
            error(
                `Error while fetching URL '${requestUrl}'; config was`,
                configuration
            )
            return {
                error: {
                    type: 'TRY_CATCH',
                    error: e,
                },
            }
        }
        if (response.status === 503) {
            warn(
                'The server responded with 503, which indicates maintenance is ongoing.'
            )
            return { error: { type: 'MAINTENANCE' } }
        } else if (response.status >= 300 || response.status === 0) {
            error(`Got unexpected response from server`, response)
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
