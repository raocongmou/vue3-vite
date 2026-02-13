<template>
  <RTable
    ref="tableRef"
    :columns="columns"
    :formConfig="formConfig"
    :buttons="buttons"
    :labelWidth="60"
    primary-key="id"
    :fetch-table-list="getUserList"
    @toolbar-button-click="handleToolbarButtonClick"
  />
  <Edit ref="editRef" @reload="reload" />
</template>

<script setup lang="ts">
  import { getUserList } from '@/api/system/user'
  import RTable from '@/components/RTable/index.vue'
  import Edit from './Edit.vue'
  import useIndex from './hooks/useIndex'

  const {
    buttons,
    formConfig,
    columns,
    reload,
    handleToolbarButtonClick,
    tableRef,
    editRef,
  } = useIndex()
</script>

<style lang="scss" scoped></style>
