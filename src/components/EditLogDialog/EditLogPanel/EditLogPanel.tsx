import { useMemo } from 'react'

import { LogResponse } from '@models/LogResponse'

import { formatDate, range } from '~/utils'

export default function EditLogPanel({
    logs,
    isLoading,
    isFetching,
    hasError,
    useCorrectTimeFormat,
}: {
    logs?: LogResponse
    isLoading: boolean
    isFetching: boolean
    hasError: boolean
    useCorrectTimeFormat: boolean
}) {
    const tbody = useMemo(() => {
        if (hasError) {
            return (
                <tbody>
                    <tr>
                        <td
                            className="text-red-500 font-bold text-center"
                            colSpan={3}
                        >
                            Error loading edit log
                        </td>
                    </tr>
                </tbody>
            )
        }
        if (isLoading || !logs) {
            return (
                <tbody>
                    {range(1, 10).map((e) => (
                        <tr key={e}>
                            <td>
                                <div
                                    className={
                                        'animate-pulse h-6 bg-slate-400 rounded'
                                    }
                                ></div>
                            </td>
                            <td>
                                <div className="animate-pulse h-6 bg-slate-400 rounded"></div>
                            </td>
                            <td>
                                <div className="animate-pulse h-6 bg-slate-400 rounded"></div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            )
        }
        return (
            <tbody>
                {logs.logEntries.map((e, i) => (
                    <tr key={e.dateTime + i}>
                        <td className={isFetching ? 'animate-pulse' : ''}>
                            {e.identifier}
                        </td>
                        <td className={isFetching ? 'animate-pulse' : ''}>
                            {formatDate(
                                new Date(e.dateTime),
                                useCorrectTimeFormat
                            )}
                        </td>
                        <td className={isFetching ? 'animate-pulse' : ''}>
                            {e.action}
                        </td>
                    </tr>
                ))}
            </tbody>
        )
    }, [hasError, isFetching, isLoading, logs, useCorrectTimeFormat])
    return (
        <>
            <table>
                <thead>
                    <tr>
                        <th>Identifier</th>
                        <th>Time</th>
                        <th>Action</th>
                    </tr>
                </thead>
                {tbody}
            </table>
        </>
    )
}
