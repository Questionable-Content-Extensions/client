import { ComponentMeta, ComponentStory } from '@storybook/react'

import { ItemNavigationData } from '../../services/comicDataService'
import NavElement from './NavElement'

const MARTEN: ItemNavigationData = {
    id: 1,
    shortName: 'Marten',
    name: 'Marten Reed',
    type: 'cast',
    color: '7d929e',
    first: 1,
    previous: 1233,
    next: 1235,
    last: 2345,
    count: 6969,
}

export default {
    component: NavElement,
} as ComponentMeta<typeof NavElement>

const Template: ComponentStory<typeof NavElement> = (args) => (
    <NavElement {...args} />
)

export const Default = Template.bind({})
Default.args = {
    item: MARTEN,
    useColors: true,
}

export const WithoutColor = Template.bind({})
WithoutColor.args = {
    item: MARTEN,
    useColors: false,
}
