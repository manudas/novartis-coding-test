import React from 'react'

import {
    fireEvent,
    render,
    screen,
    within,
} from '@testing-library/react'

import { Filters } from '..'

describe('Filters test suite', () => {

    it('should render <Filters />', () => {
        const setGeneSymbol = jest.fn()
        const setLineage = jest.fn()

        const { container } = render(
            <Filters
                geneSymbol={'TP53'}
                lineage={'lung'}
                changeGeneSymbolHandler={({
                    target: {
                        value
                    }
                }) => {
                    setGeneSymbol(value)
                }}
                changeLineageHandler={({
                    target: {
                        value
                    }
                }) => {
                    setLineage(value)
                }}
            />
        )
        expect(container).toMatchSnapshot()
    })

    it('should call setGeneSymbol when dropdown value changes in first filter', () => {
        const setGeneSymbol = jest.fn()
        const setLineage = jest.fn()

        render(
            <Filters
                geneSymbol={'TP53'}
                lineage={'lung'}
                changeGeneSymbolHandler={({
                    target: {
                        value
                    }
                }) => {
                    setGeneSymbol(value)
                }}
                changeLineageHandler={({
                    target: {
                        value
                    }
                }) => {
                    setLineage(value)
                }}
            />
        )

        // First filter is Gene filter, second is Lineage
        const filters = screen.getAllByRole('button')
        fireEvent.mouseDown(filters[0]) // gene symbol

        const geneFilterOptions = within(screen.getByRole('listbox'))
        fireEvent.click(geneFilterOptions.getByText(/kras/i))
        expect(setGeneSymbol).toHaveBeenCalledWith('KRAS')
    })

    it('should call setLineage when dropdown value changes in second filter', () => {
        const setGeneSymbol = jest.fn()
        const setLineage = jest.fn()

        render(
            <Filters
                geneSymbol={'TP53'}
                lineage={'lung'}
                changeGeneSymbolHandler={({
                    target: {
                        value
                    }
                }) => {
                    setGeneSymbol(value)
                }}
                changeLineageHandler={({
                    target: {
                        value
                    }
                }) => {
                    setLineage(value)
                }}
            />
        )

        // First filter is Gene filter, second is Lineage
        const filters = screen.getAllByRole('button')
        fireEvent.mouseDown(filters[1]) // lineage

        const lineageFilterOptions = within(screen.getByRole('listbox'))
        fireEvent.click(lineageFilterOptions.getByText(/blood/i))
        expect(setLineage).toHaveBeenCalledWith('blood')
    })
})