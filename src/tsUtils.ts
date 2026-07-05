import { EndpointBuilder } from '@reduxjs/toolkit/dist/query/endpointDefinitions'

export type KeyOfType<T, V> = keyof {
    [P in keyof T as T[P] extends V ? P : never]: never
}

export type PickEnum<T, K extends T> = {
    [P in keyof K]: P extends K ? P : never
}

export type EndpointBuilderTagTypeExtractor<T> = T extends EndpointBuilder<
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    any,
    infer X,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    any
>
    ? X
    : never
