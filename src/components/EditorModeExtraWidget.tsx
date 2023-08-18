import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { ConnectedProps, connect } from 'react-redux'

import useComic from '@hooks/useComic'
import useComicData from '@hooks/useComicData'
import { ItemNavigationData } from '@models/ItemNavigationData'
import { ItemType } from '@models/ItemType'
import { NavigationData } from '@models/NavigationData'
import comicDataService from '@services/comicDataService'
import { RootState } from '@store/store'
import FilteredNavigationData from '@widgets/FilteredNavigationData'

import { debug } from '~/utils'

import NavElement, { NavElementMode } from './QcExtMainWidget/NavElement'
import ToggleButton from './Widgets/ToggleButton'

const mapState = (state: RootState) => {
    return {
        settings: state.settings.values,
    }
}

const mapDispatch = () => ({})

const connector = connect(mapState, mapDispatch)
type PropsFromRedux = ConnectedProps<typeof connector>
type EditorModeExtraWidgetProps = PropsFromRedux & {}

function EditorModeExtraWidget({ settings }: EditorModeExtraWidgetProps) {
    const {
        currentComic: [_currentComic, setCurrentComic],
    } = useComic()
    const {
        comicDataLoading: [comicDataLoading, _comicDataComicLoading],
        comicData,
        refreshComicData: _refreshComicData,
    } = useComicData()

    const [comicTitle, setComicTitle] = useState('')
    const [comicTagline, setComicTagline] = useState('')
    const [comicDate, setComicDate] = useState('')
    const [comicIsAccurateDate, setComicIsAccurateDate] = useState(false)
    useEffect(() => {
        setComicTitle(
            comicData && comicData.hasData ? comicData.title ?? '' : ''
        )
        setComicTagline(
            comicData && comicData.hasData ? comicData.tagline ?? '' : ''
        )
        setComicDate(
            comicData && comicData.hasData ? comicData.publishDate ?? '' : ''
        )
        setComicIsAccurateDate(
            comicData && comicData.hasData
                ? comicData.isAccuratePublishDate
                : false
        )
    }, [comicData])

    const missingData = useMemo(() => {
        const hasCast =
            !comicData?.hasData ||
            comicData.hasNoCast ||
            comicData.items.filter((i) => i.type === 'cast').length !== 0
        const hasLocation =
            !comicData?.hasData ||
            comicData.hasNoLocation ||
            comicData.items.filter((i) => i.type === 'location').length !== 0
        const hasStoryline =
            !comicData?.hasData ||
            comicData.hasNoStoryline ||
            comicData.items.filter((i) => i.type === 'storyline').length !== 0
        const hasTitle =
            !comicData?.hasData ||
            comicData.hasNoTitle ||
            (comicData.title && comicData.title !== '')
        const hasTagline =
            !comicData?.hasData ||
            comicData.hasNoTagline ||
            (comicData.tagline && comicData.tagline !== '')

        const missingData: string[] = []
        if (!hasCast) {
            missingData.push('cast members')
        }
        if (!hasLocation) {
            missingData.push('a location')
        }
        if (!hasStoryline) {
            // TODO: Add back when storylines get added
            //missingData.push('a storyline')
        }
        if (!hasTitle) {
            missingData.push('a title')
        }
        if (!hasTagline) {
            missingData.push('a tagline')
        }

        if (!comicDataLoading && missingData.length) {
            return (
                <p className="text-[#ff3030] mt-2 leading-5">
                    This comic is missing{' '}
                    {missingData.reduce((p, c, i) => {
                        if (i === 0) {
                            return c
                        } else {
                            return `${p}, ${c}`
                        }
                    })}
                </p>
            )
        } else if (!comicDataLoading && comicData && !comicData.hasData) {
            return (
                <div className="text-center pt-4">
                    <i
                        className="fa fa-exclamation-triangle"
                        aria-hidden="true"
                    ></i>
                    <br />
                    Comic has no data
                </div>
            )
        } else {
            return <></>
        }
    }, [comicData, comicDataLoading])

    const [clientWidth, setClientWidth] = useState(
        document.documentElement.clientWidth
    )
    useEffect(() => {
        function onResize() {
            setClientWidth(document.documentElement.clientWidth)
        }

        window.addEventListener('resize', onResize)
        return () => {
            window.removeEventListener('resize', onResize)
        }
    })
    const correctionWidth = useMemo(
        () => (clientWidth < 1530 ? (1530 - clientWidth) / 2 : 0),
        [clientWidth]
    )

    if (!settings.editMode) {
        return <></>
    }

    let comicFlags = <></>
    if (comicData) {
        comicFlags = (
            <div className="flex flex-col gap-1">
                <ToggleButton
                    label="Guest comic"
                    checked={
                        (comicData.hasData && comicData.isGuestComic) || false
                    }
                    onChange={(e) => {
                        comicDataService.updateComicFlag(
                            'isGuestComic',
                            e.target.checked
                        )
                    }}
                    disabled={comicDataLoading}
                />
                <ToggleButton
                    label="Non-canon"
                    checked={
                        (comicData.hasData && comicData.isNonCanon) || false
                    }
                    onChange={(e) => {
                        comicDataService.updateComicFlag(
                            'isNonCanon',
                            e.target.checked
                        )
                    }}
                />
                <ToggleButton
                    label="No cast"
                    title="Indicates that it is not a mistake that there are no cast members in this comic"
                    checked={
                        (comicData.hasData && comicData.hasNoCast) || false
                    }
                    disabled={
                        comicDataLoading ||
                        (comicData.hasData &&
                            hasItemsOfType(comicData.items, 'cast'))
                    }
                    onChange={(e) => {
                        comicDataService.updateComicFlag(
                            'hasNoCast',
                            e.target.checked
                        )
                    }}
                />
                <ToggleButton
                    label="No location"
                    title="Indicates that it is not a mistake that there are no locations in this comic"
                    checked={
                        (comicData.hasData && comicData.hasNoLocation) || false
                    }
                    disabled={
                        comicDataLoading ||
                        (comicData.hasData &&
                            hasItemsOfType(comicData.items, 'location'))
                    }
                    onChange={(e) => {
                        comicDataService.updateComicFlag(
                            'hasNoLocation',
                            e.target.checked
                        )
                    }}
                />
                <ToggleButton
                    label="No storyline"
                    title="Indicates that it is not a mistake that there are no storylines in this comic"
                    checked={
                        (comicData.hasData && comicData.hasNoStoryline) || false
                    }
                    disabled={
                        comicDataLoading ||
                        (comicData.hasData &&
                            hasItemsOfType(comicData.items, 'storyline'))
                    }
                    onChange={(e) => {
                        comicDataService.updateComicFlag(
                            'hasNoStoryline',
                            e.target.checked
                        )
                    }}
                />
                <ToggleButton
                    label="No title"
                    title="Indicates that it is not a mistake that this comic has no title"
                    checked={
                        (comicData.hasData && comicData.hasNoTitle) || false
                    }
                    disabled={comicDataLoading}
                    onChange={(e) => {
                        comicDataService.updateComicFlag(
                            'hasNoTitle',
                            e.target.checked
                        )
                    }}
                />
                <ToggleButton
                    label="No tagline"
                    title="Indicates that it is not a mistake that this comic has no tagline"
                    checked={
                        (comicData.hasData && comicData.hasNoTagline) || false
                    }
                    disabled={comicDataLoading}
                    onChange={(e) => {
                        comicDataService.updateComicFlag(
                            'hasNoTagline',
                            e.target.checked
                        )
                    }}
                />
            </div>
        )
    }

    const editorData = comicData?.editorData
    return (
        <div
            className={
                'bg-stone-100 border-solid border-0 border-b border-qc-header lg:border lg:border-stone-300 ' +
                'shadow-md lg:fixed lg:top-20 xl:top-48 lg:left-[50%] lg:-ml-[750px] lg:w-64 z-10 p-2 ' +
                'transition-transform translate-x-0 lg:hover:translate-x-[var(--corrected-margin)]'
            }
            style={
                {
                    '--corrected-margin': `${correctionWidth}px`,
                } as any
            }
        >
            <h1 className="-mx-2 -mt-2 mb-2 text-center small-caps text-sm font-thin border-b border-solid border-b-stone-300 border-l-0 border-t-0 border-r-0">
                Editor Mode
            </h1>
            {editorData && editorData.present ? (
                <>
                    <MissingNavElement
                        navigationData={editorData.missing.cast}
                        title="Missing cast"
                        description="Navigate to comics without cast members"
                        onSetCurrentComic={setCurrentComic}
                        id={-1}
                        useColors={settings.useColors}
                    />
                    <MissingNavElement
                        navigationData={editorData.missing.location}
                        title="Missing location"
                        description="Navigate to comics without locations"
                        onSetCurrentComic={setCurrentComic}
                        id={-2}
                        useColors={settings.useColors}
                    />
                    <MissingNavElement
                        navigationData={editorData.missing.storyline}
                        title="Missing storyline"
                        description="Navigate to comics without storylines"
                        onSetCurrentComic={setCurrentComic}
                        id={-3}
                        useColors={settings.useColors}
                    />
                    <MissingNavElement
                        navigationData={editorData.missing.title}
                        title="Missing title"
                        description="Navigate to comics without a title"
                        onSetCurrentComic={setCurrentComic}
                        id={-4}
                        useColors={settings.useColors}
                    />
                    <MissingNavElement
                        navigationData={editorData.missing.tagline}
                        title="Missing tagline"
                        description="Navigate to comics without a tagline"
                        onSetCurrentComic={setCurrentComic}
                        id={-5}
                        useColors={settings.useColors}
                    />
                </>
            ) : (
                <></>
            )}
            {missingData}
            {/* TODO: show recent items before all items */}
            {!settings.showAllMembers ? (
                <>
                    <hr className="my-4 mx-0 border-solid border-b max-w-none" />
                    <FilteredNavigationData
                        isLoading={comicDataLoading}
                        itemData={(comicData && comicData.allItems) ?? []}
                        onSetCurrentComic={setCurrentComic}
                        onShowInfoFor={() => {
                            debug(
                                'TODO: Set up after adding RootWidgetHost component'
                            )
                        }}
                        useColors={settings.useColors}
                        editMode={settings.editMode}
                        onAddItem={(item) => {
                            comicDataService.addItemToComic(item.id)
                        }}
                    />
                </>
            ) : (
                <></>
            )}
            {/* TODO: Track comic "dirty" state and warn if closing page/navigating away without saving */}

            <hr className="my-4 mx-0 border-solid border-b max-w-none" />
            <ExpandingEditor>
                <TextEditor
                    disabled={comicDataLoading}
                    buttonContent="Set"
                    buttonTitle="Set comic title"
                    label="Title"
                    inputId="qcext-comic-title"
                    value={comicTitle}
                    onValueChange={setComicTitle}
                    onSubmit={() =>
                        comicDataService.updateComicTitle(comicTitle)
                    }
                />
            </ExpandingEditor>
            <ExpandingEditor>
                <TextEditor
                    disabled={comicDataLoading}
                    buttonContent="Set"
                    buttonTitle="Set comic tagline"
                    label="Tagline"
                    inputId="qcext-comic-tagline"
                    value={comicTagline}
                    onValueChange={setComicTagline}
                    onSubmit={() =>
                        comicDataService.updateComicTagline(comicTagline)
                    }
                />
            </ExpandingEditor>
            <ExpandingEditor>
                <DateEditor
                    disabled={comicDataLoading}
                    buttonContent="Set"
                    buttonTitle="Set comic publish date"
                    label="Date"
                    labelTitle={'Publish date'}
                    inputId="qcext-comic-publish-date"
                    dateValue={comicDate}
                    isAccurateValue={comicIsAccurateDate}
                    onDateValueChange={setComicDate}
                    onIsAccurateValueChange={setComicIsAccurateDate}
                    onSubmit={() =>
                        comicDataService.updateComicPublishDate(
                            comicDate,
                            comicIsAccurateDate
                        )
                    }
                />
            </ExpandingEditor>
            {/* TODO: Publish date */}
            <hr className="my-4 mx-0 border-solid border-b max-w-none" />
            {comicFlags}
        </div>
    )
}

export default connector(EditorModeExtraWidget)

function MissingNavElement({
    navigationData,
    id,
    title,
    description,
    onSetCurrentComic,
    useColors,
}: {
    navigationData: NavigationData | null
    id: number
    title: string
    description: string
    onSetCurrentComic: (comic: number) => void
    useColors: boolean
}) {
    if (navigationData) {
        if (
            navigationData.first ||
            navigationData.previous ||
            navigationData.next ||
            navigationData.last
        ) {
            return (
                <NavElement
                    item={{
                        ...navigationData,
                        color: '5f0000',
                        id,
                        name: description,
                        shortName: title,
                        type: 'cast',
                        count: 0,
                    }}
                    onSetCurrentComic={onSetCurrentComic}
                    useColors={useColors}
                    onShowInfoFor={() => {}}
                    mode={NavElementMode.Editor}
                />
            )
        }
    }
    return <></>
}

function TextEditor({
    disabled,
    buttonContent,
    buttonTitle,
    label,
    labelTitle,
    inputId,
    value,
    onValueChange,
    onSubmit,
}: {
    disabled: boolean
    buttonContent: React.ReactChild
    buttonTitle?: string
    label: string
    labelTitle?: string
    inputId: string
    value: string
    onValueChange: (newValue: string) => void
    onSubmit: () => void
}) {
    const [_expanded, setExpanded] = useContext(ExpandedContext)
    return (
        <form
            className="flex min-w-0"
            onSubmit={(e) => {
                e.preventDefault()
                setExpanded(false)
                onSubmit()
            }}
        >
            <label
                title={labelTitle}
                htmlFor={inputId}
                className={
                    `bg-qc-header text-white py-2 px-4 flex-initial rounded-l-sm rounded-r-none` +
                    (disabled ? ' opacity-75' : '')
                }
            >
                {label}
            </label>
            <input
                id={inputId}
                type="text"
                placeholder={labelTitle ?? label}
                value={value}
                title={value}
                onChange={(e) => onValueChange(e.target.value)}
                className="min-w-0 border border-qc-header focus:outline-none flex-auto rounded-none pl-2 disabled:opacity-75"
                disabled={disabled}
                onFocus={() => setExpanded(true)}
                onBlur={() => setExpanded(false)}
            />
            <button
                className="bg-qc-header hover:bg-qc-header-second focus:bg-qc-header-second text-white py-2 px-4 rounded-l-none rounded-r-sm disabled:opacity-75"
                disabled={disabled}
                title={buttonTitle}
                type="submit"
                onFocus={() => setExpanded(true)}
                onBlur={() => setExpanded(false)}
            >
                {buttonContent}
            </button>
        </form>
    )
}

function DateEditor({
    disabled,
    buttonContent,
    buttonTitle,
    label,
    labelTitle,
    inputId,
    dateValue,
    isAccurateValue,
    onDateValueChange,
    onIsAccurateValueChange,
    onSubmit,
}: {
    disabled: boolean
    buttonContent: React.ReactChild
    buttonTitle?: string
    label: string
    labelTitle?: string
    inputId: string
    dateValue: string
    isAccurateValue: boolean
    onDateValueChange: (newValue: string) => void
    onIsAccurateValueChange: (newValue: boolean) => void
    onSubmit: () => void
}) {
    const [_expanded, setExpanded] = useContext(ExpandedContext)

    function toISOLocal(d: Date) {
        return new Date(d.getTime() - d.getTimezoneOffset() * 60000)
            .toISOString()
            .slice(0, -1)
    }
    let dateString
    try {
        dateString = toISOLocal(new Date(dateValue))
    } catch {
        dateString = ''
    }

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault()
                setExpanded(false)
                onSubmit()
            }}
        >
            <div className="flex min-w-0">
                <label
                    title={labelTitle}
                    htmlFor={inputId}
                    className={
                        `bg-qc-header text-white py-2 px-4 flex-initial rounded-l-sm rounded-r-none` +
                        (disabled ? ' opacity-75' : '')
                    }
                >
                    {label}
                </label>

                <input
                    id={inputId}
                    type="datetime-local"
                    placeholder={labelTitle ?? label}
                    value={dateString}
                    title={dateValue}
                    onChange={(e) => {
                        try {
                            onDateValueChange(
                                new Date(e.target.value).toISOString()
                            )
                        } catch {}
                    }}
                    className="min-w-0 border border-qc-header focus:outline-none flex-auto rounded-none pl-2 disabled:opacity-75"
                    disabled={disabled}
                    onFocus={() => setExpanded(true)}
                    onBlur={() => setExpanded(false)}
                />
                <button
                    className="bg-qc-header hover:bg-qc-header-second focus:bg-qc-header-second text-white py-2 px-4 rounded-l-none rounded-r-sm disabled:opacity-75"
                    disabled={disabled}
                    title={buttonTitle}
                    type="submit"
                    onFocus={() => setExpanded(true)}
                    onBlur={() => setExpanded(false)}
                >
                    {buttonContent}
                </button>
            </div>
            <div className="bg-stone-100">
                <ToggleButton
                    label="Accurate Date"
                    checked={isAccurateValue}
                    disabled={disabled}
                    onChange={(e) => onIsAccurateValueChange(e.target.checked)}
                />
            </div>
        </form>
    )
}

const ExpandedContext = createContext<
    [boolean, React.Dispatch<React.SetStateAction<boolean>>]
>([false, () => {}])
function ExpandingEditor({ children }: { children: React.ReactChild }) {
    const [expanded, setExpanded] = useState(false)

    return (
        <div
            className={
                'mt-2 transition-[width] ' +
                (expanded ? 'lg:w-[1080px] lg:shadow-md' : 'lg:w-60')
            }
        >
            <ExpandedContext.Provider value={[expanded, setExpanded]}>
                {children}
            </ExpandedContext.Provider>
        </div>
    )
}

function hasItemsOfType(items: ItemNavigationData[], type: ItemType) {
    return items.filter((i) => i.type === type).length !== 0
}
