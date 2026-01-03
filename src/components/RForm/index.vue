<template>
  <el-form
    :model="formData"
    inline
    :label-width="labelWidth"
    label-position="right"
    :style="{
      width: 'calc(100 % - 40px)',
      '--removeFormItemMarginBottom': removeFormItemMarginBottom,
    }"
  >
    <el-row>
      <el-col v-for="item in formConfig" :span="6">
        <el-form-item :key="item.prop" :label="item.label" style="width: 100%">
          <component
            :is="item.component"
            v-model="formData[item.prop]"
            v-bind="item.props"
          />
        </el-form-item>
      </el-col>
      <el-col
        :span="6"
        :offset="setOffset"
        style="text-align: right; width: 100%"
      >
        <el-form-item style="margin-bottom: 0 !important">
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script setup lang="ts" name="RForm">
  import { FormItem } from './type'

  const props = withDefaults(
    defineProps<{
      formConfig: FormItem[]
      labelWidth: string | number
    }>(),
    {
      labelWidth: 60,
    },
  )

  const setOffset = computed(() => {
    if (props.formConfig.length % 4 === 0) {
      return 18
    } else if (props.formConfig.length % 4 === 1) {
      return 12
    } else if (props.formConfig.length % 4 === 2) {
      return 6
    } else {
      return 0
    }
  })

  const removeFormItemMarginBottom = computed(() => {
    if (props.formConfig.length >= 4) {
      return '18px'
    } else {
      return '0'
    }
  })

  const emit = defineEmits<{
    (e: 'search', data: Record<string, any>): void
  }>()

  const formData = reactive<Record<string, any>>(
    props.formConfig.reduce(
      (prev, curr) => {
        prev[curr.prop] = ''
        return prev
      },
      {} as Record<string, any>,
    ),
  )

  const handleSearch = () => {
    emit('search', { ...formData })
  }

  const handleReset = () => {
    Object.keys(formData).forEach((key) => (formData[key] = ''))
    handleSearch()
  }
</script>

<style lang="scss" scoped>
  :deep(.el-form-item) {
    margin-bottom: var(--removeFormItemMarginBottom) !important;
  }
</style>
