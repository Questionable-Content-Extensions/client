import { ConnectedProps, connect } from 'react-redux'

import { FlagType } from '@models/FlagType'
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
import { AppDispatch, RootState } from '@store/store'

import ToggleButton from './ToggleButton/ToggleButton'

const mapState = (state: RootState) => {
    return {
        isGuestComic: state.comicEditor.isGuestComic,
        isGuestComicDirty: isIsGuestComicDirtySelector(state),
        isNonCanon: state.comicEditor.isNonCanon,
        isNonCanonDirty: isIsNonCanonDirtySelector(state),
        hasNoCast: state.comicEditor.hasNoCast,
        hasNoCastDirty: isHasNoCastDirtySelector(state),
        hasNoLocation: state.comicEditor.hasNoLocation,
        hasNoLocationDirty: isHasNoLocationDirtySelector(state),
        hasNoStoryline: state.comicEditor.hasNoStoryline,
        hasNoStorylineDirty: isHasNoStorylineDirtySelector(state),
        hasNoTitle: state.comicEditor.hasNoTitle,
        hasNoTitleDirty: isHasNoTitleDirtySelector(state),
        hasNoTagline: state.comicEditor.hasNoTagline,
        hasNoTaglineDirty: isHasNoTaglineDirtySelector(state),
    }
}

const mapDispatch = (dispatch: AppDispatch) => {
    return {
        setFlag: (flag: FlagType, value: boolean) => {
            dispatch(setFlag(flag, value))
        },
    }
}

const connector = connect(mapState, mapDispatch)
type PropsFromRedux = ConnectedProps<typeof connector>
type ComicFlagsWidgetProps = PropsFromRedux & {
    isLoading: boolean
    hasError: boolean
    hasCastItems: boolean
    hasLocationItems: boolean
    hasStorylineItems: boolean
}

function ComicFlagsWidget({
    isGuestComic,
    isGuestComicDirty,
    isNonCanon,
    isNonCanonDirty,
    hasNoCast,
    hasNoCastDirty,
    hasNoLocation,
    hasNoLocationDirty,
    hasNoStoryline,
    hasNoStorylineDirty,
    hasNoTitle,
    hasNoTitleDirty,
    hasNoTagline,
    hasNoTaglineDirty,
    setFlag,

    isLoading,
    hasError,
    hasCastItems,
    hasLocationItems,
    hasStorylineItems,
}: ComicFlagsWidgetProps) {
    return (
        <div className="flex flex-col gap-1">
            <ToggleButton
                label="Guest comic"
                checked={isGuestComic}
                onChange={(e) => {
                    setFlag('isGuestComic', e.target.checked)
                }}
                disabled={isLoading || hasError}
                dirty={isGuestComicDirty}
            />
            <ToggleButton
                label="Non-canon"
                checked={isNonCanon}
                onChange={(e) => {
                    setFlag('isNonCanon', e.target.checked)
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
                    setFlag('hasNoCast', e.target.checked)
                }}
                dirty={hasNoCastDirty}
            />
            <ToggleButton
                label="No location"
                title="Indicates that it is not a mistake that there are no locations in this comic"
                checked={hasNoLocation}
                disabled={hasLocationItems || isLoading || hasError}
                onChange={(e) => {
                    setFlag('hasNoLocation', e.target.checked)
                }}
                dirty={hasNoLocationDirty}
            />
            <ToggleButton
                label="No storyline"
                title="Indicates that it is not a mistake that there are no storylines in this comic"
                checked={hasNoStoryline}
                disabled={hasStorylineItems || isLoading || hasError}
                onChange={(e) => {
                    setFlag('hasNoStoryline', e.target.checked)
                }}
                dirty={hasNoStorylineDirty}
            />
            <ToggleButton
                label="No title"
                title="Indicates that it is not a mistake that this comic has no title"
                checked={hasNoTitle}
                disabled={isLoading || hasError}
                onChange={(e) => {
                    setFlag('hasNoTitle', e.target.checked)
                }}
                dirty={hasNoTitleDirty}
            />
            <ToggleButton
                label="No tagline"
                title="Indicates that it is not a mistake that this comic has no tagline"
                checked={hasNoTagline}
                disabled={isLoading || hasError}
                onChange={(e) => {
                    setFlag('hasNoTagline', e.target.checked)
                }}
                dirty={hasNoTaglineDirty}
            />
        </div>
    )
}

export default connector(ComicFlagsWidget)
