import { describe, expect, it } from 'vitest'

import { hexColorToRgb } from './color'

describe('hexColorToRgb', () => {
    it('parses a full 6-character hex color, with or without a leading #', () => {
        expect(hexColorToRgb('#0033ff')).toEqual([0, 51, 255])
        expect(hexColorToRgb('0033ff')).toEqual([0, 51, 255])
    })

    it('expands a 3-character shorthand hex color', () => {
        expect(hexColorToRgb('#03f')).toEqual([0, 51, 255])
        expect(hexColorToRgb('fff')).toEqual([255, 255, 255])
    })

    it('throws on malformed input instead of returning NaN components', () => {
        expect(() => hexColorToRgb('#zzzzzz')).toThrow()
        expect(() => hexColorToRgb('12')).toThrow()
        expect(() => hexColorToRgb('')).toThrow()
    })
})
