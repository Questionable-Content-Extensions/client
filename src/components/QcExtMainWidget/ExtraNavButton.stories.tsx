import { ComponentMeta, ComponentStory } from '@storybook/react'

import ExtraNavButton from './ExtraNavButton'

export default {
    component: ExtraNavButton,
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
