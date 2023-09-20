import { expect } from '@storybook/jest'
import { Meta, StoryFn } from '@storybook/react'
import { userEvent, within } from '@storybook/testing-library'

import ExtraNavigation from './ExtraNavigation'

export default {
    component: ExtraNavigation,
} as Meta<typeof ExtraNavigation>

const Template: StoryFn<typeof ExtraNavigation> = (args) => (
    <ExtraNavigation {...args} />
)

export const Default = Template.bind({})
Default.args = {
    currentComic: 123,
    previousComic: 122,
    nextComic: 124,
    latestComic: 234,
    randomComic: 69,
}
Default.play = async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)

    expect(args.onSetFirstComic).not.toBeCalled()
    await userEvent.click(canvas.getByTitle('Go to first strip'))
    expect(args.onSetFirstComic).toBeCalled()

    expect(args.onSetPreviousComic).not.toBeCalled()
    await userEvent.click(canvas.getByTitle('Go to previous strip'))
    expect(args.onSetPreviousComic).toBeCalled()

    expect(args.onSetNextComic).not.toBeCalled()
    await userEvent.click(canvas.getByTitle('Go to next strip'))
    expect(args.onSetNextComic).toBeCalled()

    expect(args.onSetLatestComic).not.toBeCalled()
    await userEvent.click(canvas.getByTitle('Go to latest strip'))
    expect(args.onSetLatestComic).toBeCalled()

    expect(args.onSetRandomComic).not.toBeCalled()
    await userEvent.click(canvas.getByTitle('Go to random strip'))
    expect(args.onSetRandomComic).toBeCalled()

    expect(args.onShowGoToComicDialog).not.toBeCalled()
    await userEvent.click(canvas.getByTitle('Go to comic...'))
    expect(args.onShowGoToComicDialog).toBeCalled()
}
