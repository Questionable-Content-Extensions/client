import { toast } from 'react-toastify'

import { Middleware, MiddlewareAPI } from '@reduxjs/toolkit'
import type { RootState } from '@store/store'

import { isStateDirtySelector } from './comicEditorSlice'
import { setCurrentComic } from './comicSlice'

/**
 * Shows a toast when navigation implicitly breaks an item navigation lock,
 * and guards against navigating away from a comic with unsaved editor
 * changes.
 *
 * This lives outside the `comicSlice` reducer because reducers must stay
 * pure (no side effects like toasts/`window.confirm`) to work correctly with
 * Redux tooling such as time-travel debugging and React StrictMode's
 * double-invocation.
 */
export const comicNavigationMiddleware: Middleware =
    (api: MiddlewareAPI) => (next) => (action) => {
        if (setCurrentComic.match(action)) {
            const state = api.getState() as RootState

            if (
                state.settings.values?.editMode &&
                isStateDirtySelector(state) &&
                !window.confirm(
                    'This comic has unsaved changes. Are you sure you want ' +
                        'to navigate away and lose them?'
                )
            ) {
                return
            }

            const prevLockedToItem = state.comic.lockedToItem
            if (!action.payload.locked && prevLockedToItem !== null) {
                toast.info(
                    `A navigation event that was unrelated to the navigation-locked ` +
                        `item took place, ` +
                        `so the page navigation is back to being unlocked again`
                )
            }
        }

        return next(action)
    }
