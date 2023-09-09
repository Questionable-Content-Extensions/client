import { EndpointBuilder } from '@reduxjs/toolkit/dist/query/endpointDefinitions'

export type KeyOfType<T, V> = keyof {
    [P in keyof T as T[P] extends V ? P : never]: any
}

export type PickEnum<T, K extends T> = {
    [P in keyof K]: P extends K ? P : never
}

export type EndpointBuilderTagTypeExtractor<T> = T extends EndpointBuilder<
    any,
    infer X,
    any
>
    ? X
    : never
