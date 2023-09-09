import FakeComic from '@storybook/FakeComic'
import { Meta, StoryFn } from '@storybook/react'

import ComicRibbon, { RibbonType } from './ComicRibbon'

export default {
    component: ComicRibbon,
    argTypes: {
        ribbonType: {
            control: 'select',
            options: [
                RibbonType[RibbonType.None],
                RibbonType[RibbonType.GuestComic],
                RibbonType[RibbonType.NonCanon],
            ],
        },
    },
} as Meta<typeof ComicRibbon>

const Template: StoryFn<typeof ComicRibbon> = (args) => {
    // For better Storybook experience, we pretend this field is a string
    // and then turn it into a number here
    const ribbonType = args.ribbonType
    if (typeof ribbonType === 'string') {
        args.ribbonType = RibbonType[ribbonType] as unknown as RibbonType
    }

    return (
        <div className="relative inline-block mt-4 mr-4">
            <FakeComic />
            <ComicRibbon {...args} />
        </div>
    )
}

export const GuestComic = Template.bind({})
GuestComic.args = {
    show: true,
    ribbonType: RibbonType[RibbonType.GuestComic] as unknown as RibbonType,
}

export const NonCanon = Template.bind({})
NonCanon.args = {
    show: true,
    ribbonType: RibbonType[RibbonType.NonCanon] as unknown as RibbonType,
}

export const Regular = Template.bind({})
Regular.args = {
    show: true,
    ribbonType: RibbonType[RibbonType.None] as unknown as RibbonType,
}

export const Hidden = Template.bind({})
Hidden.args = {
    ...GuestComic.args,
    show: false,
}
