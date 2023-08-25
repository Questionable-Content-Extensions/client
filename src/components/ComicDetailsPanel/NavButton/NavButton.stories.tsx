import { forkAwesomeIcons } from '@models/ForkAwesomeIcon'
import { ComponentMeta, ComponentStory } from '@storybook/react'

import NavButton from './NavButton'

export default {
    component: NavButton,
    argTypes: {
        faClass: { control: { type: 'select', options: forkAwesomeIcons } },
    },
} as ComponentMeta<typeof NavButton>

const Template: ComponentStory<typeof NavButton> = (args) => (
    <NavButton {...args} />
)

export const Default = Template.bind({})
Default.args = {
    comicNo: 1234,
    title: 'Title',
    faClass: 'question',
}
