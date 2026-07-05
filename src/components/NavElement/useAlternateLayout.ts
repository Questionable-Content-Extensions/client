import { MutableRefObject, useEffect, useRef, useState } from 'react'

// Allows minor pixel-perfect inaccuracies not to trigger the layout by accident.
const ENTER_THRESHOLD_PX = 2

// Wider than ENTER_THRESHOLD_PX so the layout doesn't flip-flop at the boundary.
const EXIT_HYSTERESIS_PX = 16

// `measureRef` must be attached to a hidden, always-unwrapped mirror of the
// content, since measuring the visible container directly is circular once
// its own children's widths depend on the alternate layout being active.
export function useAlternateLayout(): [
    boolean,
    MutableRefObject<HTMLDivElement | null>,
    MutableRefObject<HTMLDivElement | null>,
] {
    const ref = useRef<HTMLDivElement | null>(null)
    const measureRef = useRef<HTMLDivElement | null>(null)
    const [useAlternateLayout, setUseAlternateLayout] = useState(false)

    useEffect(() => {
        const self = ref.current
        const measure = measureRef.current
        if (!self || !measure) {
            return
        }

        function checkNeedsAlternateLayout() {
            const selfWidth = self!.clientWidth
            const requiredWidth = measure!.scrollWidth

            setUseAlternateLayout((current) => {
                if (
                    !current &&
                    requiredWidth > selfWidth + ENTER_THRESHOLD_PX
                ) {
                    return true
                }
                if (current && requiredWidth < selfWidth - EXIT_HYSTERESIS_PX) {
                    return false
                }
                return current
            })
        }

        checkNeedsAlternateLayout()

        const observer = new ResizeObserver(checkNeedsAlternateLayout)
        observer.observe(self)
        observer.observe(measure)

        return () => {
            observer.disconnect()
        }
    }, [])

    return [useAlternateLayout, ref, measureRef]
}
