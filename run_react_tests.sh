#!/bin/bash

npx vitest run --project=unit --reporter=./src/util/customJsonReporter.ts $@ | \
    awk '/^\{/{f=1} f' | \
    jq '{
        tests: .numTotalTests,
        passed: .numPassedTests,
        failed: .numFailedTests,
        results: [
            # only files with at least one failure, or suite-level failures (e.g. module load errors)
            (.testResults[] | select(.status == "failed")) | {
                file: .name,
                errors: .errors,
                results: [
                    # only failed assertions within this file
                    (.assertionResults[] | select(.status == "failed")) | {
                        name: .fullName,
                        errors: .errors,
                        logs: [.logs[] | {type, content}]
                    }
                ]
            }
        ],
        noisyPasses: [
            # only files with at least one passing test that produced logs
            (.testResults[] | select(any(.assertionResults[]; .status == "passed" and (.logs | length > 0)))) | {
                file: .name,
                results: [
                    # only passing assertions that produced logs
                    (.assertionResults[] | select(.status == "passed" and (.logs | length > 0))) | {
                        name: .fullName,
                        logs: [.logs[] | {type, content}]
                    }
                ]
            }
        ],
        unassociatedLogs: [.unassociatedLogs[] | {type, content}]
    }'
