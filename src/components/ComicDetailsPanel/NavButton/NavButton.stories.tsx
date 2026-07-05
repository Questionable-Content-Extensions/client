import { fn } from 'storybook/test'

import { forkAwesomeIcons } from '@models/ForkAwesomeIcon'
import type { Meta, StoryObj } from '@storybook/react-vite'

import NavButton from './NavButton'

const meta: Meta<typeof NavButton> = {
    component: NavButton,
    argTypes: {
        faClass: { control: { type: 'select' }, options: forkAwesomeIcons },
    },
    args: {
        comicNo: 1234,
        title: 'Title',
        faClass: 'question',
        onSetCurrentComic: fn(),
    },
}
export default meta

type Story = StoryObj<typeof NavButton>

export const Default: Story = {}
