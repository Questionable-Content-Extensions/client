import { describe, expect, it } from 'vitest'

import { Item } from '@models/Item'

import itemEditorReducer, {
    reset,
    setFromItem,
    setType,
} from './itemEditorSlice'

const item: Item = {
    id: 1,
    shortName: 'short',
    name: 'name',
    type: 'location',
    color: '#abcdef',
    first: 1,
    last: 2,
    appearances: 3,
    totalComics: 4,
    presence: 5,
    hasImage: false,
    primaryImage: null,
    startComicId: null,
    endComicId: null,
}

describe('itemEditorSlice', () => {
    it('starts with cast as both type and originalType', () => {
        const state = itemEditorReducer(undefined, { type: 'unknown' })
        expect(state.type).toBe('cast')
        expect(state.originalType).toBe('cast')
    })

    it('resets originalType back to its own initial value, not type', () => {
        const loaded = itemEditorReducer(undefined, setFromItem(item))
        expect(loaded.originalType).toBe('location')

        const dirtied = itemEditorReducer(loaded, setType('storyline'))
        expect(dirtied.type).toBe('storyline')

        const state = itemEditorReducer(dirtied, reset())

        expect(state.type).toBe('cast')
        expect(state.originalType).toBe('cast')
    })

    it('sets both type and originalType from the loaded item', () => {
        const state = itemEditorReducer(undefined, setFromItem(item))

        expect(state.type).toBe('location')
        expect(state.originalType).toBe('location')
    })
})
