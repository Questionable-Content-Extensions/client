import { expect } from '@storybook/jest'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import { userEvent, within } from '@storybook/testing-library'

import ExtraNavigation from './ExtraNavigation'

export default {
    component: ExtraNavigation,
} as ComponentMeta<typeof ExtraNavigation>

const Template: ComponentStory<typeof ExtraNavigation> = (args) => (
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
Default.play = ({ canvasElement, args }) => {
    const canvas = within(canvasElement)

    expect(args.onSetFirstComic).not.toBeCalled()
    userEvent.click(canvas.getByTitle('Go to first strip'))
    expect(args.onSetFirstComic).toBeCalled()

    expect(args.onSetPreviousComic).not.toBeCalled()
    userEvent.click(canvas.getByTitle('Go to previous strip'))
    expect(args.onSetPreviousComic).toBeCalled()

    expect(args.onSetNextComic).not.toBeCalled()
    userEvent.click(canvas.getByTitle('Go to next strip'))
    expect(args.onSetNextComic).toBeCalled()

    expect(args.onSetLatestComic).not.toBeCalled()
    userEvent.click(canvas.getByTitle('Go to latest strip'))
    expect(args.onSetLatestComic).toBeCalled()

    expect(args.onSetRandomComic).not.toBeCalled()
    userEvent.click(canvas.getByTitle('Go to random strip'))
    expect(args.onSetRandomComic).toBeCalled()

    expect(args.onShowGoToComicDialog).not.toBeCalled()
    userEvent.click(canvas.getByTitle('Go to comic...'))
    expect(args.onShowGoToComicDialog).toBeCalled()
}
