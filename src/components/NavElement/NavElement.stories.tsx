import { HttpResponse, http } from 'msw'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'

import { setCurrentComic } from '@store/comicSlice'
import { setSettings } from '@store/settingsSlice'
import store from '@store/store'
import type { Meta, StoryObj } from '@storybook/react-vite'

import Settings from '~/Settings'
import { MARTEN, MARTEN_HYDRATED, MARTEN_ITEM } from '~/mocks'

import NavElement, { NavElementMode } from './NavElement'

const meta: Meta<typeof NavElement> = {
    component: NavElement,
    argTypes: {
        mode: {
            control: 'select',
            options: [
                NavElementMode[NavElementMode.Present],
                NavElementMode[NavElementMode.Missing],
                NavElementMode[NavElementMode.Editor],
                NavElementMode[NavElementMode.Preview],
            ],
        },
        onSetCurrentComic: { action: 'onSetCurrentComic' },
        onShowInfoFor: { action: 'onShowInfoFor' },
        onAddItem: { action: 'onAddItem' },
        onRemoveItem: { action: 'onRemoveItem' },
    },
    args: {
        item: MARTEN_HYDRATED,
        useColors: true,
        mode: NavElementMode[
            NavElementMode.Present
        ] as unknown as NavElementMode,
        editMode: false,
        onSetCurrentComic: fn(),
        onShowInfoFor: fn(),
        onAddItem: fn(),
        onRemoveItem: fn(),
    },
    parameters: {
        msw: {
            handlers: [
                http.get(
                    'http://localhost:3000/api/v2/itemdata/1/comics/random',
                    () => HttpResponse.json(4269)
                ),
            ],
        },
    },
    // For better Storybook experience, the control shows the enum's string
    // names, but the component needs the underlying numeric enum value.
    render: (args) => {
        const mode =
            typeof args.mode === 'string'
                ? (NavElementMode[args.mode] as unknown as NavElementMode)
                : args.mode

        return <NavElement {...args} mode={mode} />
    },
    loaders: [
        () => {
            const state = store.getState()

            if (state.comic.current !== 666) {
                store.dispatch(setCurrentComic(666))
            }

            store.dispatch(
                setSettings({
                    ...Settings.DEFAULTS,
                })
            )
        },
    ],
}
export default meta

type Story = StoryObj<typeof NavElement>

export const Default: Story = {
    play: async ({ canvasElement, args }) => {
        const canvas = within(canvasElement)

        await waitFor(async () =>
            expect(
                canvas.getByTitle('First strip with Marten')
            ).toBeInTheDocument()
        )

        await expect(args.onSetCurrentComic).not.toHaveBeenCalledWith(
            MARTEN.first,
            false
        )
        await userEvent.click(canvas.getByTitle('First strip with Marten'))
        await expect(args.onSetCurrentComic).toHaveBeenCalledWith(
            MARTEN.first,
            false
        )

        await expect(args.onSetCurrentComic).not.toHaveBeenCalledWith(
            MARTEN.previous,
            false
        )
        await userEvent.click(canvas.getByTitle('Previous strip with Marten'))
        await expect(args.onSetCurrentComic).toHaveBeenCalledWith(
            MARTEN.previous,
            false
        )

        await expect(args.onSetCurrentComic).not.toHaveBeenCalledWith(
            MARTEN.next,
            false
        )
        await userEvent.click(canvas.getByTitle('Next strip with Marten'))
        await expect(args.onSetCurrentComic).toHaveBeenCalledWith(
            MARTEN.next,
            false
        )

        await expect(args.onSetCurrentComic).not.toHaveBeenCalledWith(
            MARTEN.last,
            false
        )
        await userEvent.click(canvas.getByTitle('Last strip with Marten'))
        await expect(args.onSetCurrentComic).toHaveBeenCalledWith(
            MARTEN.last,
            false
        )

        await expect(args.onShowInfoFor).not.toHaveBeenCalledWith(MARTEN.id)
        await userEvent.click(canvas.getByTitle(MARTEN_ITEM.name))
        await expect(args.onShowInfoFor).toHaveBeenCalledWith(MARTEN.id)
    },
}

export const WithoutColor: Story = {
    args: {
        useColors: false,
    },
}

export const EditModePresent: Story = {
    args: {
        editMode: true,
    },
    play: async ({ canvasElement, args }) => {
        const canvas = within(canvasElement)

        await waitFor(async () =>
            expect(
                canvas.getByTitle('Remove Marten from comic')
            ).toBeInTheDocument()
        )

        await expect(args.onRemoveItem).not.toHaveBeenCalledWith(MARTEN.id)
        await userEvent.click(canvas.getByTitle('Remove Marten from comic'))
        await expect(args.onRemoveItem).toHaveBeenCalledWith(MARTEN.id)
    },
}

export const EditModeMissing: Story = {
    args: {
        editMode: true,
        mode: NavElementMode[
            NavElementMode.Missing
        ] as unknown as NavElementMode,
    },
    play: async ({ canvasElement, args }) => {
        const canvas = within(canvasElement)

        await waitFor(async () =>
            expect(canvas.getByTitle('Add Marten to comic')).toBeInTheDocument()
        )

        await expect(args.onAddItem).not.toHaveBeenCalledWith(MARTEN.id)
        await userEvent.click(canvas.getByTitle('Add Marten to comic'))
        await expect(args.onAddItem).toHaveBeenCalledWith(MARTEN.id)
    },
}

export const WithRandomButton: Story = {
    loaders: [
        () => {
            const state = store.getState()
            if (!state.settings.values?.showItemRandomButton) {
                store.dispatch(
                    setSettings({
                        ...Settings.DEFAULTS,
                        showItemRandomButton: true,
                    })
                )
            }
        },
    ],
    play: async ({ canvasElement, args }) => {
        const canvas = within(canvasElement)

        await waitFor(async () =>
            expect(
                canvas.getByTitle('Random strip with Marten')
            ).toBeInTheDocument()
        )
        await waitFor(async () =>
            expect(
                canvas.getByTitle<HTMLAnchorElement>('Random strip with Marten')
                    .href
            ).toMatch(/4269$/)
        )

        await expect(args.onSetCurrentComic).not.toHaveBeenCalledWith(
            4269,
            false
        )
        await userEvent.click(canvas.getByTitle('Random strip with Marten'))
        await expect(args.onSetCurrentComic).toHaveBeenCalledWith(4269, false)
    },
}

export const WithChainButton: Story = {
    loaders: [
        () => {
            const state = store.getState()
            if (!state.settings.values?.showItemChainButton) {
                store.dispatch(
                    setSettings({
                        ...Settings.DEFAULTS,
                        showItemChainButton: true,
                    })
                )
            }
        },
    ],
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)

        await waitFor(async () =>
            expect(
                canvas.getByTitle('Lock page navigation to Marten')
            ).toBeInTheDocument()
        )

        await expect(store.getState().comic.lockedToItem).toBeNull()
        await userEvent.click(
            canvas.getByTitle('Lock page navigation to Marten')
        )
        await expect(store.getState().comic.lockedToItem).toEqual(MARTEN.id)

        await waitFor(async () =>
            expect(
                canvas.getByTitle('Unlock page navigation from Marten')
            ).toBeInTheDocument()
        )

        await userEvent.click(
            canvas.getByTitle('Unlock page navigation from Marten')
        )
        await expect(store.getState().comic.lockedToItem).toBeNull()

        await waitFor(async () =>
            expect(
                canvas.getByTitle('Lock page navigation to Marten')
            ).toBeInTheDocument()
        )
    },
}
