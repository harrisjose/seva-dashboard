import { parseCSV } from '../../lib/parser'
import { saveFile } from '../../lib/storage'
import { processData } from '../../lib/data-transforms'

import type { NextApiRequest, NextApiResponse } from 'next'
import type { Response } from '../../lib/types'

export const config = {
  api: {
    bodyParser: false,
  },
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response>
) {
  try {
    const { rows, columns } = await parseCSV(req)
    const data = await processData(rows, columns)

    await saveFile(data.date, data)

    res.status(200).json({ code: 0, data: data })
  } catch (error) {
    res.status(501).json({ code: 1, message: error.message })
  }
}
