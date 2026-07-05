import type { Meta, StoryObj } from '@storybook/react-vite'

import FakeComic from '~/storybook/FakeComic'

import ComicRibbon, { RibbonType } from './ComicRibbon'

const meta: Meta<typeof ComicRibbon> = {
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
    // For better Storybook experience, the control shows the enum's string
    // names, but the component needs the underlying numeric enum value.
    render: (args) => {
        const ribbonType =
            typeof args.ribbonType === 'string'
                ? (RibbonType[args.ribbonType] as unknown as RibbonType)
                : args.ribbonType

        return (
            <div className="relative inline-block mt-4 mr-4">
                <FakeComic />
                <ComicRibbon {...args} ribbonType={ribbonType} />
            </div>
        )
    },
}
export default meta

type Story = StoryObj<typeof ComicRibbon>

export const GuestComic: Story = {
    args: {
        show: true,
        ribbonType: RibbonType[RibbonType.GuestComic] as unknown as RibbonType,
    },
}

export const NonCanon: Story = {
    args: {
        show: true,
        ribbonType: RibbonType[RibbonType.NonCanon] as unknown as RibbonType,
    },
}

export const Regular: Story = {
    args: {
        show: true,
        ribbonType: RibbonType[RibbonType.None] as unknown as RibbonType,
    },
}

export const Hidden: Story = {
    args: {
        ...GuestComic.args,
        show: false,
    },
}
