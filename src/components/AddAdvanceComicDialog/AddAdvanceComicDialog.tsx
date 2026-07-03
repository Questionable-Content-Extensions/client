import { useState } from 'react'

import { PaddedButton } from '@components/Button'
import ItemNavigation from '@components/ComicDetailsPanel/ItemNavigation/ItemNavigation'
import FilteredNavigationData from '@components/FilteredNavigationData/FilteredNavigationData'
import ModalDialog from '@components/Modals/ModalDialog/ModalDialog'
import { NavElementMode } from '@components/NavElement/NavElement'
import useHydratedItemData from '@hooks/useHydratedItemData'
import { ComicId } from '@models/ComicId'
import { PresentComic } from '@models/PresentComic'
import { skipToken } from '@reduxjs/toolkit/dist/query'
import {
    toGetDataQueryArgs,
    useAddAdvanceComicMutation,
    useAddItemMutation,
    useGetComicDataQuery,
    useListAdvanceComicsQuery,
    usePatchComicMutation,
    useRemoveItemMutation,
} from '@store/api/comicApiSlice'
import { useAppSelector } from '@store/hooks'

import { SettingValues } from '~/Settings'

function toDatetimeLocalValue(isoDate: string): string {
    const d = new Date(isoDate)
    return new Date(d.getTime() - d.getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, 16)
}

export default function AddAdvanceComicDialog({
    show,
    onClose,
}: {
    show: boolean
    onClose: () => void
}) {
    const settings = useAppSelector((state) => state.settings.values)

    // Pending advance comics aren't published yet, so they must never be
    // opened via the normal comic-navigation state: this extension runs on
    // top of the live site, and navigating there pushes real browser
    // history to the unpublished comic's URL. Editing happens entirely
    // in-dialog instead, fetching/patching the comic directly by id.
    const [editingComic, setEditingComic] = useState<ComicId | null>(null)

    const handleClose = () => {
        setEditingComic(null)
        onClose()
    }

    if (editingComic !== null) {
        return (
            <EditAdvanceComicDialog
                comicId={editingComic}
                onBack={() => setEditingComic(null)}
                onClose={handleClose}
            />
        )
    }

    return (
        <CreateAdvanceComicDialog
            show={show}
            settings={settings}
            onSelectPending={setEditingComic}
            onClose={handleClose}
        />
    )
}

function CreateAdvanceComicDialog({
    show,
    settings,
    onSelectPending,
    onClose,
}: {
    show: boolean
    settings: SettingValues | null
    onSelectPending: (comicId: ComicId) => void
    onClose: () => void
}) {
    const { data: pendingComics, isFetching: isFetchingPendingComics } =
        useListAdvanceComicsQuery(
            !show || !settings?.editModeToken
                ? skipToken
                : { editModeToken: settings.editModeToken }
        )

    const [comicId, setComicId] = useState('')
    const [title, setTitle] = useState('')
    const [tagline, setTagline] = useState('')
    const [publishDate, setPublishDate] = useState('')
    const [isAccuratePublishDate, setIsAccuratePublishDate] = useState(false)
    const [isGuestComic, setIsGuestComic] = useState(false)
    const [isNonCanon, setIsNonCanon] = useState(false)

    const [addAdvanceComic, { isLoading: isAdding }] =
        useAddAdvanceComicMutation()

    const onAdd = async () => {
        const parsedComicId = Number(comicId)
        if (!parsedComicId || !title) {
            return
        }

        const result = await addAdvanceComic({
            token: settings!.editModeToken,
            comicId: parsedComicId,
            title,
            tagline: tagline || undefined,
            publishDate: publishDate
                ? new Date(publishDate).toISOString()
                : undefined,
            isAccuratePublishDate,
            isGuestComic,
            isNonCanon,
        })
        if ('data' in result) {
            setComicId('')
            setTitle('')
            setTagline('')
            setPublishDate('')
            setIsAccuratePublishDate(false)
            setIsGuestComic(false)
            setIsNonCanon(false)
            onSelectPending(parsedComicId)
        }
    }

    return (
        <ModalDialog
            onCloseClicked={onClose}
            header={
                <h5 className="m-0 text-xl font-medium leading-normal text-gray-800">
                    Add advance comic
                </h5>
            }
            body={
                <>
                    {pendingComics && pendingComics.length > 0 && (
                        <>
                            <h6 className="font-medium mb-2">
                                Pending advance comics
                            </h6>
                            <ul className="mb-4">
                                {pendingComics.map((pendingComic) => (
                                    <li key={pendingComic.comic}>
                                        <button
                                            type="button"
                                            className="text-blue-600 hover:underline"
                                            onClick={() =>
                                                onSelectPending(
                                                    pendingComic.comic
                                                )
                                            }
                                        >
                                            #{pendingComic.comic} —{' '}
                                            {pendingComic.title}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                            <hr className="my-4 mx-0 border-solid border-b max-w-none" />
                        </>
                    )}
                    <div className="flex flex-col gap-2">
                        <label className="flex flex-col">
                            Comic ID
                            <input
                                type="number"
                                min="1"
                                className="border border-qc-header pl-2"
                                value={comicId}
                                onChange={(e) => setComicId(e.target.value)}
                            />
                        </label>
                        <label className="flex flex-col">
                            Title
                            <input
                                type="text"
                                className="border border-qc-header pl-2"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                        </label>
                        <label className="flex flex-col">
                            Tagline
                            <input
                                type="text"
                                className="border border-qc-header pl-2"
                                value={tagline}
                                onChange={(e) => setTagline(e.target.value)}
                            />
                        </label>
                        <label className="flex flex-col">
                            Publish date
                            <input
                                type="datetime-local"
                                className="border border-qc-header pl-2"
                                value={publishDate}
                                onChange={(e) => setPublishDate(e.target.value)}
                            />
                        </label>
                        <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={isAccuratePublishDate}
                                onChange={(e) =>
                                    setIsAccuratePublishDate(e.target.checked)
                                }
                            />
                            Accurate date
                        </label>
                        <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={isGuestComic}
                                onChange={(e) =>
                                    setIsGuestComic(e.target.checked)
                                }
                            />
                            Guest comic
                        </label>
                        <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={isNonCanon}
                                onChange={(e) =>
                                    setIsNonCanon(e.target.checked)
                                }
                            />
                            Non-canon
                        </label>
                    </div>
                </>
            }
            footer={
                <>
                    <PaddedButton
                        onClick={onAdd}
                        disabled={
                            isAdding ||
                            isFetchingPendingComics ||
                            !comicId ||
                            !title
                        }
                    >
                        Add advance comic
                    </PaddedButton>
                    <PaddedButton onClick={onClose}>Close</PaddedButton>
                </>
            }
        />
    )
}

function EditAdvanceComicDialog({
    comicId,
    onBack,
    onClose,
}: {
    comicId: ComicId
    onBack: () => void
    onClose: () => void
}) {
    const settings = useAppSelector((state) => state.settings.values)

    const { data: comicData, isFetching } = useGetComicDataQuery(
        settings ? toGetDataQueryArgs(comicId, settings) : skipToken
    )

    if (!settings?.editModeToken || !comicData || !comicData.hasData) {
        return (
            <ModalDialog
                onCloseClicked={onClose}
                header={
                    <h5 className="m-0 text-xl font-medium leading-normal text-gray-800">
                        Edit advance comic #{comicId}
                    </h5>
                }
                body={<p>{isFetching ? 'Loading…' : 'Comic not found.'}</p>}
                footer={<PaddedButton onClick={onBack}>Back</PaddedButton>}
            />
        )
    }

    return (
        <EditAdvanceComicFields
            comicId={comicId}
            settings={settings}
            initialData={comicData}
            onBack={onBack}
            onClose={onClose}
        />
    )
}

function EditAdvanceComicFields({
    comicId,
    settings,
    initialData,
    onBack,
    onClose,
}: {
    comicId: ComicId
    settings: SettingValues
    initialData: PresentComic
    onBack: () => void
    onClose: () => void
}) {
    const editModeToken = settings.editModeToken

    const [title, setTitle] = useState(initialData.title)
    const [tagline, setTagline] = useState(initialData.tagline ?? '')
    const [publishDate, setPublishDate] = useState(
        initialData.publishDate
            ? toDatetimeLocalValue(initialData.publishDate)
            : ''
    )
    const [isAccuratePublishDate, setIsAccuratePublishDate] = useState(
        initialData.isAccuratePublishDate
    )
    const [isGuestComic, setIsGuestComic] = useState(initialData.isGuestComic)
    const [isNonCanon, setIsNonCanon] = useState(initialData.isNonCanon)

    const [patchComic, { isLoading: isPatching }] = usePatchComicMutation()

    const {
        comicItems,
        allItems,
        isLoading: isLoadingItemData,
        isFetching: isFetchingItemData,
    } = useHydratedItemData(comicId, settings)

    const [addItem] = useAddItemMutation()
    const [removeItem] = useRemoveItemMutation()

    // Item navigation buttons normally jump the app to another comic to show
    // it, which would be regular site navigation via setCurrentComic. This
    // dialog must stay isolated from that, so those callbacks are no-ops —
    // only the add/remove affordances (which are comic-id-scoped mutations)
    // are wired up.
    const noopSetCurrentComic = () => {}
    const noopShowInfoFor = () => {}

    const onSave = async () => {
        if (!title) {
            return
        }

        const result = await patchComic({
            comic: comicId,
            body: {
                token: editModeToken,
                title,
                tagline: tagline || undefined,
                publishDate: publishDate
                    ? {
                          publishDate: new Date(publishDate).toISOString(),
                          isAccuratePublishDate,
                      }
                    : undefined,
                isGuestComic,
                isNonCanon,
            },
        })
        if ('data' in result) {
            onBack()
        }
    }

    return (
        <ModalDialog
            onCloseClicked={onClose}
            header={
                <h5 className="m-0 text-xl font-medium leading-normal text-gray-800">
                    Edit advance comic #{comicId}
                </h5>
            }
            body={
                <div className="flex flex-col gap-2">
                    <label className="flex flex-col">
                        Title
                        <input
                            type="text"
                            className="border border-qc-header pl-2"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </label>
                    <label className="flex flex-col">
                        Tagline
                        <input
                            type="text"
                            className="border border-qc-header pl-2"
                            value={tagline}
                            onChange={(e) => setTagline(e.target.value)}
                        />
                    </label>
                    <label className="flex flex-col">
                        Publish date
                        <input
                            type="datetime-local"
                            className="border border-qc-header pl-2"
                            value={publishDate}
                            onChange={(e) => setPublishDate(e.target.value)}
                        />
                    </label>
                    <label className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={isAccuratePublishDate}
                            onChange={(e) =>
                                setIsAccuratePublishDate(e.target.checked)
                            }
                        />
                        Accurate date
                    </label>
                    <label className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={isGuestComic}
                            onChange={(e) => setIsGuestComic(e.target.checked)}
                        />
                        Guest comic
                    </label>
                    <label className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={isNonCanon}
                            onChange={(e) => setIsNonCanon(e.target.checked)}
                        />
                        Non-canon
                    </label>
                    <hr className="my-2 mx-0 border-solid border-b max-w-none" />
                    <h6 className="font-medium mb-0">Items</h6>
                    <ItemNavigation
                        itemNavigationData={comicItems ?? []}
                        isLoading={isLoadingItemData}
                        isFetching={isFetchingItemData}
                        useColors={settings.useColors}
                        orderMembersByLastAppearance={false}
                        onSetCurrentComic={noopSetCurrentComic}
                        onShowInfoFor={noopShowInfoFor}
                        mode={NavElementMode.Present}
                        editMode
                        onRemoveItem={(itemId) => {
                            removeItem({
                                editModeToken,
                                comicId,
                                itemId,
                            })
                        }}
                    />
                    <FilteredNavigationData
                        isLoading={isLoadingItemData}
                        isFetching={isFetchingItemData}
                        isSaving={false}
                        hasError={false}
                        itemData={allItems ?? []}
                        onSetCurrentComic={noopSetCurrentComic}
                        onShowInfoFor={noopShowInfoFor}
                        useColors={settings.useColors}
                        orderMembersByLastAppearance={false}
                        editMode
                        onAddItem={(itemBody) => {
                            addItem({
                                token: editModeToken,
                                comicId,
                                ...itemBody,
                            })
                        }}
                    />
                </div>
            }
            footer={
                <>
                    <PaddedButton
                        onClick={onSave}
                        disabled={isPatching || !title}
                    >
                        Save changes
                    </PaddedButton>
                    <PaddedButton onClick={onBack}>Back</PaddedButton>
                </>
            }
        />
    )
}
