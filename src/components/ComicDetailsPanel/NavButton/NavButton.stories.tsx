import { forkAwesomeIcons } from '@models/ForkAwesomeIcon'
import { Meta, StoryFn } from '@storybook/react'

import NavButton from './NavButton'

export default {
    component: NavButton,
    argTypes: {
        faClass: { control: { type: 'select' }, options: forkAwesomeIcons },
    },
} as Meta<typeof NavButton>

const Template: StoryFn<typeof NavButton> = (args) => <NavButton {...args} />

export const Default = Template.bind({})
Default.args = {
    comicNo: 1234,
    title: 'Title',
    faClass: 'question',
}
