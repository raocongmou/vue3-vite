import request from '@/utils/request'
import { roleQueryInter, roleResponse } from './type'

/**
 * 角色列表
 * @param params
 * @returns
 */
export function getRoleList(params: roleQueryInter) {
  return request<any, roleResponse>({
    url: '/role/list',
    params,
  })
}
