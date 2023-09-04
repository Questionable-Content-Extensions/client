import { SerializedError } from '@reduxjs/toolkit'
import { GreasemonkeyError, isGreasemonkeyResponse } from '@store/apiSlice'

import constants from '~/constants'
import { error as logError } from '~/utils'

type DebugError = {
    isDebugError: true
}

export default function ErrorPresenter({
    error,
}: {
    error: GreasemonkeyError | SerializedError | DebugError
}) {
    if ('isDebugError' in error) {
        return (
            <ErrorMessage>
                <p>
                    You are running a development version of the Questionable
                    Content Extensions, and the way it works is by fetching an
                    up-to-date build of the script when the page gets
                    loaded/refreshed. In order to accomplish this,{' '}
                    <code>npm run start</code> must be running in the{' '}
                    <code>qcext-client</code> project, since it validates,
                    builds and serves said up-to-date script.
                </p>
                <p>
                    Make sure <code>npm run start</code> is running and has no
                    build errors, and then refresh this page.
                </p>
            </ErrorMessage>
        )
    } else if ('type' in error) {
        switch (error.type) {
            case 'MAINTENANCE':
                return (
                    <ErrorMessage>
                        {constants.messages.maintenance}
                    </ErrorMessage>
                )
            case 'STATUS_ERROR':
                return (
                    <ErrorMessage>
                        <p>
                            QC Extensions server responded with unexpected HTTP
                            status code {error.response.status} (
                            {error.response.statusText}) and the response was "
                            {error.response.responseText}"
                        </p>
                    </ErrorMessage>
                )
            case 'TRY_CATCH':
                if (isGreasemonkeyResponse(error.error)) {
                    const response = error.error
                    if (response.status === 0) {
                        return (
                            <ErrorMessage>
                                <p>QC Extensions server is not responding</p>
                            </ErrorMessage>
                        )
                    } else {
                        return (
                            <ErrorMessage>
                                <p>
                                    Unexpected API fetching error with HTTP
                                    status code {response.status} (
                                    {response.statusText}) where the response
                                    was {response.responseText}
                                </p>
                            </ErrorMessage>
                        )
                    }
                } else {
                    return (
                        <ErrorMessage forkAwesomeIcon="fa-question">
                            <p>
                                Unknown error encountered. See JS console for
                                details
                            </p>
                        </ErrorMessage>
                    )
                }
        }
    } else {
        logError('Unknown error encountered: ', error)
        return (
            <ErrorMessage forkAwesomeIcon="fa-question">
                <p>Unknown error encountered. See JS console for details</p>
            </ErrorMessage>
        )
    }
}

function ErrorMessage({
    forkAwesomeIcon = 'fa-exclamation',
    children,
}: {
    forkAwesomeIcon?: string
    children: React.ReactNode
}) {
    return (
        <div className="text-center pt-4">
            <i className={`fa ${forkAwesomeIcon}`} aria-hidden="true"></i>
            <br />
            {children}
        </div>
    )
}
