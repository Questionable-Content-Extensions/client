import { describe, expect, it } from 'vitest'

import { render, screen } from '@testing-library/react'

import DonutGraph from './DonutGraph'

describe('DonutGraph', () => {
    it('renders the percentage and amounts for a normal split', () => {
        render(
            <DonutGraph
                amount={25}
                totalAmount={100}
                fillColor="#000"
                backgroundColor="#fff"
            />
        )

        expect(screen.getByText('25%')).toBeInTheDocument()
        expect(screen.getByText('25/100')).toBeInTheDocument()
    })

    it('renders 0% instead of NaN% when totalAmount is 0', () => {
        render(
            <DonutGraph
                amount={0}
                totalAmount={0}
                fillColor="#000"
                backgroundColor="#fff"
            />
        )

        expect(screen.getByText('0%')).toBeInTheDocument()
        expect(screen.queryByText('NaN%')).not.toBeInTheDocument()
    })
})
