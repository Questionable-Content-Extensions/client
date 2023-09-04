// Based on code in
// <https://github.com/mui/material-ui/blob/31e2f14f19ac24959103f1d9ca76a26c4f7cb8fd/packages/mui-material/src/Pagination/Pagination.js>
//
import { useMemo } from 'react'

import { range } from '~/utils'

export type PaginationProps = {
    page: number
    count: number
    disabled?: boolean
    onGoToPage: (x: number) => void
    isFetching: boolean

    boundaryCount?: number
    hideNextButton?: boolean
    hidePrevButton?: boolean
    showFirstButton?: boolean
    showLastButton?: boolean
    siblingCount?: number
}
export default function Pagination({
    page,
    count,
    onGoToPage,
    disabled = false,
    isFetching,

    hideNextButton = false,
    hidePrevButton = false,
    showFirstButton = false,
    showLastButton = false,
    boundaryCount = 1,
    siblingCount = 1,
}: PaginationProps) {
    const paginationList = usePagination({
        page,
        count,
        boundaryCount,
        hideNextButton,
        hidePrevButton,
        showFirstButton,
        showLastButton,
        siblingCount,
    })

    return (
        <div className="flex gap-2">
            {paginationList.map((i) => {
                switch (i) {
                    case 'start-ellipsis':
                    case 'end-ellipsis':
                        return (
                            <div key={i} className="w-8 text-center">
                                ...
                            </div>
                        )
                }

                let disabledPage: number
                switch (i) {
                    case 'first':
                    case 'previous':
                        disabledPage = 1
                        break
                    case 'next':
                    case 'last':
                        disabledPage = count
                        break
                    default:
                        disabledPage = i
                }
                return (
                    <div
                        key={i}
                        className={
                            isFetching && page === i ? 'animate-bounce' : ''
                        }
                    >
                        <GoToPageButton
                            currentPage={page}
                            count={count}
                            isFetching={isFetching && page === i}
                            disabled={disabled || page === disabledPage}
                            type={i}
                            onGoToPage={onGoToPage}
                        />
                    </div>
                )
            })}
        </div>
    )
}

function GoToPageButton({
    currentPage,
    count,
    type,
    disabled,
    isFetching,
    onGoToPage,
}: {
    currentPage: number
    count: number
    type: Exclude<NavigationType, 'start-ellipsis' | 'end-ellipsis'> | number
    disabled: boolean
    isFetching: boolean
    onGoToPage: (page: number) => void
}) {
    return (
        <button
            onClick={() =>
                onGoToPage(
                    typeof type === 'number'
                        ? type
                        : typeToTargetPage(type, currentPage, count)
                )
            }
            disabled={disabled}
            className={
                'w-8 disabled:opacity-50 text-qc-link hover:underline' +
                (isFetching ? ' !cursor-wait' : '')
            }
        >
            {typeof type === 'number' ? (
                type
            ) : (
                <i className={`fa ${typeToFaClass(type)}`} aria-hidden></i>
            )}
        </button>
    )
}

function typeToTargetPage(
    type: Exclude<NavigationType, 'start-ellipsis' | 'end-ellipsis'>,
    page: number,
    count: number
) {
    switch (type) {
        case 'first':
            return 1
        case 'previous':
            return page - 1
        case 'next':
            return page + 1
        case 'last':
            return count
    }
}

function typeToFaClass(
    type: Exclude<NavigationType, 'start-ellipsis' | 'end-ellipsis'>
) {
    switch (type) {
        case 'first':
            return 'fa-fast-backward'
        case 'previous':
            return 'fa-backward'
        case 'next':
            return 'fa-forward'
        case 'last':
            return 'fa-fast-forward'
    }
}

type UsePaginationProps = Pick<
    PaginationProps,
    | 'boundaryCount'
    | 'count'
    | 'hideNextButton'
    | 'hidePrevButton'
    | 'page'
    | 'showFirstButton'
    | 'showLastButton'
    | 'siblingCount'
>
function usePagination({
    boundaryCount = 1,
    count = 1,
    hideNextButton = false,
    hidePrevButton = false,
    page,
    showFirstButton = false,
    showLastButton = false,
    siblingCount = 1,
}: UsePaginationProps) {
    return useMemo(() => {
        const startPages = range(1, Math.min(boundaryCount, count))
        const endPages = range(
            Math.max(count - boundaryCount + 1, boundaryCount + 1),
            count
        )

        const siblingsStart = Math.max(
            Math.min(
                // Natural start
                page - siblingCount,
                // Lower boundary when page is high
                count - boundaryCount - siblingCount * 2 - 1
            ),
            // Greater than startPages
            boundaryCount + 2
        )

        const siblingsEnd = Math.min(
            Math.max(
                // Natural end
                page + siblingCount,
                // Upper boundary when page is low
                boundaryCount + siblingCount * 2 + 2
            ),
            // Less than endPages
            endPages.length > 0 ? endPages[0] - 2 : count - 1
        )

        // Basic list of items to render
        // e.g. itemList = ['first', 'previous', 1, 'ellipsis', 4, 5, 6, 'ellipsis', 10, 'next', 'last']
        const itemList: (NavigationType | number)[] = [
            ...(showFirstButton ? (['first'] as NavigationType[]) : []),
            ...(hidePrevButton ? [] : (['previous'] as NavigationType[])),
            ...startPages,

            // Start ellipsis
            // eslint-disable-next-line no-nested-ternary
            ...(siblingsStart > boundaryCount + 2
                ? (['start-ellipsis'] as NavigationType[])
                : boundaryCount + 1 < count - boundaryCount
                ? [boundaryCount + 1]
                : []),

            // Sibling pages
            ...range(siblingsStart, siblingsEnd),

            // End ellipsis
            // eslint-disable-next-line no-nested-ternary
            ...(siblingsEnd < count - boundaryCount - 1
                ? (['end-ellipsis'] as NavigationType[])
                : count - boundaryCount > boundaryCount
                ? [count - boundaryCount]
                : []),

            ...endPages,
            ...(hideNextButton ? [] : (['next'] as NavigationType[])),
            ...(showLastButton ? (['last'] as NavigationType[]) : []),
        ]

        return itemList
    }, [
        count,
        boundaryCount,
        hideNextButton,
        hidePrevButton,
        page,
        showFirstButton,
        showLastButton,
        siblingCount,
    ])
}

type NavigationType =
    | 'first'
    | 'previous'
    | 'start-ellipsis'
    | 'end-ellipsis'
    | 'next'
    | 'last'
