export type Error = {
  message: string
}

export type Response = {
  message?: string
  code: number
  data?: any
}

export type ParseResult = {
  data?: any
  meta?: any
}

export type PaymentList = {
  rows: any
  columns: any
}
