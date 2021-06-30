import Papa from 'papaparse'
import Busboy from 'busboy'
import unzip from 'unzip-stream'
import { isEmpty } from 'lodash'

import type { NextApiRequest } from 'next'
import type { ParseResult, Error, PaymentList } from './types'

const collateData = (list: ParseResult[]): PaymentList => {
  let rows: any = []
  let columns: string[] = []

  list.forEach((item) => {
    let {
      data,
      meta: { fields },
    } = item

    if (!isEmpty(data)) {
      rows = rows.concat(data)
    }
    if (!isEmpty(fields)) {
      columns = Array.from(new Set([...columns, ...fields]))
    }
  })

  return { rows, columns }
}

const getPapaOptions = (resolve: Function, reject: Function) => ({
  delimiter: ',',
  header: true,
  complete: (data: ParseResult) => resolve(data),
  error: (error: Error) => reject(error),
})

const parse = (stream: NodeJS.ReadableStream): Promise<ParseResult> => {
  return new Promise((resolve, reject) => {
    Papa.parse(stream, getPapaOptions(resolve, reject))
  })
}

export function parseCSV(req: NextApiRequest): Promise<PaymentList> {
  return new Promise((resolve, reject) => {
    let promises: Promise<ParseResult>[] = []

    const busboy = new Busboy({ headers: req.headers })
      .on('file', function (fieldName, file) {
        promises.push(parse(file))
      })
      .on('finish', () => {
        Promise.all(promises)
          .then((responses) => resolve(collateData(responses)))
          .catch(reject)
      })

    try {
      req.pipe(busboy)
    } catch (error) {
      reject(error)
    }
  })
}

export function parseZip(req: NextApiRequest): Promise<PaymentList> {
  return new Promise((resolve, reject) => {
    let promises: Promise<ParseResult>[] = []

    const busboy = new Busboy({ headers: req.headers })
      .on('file', function (fieldName, file) {
        file.pipe(unzip.Parse()).on('entry', (entry) => {
          const { type, path } = entry
          if (type === 'File' && path.includes('.csv')) {
            promises.push(parse(entry))
          } else {
            entry.autodrain()
          }
        })
      })
      .on('finish', () => {
        Promise.all(promises)
          .then((responses) => resolve(collateData(responses)))
          .catch(reject)
      })

    try {
      req.pipe(busboy)
    } catch (error) {
      reject(error)
    }
  })
}
