import {
    forwardRef,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react'

import { ItemList } from '@models/ItemList'
import { useAllItemsQuery } from '@store/api/itemApiSlice'

import { getFilterWithoutType, getTypeFromFilter } from '~/itemFilters'

export enum FilterType {
    Text,
    Item,
    IsGuestComic,
    IsNonCanon,
}

export type Filter =
    | {
          type: FilterType.Text
          value: string
      }
    | {
          type: FilterType.Item
          value: ItemList
      }
    | {
          type: FilterType.IsGuestComic | FilterType.IsNonCanon
          value: boolean
      }

export default function ComicFilter({
    filters,
    setFilters,
}: {
    filters: Filter[]
    setFilters: React.Dispatch<React.SetStateAction<Filter[]>>
}) {
    const { data: itemData } = useAllItemsQuery()

    const [filterText, setFilterText] = useState('')

    const [dropDownOpen, setDropDownOpen] = useState(false)
    const [activeSuggestion, setActiveSuggestion] = useState(0)

    const activeRef = useRef<HTMLLIElement | null>(null)
    const inputRef = useRef<HTMLInputElement | null>(null)

    const addFilter = useCallback(
        (filter: Filter) => {
            setFilters((f) => {
                return [...f, filter]
            })
            setFilterText('')

            if (
                !inputRef.current ||
                inputRef.current !== document.activeElement
            ) {
                setDropDownOpen(false)
            }
        },
        [setFilters]
    )

    const suggestedFilters = useMemo(() => {
        let index = 0
        const suggestedFilters: JSX.Element[] = []
        suggestedFilters.push(
            <SuggestedFilter
                key="text"
                filter={{ type: FilterType.Text, value: filterText }}
                addFilter={(f) => {
                    if (filterText.trim().length > 0) {
                        addFilter(f)
                    }
                }}
                highlighted={activeSuggestion === index}
                ref={activeSuggestion === index ? activeRef : undefined}
            />
        )
        index++
        if (itemData) {
            for (const item of filterItems(itemData, filterText)) {
                if (
                    !filters.find(
                        (f) =>
                            f.type === FilterType.Item && f.value.id === item.id
                    )
                ) {
                    suggestedFilters.push(
                        <SuggestedFilter
                            key={item.id}
                            filter={{ type: FilterType.Item, value: item }}
                            addFilter={addFilter}
                            highlighted={activeSuggestion === index}
                            ref={
                                activeSuggestion === index
                                    ? activeRef
                                    : undefined
                            }
                        />
                    )
                    index++
                }
            }
        }
        if (!filters.find((f) => f.type === FilterType.IsGuestComic)) {
            suggestedFilters.push(
                <SuggestedFilter
                    key="guest"
                    filter={{ type: FilterType.IsGuestComic, value: true }}
                    addFilter={addFilter}
                    highlighted={activeSuggestion === index}
                    ref={activeSuggestion === index ? activeRef : undefined}
                />
            )
            index++
            suggestedFilters.push(
                <SuggestedFilter
                    key="not-guest"
                    filter={{ type: FilterType.IsGuestComic, value: false }}
                    addFilter={addFilter}
                    highlighted={activeSuggestion === index}
                    ref={activeSuggestion === index ? activeRef : undefined}
                />
            )
            index++
        }
        if (!filters.find((f) => f.type === FilterType.IsNonCanon)) {
            suggestedFilters.push(
                <SuggestedFilter
                    key="non-canon"
                    filter={{ type: FilterType.IsNonCanon, value: true }}
                    addFilter={addFilter}
                    highlighted={activeSuggestion === index}
                    ref={activeSuggestion === index ? activeRef : undefined}
                />
            )
            index++
            suggestedFilters.push(
                <SuggestedFilter
                    key="not-non-canon"
                    filter={{ type: FilterType.IsNonCanon, value: false }}
                    addFilter={addFilter}
                    highlighted={activeSuggestion === index}
                    ref={activeSuggestion === index ? activeRef : undefined}
                />
            )
            index++
        }
        return suggestedFilters
    }, [itemData, filterText, filters, activeSuggestion, addFilter])

    useEffect(() => {
        if (!dropDownOpen) {
            return
        }
        if (activeSuggestion > suggestedFilters.length - 1) {
            setActiveSuggestion(suggestedFilters.length - 1)
        }
        if (activeRef.current) {
            activeRef.current.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
                inline: 'start',
            })
        }
    }, [suggestedFilters, activeSuggestion, dropDownOpen])

    return (
        <div className="relative">
            <span
                className={'fixed inset-0' + (!dropDownOpen ? ' hidden' : '')}
                onClick={(e) => {
                    e.preventDefault()
                    setDropDownOpen(false)
                }}
            ></span>
            <div
                className={
                    'flex flex-wrap border border-black border-solid py-1 relative'
                }
            >
                <ul className="p-0 m-0 list-none flex flex-wrap">
                    {filters.map((filter, i) => {
                        const index = i
                        return (
                            <ActiveFilter
                                key={index}
                                filter={filter}
                                onDelete={() =>
                                    setFilters((f) => {
                                        return f.filter((_, i) => i !== index)
                                    })
                                }
                            />
                        )
                    })}
                </ul>
                <input
                    ref={inputRef}
                    type="text"
                    spellCheck="false"
                    className="border-none outline-none flex-auto"
                    onFocus={() => setDropDownOpen(true)}
                    onKeyDown={(e) => {
                        if (
                            e.code === 'ArrowUp' ||
                            e.code === 'ArrowDown' ||
                            e.code === 'Enter' ||
                            e.code === 'Escape'
                        ) {
                            e.preventDefault()
                            if (e.code === 'ArrowUp') {
                                if (!dropDownOpen) {
                                    setDropDownOpen(true)
                                }
                                setActiveSuggestion((s) => {
                                    if (s > 0) {
                                        return s - 1
                                    } else {
                                        return suggestedFilters.length - 1
                                    }
                                })
                            } else if (e.code === 'ArrowDown') {
                                if (!dropDownOpen) {
                                    setDropDownOpen(true)
                                }
                                setActiveSuggestion((s) => {
                                    if (s < suggestedFilters.length - 1) {
                                        return s + 1
                                    } else {
                                        return 0
                                    }
                                })
                            } else if (e.code === 'Enter') {
                                if (!dropDownOpen) {
                                    setDropDownOpen(true)
                                    return
                                }
                                if (activeRef.current) {
                                    activeRef.current
                                        .querySelector('button')!
                                        .click()
                                }
                            } else if (e.code === 'Escape') {
                                if (dropDownOpen) {
                                    setDropDownOpen(false)
                                }
                            }
                        } else if (e.code === 'Backspace') {
                            if (filterText === '' && filters.length > 0) {
                                setFilters((f) => {
                                    return f.filter(
                                        (_, i) => i !== filters.length - 1
                                    )
                                })
                            }
                        }
                    }}
                    value={filterText}
                    onChange={(e) => setFilterText(e.target.value)}
                />
            </div>

            <ul
                className={
                    'bg-slate-100 list-none m-0 p-1 absolute w-full overflow-y-auto max-h-48 shadow-md ' +
                    'border-x border-y-0 border-b border-solid border-slate-500' +
                    (!dropDownOpen ? ' hidden' : '')
                }
            >
                {suggestedFilters}
            </ul>
        </div>
    )
}

function filterItems(allItems: ItemList[], filter: string) {
    const [filterType, filterName] = [
        getTypeFromFilter(filter),
        getFilterWithoutType(filter),
    ]

    return allItems.filter((c) => {
        const isRightType = filterType === 'item' || c.type === filterType
        const hasName =
            c.name.toUpperCase().indexOf(filterName.toUpperCase()) !== -1
        const hasShortName =
            c.shortName.toUpperCase().indexOf(filterName.toUpperCase()) !== -1
        return isRightType && (hasName || hasShortName)
    })
}

const SuggestedFilter = forwardRef<
    HTMLLIElement,
    {
        highlighted: boolean
        filter: Filter
        addFilter: (filter: Filter) => void
    }
>(function ({ highlighted, filter, addFilter }, ref) {
    let filterElement
    switch (filter.type) {
        case FilterType.Text:
            filterElement = (
                <>
                    Add{' '}
                    <span className="inline-block border border-solid px-2 py-1 rounded-lg border-slate-400 bg-slate-200">
                        Contains text "{filter.value}"
                    </span>{' '}
                    filter...
                </>
            )
            break

        case FilterType.Item:
            filterElement = (
                <>
                    Add{' '}
                    <span className="inline-block border border-solid px-2 py-1 rounded-lg border-orange-400 bg-orange-200">
                        Contains {filter.value.type}{' '}
                        <span className="font-bold">
                            {filter.value.shortName}
                        </span>
                    </span>{' '}
                    filter...
                </>
            )
            break

        case FilterType.IsGuestComic:
        case FilterType.IsNonCanon:
            let color
            if (filter.type === FilterType.IsGuestComic) {
                color = 'border-qc-header bg-qc-header-second'
            } else {
                color = 'border-qc-non-canon bg-qc-non-canon-second'
            }
            filterElement = (
                <>
                    Add{' '}
                    <span
                        className={
                            'inline-block border border-solid px-2 py-1 rounded-lg text-white ' +
                            color
                        }
                    >
                        {filter.value ? 'Is' : 'Is not'}{' '}
                        {filter.type === FilterType.IsGuestComic
                            ? 'guest comic'
                            : 'non-canon'}
                    </span>{' '}
                    filter...
                </>
            )
    }
    return (
        <li
            className={
                'my-1 flex' + (highlighted ? ' bg-blue-500 -m-1 p-1' : '')
            }
            ref={highlighted ? ref : undefined}
        >
            <button
                className="flex-auto text-left"
                onClick={() => {
                    addFilter(filter)
                }}
            >
                {filterElement}
            </button>
        </li>
    )
})

function ActiveFilter({
    filter,
    onDelete,
}: {
    filter: Filter
    onDelete: () => void
}) {
    let title
    let contents
    let colorClassName
    switch (filter.type) {
        case FilterType.Text:
            title = `Comic contains "${filter.value}" in its title or tagline`
            contents = (
                <>
                    Contains{' '}
                    <span className="font-bold">{`"${filter.value}"`}</span> in
                    title/tagline
                </>
            )
            colorClassName = 'border-slate-400 bg-slate-200'
            break

        case FilterType.Item:
            title = `Comic contains ${filter.value.type} "${filter.value.name}"`
            contents = (
                <>
                    Contains {filter.value.type}{' '}
                    <span className="font-bold">{`"${filter.value.shortName}"`}</span>
                </>
            )
            colorClassName = 'border-orange-400 bg-orange-200'
            break

        case FilterType.IsGuestComic:
        case FilterType.IsNonCanon:
            let contains
            colorClassName = 'text-white '
            if (filter.type === FilterType.IsGuestComic) {
                colorClassName += 'border-qc-header bg-qc-header-second'
                contains = (filter.value ? 'is' : 'is not') + ' guest comic'
            } else {
                colorClassName += 'border-qc-non-canon bg-qc-non-canon-second'
                contains = (filter.value ? 'is' : 'is not') + ' non-canon'
            }

            title = `Comic ${contains}`
            contents = (
                <>
                    {filter.value ? 'Is' : 'Is not'}{' '}
                    <span>
                        {filter.type === FilterType.IsGuestComic
                            ? 'guest comic'
                            : 'non-canon'}
                    </span>
                </>
            )
            break
    }
    return (
        <li
            className={
                'mx-1 border border-solid px-2 rounded-lg ' + colorClassName
            }
            title={title}
        >
            {contents}
            <button onClick={() => onDelete()} title="Remove filter">
                <i className="fa fa-close ml-2" aria-hidden="true"></i>
            </button>
        </li>
    )
}
