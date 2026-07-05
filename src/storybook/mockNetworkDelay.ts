import { delay } from 'msw'

// Simulates realistic network latency so loading states are visible when a
// story is viewed interactively in Storybook's UI. Under Vitest that jitter
// is pure wall-clock cost with no payoff - a story's play function can await
// several of these in sequence - so it's cut down to a few ms there
// regardless of the requested interactive duration.
export function mockNetworkDelay(
    ms = 1000 + Math.random() * 1000
): Promise<void> {
    return delay(import.meta.env.MODE === 'test' ? 1 + Math.random() * 9 : ms)
}
