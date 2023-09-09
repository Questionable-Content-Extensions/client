import { expect } from '@storybook/jest'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import { userEvent, waitFor, within } from '@storybook/testing-library'

import { OperationsMenu, OperationsMenuProps } from './OperationsMenu'

export default {
    component: OperationsMenu,
    argTypes: {
        setShowCopyItemsDialog: { action: 'setShowCopyItemsDialog' },

        setShowEditLogDialog: { action: 'setShowEditLogDialog' },
    },
} as ComponentMeta<typeof OperationsMenu>

const Template: ComponentStory<typeof OperationsMenu> = (args) => {
    return <OperationsMenu {...args} />
}

export const Default = Template.bind({})
Default.args = {
    currentComic: 42,
}
Default.play = async ({ canvasElement, args }) => {
    await testMenuItem(
        canvasElement,
        args,
        'Copy items from another comic...',
        (a) => a.setShowCopyItemsDialog,
        args.currentComic
    )
    await testMenuItem(
        canvasElement,
        args,
        'Show edit log for comic 42...',
        (a) => a.setShowEditLogDialog,
        args.currentComic
    )
    await testMenuItem(
        canvasElement,
        args,
        'Show edit log...',
        (a) => a.setShowEditLogDialog,
        true
    )
}
async function testMenuItem<T>(
    canvasElement: HTMLElement,
    args: OperationsMenuProps,
    menuText: string,
    argsFieldSelector: (args: OperationsMenuProps) => (_: T) => void,
    argsFieldExpectedValue: T
) {
    const canvas = within(canvasElement)

    await waitFor(async () => {
        expect(canvas.queryByText(menuText)).not.toBeInTheDocument()
    })

    const menuButton = canvas.getByRole('button')
    userEvent.click(menuButton)

    await waitFor(async () => {
        expect(canvas.getByText(menuText)).toBeInTheDocument()
    })

    userEvent.click(canvas.getByText(menuText))

    expect(argsFieldSelector(args)).toBeCalledWith(argsFieldExpectedValue)

    await waitFor(async () => {
        expect(canvas.queryByText(menuText)).not.toBeInTheDocument()
    })
}
