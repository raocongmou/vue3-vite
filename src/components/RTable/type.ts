export interface PagerVO {
  total: number
  pageNum: number
  pageSize: number
}

export type ButtonType =
  | ''
  | 'text'
  | 'default'
  | 'primary'
  | 'success'
  | 'warning'
  | 'info'
  | 'danger'

export interface ButtonItem {
  label: string
  type?: ButtonType
  disabled?: boolean
  action?: () => void
}
