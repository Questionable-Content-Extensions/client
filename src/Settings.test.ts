import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

// `Settings` caches its singleton in module-level state, so each test needs
// a fresh module instance (and a fresh `GM` mock) to avoid bleeding state
// between tests.
async function importFreshSettings() {
    vi.resetModules()
    return (await import('./Settings')).default
}

function mockGM(
    getValueImpl: (
        key: string,
        defaultValue: string
    ) => Promise<string> | string
) {
    global.GM = {
        info: { script: { name: 'QCExt', version: '1.0.0' } },
        getValue: vi.fn(getValueImpl),
        setValue: vi.fn().mockResolvedValue(undefined),
    } as unknown as typeof GM
}

describe('Settings.loadSettings', () => {
    beforeEach(() => {
        localStorage.clear()
    })

    afterEach(() => {
        // @ts-expect-error test cleanup of a global we defined ourselves
        delete global.GM
        vi.restoreAllMocks()
    })

    it('merges stored settings with defaults for any newly-added properties', async () => {
        mockGM(() => Promise.resolve(JSON.stringify({ showDebugLogs: true })))
        const Settings = await importFreshSettings()

        const settings = await Settings.loadSettings()

        expect(settings.values.showDebugLogs).toBe(true)
        expect(settings.values.scrollToTop).toBe(Settings.DEFAULTS.scrollToTop)
    })

    it('returns the same cached instance on subsequent sequential calls without re-reading GM storage', async () => {
        mockGM(() => Promise.resolve(JSON.stringify(Settings.DEFAULTS)))
        const Settings = await importFreshSettings()

        const first = await Settings.loadSettings()
        const second = await Settings.loadSettings()

        expect(second).toBe(first)
        expect(global.GM.getValue).toHaveBeenCalledTimes(1)
    })

    it('dedupes concurrent calls made before the first one resolves', async () => {
        // Simulate `GM.getValue` taking a moment, so both calls race the
        // `if (instance)` check while `instance` is still null.
        mockGM(
            () =>
                new Promise((resolve) =>
                    setTimeout(
                        () => resolve(JSON.stringify(Settings.DEFAULTS)),
                        10
                    )
                )
        )
        const Settings = await importFreshSettings()

        const [first, second] = await Promise.all([
            Settings.loadSettings(),
            Settings.loadSettings(),
        ])

        expect(second).toBe(first)
        expect(global.GM.getValue).toHaveBeenCalledTimes(1)
    })
})
