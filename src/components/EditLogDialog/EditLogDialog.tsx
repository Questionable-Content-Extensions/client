import { useState } from 'react'
import { ConnectedProps, connect } from 'react-redux'

import { PaddedButton } from '@components/Button'
import ModalDialog from '@modals/ModalDialog/ModalDialog'
import { skipToken } from '@reduxjs/toolkit/dist/query'
import {
    useGetLogsForComicQuery,
    useGetLogsQuery,
} from '@store/api/logApiSlice'
import { AppDispatch, RootState } from '@store/store'

import EditLogPanel from './EditLogPanel/EditLogPanel'
import Pagination from './Pagination/Pagination'

const mapState = (state: RootState) => {
    return {
        settings: state.settings.values,
    }
}

const mapDispatch = (_dispatch: AppDispatch) => {
    return {}
}

const connector = connect(mapState, mapDispatch)
type PropsFromRedux = ConnectedProps<typeof connector>
type GoToComicDialogProps = PropsFromRedux & {
    showFor: number | boolean
    onClose: () => void
}

export function EditLogDialog({
    showFor,
    onClose,
    settings,
}: GoToComicDialogProps) {
    const [currentShowFor, setCurrentShowFor] = useState<number | boolean>(
        false
    )
    const [currentPage, setCurrentPage] = useState(1)
    if (showFor && currentShowFor !== showFor) {
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
        currentShowFor === true && settings
            ? { token: settings!.editModeToken, page: currentPage }
            : skipToken
    )
    const {
        data: comicLogs,
        isLoading: isLoadingComicLogs,
        isFetching: isFetchingComicLogs,
        isError: hasComicLogsError,
        refetch: reloadComicEditLog,
    } = useGetLogsForComicQuery(
        typeof currentShowFor === 'number' && settings
            ? {
                  token: settings!.editModeToken,
                  page: currentPage,
                  id: currentShowFor,
              }
            : skipToken
    )

    let logs
    let isLoadingLogs
    let isFetchingLogs
    let hasLogsError
    let reloadEditLog: typeof reloadComicEditLog | typeof reloadAllEditLog
    if (typeof currentShowFor === 'number') {
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
                    {typeof currentShowFor === 'number'
                        ? ` for comic ${currentShowFor}`
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
                    <div className="flex flex-col justify-center flex-grow">
                        {logs && logs.pageCount > 1 ? (
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
                        ) : (
                            <></>
                        )}
                    </div>
                    <div className="ml-2">
                        {hasLogsError ? (
                            <PaddedButton
                                onClick={() => reloadEditLog()}
                                className="mr-2"
                            >
                                Retry loading logs...
                            </PaddedButton>
                        ) : (
                            <></>
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

export default connector(EditLogDialog)
