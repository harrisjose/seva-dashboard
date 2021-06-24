export type Error = {
  message: string
}

export type Response = {
  data?: any | null
  error?: Error | null
}

export type Data = {
  message?: string
  code: number
  data?: any
}
