import ToggleButton from '@components/ToggleButton/ToggleButton'
import {
    isHasNoCastDirtySelector,
    isHasNoLocationDirtySelector,
    isHasNoStorylineDirtySelector,
    isHasNoTaglineDirtySelector,
    isHasNoTitleDirtySelector,
    isIsGuestComicDirtySelector,
    isIsNonCanonDirtySelector,
    setFlag,
} from '@store/comicEditorSlice'
import { useAppDispatch, useAppSelector } from '@store/hooks'

export default function ComicFlags({
    isLoading,
    hasError,
    hasCastItems,
    hasLocationItems,
    hasStorylineItems,
}: {
    isLoading: boolean
    hasError: boolean
    hasCastItems: boolean
    hasLocationItems: boolean
    hasStorylineItems: boolean
}) {
    const dispatch = useAppDispatch()

    const isGuestComic = useAppSelector(
        (state) => state.comicEditor.isGuestComic
    )
    const isGuestComicDirty = useAppSelector((state) =>
        isIsGuestComicDirtySelector(state)
    )
    const isNonCanon = useAppSelector((state) => state.comicEditor.isNonCanon)
    const isNonCanonDirty = useAppSelector((state) =>
        isIsNonCanonDirtySelector(state)
    )
    const hasNoCast = useAppSelector((state) => state.comicEditor.hasNoCast)
    const hasNoCastDirty = useAppSelector((state) =>
        isHasNoCastDirtySelector(state)
    )
    const hasNoLocation = useAppSelector(
        (state) => state.comicEditor.hasNoLocation
    )
    const hasNoLocationDirty = useAppSelector((state) =>
        isHasNoLocationDirtySelector(state)
    )
    const hasNoStoryline = useAppSelector(
        (state) => state.comicEditor.hasNoStoryline
    )
    const hasNoStorylineDirty = useAppSelector((state) =>
        isHasNoStorylineDirtySelector(state)
    )
    const hasNoTitle = useAppSelector((state) => state.comicEditor.hasNoTitle)
    const hasNoTitleDirty = useAppSelector((state) =>
        isHasNoTitleDirtySelector(state)
    )
    const hasNoTagline = useAppSelector(
        (state) => state.comicEditor.hasNoTagline
    )
    const hasNoTaglineDirty = useAppSelector((state) =>
        isHasNoTaglineDirtySelector(state)
    )

    return (
        <div className="flex flex-col gap-1">
            <ToggleButton
                label="Guest comic"
                checked={isGuestComic}
                onChange={(e) => {
                    dispatch(setFlag('isGuestComic', e.target.checked))
                }}
                disabled={isLoading || hasError}
                dirty={isGuestComicDirty}
            />
            <ToggleButton
                label="Non-canon"
                checked={isNonCanon}
                onChange={(e) => {
                    dispatch(setFlag('isNonCanon', e.target.checked))
                }}
                disabled={isLoading || hasError}
                dirty={isNonCanonDirty}
            />
            <ToggleButton
                label="No cast"
                title="Indicates that it is not a mistake that there are no cast members in this comic"
                checked={hasNoCast}
                disabled={hasCastItems || isLoading || hasError}
                onChange={(e) => {
                    dispatch(setFlag('hasNoCast', e.target.checked))
                }}
                dirty={hasNoCastDirty}
            />
            <ToggleButton
                label="No location"
                title="Indicates that it is not a mistake that there are no locations in this comic"
                checked={hasNoLocation}
                disabled={hasLocationItems || isLoading || hasError}
                onChange={(e) => {
                    dispatch(setFlag('hasNoLocation', e.target.checked))
                }}
                dirty={hasNoLocationDirty}
            />
            <ToggleButton
                label="No storyline"
                title="Indicates that it is not a mistake that there are no storylines in this comic"
                checked={hasNoStoryline}
                disabled={hasStorylineItems || isLoading || hasError}
                onChange={(e) => {
                    dispatch(setFlag('hasNoStoryline', e.target.checked))
                }}
                dirty={hasNoStorylineDirty}
            />
            <ToggleButton
                label="No title"
                title="Indicates that it is not a mistake that this comic has no title"
                checked={hasNoTitle}
                disabled={isLoading || hasError}
                onChange={(e) => {
                    dispatch(setFlag('hasNoTitle', e.target.checked))
                }}
                dirty={hasNoTitleDirty}
            />
            <ToggleButton
                label="No tagline"
                title="Indicates that it is not a mistake that this comic has no tagline"
                checked={hasNoTagline}
                disabled={isLoading || hasError}
                onChange={(e) => {
                    dispatch(setFlag('hasNoTagline', e.target.checked))
                }}
                dirty={hasNoTaglineDirty}
            />
        </div>
    )
}
