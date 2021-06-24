import { parseCSV } from '../../lib/parser'
import { save } from '../../lib/storage'
import { processData } from '../../lib/data-transforms'

import type { NextApiRequest, NextApiResponse } from 'next'
import type { Data } from '../../lib/types'

export const config = {
  api: {
    bodyParser: false,
  },
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { error, data } = await parseCSV(req)

  if (!error) {
    let {
      data: transactions,
      meta: { fields },
    } = data

    const result = await processData(transactions, fields)

    let { error } = await save(result.date, result)

    res.status(200).json({ code: 0, data: result })
  } else {
    res.status(501).json({ code: 1, message: error.message })
  }
}
