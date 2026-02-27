import request from '@/utils/request'
import type {
  assignUserRolesForm,
  loginForm,
  loginResponse,
  userRoleIdsResponse,
  userInfoResponse,
  userResponse,
  userQueryInter,
  validateCodeResponse,
} from './type'

/**
 * 用户登录
 * @param data
 * @returns
 */
export function userLogin(data: loginForm) {
  return request<any, loginResponse>({
    url: '/user/login',
    method: 'post',
    data,
  })
}

/**
 * 用户登出
 * @returns
 */
export function userLogout() {
  return request<any, loginResponse>({
    url: '/user/logout',
    method: 'post',
  })
}

/**
 * 获取用户登录信息
 * @returns
 */
export function getUserInfo() {
  return request<any, userInfoResponse>({
    url: '/user/info',
  })
}

export function getUserList(params: userQueryInter) {
  return request<any, userResponse>({
    url: '/user/list',
    params,
  })
}

/**
 * 用户新增
 * @param data
 * @returns
 */
export function addUser(data: any) {
  return request<any, userResponse>({
    url: '/user',
    method: 'post',
    data,
  })
}

/**
 * 用户修改
 * @param data
 * @returns
 */
export function updateUser(data: any) {
  return request<any, userResponse>({
    url: '/user',
    method: 'put',
    data,
  })
}

/**
 * 获取验证码
 * @returns
 */
export function generateValidateCode() {
  return request<any, validateCodeResponse>({
    url: '/user/generateValidateCode?time=' + Date.now(),
  })
}

/**
 * 获取用户已分配的角色ID列表
 */
export function getUserRoleIds(params: { userId: number }) {
  return request<any, userRoleIdsResponse>({
    url: '/user/roleIds',
    params,
  })
}

/**
 * 保存用户角色分配
 */
export function assignUserRoles(data: assignUserRolesForm) {
  return request<any, any>({
    url: '/user/assignRoles',
    method: 'post',
    data,
  })
}
