<template>
  <RTable
    ref="tableRef"
    :columns="columns"
    :formConfig="formConfig"
    :buttons="buttons"
    :labelWidth="60"
    primary-key="id"
    :fetch-table-list="getRoleList"
    @toolbar-button-click="handleToolbarButtonClick"
  />
</template>

<script setup lang="ts">
  import RTable from '@/components/RTable/index.vue'
  import useIndex from './hooks/useIndex'
  import { getRoleList } from '@/api/system/role'

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
