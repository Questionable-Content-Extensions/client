import { createSelector } from '@reduxjs/toolkit'

import { RootState } from './store'

export type RootStateValueSelector<T> = (state: RootState) => T
export function createDirtySelector<T>(
    valueSelector: RootStateValueSelector<T>,
    originalValueSelector: RootStateValueSelector<T>
) {
    return createSelector(
        valueSelector,
        originalValueSelector,
        (value, originalValue) => value !== originalValue
    )
}
