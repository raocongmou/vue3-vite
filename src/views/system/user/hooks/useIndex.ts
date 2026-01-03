import type { VxeColumnProps } from 'vxe-table'
import type { VxeToolbarPropTypes } from 'vxe-table'
import { FormItem } from '@/components/RForm/type'
import dayjs from 'dayjs'
import BtnCodeConstant from '@/constant/btnCodeConstant'

const useIndex = () => {
  const tableRef = ref(null)
  const instance = getCurrentInstance()
  const buttons = ref<VxeToolbarPropTypes.Buttons>([
    {
      name: '新增',
      code: BtnCodeConstant.add,
      status: 'primary',
      icon: 'vxe-icon-add',
      permissionCode: 'roleManageActionInsert',
    },
    {
      name: '删除',
      code: BtnCodeConstant.remove,
      status: 'error',
      icon: 'vxe-icon-delete',
      permissionCode: 'roleManageActionDelete',
    },
    {
      name: '修改',
      code: BtnCodeConstant.update,
      status: 'warning',
      icon: 'vxe-icon-edit',
      permissionCode: 'roleManageActionDelete',
    },
    {
      name: '查看',
      code: BtnCodeConstant.view,
      status: 'info',
      icon: 'vxe-icon-eye-fill',
      permissionCode: 'roleManageActionDelete',
    },
  ])
  const formConfig = ref<FormItem[]>([
    {
      label: '用户名',
      prop: 'username',
      component: 'el-input',
      props: {
        placeholder: '请输入用户名',
        clearable: true,
      },
    },
    {
      label: '昵称',
      prop: 'nickname',
      component: 'el-input',
      props: {
        placeholder: '请输入昵称',
        clearable: true,
      },
    },
  ])
  const statusList = [
    { value: 1, label: '启用' },
    { value: 0, label: '禁用' },
  ]
  const genderList = [
    { value: 1, label: '男' },
    { value: 0, label: '女' },
  ]
  const columns = reactive<VxeColumnProps[]>([
    {
      type: 'seq',
      width: 70,
      align: 'center',
      fixed: 'left',
    },
    {
      field: 'username',
      title: '用户名',
      align: 'center',
      minWidth: '80px',
    },
    {
      field: 'nickname',
      title: '昵称',
      align: 'center',
      minWidth: '80px',
    },
    {
      field: 'phone',
      title: '手机号码',
      align: 'center',
      minWidth: '80px',
    },
    {
      field: 'status',
      title: '用户状态',
      align: 'center',
      minWidth: '80px',
      formatter({ cellValue }) {
        const item = statusList.find((item: any) => item.value === cellValue)
        return item ? item.label : cellValue
      },
    },
    {
      field: 'gender',
      title: '性别',
      align: 'center',
      minWidth: '80px',
      formatter({ cellValue }) {
        const item = genderList.find((item: any) => item.value === cellValue)
        return item ? item.label : cellValue
      },
    },
    {
      field: 'email',
      title: '邮箱',
      align: 'center',
      minWidth: '80px',
    },
    {
      field: 'avatar',
      title: '用户头像',
      align: 'center',
      minWidth: '80px',
      cellRender: {
        name: 'VxeImage',
        props: {
          width: 32,
          height: 32,
          circle: true, // 是否圆角
        },
      },
    },
    {
      field: 'createTime',
      title: '创建时间',
      align: 'center',
      minWidth: '80px',
      formatter({ cellValue }) {
        return cellValue ? dayjs(cellValue).format('YYYY-MM-DD HH:mm:ss') : ''
      },
    },
  ])

  const buttonActions: Record<string, () => void> = {
    add: () => {
      console.log('add', instance)
    },
    remove: () => {},
    update: () => {},
    view: () => {},
  }

  const handleToolbarButtonClick = (btn: VxeToolbarPropTypes.ButtonConfig) => {
    const action = buttonActions[btn.code as string]
    action()
  }

  return {
    buttons,
    formConfig,
    columns,
    handleToolbarButtonClick,
    tableRef,
  }
}

export default useIndex
