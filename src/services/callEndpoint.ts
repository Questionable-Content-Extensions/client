import type { EndpointSpec } from '@endpoints/EndpointSpec'

export async function callEndpoint<Q, B, P, R, Fe>(
    spec: EndpointSpec<Q, B, P, R, Fe>,
    args?: { query?: Q; body?: B; pathParams?: P },
    options?: Omit<RequestInit, 'method'>
): Promise<R> {
    let path = spec.path as string

    if (args?.pathParams !== undefined) {
        if (typeof args.pathParams === 'object' && args.pathParams !== null) {
            for (const [key, value] of Object.entries(
                args.pathParams as Record<string, unknown>
            )) {
                path = path.replace(`{${key}}`, String(value))
            }
        } else {
            path = path.replace(/\{[^}]+\}/, String(args.pathParams))
        }
    }

    if (args?.query) {
        const qs = new URLSearchParams(
            args.query as Record<string, string>
        ).toString()
        if (qs) path = `${path}?${qs}`
    }

    const init: RequestInit = { ...options, method: spec.method }
    if (args?.body !== undefined) {
        init.body = JSON.stringify(args.body)
        init.headers = {
            ...(options?.headers as Record<string, string> | undefined),
            'Content-Type': 'application/json; charset=utf-8',
        }
    }

    const response = await fetch(`/api/v3/${path}`, init)
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    return response.json() as Promise<R>
}
