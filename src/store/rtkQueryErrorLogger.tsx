import { toast } from 'react-toastify'

import {
    Middleware,
    MiddlewareAPI,
    isRejectedWithValue,
} from '@reduxjs/toolkit'

import constants from '~/constants'
import { warn } from '~/utils'

import {
    GREASMONKEY_ERROR_TYPES,
    GreasemonkeyError,
    isGreasemonkeyResponse,
} from './apiSlice'

/**
 * Log a warning and show a toast!
 */
export const rtkQueryErrorLogger: Middleware =
    (_api: MiddlewareAPI) => (next) => (action) => {
        // RTK Query uses `createAsyncThunk` from redux-toolkit under the hood, so we're able to utilize these matchers!
        if (isRejectedWithValue(action)) {
            const payload = action.payload
            if (payloadIsGreasemonkeyError(payload)) {
                switch (payload.type) {
                    case 'MAINTENANCE':
                        toast.info(constants.messages.maintenance)
                        break

                    case 'STATUS_ERROR':
                        toast.error(
                            'The QC Extensions server responded with an unexpected HTTP' +
                                `status code ${payload.response.status} (` +
                                `${payload.response.statusText}) and the response was ` +
                                `"${payload.response.responseText}"`,
                            { autoClose: 15000 }
                        )
                        break
                    case 'TRY_CATCH':
                        if (isGreasemonkeyResponse(payload.error)) {
                            const response = payload.error
                            if (response.status === 0) {
                                toast.error(
                                    'The QC Extensions server is not responding to requests',
                                    { autoClose: 15000 }
                                )
                            } else {
                                toast.error(
                                    'The QC Extensions server responded with an unexpected HTTP' +
                                        `status code ${response.status} (` +
                                        `${response.statusText}) and the response was ` +
                                        `"${response.responseText}"`,
                                    { autoClose: 15000 }
                                )
                            }
                        } else {
                            toast.error(
                                'Unknown error encountered. See JS console for details',
                                { autoClose: 15000 }
                            )
                        }
                        break
                }
            } else {
                warn(
                    "We got a rejected action that isn't handled!",
                    JSON.stringify(action)
                )
            }
        }

        return next(action)
    }

function payloadIsGreasemonkeyError(
    payload: any
): payload is GreasemonkeyError {
    return 'type' in payload && GREASMONKEY_ERROR_TYPES.includes(payload.type)
}
