import type { VxeColumnProps } from 'vxe-table'
import type { VxeToolbarPropTypes } from 'vxe-table'
import { FormItem } from '@/components/RForm/type'
import type { ComponentPublicInstance } from 'vue'
import dayjs from 'dayjs'
import BtnCodeConstant from '@/constant/btnCodeConstant'
import Edit from '../Edit.vue'

type RTableExpose = {
  query: (isResetPager?: boolean) => void
}

const useIndex = () => {
  const tableRef = ref<ComponentPublicInstance<RTableExpose> | null>(null)
  const editRef = ref<InstanceType<typeof Edit> | null>(null)
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
      type: 'radio',
      width: 60,
      align: 'center',
      fixed: 'left',
    },
    {
      type: 'seq',
      width: 70,
      align: 'center',
      fixed: 'left',
    },
    {
      field: 'roleName',
      title: '角色名称',
      align: 'center',
      minWidth: '80px',
    },
    {
      field: 'roleKey',
      title: '角色代码',
      align: 'center',
      minWidth: '80px',
    },
    {
      field: 'status',
      title: '状态',
      align: 'center',
      minWidth: '80px',
    },
    {
      field: 'remark',
      title: '备注',
      align: 'center',
      minWidth: '80px',
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

  const buttonActions: Record<string, (currentRow: any) => void> = {
    add: () => {
      editRef.value?.open()
    },
    remove: () => {},
    update: (currentRow: any) => {
      editRef.value?.open(currentRow, 'edit')
    },
    view: (currentRow: any) => {
      editRef.value?.open(currentRow, 'view')
    },
  }

  const handleToolbarButtonClick = (
    btn: VxeToolbarPropTypes.ButtonConfig,
    selection: any[],
    currentRow: any,
  ) => {
    const action = buttonActions[btn.code as string]
    action(currentRow)
  }

  // 刷新列表
  const reload = () => {
    tableRef.value?.query(true)
  }

  return {
    buttons,
    formConfig,
    columns,
    reload,
    handleToolbarButtonClick,
    tableRef,
    editRef,
  }
}

export default useIndex
