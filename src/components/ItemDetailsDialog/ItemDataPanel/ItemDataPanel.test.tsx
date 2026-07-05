import { describe, expect, it } from 'vitest'

import { ItemType } from '@models/ItemType'

import { involvesCastText, involvesLocationText } from './ItemDataPanel'

describe('involvesLocationText', () => {
    it('returns the expected phrase for each known ItemType', () => {
        expect(involvesLocationText('cast')).toBe('spotted at')
        expect(involvesLocationText('location')).toBe(
            'visited simultaneously with'
        )
        expect(involvesLocationText('storyline')).toBe('involves the places')
    })

    it('throws instead of silently returning undefined for an unknown type', () => {
        expect(() => involvesLocationText('event' as ItemType)).toThrow(
            /Unhandled ItemType/
        )
    })
})

describe('involvesCastText', () => {
    it('returns the expected phrase for each known ItemType', () => {
        expect(involvesCastText('cast')).toBe('spotted with')
        expect(involvesCastText('location')).toBe('visited by')
        expect(involvesCastText('storyline')).toBe('involves the people')
    })

    it('throws instead of silently returning undefined for an unknown type', () => {
        expect(() => involvesCastText('event' as ItemType)).toThrow(
            /Unhandled ItemType/
        )
    })
})
