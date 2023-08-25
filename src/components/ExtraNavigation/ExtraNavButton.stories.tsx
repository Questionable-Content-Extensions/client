import { forkAwesomeIcons } from '@models/ForkAwesomeIcon'
import { expect } from '@storybook/jest'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import { userEvent, within } from '@storybook/testing-library'

import ExtraNavButton from './ExtraNavButton'

export default {
    component: ExtraNavButton,
    argTypes: {
        faClass: { control: { type: 'select', options: forkAwesomeIcons } },
    },
} as ComponentMeta<typeof ExtraNavButton>

const Template: ComponentStory<typeof ExtraNavButton> = (args) => (
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
Default.play = ({ canvasElement, args }) => {
    const canvas = within(canvasElement)

    const navButton = canvas.getByRole('link')
    userEvent.click(navButton)

    expect(args.onClick).toBeCalled()
}
