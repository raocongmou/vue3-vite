import request from '@/utils/request'
import { logResponse, operateLogQueryInter } from './type'

export function getOperateLogList(params: operateLogQueryInter) {
  return request<any, logResponse>({
    url: '/operateLog/list',
    params,
  })
}
