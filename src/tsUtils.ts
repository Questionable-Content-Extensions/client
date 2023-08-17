export type KeyOfType<T, V> = keyof {
    [P in keyof T as T[P] extends V ? P : never]: any
}

export type PickEnum<T, K extends T> = {
    [P in keyof K]: P extends K ? P : never
}
