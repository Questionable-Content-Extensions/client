import { useArgs } from '@storybook/preview-api'
import { Meta, StoryFn } from '@storybook/react'

import Pagination from './Pagination'

export default {
    component: Pagination,
} as Meta<typeof Pagination>

const Template: StoryFn<typeof Pagination> = (args) => {
    let [_args, setArgs] = useArgs()
    const onGoToPage = (page: number) => {
        setArgs({ page })
        args.onGoToPage(page)
    }

    return (
        <div className="flex justify-center">
            <Pagination {...args} onGoToPage={onGoToPage} />
        </div>
    )
}

export const SinglePage = Template.bind({})
SinglePage.args = {
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
}

export const TenPages = Template.bind({})
TenPages.args = {
    ...SinglePage.args,
    count: 10,
}

export const HundredPages = Template.bind({})
HundredPages.args = {
    ...SinglePage.args,
    count: 100,
}

export const ThousandPages = Template.bind({})
ThousandPages.args = {
    ...SinglePage.args,
    count: 1000,
}

export const WithFirstAndLast = Template.bind({})
WithFirstAndLast.args = {
    ...ThousandPages.args,
    showFirstButton: true,
    showLastButton: true,
}

export const WithoutPrevAndNext = Template.bind({})
WithoutPrevAndNext.args = {
    ...ThousandPages.args,
    hideNextButton: true,
    hidePrevButton: true,
}

export const Disabled = Template.bind({})
Disabled.args = {
    ...ThousandPages.args,
    disabled: true,
}

export const Fetching = Template.bind({})
Fetching.args = {
    ...ThousandPages.args,
    isFetching: true,
    page: 4,
}
