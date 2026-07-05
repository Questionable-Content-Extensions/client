import { describe, expect, it, vi } from 'vitest'

import { fireEvent, render, screen } from '@testing-library/react'

import { SettingValues } from '~/Settings'

import SecretStringSetting from './SecretStringSetting'

function renderSetting(settings: SettingValues) {
    const updateSettings = vi.fn()
    render(
        <SecretStringSetting
            settings={settings}
            setting="editModeToken"
            updateSettings={updateSettings}
            label="Editor token"
            description="description"
        />
    )
    return { updateSettings }
}

describe('SecretStringSetting', () => {
    it('unhides the token on focus', () => {
        renderSetting({
            editModeToken: '12345678-1234-4123-8123-123456789012',
        } as SettingValues)
        const input = screen.getByLabelText('Editor token')

        expect(input).toHaveAttribute('type', 'password')
        fireEvent.focus(input)
        expect(input).toHaveAttribute('type', 'text')
    })

    it('re-hides the token on blur', () => {
        renderSetting({
            editModeToken: '12345678-1234-4123-8123-123456789012',
        } as SettingValues)
        const input = screen.getByLabelText('Editor token')

        fireEvent.focus(input)
        expect(input).toHaveAttribute('type', 'text')
        fireEvent.blur(input)
        expect(input).toHaveAttribute('type', 'password')
    })
})
