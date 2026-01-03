<template>
  <div class="crumb">
    <el-breadcrumb :separator-icon="ArrowRight">
      <template v-for="match in route.matched" :key="match.path">
        <el-breadcrumb-item v-if="match.meta.title" :to="{ path: match.path }">
          <el-icon><component :is="is(match?.meta?.icon)" /></el-icon>
          <span>{{ match.meta.title }}</span>
        </el-breadcrumb-item>
      </template>
    </el-breadcrumb>
  </div>
</template>

<script setup lang="ts">
  import { ArrowRight } from '@element-plus/icons-vue'
  import { useRoute } from 'vue-router'
  import MenuIconsConstant from '@/constant/menuIconsConstant'

  const route = useRoute()

  const is = computed(() => (icon: string | unknown) => {
    return MenuIconsConstant.menuIconsMap.get(icon)
  })
</script>

<style lang="scss" scoped>
  .el-icon {
    vertical-align: top;
    margin-right: 5px;
  }
</style>
