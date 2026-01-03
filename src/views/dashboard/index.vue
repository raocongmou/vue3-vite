<template>
  <RTable
    :columns="columns"
    :formConfig="formConfig"
    :buttons="buttons"
    :labelWidth="90"
    :fetch-table-list="getOperateLogList"
    @toolbar-button-click="handleToolbarButtonClick"
  />
</template>

<script lang="ts" setup name="dashboard">
  import { getOperateLogList } from '@/api/log'
  import type { VxeToolbarPropTypes } from 'vxe-table'
  import type { VxeColumnProps } from 'vxe-table'
  import RTable from '@/components/RTable/index.vue'

  const formConfig = ref([
    {
      label: '操作类名',
      prop: 'id',
      // prop: 'className',
      component: 'el-input',
      props: {
        placeholder: '请输入操作类名',
        clearable: true,
      },
    },
    {
      label: '操作方法名',
      prop: 'methodName',
      component: 'el-input',
      props: {
        placeholder: '请输入操作方法名',
        clearable: true,
      },
    },
  ])
  const buttons = ref<VxeToolbarPropTypes.Buttons>([
    {
      name: '新增',
      code: 'add',
      status: 'primary',
      icon: 'vxe-icon-add',
      permissionCode: 'roleManageActionInsert',
    },
    {
      name: '删除',
      code: 'remove',
      status: 'error',
      icon: 'vxe-icon-delete',
      permissionCode: 'roleManageActionDelete',
    },
    {
      name: '修改',
      code: 'update',
      status: 'warning',
      icon: 'vxe-icon-edit',
      permissionCode: 'roleManageActionDelete',
    },
    {
      name: '查看',
      code: 'view',
      status: 'info',
      icon: 'vxe-icon-eye-fill',
      permissionCode: 'roleManageActionDelete',
    },
  ])
  const columns = ref<VxeColumnProps[]>([
    { field: 'seq', type: 'seq', width: 50, align: 'center' },
    { field: 'id', title: 'id', width: 60, align: 'center' },
    {
      field: 'operateEmpId',
      title: '操作人ID',
      showOverflow: true,
      width: 80,
      align: 'center',
    },
    {
      field: 'operateTime',
      title: '操作时间',
      align: 'center',
      minWidth: 90,
    },
    {
      field: 'className',
      title: '操作类名',
      showHeaderOverflow: 'title',
      align: 'center',
      minWidth: 90,
    },
    {
      field: 'methodName',
      title: '操作方法名',
      minWidth: 90,
      align: 'center',
    },
    {
      field: 'methodParam',
      title: '操作方法参数',
      minWidth: 90,
      showOverflow: 'ellipsis',
      align: 'center',
    },
    {
      field: 'costTime',
      title: '操作使用时间',
      width: 100,
      align: 'center',
    },
  ])

  const handleToolbarButtonClick = (btn: VxeToolbarPropTypes.ButtonConfig) => {
    console.log('handleToolbarButtonClick', btn)
  }
</script>

<style lang="sass" scoped></style>
