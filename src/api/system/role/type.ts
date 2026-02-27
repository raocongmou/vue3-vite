import type { requestResultInter } from '../../type'

export interface roleQueryInter extends roleInter {
  pageSize?: number
  pageNum?: number
}

export interface roleInter {
  id?: number
  roleName?: string // 角色名称
  roleKey?: string // 角色代码
  sortOrder?: number
  status?: number // 状态
  remark?: string // 备注
  createTime?: string // 创建时间
}

interface roleDTOInter {
  records: roleInter[]
  total?: number
}

export interface roleResponse extends requestResultInter<roleDTOInter> {
  data: roleDTOInter
}
