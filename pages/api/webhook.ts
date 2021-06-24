import Cors from 'micro-cors'
import { parseZip } from '../../lib/parser'

export const config = {
  api: {
    bodyParser: false,
  },
}

// not adding types because of type mismacth with micro-cors
async function handler(req: any, res: any) {
  const { error, data } = await parseZip(req)

  if (error) {
    res.status(501).json({ code: 1, message: error.message })
  } else {
    console.log(data)
    res.status(200).json({ code: 0, data })
  }
}

export default Cors({
  allowMethods: ['POST', 'HEAD'],
})(handler)
