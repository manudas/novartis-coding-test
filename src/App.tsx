import {
  useEffect,
  useState,
} from 'react'

import { Filters } from 'components/filters'
import { HistogramGraph } from 'components/histogramGraph'

import {
  fetchData,
  getMapKey
} from 'helpers'

import {
  FETCHED_DATA,
  SampleDef,
  CcleExpressionDef,
  CACHED_DATA,
  GeneSymbolDef,
  LineageDef
} from 'types'

import './App.scss'

function App() {

  const [ data, setCachedData ] = useState<Map<string, CACHED_DATA[]>>(new Map())
  const [ geneSymbol, setGeneSymbol ] = useState<GeneSymbolDef | undefined>()
  const [ lineage, setLineage ] = useState<LineageDef | undefined>()
  const [ KRASGeneDescription, setKRASGeneDescription ] = useState<string | undefined>()
  const [ TP53GeneDescription, setTP53GeneDescription ] = useState<string | undefined>()

  /**
   * Builds, sorts and caches data from Samples
   * and CCLE Expressions fetched from the API
   *
   * @param data {FETCHED_DATA} data
   */
  const buildCache = (data: FETCHED_DATA): void => {
    const {
      samples: samples_data,
      ccle_expression: expresions_data,
    } = data;

    const samples_by_DepMap_ID = samples_data.reduce((map, sample) => {
      map[sample.DepMap_ID] = sample
      return map
    }, {} as {[id: string]: SampleDef})

    const expressions_by_DepMap_ID = expresions_data.reduce((map, expression) => {
      if (!map[expression.DepMap_ID]) map[expression.DepMap_ID] = []
      map[expression.DepMap_ID].push(expression)
      return map
    }, {} as {[id: string]: CcleExpressionDef[]})

    // Let's use a set to remove duplicates and concatenate keys in case
    // we have samples and not corresponding expressions or vice-versa
    const DepMap_ID_set = new Set(Object.keys(samples_by_DepMap_ID).concat(Object.keys(expressions_by_DepMap_ID)))

    const cache = new Map<string, CACHED_DATA[]>()
    DepMap_ID_set.forEach(id => {
      const {
        lineage,
        lineage_subtype
      } = samples_by_DepMap_ID[id]
      const expressions = expressions_by_DepMap_ID[id]

      expressions && expressions.forEach(({
        gene_symbol,
        expression_value,
      }) => {

        const mapKey = getMapKey(gene_symbol, lineage)

        /*
          CACHED_DATA object shape:

          DepMap_ID: string
          lineage: 'blood' | 'lung'
          lineage_subtype: string | null
          gene_symbol: 'TP53' | 'KRAS'
          expression_value: number

        */
        const arr_data: CACHED_DATA[] = cache.get(mapKey) ?? []
        arr_data.push({
          DepMap_ID: id,
          lineage,
          lineage_subtype,
          gene_symbol,
          expression_value
        })
        cache.set(mapKey, arr_data)
      })

      // Sorting cache in descending order
      cache.forEach(arr_data => {
        arr_data.sort((a, b) => b.expression_value - a.expression_value)
      })

      // Setting the cached data to the state
      setCachedData(cache)
    })

  }

  useEffect(() => {
    const getData = async () => {
      const data: any = await Promise.allSettled([
        fetchData(),
        (await fetch('https://rest.ensembl.org/lookup/id/ENSG00000133703?content-type=application/json')).json(),
        (await fetch('https://rest.ensembl.org/lookup/id/ENSG00000141510?content-type=application/json')).json(),
      ])

      const [{
        value: sampleExpressionData
      }, {
        value: {
          description: KRAS_GeneDescription = undefined
        } = {}
      }, {
        value: {
          description: TP53_GeneDescription = undefined
        } = {}
      }] = data

      setKRASGeneDescription(KRAS_GeneDescription)
      setTP53GeneDescription(TP53_GeneDescription)
      buildCache(sampleExpressionData)
    }

    getData()
  }, [])

  return (
    <div className="App">
      <Filters
        geneSymbol={geneSymbol}
        lineage={lineage}
        changeGeneSymbolHandler={({
          target: {
            value
          }
        }) => {
          setGeneSymbol(value as GeneSymbolDef)
        }}
        changeLineageHandler={({
          target: {
            value
          }
        }) => {
          setLineage(value as LineageDef)
        }}
      />
      <HistogramGraph
        geneSymbol={geneSymbol}
        lineage={lineage}
        data={data}
        geneDescriptions={{
          KRAS: KRASGeneDescription,
          TP53: TP53GeneDescription
        }}
      />
    </div>
  );
}

export default App
