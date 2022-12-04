import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from "@mui/material"

import {
    GeneSymbolDef,
    LineageDef,
} from 'types'

const filters = {
    gene_symbol: ['-', 'TP53', 'KRAS'],
    lineage: ['-', 'blood', 'lung']
}

export const Filters = ({
    geneSymbol = '-',
    lineage = '-',
    changeGeneSymbolHandler = (e) => undefined,
    changeLineageHandler = (e) => undefined,
} : {
    geneSymbol?: GeneSymbolDef | '-' | undefined,
    lineage?: LineageDef | '-' | undefined,
    changeGeneSymbolHandler?: (arg0: SelectChangeEvent) => void,
    changeLineageHandler?: (arg0: SelectChangeEvent) => void,
}) => {
    return (
        <header className="App-filters">
            <FormControl className="App-filter">
                <InputLabel id="gene-symbol-label">Gene Symbol</InputLabel>
                <Select
                    labelId="gene-symbol-label"
                    id="gene-symbol"
                    value={geneSymbol}
                    label="Gene Symbol"
                    onChange={changeGeneSymbolHandler}
                >
                    {
                        filters.gene_symbol.map(symbol => <MenuItem key={symbol} value={symbol}>{symbol}</MenuItem>)
                    }
                </Select>
            </FormControl>
            <FormControl className="App-filter">
                <InputLabel id="lineage-label">Lineage</InputLabel>
                <Select
                    labelId="lineage-label"
                    id="lineage"
                    value={lineage}
                    label="Lineage"
                    onChange={changeLineageHandler}
                >
                    {
                        filters.lineage.map(symbol => <MenuItem key={symbol} value={symbol}>{symbol}</MenuItem>)
                    }
                </Select>
            </FormControl>
        </header>
    )
}