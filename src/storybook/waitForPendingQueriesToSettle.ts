import { QueryStatus } from '@reduxjs/toolkit/query'
import { apiSlice } from '@store/apiSlice'
import store from '@store/store'
import { waitFor } from '@testing-library/react'

// RTK Query doesn't abort in-flight requests on unmount, it just stops
// listening — the underlying fetch keeps running and can resolve after the
// *next* story has already swapped in its own MSW handlers, getting reported
// as an unhandled request there (or, for a story asserting on an expected
// console error, after that story's suppression window has already closed).
// Give still-pending queries on the store a moment to settle before moving
// on. Stories that deliberately model a perpetual loading state (an
// unresolvable mocked request) will time out here, which is fine — that's
// the expected shape for those stories.
export async function waitForPendingQueriesToSettle(
    timeout = 500
): Promise<void> {
    try {
        await waitFor(
            () => {
                const queries = store.getState()[apiSlice.reducerPath].queries
                const stillPending = Object.values(queries).some(
                    (query) => query?.status === QueryStatus.pending
                )
                if (stillPending) {
                    throw new Error('queries still pending')
                }
            },
            { timeout, interval: 25 }
        )
    } catch {
        // Timed out — assume this story intentionally left a query pending forever.
    }
}
