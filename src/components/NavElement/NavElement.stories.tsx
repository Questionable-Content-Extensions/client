import { expect } from '@storybook/jest'
import { Meta, StoryFn } from '@storybook/react'
import { userEvent, within } from '@storybook/testing-library'

import { MARTEN, MARTEN_HYDRATED, MARTEN_ITEM } from '~/mocks'

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
    },
} as Meta<typeof NavElement>

const Template: StoryFn<typeof NavElement> = (args) => {
    // For better Storybook experience, we pretend this field is a string
    // and then turn it into a number here
    const mode = args.mode
    if (typeof mode === 'string') {
        args.mode = NavElementMode[mode] as unknown as NavElementMode
    }

    return <NavElement {...args} />
}

export const Default = Template.bind({})
Default.args = {
    item: MARTEN_HYDRATED,
    useColors: true,
    mode: NavElementMode[NavElementMode.Present] as unknown as NavElementMode,
    editMode: false,
}
Default.play = ({ canvasElement, args }) => {
    const canvas = within(canvasElement)

    expect(args.onSetCurrentComic).not.toBeCalledWith(MARTEN.first)
    userEvent.click(canvas.getByTitle('First strip with Marten'))
    expect(args.onSetCurrentComic).toBeCalledWith(MARTEN.first)

    expect(args.onSetCurrentComic).not.toBeCalledWith(MARTEN.previous)
    userEvent.click(canvas.getByTitle('Previous strip with Marten'))
    expect(args.onSetCurrentComic).toBeCalledWith(MARTEN.previous)

    expect(args.onSetCurrentComic).not.toBeCalledWith(MARTEN.next)
    userEvent.click(canvas.getByTitle('Next strip with Marten'))
    expect(args.onSetCurrentComic).toBeCalledWith(MARTEN.next)

    expect(args.onSetCurrentComic).not.toBeCalledWith(MARTEN.last)
    userEvent.click(canvas.getByTitle('Last strip with Marten'))
    expect(args.onSetCurrentComic).toBeCalledWith(MARTEN.last)

    expect(args.onShowInfoFor).not.toBeCalledWith(MARTEN.id)
    userEvent.click(canvas.getByTitle(MARTEN_ITEM.name))
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
EditModePresent.play = ({ canvasElement, args }) => {
    const canvas = within(canvasElement)

    expect(args.onRemoveItem).not.toBeCalledWith(MARTEN.id)
    userEvent.click(canvas.getByTitle('Remove Marten from comic'))
    expect(args.onRemoveItem).toBeCalledWith(MARTEN.id)
}

export const EditModeMissing = Template.bind({})
EditModeMissing.args = {
    ...Default.args,
    editMode: true,
    mode: NavElementMode[NavElementMode.Missing] as unknown as NavElementMode,
}
EditModeMissing.play = ({ canvasElement, args }) => {
    const canvas = within(canvasElement)

    expect(args.onAddItem).not.toBeCalledWith(MARTEN.id)
    userEvent.click(canvas.getByTitle('Add Marten to comic'))
    expect(args.onAddItem).toBeCalledWith(MARTEN.id)
}
