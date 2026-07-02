// import type { CoverageMap } from 'istanbul-lib-coverage'
import { existsSync, promises as fs } from 'node:fs'
import { dirname, resolve } from 'pathe'
import { TaskMeta, TaskState, TestError, UserConsoleLog } from 'vitest'
import { experimental_getRunnerTask } from 'vitest/node'
import type { Reporter, TestModule, Vitest } from 'vitest/node'

import type { Suite } from '@vitest/runner'
import { getSuites, getTests } from '@vitest/runner/utils'
import type { SnapshotSummary } from '@vitest/snapshot'

// for compatibility reasons, the reporter produces a JSON similar to the one produced by the Jest JSON reporter
// the following types are extracted from the Jest repository (and simplified)
// the commented-out fields are the missing ones

type Status = 'passed' | 'failed' | 'skipped' | 'pending' | 'todo' | 'disabled'
type Milliseconds = number
interface Callsite {
    line: number
    column: number
}

// MSW logs request/response/handler objects to the console on every intercepted
// call; these are noise in test output and never useful for diagnosing a test.
const NoisyLogPrefixes = [
    'Request {',
    'Handler: HttpHandler {',
    'Response {',
    'Worker scope: ',
    'Client ID: ',
    'Documentation: https://mswjs.io/docs',
    'Found an issue? https://github.com/mswjs/msw/issues',
    'Worker script URL: ',
]

const StatusMap: Record<TaskState, Status> = {
    fail: 'failed',
    only: 'pending',
    pass: 'passed',
    run: 'pending',
    skip: 'skipped',
    todo: 'todo',
    queued: 'pending',
}

export interface JsonAssertionResult {
    ancestorTitles: string[]
    fullName: string
    status: Status
    title: string
    meta: TaskMeta
    duration?: Milliseconds | null
    failureMessages: string[] | null
    errors: TestError[]
    location?: Callsite | null
    tags: string[]
    logs: UserConsoleLog[]
    // benchmarks: TestBenchmark[]
}

export interface JsonTestResult {
    message: string
    errors: TestError[]
    name: string
    status: 'failed' | 'passed'
    startTime: number
    endTime: number
    assertionResults: JsonAssertionResult[]
    // summary: string
    // coverage: unknown
}

export interface JsonTestResults {
    numFailedTests: number
    numFailedTestSuites: number
    numPassedTests: number
    numPassedTestSuites: number
    numPendingTests: number
    numPendingTestSuites: number
    numTodoTests: number
    numTotalTests: number
    numTotalTestSuites: number
    startTime: number
    success: boolean
    testResults: JsonTestResult[]
    snapshot: SnapshotSummary
    unassociatedLogs: UserConsoleLog[]
    // coverageMap?: CoverageMap | null | undefined;
    // numRuntimeErrorTestSuites: number
    // wasInterrupted: boolean
}

export interface JsonOptions {
    outputFile?: string
    /** @experimental */
    filterMeta?: (key: string, value: unknown) => unknown
}

export class JsonReporter implements Reporter {
    start = 0
    ctx!: Vitest
    options: JsonOptions
    // coverageMap?: CoverageMap;
    logs: UserConsoleLog[] = []

    constructor(options: JsonOptions) {
        this.options = options
    }

    onInit(ctx: Vitest): void {
        this.ctx = ctx
        this.start = Date.now()
    }

    onUserConsoleLog(log: UserConsoleLog): void {
        if (NoisyLogPrefixes.some((prefix) => log.content.startsWith(prefix))) {
            return
        }
        this.logs.push(log)
    }

    // onCoverage(coverageMap: unknown): void {
    //     this.coverageMap = coverageMap as CoverageMap;
    // }

    async onTestRunEnd(testModules: readonly TestModule[]): Promise<void> {
        const files = testModules.map((testModule) =>
            experimental_getRunnerTask(testModule)
        )

        const suites = getSuites(files)
        const numTotalTestSuites = suites.length
        const tests = getTests(files)
        const numTotalTests = tests.length

        const numFailedTestSuites = suites.filter(
            (s) => s.result?.state === 'fail'
        ).length
        const numPendingTestSuites = suites.filter(
            (s) =>
                s.result?.state === 'run' ||
                s.result?.state === 'queued' ||
                s.mode === 'todo'
        ).length
        const numPassedTestSuites =
            numTotalTestSuites - numFailedTestSuites - numPendingTestSuites

        const numFailedTests = tests.filter(
            (t) => t.result?.state === 'fail'
        ).length
        const numPassedTests = tests.filter(
            (t) => t.result?.state === 'pass'
        ).length
        const numPendingTests = tests.filter(
            (t) =>
                t.result?.state === 'run' ||
                t.result?.state === 'queued' ||
                t.mode === 'skip' ||
                t.result?.state === 'skip'
        ).length
        const numTodoTests = tests.filter((t) => t.mode === 'todo').length
        const testResults: JsonTestResult[] = []

        const success =
            (files.length > 0 || this.ctx.config.passWithNoTests) &&
            numFailedTestSuites === 0 &&
            numFailedTests === 0
        const { filterMeta } = this.options

        const testIds = new Set(tests.map((t) => t.id))
        const logsByTaskId = new Map<string, UserConsoleLog[]>()
        const unassociatedLogs: UserConsoleLog[] = []
        for (const log of this.logs) {
            if (log.taskId && testIds.has(log.taskId)) {
                let logs = logsByTaskId.get(log.taskId)
                if (!logs) {
                    logs = []
                    logsByTaskId.set(log.taskId, logs)
                }
                logs.push(log)
            } else {
                unassociatedLogs.push(log)
            }
        }

        for (const file of files) {
            const tests = getTests([file])
            let startTime = tests.reduce(
                (prev, next) =>
                    Math.min(
                        prev,
                        next.result?.startTime ?? Number.POSITIVE_INFINITY
                    ),
                Number.POSITIVE_INFINITY
            )
            if (startTime === Number.POSITIVE_INFINITY) {
                startTime = this.start
            }

            const endTime = tests.reduce(
                (prev, next) =>
                    Math.max(
                        prev,
                        (next.result?.startTime ?? 0) +
                            (next.result?.duration ?? 0)
                    ),
                startTime
            )
            const assertionResults = tests.map((t) => {
                const ancestorTitles: string[] = []
                let iter: Suite | undefined = t.suite
                while (iter) {
                    ancestorTitles.push(iter.name)
                    iter = iter.suite
                }
                ancestorTitles.reverse()

                return {
                    ancestorTitles,
                    fullName: t.name
                        ? [...ancestorTitles, t.name].join(' ')
                        : ancestorTitles.join(' '),
                    status: StatusMap[t.result?.state ?? t.mode],
                    title: t.name,
                    duration: t.result?.duration,
                    failureMessages:
                        t.result?.errors?.map((e) => e.stack ?? e.message) ??
                        [],
                    errors: t.result?.errors ?? [],
                    location: t.location,
                    meta: filterMeta
                        ? (() => {
                              const filtered: Record<string, unknown> = {}
                              for (const key in t.meta) {
                                  const value = t.meta[key as keyof TaskMeta]
                                  if (filterMeta(key, value)) {
                                      filtered[key] = value
                                  }
                              }
                              return filtered
                          })()
                        : t.meta,
                    tags: t.tags ?? [],
                    logs: logsByTaskId.get(t.id) ?? [],
                } satisfies JsonAssertionResult
            })

            if (
                tests.some(
                    (t) =>
                        t.result?.state === 'run' ||
                        t.result?.state === 'queued'
                )
            ) {
                this.ctx.logger.warn(
                    'WARNING: Some tests are still running when generating the JSON report.' +
                        'This is likely an internal bug in Vitest.' +
                        'Please report it to https://github.com/vitest-dev/vitest/issues'
                )
            }

            const hasFailedTests = tests.some((t) => t.result?.state === 'fail')

            testResults.push({
                assertionResults,
                startTime,
                endTime,
                status:
                    file.result?.state === 'fail' || hasFailedTests
                        ? 'failed'
                        : 'passed',
                message: file.result?.errors?.[0]?.message ?? '',
                errors: file.result?.errors ?? [],
                name: file.filepath,
            })
        }

        const result: JsonTestResults = {
            numTotalTestSuites,
            numPassedTestSuites,
            numFailedTestSuites,
            numPendingTestSuites,
            numTotalTests,
            numPassedTests,
            numFailedTests,
            numPendingTests,
            numTodoTests,
            snapshot: this.ctx.snapshot.summary,
            startTime: this.start,
            success,
            testResults,
            unassociatedLogs,
        }

        await this.writeReport(JSON.stringify(result))
    }

    /**
     * Writes the report to an output file if specified in the config,
     * or logs it to the console otherwise.
     * @param report
     */
    async writeReport(report: string): Promise<void> {
        const outputFileConfig = this.ctx.config.outputFile
        const outputFile =
            this.options.outputFile ??
            (typeof outputFileConfig === 'string'
                ? outputFileConfig
                : outputFileConfig && typeof outputFileConfig.json === 'string'
                  ? outputFileConfig.json
                  : null)

        if (outputFile) {
            const reportFile = resolve(this.ctx.config.root, outputFile)

            const outputDirectory = dirname(reportFile)
            if (!existsSync(outputDirectory)) {
                await fs.mkdir(outputDirectory, { recursive: true })
            }

            await fs.writeFile(reportFile, report, 'utf-8')
            this.ctx.logger.log(`JSON report written to ${reportFile}`)
        } else {
            this.ctx.logger.log(report)
        }
    }
}

export default JsonReporter
