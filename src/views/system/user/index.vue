<template>
  <RTable
    ref="tableRef"
    :columns="columns"
    :formConfig="formConfig"
    :buttons="buttons"
    :labelWidth="60"
    :fetch-table-list="getUserList"
    @toolbar-button-click="handleToolbarButtonClick"
  />
</template>

<script setup lang="ts">
  import { getUserList } from '@/api/system/user'
  import RTable from '@/components/RTable/index.vue'
  import useIndex from './hooks/useIndex'

  const { buttons, formConfig, columns, handleToolbarButtonClick, tableRef } =
    useIndex()
</script>

<style lang="scss" scoped></style>
