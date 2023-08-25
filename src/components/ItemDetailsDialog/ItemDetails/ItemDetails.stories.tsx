import { ComponentMeta, ComponentStory } from '@storybook/react'

import { FAYE } from '~/mocks'

import ItemDetails from './ItemDetails'

export default {
    component: ItemDetails,
} as ComponentMeta<typeof ItemDetails>

const Template: ComponentStory<typeof ItemDetails> = (args) => {
    return <ItemDetails {...args} />
}

export const Default = Template.bind({})
Default.args = {
    item: FAYE,
    editMode: false,
}
