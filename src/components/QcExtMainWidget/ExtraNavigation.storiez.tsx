import { ComponentStory, ComponentMeta } from '@storybook/react'

import ExtraNavigation from './ExtraNavigation'

export default {
    component: ExtraNavigation,
} as ComponentMeta<typeof ExtraNavigation>

const Template: ComponentStory<typeof ExtraNavigation> = (args) => (
    <ExtraNavigation {...args} />
)

export const Default = Template.bind({})
Default.args = {
    currentComic: 123,
    previousComic: 122,
    nextComic: 124,
    latestComic: 234,
    randomComic: 69,
}
