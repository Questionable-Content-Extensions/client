import { apiSlice } from '@store/apiSlice'
import { setShowEditLogDialog } from '@store/dialogSlice'
import { setSettings } from '@store/settingsSlice'
import store from '@store/store'
import { ComponentMeta, ComponentStory } from '@storybook/react'

import { EDIT_LOG_COMIC_4269, LATEST_EDIT_LOG, useMswReady } from '~/mocks'
import Settings from '~/settings'

import EditLogDialog from './EditLogDialog'

export default {
    component: EditLogDialog,
    argTypes: {
        showFor: {
            table: {
                disable: true,
            },
        },
    },
} as ComponentMeta<typeof EditLogDialog>

type ItemDetailsDialogStoryThis = {
    kind: 'All' | 'Error' | 'Comic'
}
const Template: ComponentStory<typeof EditLogDialog> = function (
    this: ItemDetailsDialogStoryThis,
    args
) {
    const mswReady = useMswReady()

    // Let's set up the Redux store to be the way we need
    const state = store.getState()
    store.dispatch(apiSlice.util.resetApiState())
    if (state.dialog.showEditLogDialogFor === false) {
        store.dispatch(setShowEditLogDialog(this.kind === 'All' ? true : 666))
        store.dispatch(
            setSettings({
                ...Settings.DEFAULTS,
                editMode: true,
                editModeToken: '00000000-0000-0000-0000-000000000000',
            })
        )
    }

    // Then, let's fake the necessary REST calls
    const { worker, rest } = window.msw
    if (this.kind === 'All') {
        worker.use(
            rest.get('http://localhost:3000/api/v2/log/', (req, res, ctx) => {
                const page = Number(req.url.searchParams.get('page'))
                return res(
                    ctx.delay(1000 + Math.random() * 1000),
                    ctx.json({ ...LATEST_EDIT_LOG, page })
                )
            })
        )
    } else if (this.kind === 'Comic') {
        worker.use(
            rest.get(
                'http://localhost:3000/api/v2/log/comic',
                (req, res, ctx) => {
                    const page = Number(req.url.searchParams.get('page'))
                    return res(
                        ctx.delay(1000 + Math.random() * 1000),
                        ctx.json({ ...EDIT_LOG_COMIC_4269, page })
                    )
                }
            )
        )
    } else if (this.kind === 'Error') {
        worker.use(
            rest.get('http://localhost:3000/api/v2/log/', (req, res, ctx) => {
                return res(
                    ctx.delay(1000 + Math.random() * 1000),
                    ctx.status(500),
                    ctx.text('Server Error')
                )
            })
        )
    }

    const onClose = () => {
        alert('In the userscript, this window would close now.')
    }

    return mswReady ? <EditLogDialog {...args} onClose={onClose} /> : <></>
}

export const All = Template.bind({ kind: 'All' })
All.args = {
    showFor: true,
}

export const Comic = Template.bind({ kind: 'Comic' })
Comic.args = {
    showFor: 4269,
}

export const Error = Template.bind({ kind: 'Error' })
Error.args = {
    showFor: true,
}
