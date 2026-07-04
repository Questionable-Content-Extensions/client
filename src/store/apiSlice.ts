import type { EndpointSpec } from '@endpoints/EndpointSpec'
import { EndpointBuilder } from '@reduxjs/toolkit/dist/query/endpointDefinitions'
import { BaseQueryFn, createApi } from '@reduxjs/toolkit/query/react'
import type { RootState } from '@store/store'

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
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          error: GM.Response<undefined> | any
      }
    | {
          type: 'MAINTENANCE'
      }
    | {
          type: 'STATUS_ERROR'
          response: GM.Response<undefined>
      }

function authHeaderFromState(getState: () => unknown): Record<string, string> {
    const token = (getState() as RootState).settings.values?.editModeToken
    return token ? { Authorization: `Bearer ${token}` } : {}
}

export function isGreasemonkeyResponse(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    possibleResponse: any
): possibleResponse is GM.Response<undefined> {
    return 'finalUrl' in possibleResponse
}

export interface GreasemonkeyQueryArgs {
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
        data?: string | Uint8Array
        headers?: {
            [header: string]: string
        }
        overrideMimeType?: string
        user?: string
        password?: string
    }
}

export type GreasemonkeyBaseQuery = BaseQueryFn<
    GreasemonkeyQueryArgs,
    GM.Response<undefined>,
    GreasemonkeyError,
    object, // DefinitionExtraOptions
    object // Meta
>
const greasemonkeyBaseQuery = ({
    baseUrl,
}: {
    baseUrl: string
}): GreasemonkeyBaseQuery => {
    return async ({ url, configuration }, api, _extraOptions) => {
        const requestUrl = `${baseUrl}${url}`
        const authHeader = authHeaderFromState(api.getState)

        if (!configuration) {
            configuration = {
                headers: {
                    'X-QCExt-Version': GM.info.script.version,
                    ...authHeader,
                },
            }
        } else {
            configuration = {
                ...configuration,
                headers: {
                    ...(configuration.headers ?? {}),
                    'X-QCExt-Version': GM.info.script.version,
                    ...authHeader,
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
    return async ({ url, configuration }, api, _extraOptions) => {
        const requestUrl = `${baseUrl}${url}`
        const authHeader = authHeaderFromState(api.getState)

        const requestOptions: RequestInit = { headers: authHeader }
        if (configuration) {
            requestOptions.body = configuration.data
            requestOptions.headers = {
                ...(configuration.headers ?? {}),
                ...authHeader,
            }
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

function buildQueryString(query: Record<string, unknown> | undefined) {
    if (!query) return ''
    const params = new URLSearchParams()
    for (const [key, value] of Object.entries(query)) {
        if (value === undefined) continue
        if (Array.isArray(value)) {
            for (const item of value) params.append(key, String(item))
        } else {
            params.append(key, String(value))
        }
    }
    return params.toString()
}

/**
 * Builds the `{ url, configuration }` shape `GreasemonkeyBaseQuery` expects
 * from a generated `EndpointSpec` (see `src/bindings/endpoints`), substituting
 * path params and serializing the query string and JSON body.
 */
export function queryFromSpec<Q, B, P>(
    spec: EndpointSpec<Q, B, P, unknown>,
    args?: { pathParams?: P; query?: Q; body?: B }
): GreasemonkeyQueryArgs {
    let path: string = spec.path

    if (args?.pathParams !== undefined) {
        if (typeof args.pathParams === 'object' && args.pathParams !== null) {
            for (const [key, value] of Object.entries(
                args.pathParams as Record<string, unknown>
            )) {
                path = path.replace(`{${key}}`, String(value))
            }
        } else {
            path = path.replace(/\{[^}]+\}/, String(args.pathParams))
        }
    }

    const queryString = buildQueryString(
        args?.query as Record<string, unknown> | undefined
    )
    if (queryString) path = `${path}?${queryString}`

    if (args?.body !== undefined) {
        return {
            url: path,
            configuration: {
                data: JSON.stringify(args.body),
                method: spec.method,
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                },
            },
        }
    }

    if (spec.method !== 'GET') {
        return { url: path, configuration: { method: spec.method } }
    }

    return { url: path }
}
