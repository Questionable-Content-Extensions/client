#!/bin/bash

npx eslint -f json "${@:-.}" | \
    jq '{ count: ([ .[] | select(.errorCount > 0 or .warningCount > 0) ] | length), lints: [ (.[] | select(.errorCount > 0 or .warningCount > 0) | { file: .filePath, messages: .messages } ) ] }'
