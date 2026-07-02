import { expect, fn, userEvent, within } from 'storybook/test'

import type { Meta, StoryObj } from '@storybook/react-vite'

import ExtraNavigation from './ExtraNavigation'

const meta: Meta<typeof ExtraNavigation> = {
    component: ExtraNavigation,
    args: {
        currentComic: 123,
        previousComic: 122,
        nextComic: 124,
        latestComic: 234,
        randomComic: 69,
        onSetFirstComic: fn(),
        onSetPreviousComic: fn(),
        onSetNextComic: fn(),
        onSetLatestComic: fn(),
        onSetRandomComic: fn(),
        onShowGoToComicDialog: fn(),
    },
}
export default meta

type Story = StoryObj<typeof ExtraNavigation>

export const Default: Story = {
    play: async ({ canvasElement, args }) => {
        const canvas = within(canvasElement)

        await expect(args.onSetFirstComic).not.toHaveBeenCalled()
        await userEvent.click(canvas.getByTitle('Go to first strip'))
        await expect(args.onSetFirstComic).toHaveBeenCalled()

        await expect(args.onSetPreviousComic).not.toHaveBeenCalled()
        await userEvent.click(canvas.getByTitle('Go to previous strip'))
        await expect(args.onSetPreviousComic).toHaveBeenCalled()

        await expect(args.onSetNextComic).not.toHaveBeenCalled()
        await userEvent.click(canvas.getByTitle('Go to next strip'))
        await expect(args.onSetNextComic).toHaveBeenCalled()

        await expect(args.onSetLatestComic).not.toHaveBeenCalled()
        await userEvent.click(canvas.getByTitle('Go to latest strip'))
        await expect(args.onSetLatestComic).toHaveBeenCalled()

        await expect(args.onSetRandomComic).not.toHaveBeenCalled()
        await userEvent.click(canvas.getByTitle('Go to random strip'))
        await expect(args.onSetRandomComic).toHaveBeenCalled()

        await expect(args.onShowGoToComicDialog).not.toHaveBeenCalled()
        await userEvent.click(
            canvas.getByTitle('Go to comic... / filter comics...')
        )
        await expect(args.onShowGoToComicDialog).toHaveBeenCalled()
    },
}
