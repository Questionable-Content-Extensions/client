import { SerializedError } from '@reduxjs/toolkit'
import { GreasemonkeyError, isGreasemonkeyResponse } from '@store/apiSlice'

import constants from '~/constants'
import { error as logError } from '~/utils'

export default function ErrorPresenter({
    error,
}: {
    error: GreasemonkeyError | SerializedError
}) {
    if ('type' in error) {
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
    children: React.ReactChild
}) {
    return (
        <div className="text-center pt-4">
            <i className={`fa ${forkAwesomeIcon}`} aria-hidden="true"></i>
            <br />
            {children}
        </div>
    )
}
