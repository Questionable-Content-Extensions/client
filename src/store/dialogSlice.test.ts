import { describe, expect, it } from 'vitest'

import dialogReducer, {
    setShowAddAdvanceComicDialog,
    setShowEditLogDialog,
} from './dialogSlice'

describe('dialogSlice', () => {
    it('starts with the advance comic dialog hidden', () => {
        expect(
            dialogReducer(undefined, { type: 'unknown' })
                .showAddAdvanceComicDialog
        ).toBe(false)
    })

    it('shows and hides the advance comic dialog', () => {
        const shown = dialogReducer(
            undefined,
            setShowAddAdvanceComicDialog(true)
        )
        expect(shown.showAddAdvanceComicDialog).toBe(true)

        const hidden = dialogReducer(shown, setShowAddAdvanceComicDialog(false))
        expect(hidden.showAddAdvanceComicDialog).toBe(false)
    })

    it('starts with the edit log dialog closed', () => {
        expect(
            dialogReducer(undefined, { type: 'unknown' }).showEditLogDialogFor
        ).toEqual({ kind: 'closed' })
    })

    it('shows the edit log dialog for all logs', () => {
        const state = dialogReducer(
            undefined,
            setShowEditLogDialog({ kind: 'all' })
        )
        expect(state.showEditLogDialogFor).toEqual({ kind: 'all' })
    })

    it('shows the edit log dialog for comic id 0 without being mistaken for closed', () => {
        const state = dialogReducer(
            undefined,
            setShowEditLogDialog({ kind: 'comic', comicId: 0 })
        )
        expect(state.showEditLogDialogFor).toEqual({
            kind: 'comic',
            comicId: 0,
        })
    })

    it('closes the edit log dialog', () => {
        const shown = dialogReducer(
            undefined,
            setShowEditLogDialog({ kind: 'comic', comicId: 666 })
        )
        const closed = dialogReducer(
            shown,
            setShowEditLogDialog({ kind: 'closed' })
        )
        expect(closed.showEditLogDialogFor).toEqual({ kind: 'closed' })
    })
})
