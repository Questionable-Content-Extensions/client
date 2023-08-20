import { PayloadAction, createSlice } from '@reduxjs/toolkit'

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
                state.current = comic
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
