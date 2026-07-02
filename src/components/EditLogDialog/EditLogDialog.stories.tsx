import { HttpResponse, delay, http } from 'msw'

import { apiSlice } from '@store/apiSlice'
import { setShowEditLogDialog } from '@store/dialogSlice'
import { setSettings } from '@store/settingsSlice'
import store from '@store/store'
import type { Meta, StoryObj } from '@storybook/react-vite'

import Settings from '~/Settings'
import { EDIT_LOG_COMIC_4269, LATEST_EDIT_LOG } from '~/mocks'

import EditLogDialog from './EditLogDialog'

const meta: Meta<typeof EditLogDialog> = {
    component: EditLogDialog,
    argTypes: {
        showFor: {
            table: {
                disable: true,
            },
        },
    },
    args: {
        onClose: () => {
            alert('In the userscript, this window would close now.')
        },
    },
    loaders: [
        () => {
            store.dispatch(apiSlice.util.resetApiState())
        },
    ],
}
export default meta

type Story = StoryObj<typeof EditLogDialog>

export const All: Story = {
    args: {
        showFor: true,
    },
    parameters: {
        msw: {
            handlers: [
                http.get(
                    'http://localhost:3000/api/v2/log/',
                    async ({ request }) => {
                        const page = Number(
                            new URL(request.url).searchParams.get('page')
                        )
                        await delay(1000 + Math.random() * 1000)
                        return HttpResponse.json({
                            ...LATEST_EDIT_LOG,
                            page,
                        })
                    }
                ),
            ],
        },
    },
    loaders: [
        () => {
            const state = store.getState()
            if (state.dialog.showEditLogDialogFor === false) {
                store.dispatch(setShowEditLogDialog(true))
                store.dispatch(
                    setSettings({
                        ...Settings.DEFAULTS,
                        editMode: true,
                        editModeToken: '00000000-0000-0000-0000-000000000000',
                    })
                )
            }
        },
    ],
}

export const Comic: Story = {
    args: {
        showFor: 4269,
    },
    parameters: {
        msw: {
            handlers: [
                http.get(
                    'http://localhost:3000/api/v2/log/comic',
                    async ({ request }) => {
                        const page = Number(
                            new URL(request.url).searchParams.get('page')
                        )
                        await delay(1000 + Math.random() * 1000)
                        return HttpResponse.json({
                            ...EDIT_LOG_COMIC_4269,
                            page,
                        })
                    }
                ),
            ],
        },
    },
    loaders: [
        () => {
            const state = store.getState()
            if (state.dialog.showEditLogDialogFor === false) {
                store.dispatch(setShowEditLogDialog(666))
                store.dispatch(
                    setSettings({
                        ...Settings.DEFAULTS,
                        editMode: true,
                        editModeToken: '00000000-0000-0000-0000-000000000000',
                    })
                )
            }
        },
    ],
}

export const Error: Story = {
    args: {
        showFor: true,
    },
    parameters: {
        msw: {
            handlers: [
                http.get('http://localhost:3000/api/v2/log/', async () => {
                    await delay(1000 + Math.random() * 1000)
                    return HttpResponse.text('Server Error', { status: 500 })
                }),
            ],
        },
    },
    loaders: [
        () => {
            const state = store.getState()
            if (state.dialog.showEditLogDialogFor === false) {
                store.dispatch(setShowEditLogDialog(true))
                store.dispatch(
                    setSettings({
                        ...Settings.DEFAULTS,
                        editMode: true,
                        editModeToken: '00000000-0000-0000-0000-000000000000',
                    })
                )
            }
        },
    ],
}
