import type { requestResultInter } from '../../type'
export interface loginForm {
  username: string
  password: string
}

interface dataInter {
  token: string
}

export interface userInfoInter {
  id: number
  username: string
  nickname: string
  email: string
  phone: string
  gender: number
  avatar: string
}

export interface loginResponse extends requestResultInter<dataInter> {
  data: dataInter
}

export interface userInfoResponse extends requestResultInter<userInfoInter> {
  data: userInfoInter
}

export interface userQueryInter extends userInter {
  pageSize?: number
  pageNum?: number
}

export interface userInter {
  username?: string // 用户名
  phone?: number // 手机号
  nickname?: string // 昵称
  email?: string // 邮箱地址
  gender?: number // 性别
  avatar?: string // 头像
  status?: number // 状态
  createTime?: string // 创建时间
  updateTime?: string // 更新时间
  createBy?: number // 创建人
  updateBy?: number // 更新人
}

interface userDTOInter {
  records: userInter[]
}

export interface userResponse extends requestResultInter<userDTOInter> {
  data: userDTOInter
}
