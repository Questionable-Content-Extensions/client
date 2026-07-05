import { describe, expect, it } from 'vitest'

import computeStorylineSegments from './computeStorylineSegments'

describe('computeStorylineSegments', () => {
    it('returns a single featured segment with no capping when fully featured', () => {
        const result = computeStorylineSegments({
            startComicId: 100,
            endComicId: 110,
            latestKnownComicId: 110,
            segments: [{ fromComicId: 100, toComicId: 110, featured: true }],
            currentComicId: 105,
        })

        expect(result.isOpenEnded).toBe(false)
        expect(result.segments).toHaveLength(1)
        expect(result.segments[0]).toMatchObject({
            kind: 'featured',
            fromComicId: 100,
            toComicId: 110,
        })
        expect(result.segments[0].widthFraction).toBeCloseTo(1, 10)
        // toComicId is exclusive, so this covers 10 comics (100-109).
        expect(result.currentComicPositionFraction).toBeCloseTo(0.5, 10)
    })

    it('caps a single long gap without inflating the surrounding featured segments', () => {
        const result = computeStorylineSegments({
            startComicId: 0,
            endComicId: 100,
            latestKnownComicId: 100,
            segments: [
                { fromComicId: 0, toComicId: 5, featured: true },
                { fromComicId: 5, toComicId: 95, featured: false },
                { fromComicId: 95, toComicId: 100, featured: true },
            ],
            currentComicId: 2,
        })

        expect(result.segments).toHaveLength(3)
        expect(result.segments.map((s) => s.kind)).toEqual([
            'featured',
            'gap',
            'featured',
        ])
        // Raw fractions were 0.05 / 0.9 / 0.05 (of 100 comics). The gap is
        // capped to 0.25 and the freed 0.65 is simply dropped rather than
        // handed to the featured segments, so their relative weight against
        // the capped gap is preserved instead of ballooning to fill the bar.
        expect(result.segments[0].widthFraction).toBeCloseTo(0.05 / 0.35, 10)
        expect(result.segments[1].widthFraction).toBeCloseTo(0.25 / 0.35, 10)
        expect(result.segments[2].widthFraction).toBeCloseTo(0.05 / 0.35, 10)

        const total = result.segments.reduce((s, r) => s + r.widthFraction, 0)
        expect(total).toBeCloseTo(1, 10)
    })

    it('positions the current-comic marker inside a capped gap proportionally, not at its edge', () => {
        const result = computeStorylineSegments({
            startComicId: 0,
            endComicId: 100,
            latestKnownComicId: 100,
            segments: [
                { fromComicId: 0, toComicId: 5, featured: true },
                { fromComicId: 5, toComicId: 95, featured: false },
                { fromComicId: 95, toComicId: 100, featured: true },
            ],
            currentComicId: 50, // 50% through the raw gap [5, 95)
        })

        // 0.375 (first featured) + 0.5 * 0.25 (halfway through the capped gap)
        expect(result.currentComicPositionFraction).toBeCloseTo(0.5, 10)
    })

    it('merges a dense run of small toggles into a single intermittent segment', () => {
        const segments = []
        for (let i = 0; i < 8; i++) {
            segments.push({
                fromComicId: i * 10,
                toComicId: i * 10 + 10,
                featured: i % 2 === 0,
            })
        }
        segments.push({ fromComicId: 80, toComicId: 1000, featured: false })

        const result = computeStorylineSegments({
            startComicId: 0,
            endComicId: 1000,
            latestKnownComicId: 1000,
            segments,
            currentComicId: 500,
        })

        expect(result.segments).toHaveLength(2)
        expect(result.segments[0]).toMatchObject({
            kind: 'intermittent',
            fromComicId: 0,
            toComicId: 70,
        })
        // The last small-toggle segment coalesces with the adjacent trailing
        // filler gap (both non-featured) before the intermittent merge runs,
        // leaving a 7-segment intermittent run (0-70, raw 0.07) and a single
        // big gap (70-1000, raw 0.93). The gap is capped to 0.25 and that
        // freed space is simply dropped (the intermittent segment's raw
        // width is already above the min-width floor, so it needs no bump
        // and borrows nothing) rather than inflating the intermittent
        // segment to fill the bar.
        expect(result.segments[0].widthFraction).toBeCloseTo(0.07 / 0.32, 5)
        expect(result.segments[1]).toMatchObject({
            kind: 'gap',
            fromComicId: 70,
            toComicId: 1000,
        })
        expect(result.segments[1].widthFraction).toBeCloseTo(0.25 / 0.32, 5)
    })

    it('bumps a featured segment narrower than the minimum width, borrowing only from the gap', () => {
        const result = computeStorylineSegments({
            startComicId: 0,
            endComicId: 100,
            latestKnownComicId: 100,
            segments: [
                { fromComicId: 0, toComicId: 1, featured: true },
                { fromComicId: 1, toComicId: 98, featured: false },
                { fromComicId: 98, toComicId: 100, featured: true },
            ],
            currentComicId: 0,
        })

        expect(result.segments.map((s) => s.kind)).toEqual([
            'featured',
            'gap',
            'featured',
        ])
        // The first featured segment (raw 0.01) is below the 0.02 min, so
        // it's pinned to exactly 0.02 regardless of its own raw width. The
        // remaining 0.98 of the bar splits between the other two segments
        // proportional to their own (capped) raw widths — gap 0.97 capped
        // to 0.25, featured 0.02 already at the min and left alone.
        expect(result.segments[0].widthFraction).toBeCloseTo(0.02, 10)
        expect(result.segments[1].widthFraction).toBeCloseTo(
            0.98 * (0.25 / 0.27),
            10
        )
        expect(result.segments[2].widthFraction).toBeCloseTo(
            0.98 * (0.02 / 0.27),
            10
        )

        const total = result.segments.reduce((s, r) => s + r.widthFraction, 0)
        expect(total).toBeCloseTo(1, 10)
    })

    it('gives a below-floor intermittent run the same min-width floor as a featured segment, unaffected by its own raw width', () => {
        // Regression for a reported bug: an intermittent run made of several
        // featured toggles rendered at ~8% of the bar width. Attaching one
        // more nearby comic caused those toggles to merge into a single
        // 'intermittent' segment — which shrank to under 1%, because the
        // min-width floor only applied to 'featured' segments, not
        // 'intermittent' ones.
        //
        // A follow-up report showed the fixed floor still wasn't enough:
        // each additional comic attached within the same (still below-floor)
        // run made it *keep shrinking* by a tiny amount, because the old
        // formula topped the segment up by only its shortfall from the
        // floor, so a larger raw width meant less was borrowed from the
        // gap, leaving the gap comparatively bigger and diluting the
        // run's share. The fix pins both the floor segment and the capped
        // gap to fixed absolute values, so the run renders identically
        // regardless of small raw-width changes while it's still below the
        // floor — it only starts growing once it exceeds the floor on its
        // own.
        const build = (toggleCount: number) =>
            computeStorylineSegments({
                startComicId: 0,
                endComicId: null,
                latestKnownComicId: 1000,
                segments: [
                    { fromComicId: 0, toComicId: 6, featured: true },
                    { fromComicId: 6, toComicId: 7, featured: false },
                    { fromComicId: 7, toComicId: 8, featured: true },
                    { fromComicId: 8, toComicId: 9, featured: false },
                    {
                        fromComicId: 9,
                        toComicId: 9 + toggleCount,
                        featured: true,
                    },
                    {
                        fromComicId: 9 + toggleCount,
                        toComicId: 1000,
                        featured: false,
                    },
                ],
                currentComicId: 0,
            })

        const result = build(1)

        expect(result.segments.map((s) => s.kind)).toEqual([
            'intermittent',
            'gap',
        ])
        // Pinned to the 0.02 floor and the capped 0.25 gap, split as
        // 0.02 : (0.98 * 0.25 / 0.25) — since the gap is the only other
        // segment, it claims the entire remaining 0.98.
        expect(result.segments[0].widthFraction).toBeCloseTo(0.02, 10)
        expect(result.segments[1].widthFraction).toBeCloseTo(0.98, 10)

        const total = result.segments.reduce((s, r) => s + r.widthFraction, 0)
        expect(total).toBeCloseTo(1, 10)

        // Attaching more comics to the same run (still well below the 0.02
        // floor) must not change its rendered width at all.
        const grown = build(3)
        expect(grown.segments[0].widthFraction).toBeCloseTo(
            result.segments[0].widthFraction,
            10
        )
        expect(grown.segments[1].widthFraction).toBeCloseTo(
            result.segments[1].widthFraction,
            10
        )
    })

    it('coalesces a trailing filler gap into the preceding factual gap instead of rendering two adjacent gap segments', () => {
        const result = computeStorylineSegments({
            startComicId: 3000,
            endComicId: null,
            latestKnownComicId: 5865,
            segments: [
                { fromComicId: 3000, toComicId: 3108, featured: false },
                { fromComicId: 3108, toComicId: 3109, featured: true },
                { fromComicId: 3109, toComicId: 5821, featured: false },
            ],
            currentComicId: 3110,
        })

        expect(result.segments.map((s) => s.kind)).toEqual([
            'gap',
            'featured',
            'gap',
        ])
        expect(result.segments[2]).toMatchObject({
            fromComicId: 3109,
            toComicId: 5865,
        })
    })

    it("doesn't let a capped gap's freed space balloon a tiny featured run, and stays proportional as more distant comics attach", () => {
        // Regression for a reported bug: an open-ended storyline attached to
        // only #3110 (a negligible sliver of a much longer, mostly untouched
        // range) rendered as ~mostly featured, because the one big capped
        // trailing gap donated all its freed space to that one tiny featured
        // run. Attaching one more distant comic then flipped it to ~mostly
        // gap, since the freed space now split across two capped gaps
        // instead — a large, confusing swing from a single unrelated
        // attachment.
        const before = computeStorylineSegments({
            startComicId: 3110,
            endComicId: null,
            latestKnownComicId: 5000,
            segments: [{ fromComicId: 3110, toComicId: 3111, featured: true }],
            currentComicId: 3110,
        })
        const beforeFeaturedTotal = before.segments
            .filter((s) => s.kind === 'featured')
            .reduce((sum, s) => sum + s.widthFraction, 0)

        // A 1-comic sliver out of ~1890 comics shouldn't render as most of
        // the bar — it should sit near the readability floor.
        expect(beforeFeaturedTotal).toBeLessThan(0.15)

        const after = computeStorylineSegments({
            startComicId: 3110,
            endComicId: null,
            latestKnownComicId: 5000,
            segments: [
                { fromComicId: 3110, toComicId: 3111, featured: true },
                { fromComicId: 3111, toComicId: 3120, featured: false },
                { fromComicId: 3120, toComicId: 3121, featured: true },
            ],
            currentComicId: 3110,
        })
        const afterFeaturedTotal = after.segments
            .filter((s) => s.kind === 'featured')
            .reduce((sum, s) => sum + s.widthFraction, 0)

        // Attaching one more distant, still-negligible comic should modestly
        // grow the featured total (roughly proportional to the extra
        // minimum-width floor claimed) — not swing it from mostly-featured
        // to mostly-gap or vice versa.
        expect(afterFeaturedTotal).toBeGreaterThan(beforeFeaturedTotal)
        expect(afterFeaturedTotal).toBeLessThan(0.3)
    })

    it('marks isOpenEnded and uses latestKnownComicId as the right bound when endComicId is null', () => {
        const result = computeStorylineSegments({
            startComicId: 900,
            endComicId: null,
            latestKnownComicId: 1000,
            segments: [{ fromComicId: 900, toComicId: 1000, featured: true }],
            currentComicId: 950,
        })

        expect(result.isOpenEnded).toBe(true)
        expect(result.currentComicPositionFraction).toBeCloseTo(0.5, 10)
    })

    it('returns null for a current comic outside [start, end)', () => {
        const args = {
            startComicId: 10,
            endComicId: 20,
            latestKnownComicId: 20,
            segments: [{ fromComicId: 10, toComicId: 20, featured: true }],
        }

        expect(
            computeStorylineSegments({ ...args, currentComicId: 9 })
                .currentComicPositionFraction
        ).toBeNull()
        expect(
            computeStorylineSegments({ ...args, currentComicId: 20 })
                .currentComicPositionFraction
        ).toBeNull()
    })

    it('handles a degenerate zero-span storyline', () => {
        const result = computeStorylineSegments({
            startComicId: 50,
            endComicId: 50,
            latestKnownComicId: 50,
            segments: [{ fromComicId: 50, toComicId: 50, featured: true }],
            currentComicId: 50,
        })

        expect(result.segments).toHaveLength(1)
        expect(result.currentComicPositionFraction).toBe(0)

        const outside = computeStorylineSegments({
            startComicId: 50,
            endComicId: 50,
            latestKnownComicId: 50,
            segments: [{ fromComicId: 50, toComicId: 50, featured: true }],
            currentComicId: 51,
        })
        expect(outside.currentComicPositionFraction).toBeNull()
    })
})
