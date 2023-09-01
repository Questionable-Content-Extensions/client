import { expect } from '@storybook/jest'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import { userEvent, waitFor, within } from '@storybook/testing-library'

import { OperationsMenu } from './OperationsMenu'

export default {
    component: OperationsMenu,
    argTypes: {
        setShowCopyItemsDialog: { action: 'setShowCopyItemsDialog' },
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
    const canvas = within(canvasElement)

    const menuButton = canvas.getByRole('button')
    userEvent.click(menuButton)

    await waitFor(async () => {
        expect(
            canvas.getByText('Copy items from another comic...')
        ).toBeInTheDocument()
    })

    userEvent.click(canvas.getByText('Copy items from another comic...'))

    expect(args.setShowCopyItemsDialog).toBeCalledWith(args.currentComic)

    await waitFor(async () => {
        expect(
            canvas.queryByText('Copy items from another comic...')
        ).not.toBeInTheDocument()
    })
}
