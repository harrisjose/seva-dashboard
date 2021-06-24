import Papa from 'papaparse'
import Busboy from 'busboy'
import unzip from 'unzip-stream'

import type { NextApiRequest } from 'next'
import type { Response } from './types'

const getPapaOptions = (resolve: Function, reject: Function) => ({
  delimiter: ',',
  header: true,
  complete: (data: any) => resolve({ data, error: null }),
  error: (error: any) => reject({ error }),
})

const parse = (stream: NodeJS.ReadableStream): Promise<Response> => {
  return new Promise((resolve, reject) => {
    Papa.parse(stream, getPapaOptions(resolve, reject))
  })
}

export function parseCSV(req: NextApiRequest): Promise<Response> {
  return new Promise((resolve) => {
    let promises: Promise<Response>[] = []

    const busboy = new Busboy({ headers: req.headers })
      .on('file', function (fieldName, file) {
        promises.push(parse(file))
      })
      .on('finish', () => {
        Promise.all(promises)
          .then((responses) => resolve(responses[0]))
          .catch((error) => resolve({ error, data: null }))
      })

    try {
      req.pipe(busboy)
    } catch (error) {
      resolve({ error })
    }
  })
}

export function parseZip(req: NextApiRequest): Promise<Response> {
  return new Promise((resolve) => {
    let promises: Promise<Response>[] = []

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
          .then((responses) => resolve(responses[0]))
          .catch((error) => resolve({ error, data: null }))
      })

    try {
      req.pipe(busboy)
    } catch (error) {
      resolve({ error })
    }
  })
}
