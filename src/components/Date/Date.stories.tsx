import { ComponentMeta, ComponentStory } from '@storybook/react'

import { COMIC_DATA_666 } from '~/mocks'
import Settings from '~/settings'

import { DateComponent as Date } from './Date'

export default {
    component: Date,
} as ComponentMeta<typeof Date>

const Template: ComponentStory<typeof Date> = (args) => {
    // Then, let's fake the necessary REST calls
    const { worker, rest } = window.msw
    worker.use(
        rest.get(
            'http://localhost:3000/api/v2/comicdata/:comicId',
            (req, res, ctx) => {
                // We pretend this takes 1-2 seconds so we get to
                // observe the loading UX
                return res(
                    ctx.delay(1000 + Math.random() * 1000),
                    ctx.json(COMIC_DATA_666)
                )
            }
        )
    )

    return (
        <div className="relative inline-block mt-4 mr-4">
            <Date {...args} />
        </div>
    )
}

export const Default = Template.bind({})
Default.args = {
    currentComic: 666,
    settings: Settings.DEFAULTS,
}

const ErrorTemplate: ComponentStory<typeof Date> = (args) => {
    // Then, let's fake the necessary REST calls
    const { worker, rest } = window.msw
    worker.use(
        rest.get(
            'http://localhost:3000/api/v2/comicdata/:comicId',
            (req, res, ctx) => {
                return res(
                    ctx.delay(1000 + Math.random() * 1000),
                    ctx.status(500),
                    ctx.text('Error!')
                )
            }
        )
    )

    return (
        <div className="relative inline-block mt-4 mr-4">
            <Date {...args} />
        </div>
    )
}

export const Error = ErrorTemplate.bind({})
Error.args = {
    currentComic: 42,
    settings: Settings.DEFAULTS,
}
