import { useArgs } from 'storybook/preview-api'

import type { Meta, StoryObj } from '@storybook/react-vite'

import Pagination from './Pagination'

const meta: Meta<typeof Pagination> = {
    component: Pagination,
    args: {
        page: 1,
        count: 1,
        siblingCount: 2,
        boundaryCount: 3,
        showFirstButton: false,
        showLastButton: false,
        hideNextButton: false,
        hidePrevButton: false,
        disabled: false,
        isFetching: false,
    },
    render: (args) => {
        const [, setArgs] = useArgs()
        const onGoToPage = (page: number) => {
            setArgs({ page })
            args.onGoToPage(page)
        }

        return (
            <div className="flex justify-center">
                <Pagination {...args} onGoToPage={onGoToPage} />
            </div>
        )
    },
}
export default meta

type Story = StoryObj<typeof Pagination>

export const SinglePage: Story = {}

export const TenPages: Story = {
    args: {
        count: 10,
    },
}

export const HundredPages: Story = {
    args: {
        count: 100,
    },
}

export const ThousandPages: Story = {
    args: {
        count: 1000,
    },
}

export const WithFirstAndLast: Story = {
    args: {
        ...ThousandPages.args,
        showFirstButton: true,
        showLastButton: true,
    },
}

export const WithoutPrevAndNext: Story = {
    args: {
        ...ThousandPages.args,
        hideNextButton: true,
        hidePrevButton: true,
    },
}

export const Disabled: Story = {
    args: {
        ...ThousandPages.args,
        disabled: true,
    },
}

export const Fetching: Story = {
    args: {
        ...ThousandPages.args,
        isFetching: true,
        page: 4,
    },
}
