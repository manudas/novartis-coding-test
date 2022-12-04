import Plot from 'react-plotly.js'

import {
    getMapKey
} from 'helpers'

import {
    CACHED_DATA,
    GeneSymbolDef,
    LineageDef
} from 'types'

import './styles.scss'

export const HistogramGraph = ({
    geneSymbol = '-',
    lineage = '-',
    data = new Map(),
    geneDescriptions = {
        KRAS: undefined,
        TP53: undefined,
    }
}: {
    geneSymbol?: GeneSymbolDef | '-' | undefined,
    lineage?: LineageDef | '-' | undefined
    data?: Map<string, CACHED_DATA[]> | undefined
    geneDescriptions?: {
        KRAS: string | undefined,
        TP53: string | undefined
    }
}) => {

    const rawData = data.get(getMapKey(geneSymbol, lineage)) ?? [] as CACHED_DATA[]
    const middlePoint = rawData.reduce((acc, elem) => acc + elem.expression_value, 0) / rawData.length
    const refinedData: {
        [subtype: string] : {
            x: number[],
            y: number[],
            text: string[],
            name: string,
        }
    } = {}

    rawData.forEach(({
        DepMap_ID,
        lineage,
        lineage_subtype,
        expression_value,
    }, index) => {

        const subtypeObj = refinedData[lineage_subtype ?? 'Unknown'] ?? {
            x: [],
            y: [],
            text: [],
            name: lineage_subtype ?? 'Unknown'
        }

        subtypeObj.y.push(expression_value - middlePoint)
        subtypeObj.x.push(index)
        subtypeObj.text.push(
            `<i>DepMap_ID: </i>: ${DepMap_ID}`
            + '<br>'
            + `<b>Expression</b>: ${expression_value}`
            + (geneDescriptions[geneSymbol as GeneSymbolDef]
                ? `<br><b>Gene description</b>:<br>${geneDescriptions[geneSymbol as GeneSymbolDef]?.split(',').map(e => e.trim()).join('<br>')}`
                : ''
            )
            + '<br>'
            + `<b>Lineage</b>: ${lineage}`
            + (lineage_subtype ? `<br><b>Lineage subtype</b>: ${lineage_subtype}` : '')
            +' <extra></extra>'
        )

        refinedData[lineage_subtype ?? 'no_subtype'] = subtypeObj
    })

    const traces: Plotly.Data[] = Object.values(refinedData).map( dataObj => {
        return {
            ...dataObj,
            type: 'bar',
            hovertemplate: '%{text}',
            textposition: 'none',
        }
    })

    return (
        <Plot
            data={traces}
            layout={
                {
                    title: `CCLE ${geneSymbol} for ${lineage}`,
                    xaxis: {
                        title: 'Samples',
                        showline: false,
                        showticklabels: false,
                    },
                    yaxis: {
                        title: 'Expressions',
                        showline: false,
                        showticklabels: false,
                    },
                }
            }
        />
    );
}