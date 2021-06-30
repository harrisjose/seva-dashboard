import { FORMAT } from './constants'
import { parse, format } from 'date-fns'
import get from 'dlv'
interface DateVsCurrency {
  [date: string]: string[]
}
interface RateMap {
  [date: string]: any
}

const rates: RateMap = {}

export async function loadRates(dateVsCurrency: DateVsCurrency) {
  try {
    let promises = Object.entries(dateVsCurrency).map(async ([date, codes]) => {
      const dateStr = format(parse(date, FORMAT, new Date()), 'yyyy-MM-dd')

      let url = `https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/${dateStr}/currencies/inr.json`

      const response = await fetch(url)
      const { inr: data } = await response.json()
      rates[date] = Object.fromEntries(
        codes.map((c) => [c, data[c.toLowerCase()]])
      )
    })
    await Promise.all(promises)
  } catch (error) {
    console.error(error)
    throw error
  }
}

export function getRate(date: string, currency: string) {
  const rate = get(rates, `${date}.${currency}`, 0)
  return Number(rate)
}
