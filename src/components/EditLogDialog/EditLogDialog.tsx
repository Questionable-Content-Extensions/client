import { useState } from 'react'

import { PaddedButton } from '@components/Button'
import ModalDialog from '@modals/ModalDialog/ModalDialog'
import { skipToken } from '@reduxjs/toolkit/dist/query'
import {
    useGetLogsForComicQuery,
    useGetLogsQuery,
} from '@store/api/logApiSlice'
import { EditLogDialogTarget } from '@store/dialogSlice'
import { useAppSelector } from '@store/hooks'

import EditLogPanel from './EditLogPanel/EditLogPanel'
import Pagination from './Pagination/Pagination'

function isSameEditLogTarget(
    a: EditLogDialogTarget,
    b: EditLogDialogTarget
): boolean {
    if (a.kind !== b.kind) return false
    return a.kind === 'comic' && b.kind === 'comic'
        ? a.comicId === b.comicId
        : true
}

export default function EditLogDialog({
    showFor,
    onClose,
}: {
    showFor: EditLogDialogTarget
    onClose: () => void
}) {
    const settings = useAppSelector((state) => state.settings.values)

    const [currentShowFor, setCurrentShowFor] = useState<EditLogDialogTarget>({
        kind: 'closed',
    })
    const [currentPage, setCurrentPage] = useState(1)
    if (
        showFor.kind !== 'closed' &&
        !isSameEditLogTarget(currentShowFor, showFor)
    ) {
        setCurrentShowFor(showFor)
        setCurrentPage(1)
    }
    const {
        data: allLogs,
        isLoading: isLoadingAllLogs,
        isFetching: isFetchingAllLogs,
        isError: hasAllLogsError,
        refetch: reloadAllEditLog,
    } = useGetLogsQuery(
        currentShowFor.kind === 'all' && settings
            ? { page: currentPage }
            : skipToken
    )
    const {
        data: comicLogs,
        isLoading: isLoadingComicLogs,
        isFetching: isFetchingComicLogs,
        isError: hasComicLogsError,
        refetch: reloadComicEditLog,
    } = useGetLogsForComicQuery(
        currentShowFor.kind === 'comic' && settings
            ? { page: currentPage, id: currentShowFor.comicId }
            : skipToken
    )

    let logs
    let isLoadingLogs
    let isFetchingLogs
    let hasLogsError
    let reloadEditLog: typeof reloadComicEditLog | typeof reloadAllEditLog
    if (currentShowFor.kind === 'comic') {
        logs = comicLogs
        isLoadingLogs = isLoadingComicLogs
        isFetchingLogs = isFetchingComicLogs
        hasLogsError = hasComicLogsError
        reloadEditLog = reloadComicEditLog
    } else {
        logs = allLogs
        isLoadingLogs = isLoadingAllLogs
        isFetchingLogs = isFetchingAllLogs
        hasLogsError = hasAllLogsError
        reloadEditLog = reloadAllEditLog
    }

    return (
        <ModalDialog
            onCloseClicked={onClose}
            header={
                <h5 className="m-0 text-xl font-medium leading-normal text-gray-800">
                    Edit log
                    {currentShowFor.kind === 'comic'
                        ? ` for comic ${currentShowFor.comicId}`
                        : ''}
                </h5>
            }
            body={
                <EditLogPanel
                    logs={logs}
                    isLoading={isLoadingLogs}
                    isFetching={isFetchingLogs}
                    hasError={hasLogsError}
                    useCorrectTimeFormat={
                        settings?.useCorrectTimeFormat ?? true
                    }
                />
            }
            footer={
                <div className="flex w-full justify-end">
                    <div className="flex flex-col justify-center grow">
                        {logs && logs.pageCount > 1 && (
                            <div className="flex justify-center">
                                <Pagination
                                    page={currentPage}
                                    count={logs.pageCount}
                                    isFetching={isFetchingLogs}
                                    onGoToPage={(page) => setCurrentPage(page)}
                                    boundaryCount={2}
                                    siblingCount={2}
                                />
                            </div>
                        )}
                    </div>
                    <div className="ml-2">
                        {hasLogsError && (
                            <PaddedButton
                                onClick={() => reloadEditLog()}
                                className="mr-2"
                            >
                                Retry loading logs...
                            </PaddedButton>
                        )}
                        <PaddedButton onClick={() => onClose()}>
                            Close
                        </PaddedButton>
                    </div>
                </div>
            }
        />
    )
}
