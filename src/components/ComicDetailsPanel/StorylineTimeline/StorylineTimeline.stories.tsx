import { fn } from 'storybook/test'

import { setLatestComic } from '@store/comicSlice'
import store from '@store/store'
import type { Meta, StoryObj } from '@storybook/react-vite'

import {
    STORYLINE_INTERMITTENT_HYDRATED,
    STORYLINE_LONG_GAP_HYDRATED,
    STORYLINE_OPEN_ENDED_HYDRATED,
    STORYLINE_SHORT_ARC_HYDRATED,
} from '~/mocks'

import StorylineTimeline from './StorylineTimeline'

const meta: Meta<typeof StorylineTimeline> = {
    component: StorylineTimeline,
    argTypes: {
        onSetCurrentComic: { action: 'onSetCurrentComic' },
        onShowInfoFor: { action: 'onShowInfoFor' },
        onAddItem: { action: 'onAddItem' },
        onRemoveItem: { action: 'onRemoveItem' },
    },
    args: {
        storyline: STORYLINE_SHORT_ARC_HYDRATED,
        currentComicId: 650,
        useColors: true,
        isAttachedToCurrentComic: false,
        onSetCurrentComic: fn(),
        onShowInfoFor: fn(),
        onAddItem: fn(),
        onRemoveItem: fn(),
    },
    loaders: [
        () => {
            store.dispatch(setLatestComic(900))
        },
    ],
}
export default meta

type Story = StoryObj<typeof StorylineTimeline>

export const ShortFullyFeaturedArc: Story = {
    args: {
        storyline: STORYLINE_SHORT_ARC_HYDRATED,
        currentComicId: 650,
    },
}

export const LongArcWithCappedGap: Story = {
    args: {
        storyline: STORYLINE_LONG_GAP_HYDRATED,
        currentComicId: 600,
    },
}

export const ManySmallGapsIntermittent: Story = {
    args: {
        storyline: STORYLINE_INTERMITTENT_HYDRATED,
        currentComicId: 505,
    },
}

export const OpenEndedArc: Story = {
    args: {
        storyline: STORYLINE_OPEN_ENDED_HYDRATED,
        currentComicId: 666,
    },
}

export const CurrentComicAtStart: Story = {
    args: {
        storyline: STORYLINE_LONG_GAP_HYDRATED,
        currentComicId: 400,
    },
}

export const CurrentComicAtEnd: Story = {
    args: {
        storyline: STORYLINE_LONG_GAP_HYDRATED,
        currentComicId: 899,
    },
}

export const WithoutColor: Story = {
    args: {
        storyline: STORYLINE_LONG_GAP_HYDRATED,
        currentComicId: 600,
        useColors: false,
    },
}

export const EditModeUnattached: Story = {
    args: {
        storyline: STORYLINE_LONG_GAP_HYDRATED,
        currentComicId: 600,
        editMode: true,
        isAttachedToCurrentComic: false,
    },
}

export const EditModeAttached: Story = {
    args: {
        storyline: STORYLINE_LONG_GAP_HYDRATED,
        currentComicId: 600,
        editMode: true,
        isAttachedToCurrentComic: true,
    },
}
