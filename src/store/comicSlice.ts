import { PayloadAction, createSlice } from '@reduxjs/toolkit'

import { HAS_GREASEMONKEY } from '~/constants'

interface ComicState {
    current: number
    latest: number
    random: number
}

const initialState: ComicState = {
    current: 0,
    latest: 0,
    random: 0,
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
                action: PayloadAction<{ comic: number; updateHistory: boolean }>
            ) => {
                const comic = action.payload.comic
                state.current = comic

                if (!HAS_GREASEMONKEY) {
                    // When we're not in GM mode, we don't want to modify the browser history here
                    return
                }

                if (action.payload.updateHistory) {
                    if (state.current === 0) {
                        window.history.replaceState(
                            { comic },
                            '',
                            '/view.php?comic=' + comic
                        )
                    } else {
                        window.history.pushState(
                            { comic },
                            '',
                            '/view.php?comic=' + comic
                        )
                    }
                }
            },
            prepare: (comic: number, updateHistory: boolean = true) => {
                return { payload: { comic, updateHistory } }
            },
        },
        setRandom: (state, action: PayloadAction<number>) => {
            state.random = action.payload
        },
    },
})

export const { setCurrentComic, setLatestComic, setRandom } = comicSlice.actions

export default comicSlice.reducer
