export function buildQueryString(
    query: Record<string, unknown> | undefined
): string {
    if (!query) return ''
    const params = new URLSearchParams()
    for (const [key, value] of Object.entries(query)) {
        if (value === undefined) continue
        if (Array.isArray(value)) {
            for (const item of value) params.append(key, String(item))
        } else {
            params.append(key, String(value))
        }
    }
    return params.toString()
}
