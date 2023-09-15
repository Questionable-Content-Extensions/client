import { marked } from 'marked'

import styles from './ChangeLogDialog.module.css'

import { PaddedButton } from '@components/Button'
import ModalDialog from '@modals/ModalDialog/ModalDialog'
import { useAppDispatch, useAppSelector } from '@store/hooks'
import { updateSettings } from '@store/settingsSlice'

import constants from '~/constants'
import { formatDate } from '~/utils'

import CHANGE_LOG from './CHANGELOG.md'

marked.use({
    renderer: {
        heading(text, level) {
            if (level === 1 || (level === 2 && text.includes('Unreleased'))) {
                return ''
            } else {
                return `<h${level}>${text.replace(
                    /- (\d{4}-\d{2}-\d{2})/,
                    (_, date) => {
                        let dateTime = formatDate(new Date(date), true)
                        dateTime = dateTime.substring(0, dateTime.length - 6)
                        return `<span class="text-sm" title="${date}">${dateTime}</span>`
                    }
                )}</h${level}>`
            }
        },
        link(href, title, text) {
            return `<a href="${href}" target="_blank" rel="noreferrer noopener" ${
                title ? 'title=' + title : ''
            }>${text}</a>`
        },
        image(href, title, text) {
            return `<img src="${href}" ${
                title ? 'style=' + title : ''
            } alt="${text}" />`
        },
    },
})

const CHANGE_LOG_MARKDOWN = marked(CHANGE_LOG).replace(
    'documented in this file',
    'documented in this change log'
)

export default function ChangeLogDialog({
    onClose,
}: {
    show: boolean
    onClose: () => void
}) {
    const dispatch = useAppDispatch()

    const settings = useAppSelector((state) => state.settings.values)

    return (
        <ModalDialog
            onCloseClicked={onClose}
            header={
                <h5 className="m-0 text-xl font-medium leading-normal text-gray-800">
                    Change Log
                </h5>
            }
            body={
                <>
                    <h2 className="text-2xl font-bold my-2">
                        Questionable Content Extensions{' '}
                        {!settings?.version
                            ? 'installed!'
                            : settings.version === constants.scriptVersion
                            ? ''
                            : 'updated!'}
                    </h2>
                    <p>
                        {!settings?.version ? (
                            'Thank you for installing Questionable Content Extensions!'
                        ) : settings.version === constants.scriptVersion ? (
                            'Thank you for using Questionable Content Extensions!'
                        ) : (
                            <>
                                Your Questionable Content Extensions has been
                                updated from{' '}
                                <span className="font-bold">
                                    v{settings.version}
                                </span>{' '}
                                to{' '}
                                <span className="font-bold">
                                    v{constants.scriptVersion}
                                </span>
                                !
                            </>
                        )}
                    </p>
                    <hr className="my-4 mx-0 border-solid border-b max-w-none" />
                    <div
                        className={styles.changeLog}
                        dangerouslySetInnerHTML={{
                            __html: CHANGE_LOG_MARKDOWN,
                        }}
                    ></div>
                </>
            }
            footer={
                <>
                    {constants.developmentMode && (
                        <>
                            <PaddedButton
                                onClick={() => {
                                    dispatch(
                                        updateSettings({
                                            ...settings!,
                                            version: '0.1.0',
                                        })
                                    )
                                }}
                            >
                                DEV: Set version to 0.1.0
                            </PaddedButton>
                            <PaddedButton
                                onClick={() => {
                                    dispatch(
                                        updateSettings({
                                            ...settings!,
                                            version: null,
                                        })
                                    )
                                }}
                            >
                                DEV: Unset version
                            </PaddedButton>
                            <PaddedButton
                                onClick={() => {
                                    onClose()
                                }}
                            >
                                DEV: Close without updating version
                            </PaddedButton>
                        </>
                    )}
                    <PaddedButton
                        onClick={() => {
                            dispatch(
                                updateSettings({
                                    ...settings!,
                                    version: constants.scriptVersion,
                                })
                            )
                            onClose()
                        }}
                    >
                        Close
                    </PaddedButton>
                </>
            }
        />
    )
}
