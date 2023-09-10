import { Meta, StoryFn } from '@storybook/react'

import { LATEST_EDIT_LOG } from '~/mocks'

import EditLogPanel from './EditLogPanel'

export default {
    component: EditLogPanel,
} as Meta<typeof EditLogPanel>

const Template: StoryFn<typeof EditLogPanel> = (args) => {
    return <EditLogPanel {...args} />
}

export const Default = Template.bind({})
Default.args = {
    logs: LATEST_EDIT_LOG,
    isFetching: false,
    isLoading: false,
    useCorrectTimeFormat: true,
}

export const Loading = Template.bind({})
Loading.args = {
    ...Default.args,
    isLoading: true,
}

export const Fetching = Template.bind({})
Fetching.args = {
    ...Default.args,
    isFetching: true,
}
