import { EndpointBuilder } from '@reduxjs/toolkit/dist/query/endpointDefinitions'
import { BaseQueryFn, createApi } from '@reduxjs/toolkit/query/react'

import constants, { HAS_GREASEMONKEY } from '~/constants'
import { error, fetch as gmFetch, warn } from '~/utils'

export type GreasemonkeyErrorType = 'TRY_CATCH' | 'MAINTENANCE' | 'STATUS_ERROR'
export const GREASMONKEY_ERROR_TYPES: GreasemonkeyErrorType[] = [
    'TRY_CATCH',
    'MAINTENANCE',
    'STATUS_ERROR',
]
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

        if (!configuration) {
            configuration = {
                headers: {
                    'X-QCExt-Version': GM.info.script.version,
                },
            }
        } else {
            configuration = {
                ...configuration,
                headers: {
                    ...(configuration.headers ?? {}),
                    'X-QCExt-Version': GM.info.script.version,
                },
            }
        }

        let response
        try {
            response = await gmFetch(requestUrl, configuration)
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

const fakeGreasemonkeyBaseQuery = ({
    baseUrl,
}: {
    baseUrl: string
}): GreasemonkeyBaseQuery => {
    return async ({ url, configuration }, _api, _extraOptions) => {
        const requestUrl = `${baseUrl}${url}`

        const requestOptions: RequestInit = {}
        if (configuration) {
            requestOptions.body = configuration.data
            requestOptions.headers = configuration.headers
            requestOptions.method = configuration.method
        }

        let response: Response
        try {
            response = await fetch(requestUrl, requestOptions)
        } catch (e) {
            error(
                `Error while fetching URL '${requestUrl}'; config was`,
                configuration
            )
            return {
                error: {
                    type: 'TRY_CATCH',
                    error: JSON.parse(JSON.stringify(e)),
                },
            }
        }

        const gmResponse: GM.Response<undefined> = {
            finalUrl: response.url,
            readyState: 4,
            responseHeaders: Array.from(response.headers).reduce((p, c) => {
                if (p !== '') {
                    p = p + '\n'
                }
                return p + `${c[0]}: ${c[1]}`
            }, ''),
            response: undefined,
            responseText: await response.text(),
            responseXML: false,
            status: response.status,
            statusText: response.statusText,
        }

        if (gmResponse.status === 503) {
            warn(
                'The server responded with 503, which indicates maintenance is ongoing.'
            )
            return { error: { type: 'MAINTENANCE' } }
        } else if (gmResponse.status >= 300 || gmResponse.status === 0) {
            error(`Got unexpected response from server`, gmResponse)
            return { error: { type: 'STATUS_ERROR', response: gmResponse } }
        }

        return { data: gmResponse }
    }
}

export type Builder = EndpointBuilder<
    GreasemonkeyBaseQuery,
    'Comic' | 'Item',
    'qcExtApi'
>

export const apiSlice = createApi({
    baseQuery: HAS_GREASEMONKEY
        ? greasemonkeyBaseQuery({
              baseUrl: constants.webserviceBaseUrl,
          })
        : fakeGreasemonkeyBaseQuery({
              baseUrl: constants.webserviceBaseUrl,
          }),
    tagTypes: ['Comic', 'Item', 'Log'],
    endpoints: () => ({}),
})

export function transformResponseByJsonParseResultText<T>(
    response: GM.Response<undefined>
) {
    return JSON.parse(response.responseText) as T
}
