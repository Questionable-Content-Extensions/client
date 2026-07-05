import { describe, expect, it, vi } from 'vitest'

import { fireEvent, render, screen } from '@testing-library/react'

import DateEditor from './DateEditor'

function renderEditor() {
    const onDateValueChange = vi.fn()
    const onIsAccurateValueChange = vi.fn()
    render(
        <DateEditor
            disabled={false}
            label="Date"
            inputId="date-input"
            dateValue={new Date('2020-01-01T00:00:00.000Z').toISOString()}
            isAccurateValue={false}
            isDateValueDirty={false}
            isIsAccurateValueDirty={false}
            onDateValueChange={onDateValueChange}
            onIsAccurateValueChange={onIsAccurateValueChange}
        />
    )
    return { onDateValueChange, onIsAccurateValueChange }
}

describe('DateEditor', () => {
    it('accepts a valid date without showing an error', () => {
        const { onDateValueChange } = renderEditor()
        const input = screen.getByLabelText('Date')

        fireEvent.change(input, { target: { value: '2021-06-15T12:30' } })

        expect(input).not.toHaveClass('border-red-600')
        expect(onDateValueChange).toHaveBeenCalled()
    })

    it('shows a visible error state on invalid/incomplete date input instead of silently discarding it', () => {
        const { onDateValueChange } = renderEditor()
        const input = screen.getByLabelText('Date')

        fireEvent.change(input, { target: { value: 'not-a-date' } })

        expect(input).toHaveClass('border-red-600')
        expect(onDateValueChange).not.toHaveBeenCalled()
    })

    it('clears the error state once a valid date is entered afterwards', () => {
        const { onDateValueChange } = renderEditor()
        const input = screen.getByLabelText('Date')

        fireEvent.change(input, { target: { value: 'not-a-date' } })
        expect(input).toHaveClass('border-red-600')

        fireEvent.change(input, { target: { value: '2021-06-15T12:30' } })

        expect(input).not.toHaveClass('border-red-600')
        expect(onDateValueChange).toHaveBeenCalled()
    })
})
