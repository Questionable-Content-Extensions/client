import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { ConnectedProps, connect } from 'react-redux'

import { ItemNavigationData } from '@models/ItemNavigationData'
import { ItemType } from '@models/ItemType'
import { NavigationData } from '@models/NavigationData'
import { skipToken } from '@reduxjs/toolkit/dist/query'
import {
    toGetDataQueryArgs,
    useGetComicDataQuery,
} from '@store/api/comicApiSlice'
import { setCurrentComic } from '@store/comicSlice'
import {
    isIsAccuratePublishDateDirtySelector,
    isPublishDateDirtySelector,
    isStateDirtySelector,
    isTaglineDirtySelector,
    isTitleDirtySelector,
    reset as resetEditorData,
    saveChanges,
    setFromComic as setEditorDataFromComic,
    setIsAccuratePublishDate,
    setPublishDate,
    setTagline,
    setTitle,
} from '@store/editorSlice'
import { useAppDispatch } from '@store/hooks'
import { AppDispatch, RootState } from '@store/store'

import constants from '~/constants'

import ComicFlagsWidget from './ComicFlagsWidget'
import ErrorPresenter from './ErrorPresenter'
import NavElement, { NavElementMode } from './NavElement/NavElement'
import ToggleButton from './ToggleButton/ToggleButton'

const mapState = (state: RootState) => {
    return {
        settings: state.settings.values,
        currentComic: state.comic.current,
        isEditorSaving: state.editor.isSaving,
        title: state.editor.title,
        isTitleDirty: isTitleDirtySelector(state),
        tagline: state.editor.tagline,
        isTaglineDirty: isTaglineDirtySelector(state),
        publishDate: state.editor.publishDate,
        isPublishDateDirty: isPublishDateDirtySelector(state),
        isAccuratePublishDate: state.editor.isAccuratePublishDate,
        isIsAccuratePublishDateDirty:
            isIsAccuratePublishDateDirtySelector(state),
        editorStateDirty: isStateDirtySelector(state),
    }
}

const mapDispatch = (dispatch: AppDispatch) => {
    return {
        setCurrentComic: (comic: number) => {
            dispatch(setCurrentComic(comic))
        },
        setTitle: (title: string) => {
            dispatch(setTitle(title))
        },
        setTagline: (tagline: string) => {
            dispatch(setTagline(tagline))
        },
        setPublishDate: (publishDate: string) => {
            dispatch(setPublishDate(publishDate))
        },
        setIsAccuratePublishDate: (isAccuratePublishDate: boolean) => {
            dispatch(setIsAccuratePublishDate(isAccuratePublishDate))
        },
        saveChanges: () => {
            dispatch(saveChanges())
        },
    }
}

const connector = connect(mapState, mapDispatch)
type PropsFromRedux = ConnectedProps<typeof connector>
type EditorModeExtraWidgetProps = PropsFromRedux & {}

// TODO: Show editor log function

function EditorModePanel({
    settings,
    currentComic,
    isEditorSaving,
    title,
    isTitleDirty,
    tagline,
    isTaglineDirty,
    publishDate,
    isPublishDateDirty,
    isAccuratePublishDate,
    isIsAccuratePublishDateDirty,
    editorStateDirty,
    setCurrentComic,
    setTitle,
    setTagline,
    setPublishDate,
    setIsAccuratePublishDate,
    saveChanges,
}: EditorModeExtraWidgetProps) {
    const dispatch = useAppDispatch()

    const {
        data: comicData,
        isFetching: isFetchingComicData,
        isLoading: isLoadingInitialComicData,
        isError: hasErrorLoadingComicData,
        error: comicDataError,
    } = useGetComicDataQuery(
        currentComic === 0 || !settings
            ? skipToken
            : toGetDataQueryArgs(currentComic, settings)
    )

    // When comicData loads, update the editorData
    useEffect(() => {
        if (!comicData) {
            return
        }
        if (comicData.hasData) {
            dispatch(setEditorDataFromComic(comicData))
        } else {
            dispatch(resetEditorData())
        }
    }, [comicData, dispatch])

    const missingDataText = useMemo(() => {
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
        if (!hasTagline && currentComic > constants.taglineThreshold) {
            missingData.push('a tagline')
        }

        if (hasErrorLoadingComicData) {
            return <ErrorPresenter error={comicDataError} />
        } else if (!isLoadingInitialComicData && missingData.length) {
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
        } else if (
            !isLoadingInitialComicData &&
            comicData &&
            !comicData.hasData
        ) {
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
    }, [
        comicData,
        isLoadingInitialComicData,
        currentComic,
        hasErrorLoadingComicData,
        comicDataError,
    ])

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

    if (!settings || !settings.editMode) {
        return <></>
    }

    const editorData = comicData?.editorData
    return (
        <form
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
            onSubmit={(e) => {
                e.preventDefault()
                saveChanges()
            }}
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
            {missingDataText}
            <hr className="my-4 mx-0 border-solid border-b max-w-none" />
            <ExpandingEditor>
                <TextEditor
                    disabled={
                        isLoadingInitialComicData ||
                        isFetchingComicData ||
                        isEditorSaving ||
                        hasErrorLoadingComicData
                    }
                    label="Title"
                    inputId="qcext-comic-title"
                    value={title}
                    onValueChange={setTitle}
                    dirty={isTitleDirty}
                />
            </ExpandingEditor>
            <ExpandingEditor>
                <TextEditor
                    disabled={
                        isLoadingInitialComicData ||
                        isFetchingComicData ||
                        isEditorSaving ||
                        hasErrorLoadingComicData
                    }
                    label="Tagline"
                    inputId="qcext-comic-tagline"
                    value={tagline}
                    onValueChange={setTagline}
                    dirty={isTaglineDirty}
                />
            </ExpandingEditor>
            <ExpandingEditor>
                <DateEditor
                    disabled={
                        isLoadingInitialComicData ||
                        isFetchingComicData ||
                        isEditorSaving ||
                        hasErrorLoadingComicData
                    }
                    label="Date"
                    labelTitle={'Publish date'}
                    inputId="qcext-comic-publish-date"
                    dateValue={publishDate}
                    isAccurateValue={isAccuratePublishDate}
                    onDateValueChange={(date) => setPublishDate(date)}
                    onIsAccurateValueChange={(isAccuratePublishDate) =>
                        setIsAccuratePublishDate(isAccuratePublishDate)
                    }
                    isDateValueDirty={isPublishDateDirty}
                    isIsAccurateValueDirty={isIsAccuratePublishDateDirty}
                />
            </ExpandingEditor>
            <hr className="my-4 mx-0 border-solid border-b max-w-none" />
            {comicData ? (
                <ComicFlagsWidget
                    isLoading={
                        isLoadingInitialComicData ||
                        isFetchingComicData ||
                        isEditorSaving
                    }
                    hasError={hasErrorLoadingComicData}
                    hasCastItems={
                        isLoadingInitialComicData ||
                        (comicData.hasData &&
                            hasItemsOfType(comicData.items, 'cast'))
                    }
                    hasLocationItems={
                        isLoadingInitialComicData ||
                        (comicData.hasData &&
                            hasItemsOfType(comicData.items, 'location'))
                    }
                    hasStorylineItems={
                        isLoadingInitialComicData ||
                        (comicData.hasData &&
                            hasItemsOfType(comicData.items, 'storyline'))
                    }
                />
            ) : (
                <></>
            )}
            <hr className="my-4 mx-0 border-solid border-b max-w-none" />
            <div className="flex">
                <button
                    className="flex-auto bg-qc-header hover:bg-qc-header-second focus:bg-qc-header-second text-white py-3 rounded-sm disabled:opacity-75"
                    disabled={
                        isLoadingInitialComicData ||
                        isFetchingComicData ||
                        isEditorSaving ||
                        !editorStateDirty
                    }
                    type="submit"
                >
                    {hasErrorLoadingComicData
                        ? 'Error'
                        : isFetchingComicData || isEditorSaving
                        ? 'Loading...'
                        : editorStateDirty
                        ? 'Save changes'
                        : 'No changes'}
                </button>
            </div>
        </form>
    )
}

export default connector(EditorModePanel)

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
    label,
    labelTitle,
    inputId,
    value,
    onValueChange,
    dirty,
}: {
    disabled: boolean
    label: string
    labelTitle?: string
    inputId: string
    value: string
    onValueChange: (newValue: string) => void
    dirty?: boolean
}) {
    const [_expanded, setExpanded] = useContext(ExpandedContext)
    return (
        <div className="flex min-w-0">
            <label
                title={labelTitle}
                htmlFor={inputId}
                className={
                    `bg-qc-header text-white py-2 px-4 flex-initial rounded-l-sm rounded-r-none` +
                    (dirty ? ' bg-qc-header-second italic' : '') +
                    (disabled ? ' opacity-75' : '')
                }
            >
                {label}
                {dirty ? '*' : ''}
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
        </div>
    )
}

function DateEditor({
    disabled,
    label,
    labelTitle,
    inputId,
    dateValue,
    isAccurateValue,
    onDateValueChange,
    onIsAccurateValueChange,
    isDateValueDirty,
    isIsAccurateValueDirty,
}: {
    disabled: boolean
    label: string
    labelTitle?: string
    inputId: string
    dateValue: string
    isAccurateValue: boolean
    isDateValueDirty: boolean
    isIsAccurateValueDirty: boolean
    onDateValueChange: (newValue: string) => void
    onIsAccurateValueChange: (newValue: boolean) => void
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
        <>
            <div className="flex min-w-0">
                <label
                    title={labelTitle}
                    htmlFor={inputId}
                    className={
                        `bg-qc-header text-white py-2 px-4 flex-initial rounded-l-sm rounded-r-none` +
                        (isDateValueDirty
                            ? ' bg-qc-header-second italic'
                            : '') +
                        (disabled ? ' opacity-75' : '')
                    }
                >
                    {label}
                    {isDateValueDirty ? '*' : ''}
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
            </div>
            <div className="bg-stone-100">
                <ToggleButton
                    label="Accurate Date"
                    checked={isAccurateValue}
                    disabled={disabled}
                    onChange={(e) => onIsAccurateValueChange(e.target.checked)}
                    dirty={isIsAccurateValueDirty}
                />
            </div>
        </>
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
