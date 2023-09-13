import { setCurrentComic } from '@store/comicSlice'
import { setSettings } from '@store/settingsSlice'
import store from '@store/store'
import { expect } from '@storybook/jest'
import { Meta, StoryFn } from '@storybook/react'
import { userEvent, waitFor, within } from '@storybook/testing-library'

import { MARTEN, MARTEN_HYDRATED, MARTEN_ITEM, useMswReady } from '~/mocks'
import Settings from '~/settings'

import NavElement, { NavElementMode } from './NavElement'

export default {
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
} as Meta<typeof NavElement>

const Template: StoryFn<typeof NavElement> = function (
    this: { mode?: 'Random' | 'Chain' },
    args
) {
    const mswReady = useMswReady()

    const state = store.getState()

    if (state.comic.current !== 666) {
        store.dispatch(setCurrentComic(666))
    }

    switch (this.mode) {
        case 'Random':
            if (!state.settings.values?.showItemRandomButton) {
                store.dispatch(
                    setSettings({
                        ...Settings.DEFAULTS,
                        showItemRandomButton: true,
                    })
                )
            }
            break

        case 'Chain':
            if (!state.settings.values?.showItemChainButton) {
                store.dispatch(
                    setSettings({
                        ...Settings.DEFAULTS,
                        showItemChainButton: true,
                    })
                )
            }
            break

        default:
            store.dispatch(
                setSettings({
                    ...Settings.DEFAULTS,
                })
            )
            break
    }

    const { worker, rest } = window.msw
    worker.use(
        rest.get(
            'http://localhost:3000/api/v2/itemdata/1/comics/random',
            (req, res, ctx) => {
                return res(ctx.json(4269))
            }
        )
    )

    // For better Storybook experience, we pretend this field is a string
    // and then turn it into a number here
    const mode = args.mode
    if (typeof mode === 'string') {
        args.mode = NavElementMode[mode] as unknown as NavElementMode
    }

    return mswReady ? <NavElement {...args} /> : <></>
}

export const Default = Template.bind({})
Default.args = {
    item: MARTEN_HYDRATED,
    useColors: true,
    mode: NavElementMode[NavElementMode.Present] as unknown as NavElementMode,
    editMode: false,
}
Default.play = async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)

    await waitFor(() =>
        expect(canvas.getByTitle('First strip with Marten')).toBeInTheDocument()
    )

    expect(args.onSetCurrentComic).not.toBeCalledWith(MARTEN.first, false)
    await userEvent.click(canvas.getByTitle('First strip with Marten'))
    expect(args.onSetCurrentComic).toBeCalledWith(MARTEN.first, false)

    expect(args.onSetCurrentComic).not.toBeCalledWith(MARTEN.previous, false)
    await userEvent.click(canvas.getByTitle('Previous strip with Marten'))
    expect(args.onSetCurrentComic).toBeCalledWith(MARTEN.previous, false)

    expect(args.onSetCurrentComic).not.toBeCalledWith(MARTEN.next, false)
    await userEvent.click(canvas.getByTitle('Next strip with Marten'))
    expect(args.onSetCurrentComic).toBeCalledWith(MARTEN.next, false)

    expect(args.onSetCurrentComic).not.toBeCalledWith(MARTEN.last, false)
    await userEvent.click(canvas.getByTitle('Last strip with Marten'))
    expect(args.onSetCurrentComic).toBeCalledWith(MARTEN.last, false)

    expect(args.onShowInfoFor).not.toBeCalledWith(MARTEN.id)
    await userEvent.click(canvas.getByTitle(MARTEN_ITEM.name))
    expect(args.onShowInfoFor).toBeCalledWith(MARTEN.id)
}

export const WithoutColor = Template.bind({})
WithoutColor.args = {
    ...Default.args,
    useColors: false,
}

export const EditModePresent = Template.bind({})
EditModePresent.args = {
    ...Default.args,
    editMode: true,
}
EditModePresent.play = async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)

    await waitFor(() =>
        expect(
            canvas.getByTitle('Remove Marten from comic')
        ).toBeInTheDocument()
    )

    expect(args.onRemoveItem).not.toBeCalledWith(MARTEN.id)
    await userEvent.click(canvas.getByTitle('Remove Marten from comic'))
    expect(args.onRemoveItem).toBeCalledWith(MARTEN.id)
}

export const EditModeMissing = Template.bind({})
EditModeMissing.args = {
    ...Default.args,
    editMode: true,
    mode: NavElementMode[NavElementMode.Missing] as unknown as NavElementMode,
}
EditModeMissing.play = async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)

    await waitFor(() =>
        expect(canvas.getByTitle('Add Marten to comic')).toBeInTheDocument()
    )

    expect(args.onAddItem).not.toBeCalledWith(MARTEN.id)
    await userEvent.click(canvas.getByTitle('Add Marten to comic'))
    expect(args.onAddItem).toBeCalledWith(MARTEN.id)
}

export const WithRandomButton = Template.bind({ mode: 'Random' })
WithRandomButton.args = {
    ...Default.args,
}
WithRandomButton.play = async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)

    await waitFor(() =>
        expect(
            canvas.getByTitle('Random strip with Marten')
        ).toBeInTheDocument()
    )
    await waitFor(() =>
        expect(
            canvas.getByTitle<HTMLAnchorElement>('Random strip with Marten')
                .href
        ).toMatch(/4269$/)
    )

    expect(args.onSetCurrentComic).not.toBeCalledWith(4269, false)
    await userEvent.click(canvas.getByTitle('Random strip with Marten'))
    expect(args.onSetCurrentComic).toBeCalledWith(4269, false)
}

export const WithChainButton = Template.bind({ mode: 'Chain' })
WithChainButton.args = {
    ...Default.args,
}
WithChainButton.play = async ({ canvasElement, args: _args }) => {
    const canvas = within(canvasElement)

    await waitFor(() =>
        expect(
            canvas.getByTitle('Lock page navigation to Marten')
        ).toBeInTheDocument()
    )

    expect(store.getState().comic.lockedToItem).toBeNull()
    await userEvent.click(canvas.getByTitle('Lock page navigation to Marten'))
    expect(store.getState().comic.lockedToItem).toEqual(MARTEN.id)

    await waitFor(() =>
        expect(
            canvas.getByTitle('Unlock page navigation from Marten')
        ).toBeInTheDocument()
    )

    await userEvent.click(
        canvas.getByTitle('Unlock page navigation from Marten')
    )
    expect(store.getState().comic.lockedToItem).toBeNull()

    await waitFor(() =>
        expect(
            canvas.getByTitle('Lock page navigation to Marten')
        ).toBeInTheDocument()
    )
}
