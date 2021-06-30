import Cors from 'micro-cors'
import { parseZip } from '../../lib/parser'
import { processData } from '../../lib/data-transforms'
import { saveFile } from '../../lib/storage'

export const config = {
  api: {
    bodyParser: false,
  },
}

// not adding types for req & response because of type mismacth with micro-cors
async function handler(req: any, res: any) {
  try {
    const { rows, columns } = await parseZip(req)
    const data = await processData(rows, columns)

    await saveFile(data.date, data)

    res.status(200).json({ code: 0 })
  } catch (error) {
    res.status(501).json({ code: 1, message: error.message })
  }
}

export default Cors({
  allowMethods: ['POST', 'HEAD'],
})(handler)
