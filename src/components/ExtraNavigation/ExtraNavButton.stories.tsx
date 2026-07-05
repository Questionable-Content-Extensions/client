import { expect, fn, userEvent, within } from 'storybook/test'

import { forkAwesomeIcons } from '@models/ForkAwesomeIcon'
import type { Meta, StoryObj } from '@storybook/react-vite'

import ExtraNavButton from './ExtraNavButton'

const meta: Meta<typeof ExtraNavButton> = {
    component: ExtraNavButton,
    argTypes: {
        faClass: { control: { type: 'select' }, options: forkAwesomeIcons },
    },
    args: {
        comicNo: 69,
        title: 'Previous strip',
        visible: true,
        faClass: 'backward',
        smallXPadding: false,
        onClick: fn(),
    },
    render: (args) => (
        <div
            className={
                'inline-block shadow m-auto' + (args.visible ? '' : ' hidden')
            }
        >
            <ExtraNavButton {...args} />
        </div>
    ),
}
export default meta

type Story = StoryObj<typeof ExtraNavButton>

export const Default: Story = {
    play: async ({ canvasElement, args }) => {
        const canvas = within(canvasElement)

        const navButton = canvas.getByRole('link')
        await userEvent.click(navButton)

        await expect(args.onClick).toHaveBeenCalled()
    },
}
