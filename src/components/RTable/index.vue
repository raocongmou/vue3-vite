<template>
  <el-card style="margin-bottom: 10px">
    <RForm
      v-if="showForm"
      :formConfig="formConfig"
      :labelWidth="labelWidth"
      @search="handleSearch"
    />
  </el-card>
  <el-card>
    <!-- @vue-ignore -->
    <vxe-grid
      ref="gridRef"
      v-bind="gridOptions"
      v-on="gridEvents"
      :loading="loading"
    />
  </el-card>
</template>

<script setup lang="ts" generic="T" name="RTable">
  import { ref } from 'vue'
  import type {
    VxeGridProps,
    VxeGridListeners,
    VxeGridPropTypes,
    VxeToolbarPropTypes,
    VxeGridInstance,
  } from 'vxe-table'
  import type { PagerVO } from './type'
  import RForm from '../RForm/index.vue'

  const gridRef = ref<VxeGridInstance | null>(null)
  const props = withDefaults(
    defineProps<{
      columns: VxeGridPropTypes.Columns
      showForm?: boolean
      showPager?: boolean
      loading?: boolean
      pageSize?: number
      currentPage?: number
      formConfig?: any[]
      labelWidth?: string | number
      buttons?: VxeToolbarPropTypes.Buttons
      fetchTableList: Function
    }>(),
    {
      showForm: true,
      showPager: true,
      loading: false,
      total: 0,
      pageSize: 10,
      currentPage: 1,
      labelWidth: 60,
      formConfig: () => [],
      buttons: () => [],
      fetchTableList: (params: any) => Promise,
    },
  )

  const emit = defineEmits<{
    (e: 'search', query: any): void
    (
      e: 'page-change',
      pager: {
        pageSize: number
        pageNum: number
      },
    ): void
    (e: 'toolbar-button-click', btn: VxeToolbarPropTypes.ButtonConfig): void
  }>()

  const pager = ref<PagerVO>({
    pageNum: 1,
    pageSize: 10,
    total: 0,
  })

  const params = ref<any>({})

  const gridOptions = computed<VxeGridProps<T>>(() => ({
    border: false,
    stripe: false,
    round: true,
    keepSource: true,
    align: 'center',
    size: 'mini',
    columns: props.columns,
    showHeader: true,
    showOverflow: true,
    loading: false,
    pagerConfig: {
      ...pager.value,
      enabled: props.showPager,
      pageSizes: [10, 20, 30, 50, 100],
      layouts: [
        'Home',
        'PrevJump',
        'PrevPage',
        'Jump',
        'PageCount',
        'NextPage',
        'NextJump',
        'End',
        'Sizes',
        'Total',
      ],
    },
    cellConfig: {
      padding: true,
    },
    rowConfig: {
      isCurrent: true,
      isHover: true,
      useKey: true,
      keyField: '',
    },
    sortConfig: {
      remote: true,
      multiple: true,
    },
    toolbarConfig: {
      refresh: true,
      zoom: true,
      buttons: props.buttons,
    },
    proxyConfig: {
      form: true,
      sort: true,
      showResponseMsg: false,
      showActiveMsg: true,
      response: {
        list: 'data.records',
        result: 'data.records',
        total: 'data.total',
        message: 'msg',
      },
      props: {
        list: 'data.records',
        result: 'data.records',
        total: 'data.total',
        message: 'msg',
      },
      ajax: {
        query({ page, form, sorts }) {
          console.log('query', page)
          console.log('query', form)

          params.value = {
            ...params.value,
            pageSize: page.pageSize,
            pageNum: page.currentPage,
            // orderBy: sorts
            //   .map((item) => `${item.field}|${item.order}`)
            //   .join(','),
          }
          return props.fetchTableList(params.value)
        },
      },
    },
  }))

  const gridEvents: VxeGridListeners = {
    pageChange({ pageSize, currentPage }) {
      pager.value.pageSize = pageSize
      pager.value.pageNum = currentPage
      emit('page-change', {
        pageSize: pager.value.pageSize,
        pageNum: pager.value.pageNum,
      })
    },
    toolbarButtonClick({ button }) {
      emit('toolbar-button-click', button)
    },
  }

  const handleSearch = async (query: any) => {
    pager.value.pageNum = 1
    params.value = query
    gridRef.value?.commitProxy('query')
  }
</script>
