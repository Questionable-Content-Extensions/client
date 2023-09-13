import { toast } from 'react-toastify'

import { ComicId } from '@models/ComicId'
import { ItemId } from '@models/ItemId'
import { PayloadAction, createSlice } from '@reduxjs/toolkit'

import { HAS_GREASEMONKEY } from '~/constants'

interface ComicState {
    current: ComicId
    latest: ComicId
    random: ComicId
    lockedToItem: ItemId | null
}

const initialState: ComicState = {
    current: 0,
    latest: 0,
    random: 0,
    lockedToItem: null,
}

export const comicSlice = createSlice({
    name: 'comic',
    initialState,
    reducers: {
        setLatestComic: (state, action: PayloadAction<number>) => {
            state.latest = action.payload
        },
        setCurrentComic: {
            reducer: (
                state,
                action: PayloadAction<{
                    comic: ComicId
                    updateHistory: boolean
                    locked: boolean
                    poppedState: boolean
                }>
            ) => {
                const comic = action.payload.comic
                state.current = comic

                const locked = action.payload.locked
                if (!locked && state.lockedToItem !== null) {
                    toast.info(
                        `A navigation event that was unrelated to the navigation-locked ` +
                            `item took place, ` +
                            `so the page navigation is back to being unlocked again`
                    )
                    state.lockedToItem = null
                }

                if (!HAS_GREASEMONKEY) {
                    // When we're not in GM mode, we don't want to modify the browser history here
                    return
                }

                if (!action.payload.poppedState) {
                    if (action.payload.updateHistory) {
                        if (state.current === 0) {
                            window.history.replaceState(
                                { comic, lockedToItem: state.lockedToItem },
                                '',
                                '/view.php?comic=' + comic
                            )
                        } else {
                            window.history.pushState(
                                { comic, lockedToItem: state.lockedToItem },
                                '',
                                '/view.php?comic=' + comic
                            )
                        }
                    }
                }
            },
            prepare: (
                comic: ComicId,
                options?: {
                    locked?: boolean
                    updateHistory?: boolean
                    poppedState?: boolean
                }
            ) => {
                return {
                    payload: {
                        comic,
                        updateHistory: options?.updateHistory ?? true,
                        locked: options?.locked ?? false,
                        poppedState: options?.poppedState ?? false,
                    },
                }
            },
        },
        setRandom: (state, action: PayloadAction<ComicId>) => {
            state.random = action.payload
        },
        setLockedToItem: (state, action: PayloadAction<ItemId | null>) => {
            state.lockedToItem = action.payload
        },
    },
})

export const { setCurrentComic, setLatestComic, setRandom, setLockedToItem } =
    comicSlice.actions

export default comicSlice.reducer
