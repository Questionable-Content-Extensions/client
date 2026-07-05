import { describe, expect, it } from 'vitest'

import { render } from '@testing-library/react'

import HighlightedText from './HighlightedText'

function highlightedSpans(container: HTMLElement) {
    return Array.from(container.querySelectorAll('span')).map(
        (span) => span.textContent
    )
}

describe('HighlightedText', () => {
    it('renders plain text unchanged when there are no highlights', () => {
        const { container } = render(
            <HighlightedText text="no matches here" highlights={[]} />
        )

        expect(container.textContent).toBe('no matches here')
        expect(highlightedSpans(container)).toEqual([])
    })

    it('is case-insensitive by default', () => {
        const { container } = render(
            <HighlightedText text="Hello World" highlights={['hello']} />
        )

        expect(highlightedSpans(container)).toEqual(['Hello'])
    })

    it('ignores empty-string highlights', () => {
        const { container } = render(
            <HighlightedText text="some text" highlights={['']} />
        )

        expect(container.textContent).toBe('some text')
        expect(highlightedSpans(container)).toEqual([])
    })

    it('highlights every non-overlapping occurrence of a term', () => {
        const { container } = render(
            <HighlightedText text="cat bat cat" highlights={['cat']} />
        )

        expect(highlightedSpans(container)).toEqual(['cat', 'cat'])
    })

    it('merges overlapping highlights from different search terms into one span', () => {
        // "ova" matches at index 1 (length 3) and "vast" matches at index 2
        // (length 4), so they overlap on the shared "va".
        const { container } = render(
            <HighlightedText text="lovastatin" highlights={['ova', 'vast']} />
        )

        expect(highlightedSpans(container)).toEqual(['ovasta'])
    })

    it('keeps merely touching (non-overlapping) highlights as separate spans', () => {
        // "foo" covers [0,3) and "bar" covers [3,6) - they touch but don't
        // overlap, so they should render as two adjacent spans, not one.
        const { container } = render(
            <HighlightedText text="foobar" highlights={['foo', 'bar']} />
        )

        expect(highlightedSpans(container)).toEqual(['foo', 'bar'])
        expect(container.textContent).toBe('foobar')
    })

    it('keeps separate, non-touching highlights as distinct spans', () => {
        const { container } = render(
            <HighlightedText
                text="foo middle bar"
                highlights={['foo', 'bar']}
            />
        )

        expect(highlightedSpans(container)).toEqual(['foo', 'bar'])
        expect(container.textContent).toBe('foo middle bar')
    })
})
