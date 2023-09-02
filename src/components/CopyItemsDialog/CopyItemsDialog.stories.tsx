import { apiSlice } from '@store/apiSlice'
import { setCurrentComic } from '@store/comicSlice'
import { setShowCopyItemsDialog } from '@store/dialogSlice'
import store from '@store/store'
import { ComponentMeta, ComponentStory } from '@storybook/react'

import { getComicListMocks } from '~/mocks'

import CopyItemsDialog from './CopyItemsDialog'

export default {
    component: CopyItemsDialog,
    argTypes: {
        show: {
            table: {
                disable: true,
            },
        },
    },
} as ComponentMeta<typeof CopyItemsDialog>

const Template: ComponentStory<typeof CopyItemsDialog> = (args) => {
    store.dispatch(apiSlice.util.resetApiState())

    // Let's set up the Redux store to be the way we need
    const state = store.getState()
    if (!state.dialog.showCopyItemsDialogFor) {
        store.dispatch(setShowCopyItemsDialog(666))
    }
    if (state.comic.current !== 667) {
        store.dispatch(setCurrentComic(667))
    }

    // Then, let's fake the necessary REST calls
    const { worker, rest } = window.msw
    worker.use(
        rest.get('http://localhost:3000/api/v2/comicdata/', (req, res, ctx) => {
            return res(ctx.json(getComicListMocks(1000)))
        })
    )
    worker.use(
        rest.post(
            'http://localhost:3000/api/v2/comicdata/additems',
            (req, res, ctx) => {
                // We pretend this takes 1-2 seconds so we get to
                // observe the loading UX
                return res(
                    ctx.delay(1000 + Math.random() * 1000),
                    ctx.text('Items added to comic')
                )
            }
        )
    )

    const onClose = () => {
        alert('In the userscript, this window would close now.')
    }

    return <CopyItemsDialog {...args} onClose={onClose} />
}

export const Default = Template.bind({})
Default.args = {
    show: true,
}
