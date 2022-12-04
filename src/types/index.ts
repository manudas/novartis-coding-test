export type SampleDef = {
    DepMap_ID: string
    lineage: 'blood' | 'lung'
    lineage_subtype: string | null
}

export type GeneSymbolDef = 'TP53' | 'KRAS'

export type CcleExpressionDef = {
    gene_symbol: GeneSymbolDef,
    DepMap_ID: string
    expression_value: number
}

export type FETCHED_DATA = {
    samples: SampleDef[]
    ccle_expression: CcleExpressionDef[]
}

export type LineageDef = 'blood' | 'lung'

export type CACHED_DATA = {
    DepMap_ID: string
    lineage: LineageDef
    lineage_subtype: string | null
    gene_symbol: 'TP53' | 'KRAS'
    expression_value: number
}