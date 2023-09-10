import { MutableRefObject, useEffect, useRef, useState } from 'react'

export function useAlternateLayout(): [
    boolean,
    MutableRefObject<HTMLDivElement | null>,
] {
    const ref = useRef<HTMLDivElement | null>(null)
    const [useAlternateLayout, setUseAlternateLayout] = useState(false)
    useEffect(() => {
        let timeout: ReturnType<typeof setTimeout> | null = null
        function checkNeedsAlternateLayout() {
            if (ref.current) {
                const self = ref.current
                const selfWidth = self.clientWidth
                const childrenWidth = Array.from(self.children)
                    .map((e) => e.clientWidth)
                    .reduce((acc, cur) => acc + cur, 0)

                if (childrenWidth > selfWidth) {
                    setUseAlternateLayout(true)
                }
                clearTimeout(timeout!)
                timeout = null
            } else {
                timeout = setTimeout(checkNeedsAlternateLayout, 0)
            }
        }
        timeout = setTimeout(checkNeedsAlternateLayout, 0)
        return () => {
            if (timeout) {
                clearTimeout(timeout)
            }
        }
    })

    return [useAlternateLayout, ref]
}
