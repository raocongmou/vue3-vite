import type { requestResultInter } from '../../type'

export interface roleQueryInter extends roleInter {
  pageSize?: number
  pageNum?: number
}

export interface roleInter {
  roleName?: string // 角色名称
  roleKey?: number // 角色代码
  status?: string // 状态
  remark?: string // 备注
  createTime?: string // 创建时间
}

interface roleDTOInter {
  records: roleInter[]
}

export interface roleResponse extends requestResultInter<roleDTOInter> {
  data: roleDTOInter
}
