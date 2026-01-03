import request from '@/utils/request'
import type {
  loginForm,
  loginResponse,
  userInfoResponse,
  userResponse,
  userQueryInter,
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