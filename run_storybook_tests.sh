#!/bin/bash

npx vitest run --project=storybook $@ --reporter=./src/util/customJsonReporter.ts | \
    awk '/^\{/{f=1} f' | \
    jq '{
        tests: .numTotalTests,
        passed: .numPassedTests,
        failed: .numFailedTests,
        results: [
            # only files with at least one failure
            (.testResults[] | select(.status == "failed")) | {
                file: .name,
                message: .message,
                errors: .errors,
                results: [
                    # only failed assertions within this file
                    (.assertionResults[] | select(.status == "failed")) | {
                        name: .fullName,
                        component: .meta.componentName,
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
