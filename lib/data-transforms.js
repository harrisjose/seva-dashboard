import { parse } from 'date-fns'
import DataFrame from 'dataframe-js'
import { FORMAT, DonorFields } from './constants'
import { loadRates, getRate } from './currency'

async function loadExchangeRates(df) {
  const groups = df.groupBy('date')
  const dateVsCurrency = Object.fromEntries(
    groups
      .listHashs()
      .map((h) => groups.get(h))
      .map((groupedDf) => {
        const { groupKey, group: frame } = groupedDf
        const date = groupKey['date']

        const currencies = frame
          .unique('currency')
          .toCollection()
          .map((f) => f['currency'])

        return [date, currencies]
      })
  )
  try {
    await loadRates(dateVsCurrency)
  } catch (error) {
    console.error(error)
  }
}

function cleanColumns(df) {
  return df
    .rename('Payment id', 'id')
    .cast('id', Number)
    .dropDuplicates('id')
    .rename('Donor name', 'name')
    .cast('Platform fees', Number)
    .cast('Promotional fees', Number)
    .cast('Pg expenses', Number)
    .cast('Service tax', Number)
    .cast('Amount donated', Number)
    .rename('Amount donated', 'paid')
    .cast('Amount refunded', Number)
    .rename('Amount refunded', 'refund')
    .rename('Donation date', 'date')
    .rename('Currency', 'currency')
    .withColumn('currency', (row) => row.get('currency').toUpperCase())
    .fillMissingValues('', DonorFields)
}

function constructData(df) {
  const total = df.reduce((acc, row) => acc + row.get('total'), 0)
  const rows = df.toCollection()
  const date = parse(df.getRow(0).get('date'), FORMAT, new Date())

  return { rows, total, date }
}

export async function processData(rows, columns) {
  let df = new DataFrame(rows, [...new Set([...columns, ...DonorFields])])

  // Rename and typecast columns
  df = cleanColumns(df)

  // Add additional columns
  df = df
    .withColumn('donorInfo', (row) => {
      return Object.fromEntries(DonorFields.map((col) => [col, row.get(col)]))
    })
    .withColumn('fees', (row) => {
      // Compute total fees
      return (
        row.get('Platform fees') +
        row.get('Promotional fees') +
        row.get('Pg expenses') +
        row.get('Service tax')
      )
    })
    .withColumn('total', (row) => {
      //Compute total amount after deducting fees
      let total = row.get('paid') - row.get('refund') - row.get('fees')
      return total
    })

  // Load exchange rates and add as a columnn
  await loadExchangeRates(df)

  df = df.withColumn('exchangeRate', (row) => {
    let exchangeRate = 1

    if (row.get('currency') !== 'INR') {
      exchangeRate = getRate(row.get('date'), row.get('currency'))
    }
    return exchangeRate
  })

  return constructData(df)
}
