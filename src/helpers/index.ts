import samples_data from 'data/samples.json'
import ccle_expression_data from 'data/ccle_expression.json'

import { FETCHED_DATA, SampleDef, CcleExpressionDef } from 'types'

/**
 * Mocks the data fetch from an external API
 * for a group of Samples and CCL Expressions
 *
 * @returns a Promise containing the mocked data
 *
 */
export const fetchData: () => Promise<FETCHED_DATA> = () => {
    return new Promise((resolve, _reject) => {
        resolve({
            samples: samples_data as SampleDef[],
            ccle_expression: ccle_expression_data as CcleExpressionDef[],
        })
    })
}

/**
 * Builds and return the Map key for accessing
 * the cache, given a gene_symbol and a lineage
 *
 * @param gene_symbol {string} gene_symbol
 * @param lineage {string} lineage
 * @returns the map key for accessing the cache
 *
 */
export const getMapKey: (arg0: string, arg1: string) => string = (gene_symbol, lineage) =>`${gene_symbol}_${lineage}`