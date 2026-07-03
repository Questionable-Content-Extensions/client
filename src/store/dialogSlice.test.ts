import { describe, expect, it } from 'vitest'

import dialogReducer, { setShowAddAdvanceComicDialog } from './dialogSlice'

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
})
