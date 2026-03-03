<template>
  <div class="r-table">
    <el-card v-if="showForm" class="r-table__form">
      <RForm
        :formConfig="formConfig"
        :labelWidth="labelWidth"
        @search="handleSearch"
      />
    </el-card>
    <el-card class="r-table__grid">
      <div ref="gridContainerRef" class="r-table__grid-container">
        <!-- @vue-ignore -->
        <vxe-grid
          ref="gridRef"
          v-bind="gridOptions"
          v-on="gridEvents"
          :loading="loading"
        />
      </div>
    </el-card>
  </div>
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
  const gridContainerRef = ref<HTMLElement | null>(null)
  const gridHeight = ref(420)
  let resizeObserver: ResizeObserver | null = null
  const props = withDefaults(
    defineProps<{
      primaryKey: string
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
    (
      e: 'toolbar-button-click',
      btn: VxeToolbarPropTypes.ButtonConfig,
      selection: any[],
      currentRow: any,
    ): void
  }>()

  const pager = ref<PagerVO>({
    pageNum: 1,
    pageSize: 10,
    total: 0,
  })

  const params = ref<any>({})

  const updateGridHeight = () => {
    const containerEl = gridContainerRef.value
    if (!containerEl) return

    const nextHeight = Math.floor(containerEl.clientHeight)
    if (nextHeight > 0) {
      gridHeight.value = nextHeight
    }
  }

  onMounted(() => {
    nextTick(updateGridHeight)
    if (gridContainerRef.value) {
      resizeObserver = new ResizeObserver(updateGridHeight)
      resizeObserver.observe(gridContainerRef.value)
    }
    window.addEventListener('resize', updateGridHeight)
  })

  onUnmounted(() => {
    resizeObserver?.disconnect()
    resizeObserver = null
    window.removeEventListener('resize', updateGridHeight)
  })

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
    height: gridHeight.value,
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
    radioConfig: {
      trigger: 'row', // 👈 关键：点击整行触发单选
      highlight: true, // 选中行高亮
    },
    rowConfig: {
      isCurrent: true,
      isHover: true,
      useKey: true,
      keyField: props.primaryKey,
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
      const $grid = gridRef.value
      if ($grid) {
        // 获取复选框选中的所有行
        const selection = $grid.getCheckboxRecords()
        // 获取当前行选中的单行（针对 radio 或 isCurrent 模式）
        const currentRow = $grid.getCurrentRecord()

        // 将选中的数据作为第二个参数传给父组件
        emit('toolbar-button-click', button, selection, currentRow)
      }
    },
    // 关键：监听代理查询结束
    async proxyQuery() {
      // 稍微延迟，确保组件内部状态同步完成
      await nextTick()
      const $grid = gridRef.value
      if ($grid) {
        const data = $grid.getData()
        if (data && data.length > 0) {
          const firstRow = data[0]
          // 执行选中
          $grid.clearCheckboxRow() // 先清空之前的
          $grid.setRadioRow(firstRow)
          $grid.setCheckboxRow(firstRow, true)
          $grid.setCurrentRow(firstRow)
        }
      }
    },
  }

  const handleSearch = async (query: any) => {
    pager.value.pageNum = 1
    params.value = query
    await nextTick()
    gridRef.value?.commitProxy('query')
  }

  const query = async (isResetPager = false) => {
    await nextTick()
    if (isResetPager) {
      // 如果需要从第一页开始查（通常用于搜索按钮）
      gridRef.value?.commitProxy('reload')
    } else {
      // 如果只是刷新当前页数据（通常用于编辑保存后的局部刷新）
      gridRef.value?.commitProxy('query')
    }
  }

  defineExpose({
    query,
  })
</script>

<style lang="scss" scoped>
  .r-table {
    height: 100%;
    min-height: 0;
    display: flex;
    flex-direction: column;
  }

  .r-table__form {
    margin-bottom: 10px;
    flex-shrink: 0;
  }

  .r-table__grid {
    flex: 1;
    min-height: 0;
    display: flex;
    flex-direction: column;
  }

  .r-table__grid :deep(.el-card__body) {
    flex: 1;
    min-height: 0;
    display: flex;
    flex-direction: column;
    padding: 12px;
  }

  .r-table__grid-container {
    flex: 1;
    min-height: 0;
  }
</style>
