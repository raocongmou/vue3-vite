import request from '@/utils/request'
import { roleQueryInter } from './type'

/**
 * 角色列表
 * @param params
 * @returns
 */
export function getRoleList(params: roleQueryInter) {
  return request<any, roleQueryInter>({
    url: '/role/list',
    params,
  })
}
