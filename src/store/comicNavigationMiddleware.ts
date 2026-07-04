import { toast } from 'react-toastify'

import { Middleware, MiddlewareAPI } from '@reduxjs/toolkit'
import type { RootState } from '@store/store'

import { setCurrentComic } from './comicSlice'

/**
 * Shows a toast when navigation implicitly breaks an item navigation lock.
 *
 * This lives outside the `comicSlice` reducer because reducers must stay
 * pure (no side effects like toasts) to work correctly with Redux tooling
 * such as time-travel debugging and React StrictMode's double-invocation.
 */
export const comicNavigationMiddleware: Middleware =
    (api: MiddlewareAPI) => (next) => (action) => {
        if (setCurrentComic.match(action)) {
            const prevLockedToItem = (api.getState() as RootState).comic
                .lockedToItem
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
