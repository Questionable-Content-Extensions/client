import { useEffect, useMemo, useState } from 'react'

import useHydratedItemData from '@hooks/useHydratedItemData'
import { HydratedItemNavigationData } from '@models/HydratedItemData'
import { ItemType } from '@models/ItemType'
import { skipToken } from '@reduxjs/toolkit/dist/query'
import {
    toGetDataQueryArgs,
    useGetComicDataQuery,
} from '@store/api/comicApiSlice'
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
} from '@store/comicEditorSlice'
import { setCurrentComic } from '@store/comicSlice'
import { useAppDispatch, useAppSelector } from '@store/hooks'

import constants from '~/constants'

import Button from '../Button'
import ErrorPresenter from '../ErrorPresenter'
import OperationsMenu from '../OperationsMenu/OperationsMenu'
import ComicFlags from './ComicFlags/ComicFlags'
import DateEditor from './DateEditor/DateEditor'
import ExpandingEditor from './ExpandingEditor/ExpandingEditor'
import MissingNavElement from './MissingNavElement/MissingNavElement'
import TextEditor from './TextEditor/TextEditor'

export default function EditorModePanel() {
    const dispatch = useAppDispatch()

    const settings = useAppSelector((state) => state.settings.values)

    const currentComic = useAppSelector((state) => state.comic.current)

    const isEditorSaving = useAppSelector((state) => state.comicEditor.isSaving)
    const title = useAppSelector((state) => state.comicEditor.title)
    const isTitleDirty = useAppSelector((state) => isTitleDirtySelector(state))
    const tagline = useAppSelector((state) => state.comicEditor.tagline)
    const isTaglineDirty = useAppSelector((state) =>
        isTaglineDirtySelector(state)
    )
    const publishDate = useAppSelector((state) => state.comicEditor.publishDate)
    const isPublishDateDirty = useAppSelector((state) =>
        isPublishDateDirtySelector(state)
    )
    const isAccuratePublishDate = useAppSelector(
        (state) => state.comicEditor.isAccuratePublishDate
    )
    const isIsAccuratePublishDateDirty = useAppSelector((state) =>
        isIsAccuratePublishDateDirtySelector(state)
    )
    const editorStateDirty = useAppSelector((state) =>
        isStateDirtySelector(state)
    )

    const {
        data: comicData,
        isFetching: isFetchingComicDataz,
        isLoading: isLoadingInitialComicDataz,
        isError: hasErrorLoadingComicData,
        error: comicDataError,
    } = useGetComicDataQuery(
        currentComic === 0 || !settings
            ? skipToken
            : toGetDataQueryArgs(currentComic, settings)
    )

    const {
        comicItems,
        isLoading: isLoadingInitialItemData,
        isFetching: isFetchingItemData,
    } = useHydratedItemData(currentComic, settings)

    const isLoadingInitial =
        isLoadingInitialComicDataz || isLoadingInitialItemData
    const isFetching = isFetchingComicDataz || isFetchingItemData

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
            comicItems?.filter((i) => i.type === 'cast').length !== 0
        const hasLocation =
            !comicData?.hasData ||
            comicData.hasNoLocation ||
            comicItems?.filter((i) => i.type === 'location').length !== 0
        const hasStoryline =
            !comicData?.hasData ||
            comicData.hasNoStoryline ||
            comicItems?.filter((i) => i.type === 'storyline').length !== 0
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
        } else if (!isLoadingInitial && missingData.length) {
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
        } else if (!isLoadingInitial && comicData && !comicData.hasData) {
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
        isLoadingInitial,
        currentComic,
        hasErrorLoadingComicData,
        comicDataError,
        comicItems,
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
            <div className="flex justify-between border-b border-solid border-b-stone-300 border-l-0 border-t-0 border-r-0 -mx-2 -mt-2 mb-2">
                <h1 className="ml-2 mb-0 text-center small-caps text-sm font-thin ">
                    Editor Mode
                </h1>

                <OperationsMenu />
            </div>
            {editorData && editorData.present && (
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
            )}
            {missingDataText}
            <hr className="my-4 mx-0 border-solid border-b max-w-none" />
            <ExpandingEditor>
                <TextEditor
                    disabled={
                        isLoadingInitial ||
                        isFetching ||
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
                        isLoadingInitial ||
                        isFetching ||
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
                        isLoadingInitial ||
                        isFetching ||
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
            {comicData && (
                <ComicFlags
                    isLoading={isLoadingInitial || isFetching || isEditorSaving}
                    hasError={hasErrorLoadingComicData}
                    hasCastItems={
                        isLoadingInitial ||
                        (comicItems !== undefined &&
                            hasItemsOfType(comicItems, 'cast'))
                    }
                    hasLocationItems={
                        isLoadingInitial ||
                        (comicItems !== undefined &&
                            hasItemsOfType(comicItems, 'location'))
                    }
                    hasStorylineItems={
                        isLoadingInitial ||
                        (comicItems !== undefined &&
                            hasItemsOfType(comicItems, 'storyline'))
                    }
                />
            )}
            <hr className="my-4 mx-0 border-solid border-b max-w-none" />
            <div className="flex">
                <Button
                    className="flex-auto py-3"
                    disabled={
                        isLoadingInitial ||
                        isFetching ||
                        isEditorSaving ||
                        !editorStateDirty
                    }
                    type="submit"
                >
                    {hasErrorLoadingComicData
                        ? 'Error'
                        : isFetching || isEditorSaving
                        ? 'Loading...'
                        : editorStateDirty
                        ? 'Save changes'
                        : 'No changes'}
                </Button>
            </div>
        </form>
    )
}

function hasItemsOfType(items: HydratedItemNavigationData[], type: ItemType) {
    return items.filter((i) => i.type === type).length !== 0
}
