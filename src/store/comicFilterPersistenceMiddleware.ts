import { Middleware, MiddlewareAPI } from '@reduxjs/toolkit'
import type { RootState } from '@store/store'

import constants, { HAS_GREASEMONKEY } from '~/constants'

import { setFilteredComics } from './comicFilterSlice'
import { updateSettings } from './settingsSlice'

/**
 * Persists (or clears) the comic filter in GM storage in response to filter
 * changes and to the "remember comic filter" setting being toggled off.
 *
 * This lives outside `comicFilterSlice`'s reducer because reducers must stay
 * pure (no side effects like GM storage calls) to work correctly with Redux
 * tooling such as time-travel debugging and React StrictMode's
 * double-invocation.
 */
export const comicFilterPersistenceMiddleware: Middleware =
    (api: MiddlewareAPI) => (next) => (action) => {
        const result = next(action)

        if (!HAS_GREASEMONKEY) {
            return result
        }

        if (setFilteredComics.match(action)) {
            const state = api.getState() as RootState
            if (state.settings.values?.rememberComicFilter) {
                void GM.setValue(
                    constants.comicFilterKey,
                    JSON.stringify(state.comicFilter)
                )
            }
        } else if (
            updateSettings.fulfilled.match(action) &&
            !action.payload.rememberComicFilter
        ) {
            void GM.deleteValue(constants.comicFilterKey)
        }

        return result
    }
