import type { Meta, StoryObj } from '@storybook/react-vite'

import { LATEST_EDIT_LOG } from '~/mocks'

import EditLogPanel from './EditLogPanel'

const meta: Meta<typeof EditLogPanel> = {
    component: EditLogPanel,
    args: {
        logs: LATEST_EDIT_LOG,
        isFetching: false,
        isLoading: false,
        useCorrectTimeFormat: true,
    },
}
export default meta

type Story = StoryObj<typeof EditLogPanel>

export const Default: Story = {}

export const Loading: Story = {
    args: {
        isLoading: true,
    },
}

export const Fetching: Story = {
    args: {
        isFetching: true,
    },
}
