#!/bin/bash

npx eslint -f json "${@:-.}" | \
    jq '(.[] | select(.suppressedMessages | length > 0)) | { file: .filePath, suppressed: [ (.suppressedMessages[]) ]}'
