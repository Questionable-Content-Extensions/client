import { describe, expect, it, vi } from 'vitest'

import { fireEvent, render, screen } from '@testing-library/react'

import { SettingValues } from '~/Settings'

import NumberSetting from './NumberSetting'

function renderSetting(settings: SettingValues, positiveOnly?: boolean) {
    const updateSettings = vi.fn()
    render(
        <NumberSetting
            settings={settings}
            setting="comicLoadingIndicatorDelay"
            updateSettings={updateSettings}
            label="Delay"
            description="description"
            positiveOnly={positiveOnly}
        />
    )
    return { updateSettings }
}

describe('NumberSetting', () => {
    it('accepts a valid integer', () => {
        const { updateSettings } = renderSetting({
            comicLoadingIndicatorDelay: 0,
        } as SettingValues)
        const input = screen.getByLabelText('Delay')

        fireEvent.change(input, { target: { value: '5' } })

        expect(input).not.toHaveClass('border-red-600')
        expect(updateSettings).toHaveBeenCalled()
    })

    it('rejects a value with a junk suffix instead of silently truncating it', () => {
        const { updateSettings } = renderSetting({
            comicLoadingIndicatorDelay: 0,
        } as SettingValues)
        const input = screen.getByLabelText('Delay')

        fireEvent.change(input, { target: { value: '5abc' } })

        expect(input).toHaveClass('border-red-600')
        expect(updateSettings).not.toHaveBeenCalled()
    })

    it('rejects a negative value when positiveOnly is set', () => {
        const { updateSettings } = renderSetting(
            { comicLoadingIndicatorDelay: 0 } as SettingValues,
            true
        )
        const input = screen.getByLabelText('Delay')

        fireEvent.change(input, { target: { value: '-1' } })

        expect(input).toHaveClass('border-red-600')
        expect(updateSettings).not.toHaveBeenCalled()
    })
})
