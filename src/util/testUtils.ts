import { spyOn } from 'storybook/test'

import { setup } from '~/utils'

function makeSuppressedErrorSpies(expectedMessage: string) {
    const consoleErrorSpy = spyOn(console, 'error').mockImplementation(
        () => undefined
    )
    /*
     * `~/utils`'s `error()` (used by e.g. `apiSlice`) is bound to
     * `console.error` once via `setup()` in `.storybook/preview.tsx`, before
     * any story runs - re-pointing `console.error` above doesn't retroactively
     * change that already-bound reference. Re-running `setup()` rebinds it to
     * the now-mocked `console.error`; restoring the spy and calling `setup()`
     * again below undoes that so later stories still log for real.
     */
    setup()
    /*
     * React dispatches render errors through a fake DOM event so jsdom's own
     * uncaught-exception reporting kicks in; that path writes straight to
     * process.stderr, bypassing console entirely, so a console.error spy alone
     * can't catch it - both need to be suppressed. This only applies under
     * `run_react_tests.sh` (jsdom, Node); `run_storybook_tests.sh` runs in a
     * real Playwright-driven browser, which has no `process` global.
     */
    let stderrWriteSpy = null
    if (typeof process !== 'undefined') {
        const originalStderrWrite = process.stderr.write.bind(process.stderr)
        stderrWriteSpy = spyOn(process.stderr, 'write').mockImplementation(
            (chunk, ...rest) => {
                if (String(chunk).includes(expectedMessage)) {
                    return true
                }
                return originalStderrWrite(chunk, ...rest)
            }
        )
    }
    return { consoleErrorSpy, stderrWriteSpy }
}

/**
 * Runs `fn` with console.error and process.stderr.write suppressed for output
 * lines containing `expectedMessage`, then restores both. Use this around
 * assertions that intentionally trigger a thrown/logged error (e.g. `expect(()
 * => render(...)).toThrow(...)`), so the expected error doesn't show up as
 * test-runner noise.
 */
export function withSuppressedExpectedError<T>(
    expectedMessage: string,
    fn: () => T
): T {
    const { consoleErrorSpy, stderrWriteSpy } =
        makeSuppressedErrorSpies(expectedMessage)
    try {
        return fn()
    } finally {
        consoleErrorSpy.mockRestore()
        stderrWriteSpy?.mockRestore()
        setup()
    }
}

/**
 * Async variant of `withSuppressedExpectedError`. Use when the code that logs
 * the expected error runs asynchronously (e.g. inside an awaited dispatch or
 * fetch), so the spies stay active until the returned Promise settles.
 */
export async function withSuppressedExpectedErrorAsync<T>(
    expectedMessage: string,
    fn: () => Promise<T>
): Promise<T> {
    const { consoleErrorSpy, stderrWriteSpy } =
        makeSuppressedErrorSpies(expectedMessage)
    try {
        return await fn()
    } finally {
        consoleErrorSpy.mockRestore()
        stderrWriteSpy?.mockRestore()
        setup()
    }
}
