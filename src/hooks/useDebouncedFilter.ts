import { useEffect, useMemo, useState } from 'react'

export type DebouncedFilter = {
    /**
     * Current filter value. This value should only be used for the text
     * input since it changes immediately when `setFilter` is called.
     */
    filter: string
    /**
     * Update the filter value. When there's been `debounceTimeout`
     * milliseconds since the last time this function was called, the
     * `activeFilter` gets updated with its last value.
     *
     * @param newFilter the new filter value
     */
    setFilter: (newFilter: string) => void
    /**
     * The debounced filter value. This value only updates when it's been
     * `debounceTimeout` milliseconds since the last time the `setFilter`
     * function was called.
     */
    activeFilter: string
}
export default function useDebouncedFilter(options?: {
    debounceTimeout?: number
}): DebouncedFilter {
    const debounceTimeout = useMemo(() => {
        if (options && options.debounceTimeout) {
            return options.debounceTimeout
        }
        return 500
    }, [options])

    const [filter, setFilter] = useState('')
    const [activeFilter, setActiveFilter] = useState('')
    useEffect(() => {
        let filterDebounceTimeout: ReturnType<typeof setTimeout> | null =
            setTimeout(() => {
                setActiveFilter(filter)
                filterDebounceTimeout = null
            }, debounceTimeout)
        return () => {
            if (filterDebounceTimeout !== null) {
                clearTimeout(filterDebounceTimeout)
                filterDebounceTimeout = null
            }
        }
    }, [filter, debounceTimeout])

    return { activeFilter, filter, setFilter }
}
