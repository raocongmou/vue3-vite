export interface dataInter {
  records: operateLogInter[]
  total: number
}

export interface operateLogInter {
  id?: number
  operateEmpId?: number
  operateTime?: string
  className?: string
  methodName?: string
  methodParam?: string
  returnValue?: string
  costTime?: number
}

export interface operateLogQueryInter extends operateLogInter {
  pageSize?: number
  pageNum?: number
}

export interface logResponse {
  code: number
  data: dataInter
  msg: string
}