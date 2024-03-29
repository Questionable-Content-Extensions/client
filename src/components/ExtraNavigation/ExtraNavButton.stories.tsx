import { forkAwesomeIcons } from '@models/ForkAwesomeIcon'
import { expect } from '@storybook/jest'
import { Meta, StoryFn } from '@storybook/react'
import { userEvent, within } from '@storybook/testing-library'

import ExtraNavButton from './ExtraNavButton'

export default {
    component: ExtraNavButton,
    argTypes: {
        faClass: { control: { type: 'select' }, options: forkAwesomeIcons },
    },
} as Meta<typeof ExtraNavButton>

const Template: StoryFn<typeof ExtraNavButton> = (args) => (
    <div
        className={
            'inline-block shadow m-auto' + (args.visible ? '' : ' hidden')
        }
    >
        <ExtraNavButton {...args} />
    </div>
)

export const Default = Template.bind({})
Default.args = {
    comicNo: 69,
    title: 'Previous strip',
    visible: true,
    faClass: 'backward',
    smallXPadding: false,
}
Default.play = async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)

    const navButton = canvas.getByRole('link')
    await userEvent.click(navButton)

    expect(args.onClick).toBeCalled()
}
