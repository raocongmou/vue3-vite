<template>
  <el-tabs
    v-model="tabsStore.activeTab"
    type="card"
    class="tags-view"
    closable
    @tab-remove="removeTab"
    @tab-change="handleTabChange"
  >
    <el-tab-pane
      v-for="tab in tabsStore.tabs"
      :key="tab.path"
      :label="tab.title"
      :name="tab.path"
      :closable="tab.path !== '/index'"
    />
  </el-tabs>
</template>

<script setup lang="ts">
  import type { TabPaneName } from 'element-plus'
  import { onBeforeRouteUpdate, useRouter, useRoute } from 'vue-router'
  import useTabsStore from '@/store/modules/tabs'
  import LocalStorage from '@/utils/localStorage'

  const router = useRouter()
  const route = useRoute()
  const tabsStore = useTabsStore()
  const removeTab = (targetName: TabPaneName) => {
    let activeName = tabsStore.activeTab
    if (activeName === targetName) {
      tabsStore.tabs.forEach((tab, index) => {
        if (tab.path === targetName) {
          const nextTab = tabsStore.tabs[index + 1] || tabsStore.tabs[index - 1]
          if (nextTab) {
            activeName = nextTab.path
          }
        }
      })
    }

    tabsStore.activeTab = activeName
    tabsStore.tabs = tabsStore.tabs.filter((tab) => tab.path !== targetName)
  }

const handleTabChange = (tab: TabPaneName) => {
    console.log('tab', tab);
    
    if (typeof tab === 'string') {
      router.push(tab)
    }
  }

  // onBeforeRouteUpdate((to, from) => {
  //   console.log('to', to)
  //   console.log('from', from)
  //   const index = tabsStore.tabs.findIndex((tab) => tab.path === route.fullPath)
  //   tabsStore.activeTab = route.fullPath
  //   if (index === -1) {
  //     tabsStore.tabs.push({
  //       path: route.fullPath,
  //       title: route.meta.title as string,
  //     })
  //   }
  //   LocalStorage.set('tabs', tabsStore.tabs)
  //   LocalStorage.set('activeTab', route.fullPath)
  // })

  watch(
    () => route.fullPath,
    () => {
      const path = route.fullPath
      tabsStore.activeTab = path

      if (!tabsStore.tabs.some((tab) => tab.path === path)) {
        tabsStore.tabs.push({
          path,
          title: route.meta.title as string,
        })
      }

      LocalStorage.set('tabs', tabsStore.tabs)
      LocalStorage.set('activeTab', path)
    },
    { immediate: true },
  )
</script>

<style lang="scss" scoped>
  .tags-view {
    width: 100%;
    height: 35px;
    box-sizing: border-box;
  }
  :deep(.el-tabs__item) {
    border: none !important;
    height: 32px !important;
    line-height: 32px;
    margin-right: 6px;
    padding: 10px;
    background-color: #fff;
    // color: #000;
  }
  :deep(.el-tabs__nav) {
    width: 100%;
    height: 35px;
    border: none !important;
    display: flex;
    align-items: end;
  }

  :deep(.el-tabs__item:last-child) {
    padding-right: 10px !important;
  }

  :deep(.el-tabs__item:nth-child(2)) {
    padding-left: 10px !important;
  }
  :deep(.el-tabs__nav-wrap) {
    margin-bottom: 0;
  }
  :deep(.el-tabs__header) {
    border: none;
  }
</style>
