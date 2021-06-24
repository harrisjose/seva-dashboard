import { format, parse } from 'date-fns'
import DataFrame from 'dataframe-js'

const FORMAT = 'dd/MM/yyyy'

function getDate(dateString) {
  return parse(dateString, FORMAT, new Date())
}

function getFormattedDate(date) {
  return format(date, FORMAT, new Date())
}

function loadExchangeRates(dates, currencies) {}

function getExchangeRate(dateString, currency) {
  return 74.23
}

const PIIKeys = [
  'Pan of donor',
  'Name as in pan',
  'Passport no',
  'Nationality',
  'Address',
  'City',
  'State',
  'Country',
  'Pincode',
]

function constructData(df) {
  const date = getDate(df.getRow(0).get('date'))
  const total = df.reduce((acc, row) => acc + row.get('total'), 0)
  const columns = {
    id: {
      id: 'id',
      label: 'ID',
    },
    name: {
      id: 'name',
      label: 'Donor Name',
    },
    currency: {
      id: 'currency',
      label: 'Currency',
    },
    paid: {
      id: 'paid',
      label: 'Amount Paid',
    },
    refund: {
      id: 'refund',
      label: 'Amount Refund',
    },
    fees: {
      id: 'fees',
      label: 'Fees',
    },
    total: {
      id: 'total',
      label: 'Total (INR)',
    },
    donorInfo: {
      id: 'donorInfo',
      label: 'Donor Information',
    },
  }
  const rows = df.select(...Object.keys(columns)).toCollection()

  return { columns, rows, total, date }
}

export async function processData(rows, columns) {
  let df = new DataFrame(rows, [...new Set([...columns, ...PIIKeys])])

  df = df
    // Rename and cast columns
    .rename('Payment id', 'id')
    .cast('id', Number)
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
    // Normalize currency
    .rename('Currency', 'currency')
    .withColumn('currency', (row) => row.get('currency').toUpperCase())
    // Compute fees, total etc
    .withColumn('fees', (row) => {
      return (
        row.get('Platform fees') +
        row.get('Promotional fees') +
        row.get('Pg expenses') +
        row.get('Service tax')
      )
    })
    .withColumn('total', (row) => {
      let total = row.get('paid') - row.get('refund') - row.get('fees')
      let exchangeRate = 1

      if (row.get('currency') !== 'INR') {
        exchangeRate = getExchangeRate(row.get('date'), row.get('currency'))
      }
      return total * exchangeRate
    })
    // Add missing PII columns and group them
    .fillMissingValues('', PIIKeys)
    .withColumn('donorInfo', (row) => {
      return Object.fromEntries(PIIKeys.map((col) => [col, row.get(col)]))
    })

  return constructData(df)
}
