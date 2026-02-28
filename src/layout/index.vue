<template>
  <div class="layout">
    <div :class="getSidebarClass">
      <Logo :title="Config.title" :logo="Config.logo" />
      <Menu :menuList="routesStore.routes" />
      <CollapseIcon />
    </div>
    <div :class="getTabbarClass">
      <Tabbar />
      <TagsView />
    </div>
    <el-scrollbar :class="getMainClass">
      <Main />
    </el-scrollbar>
  </div>
</template>

<script setup lang="ts">
  import Logo from './components/logo/index.vue'
  import Menu from './components/menu/index.vue'
  import CollapseIcon from './components/collapseIcon/index.vue'
  import Tabbar from './components/tabbar/index.vue'
  import TagsView from './components/tagsView/index.vue'
  import Main from './components/main/index.vue'
  import Config from '@/config'
  import useRoutesStore from '@/store/modules/routes'
  import useCollapseStore from '@/store/modules/collapse'

  // store
  const routesStore = useRoutesStore()
  const collapseStore = useCollapseStore()

  // computed
  const getSidebarClass = computed(() => {
    return [
      'layout-sidebar',
      collapseStore.collapse ? 'layout-sidebar-collapse' : '',
    ]
  })
  const getTabbarClass = computed(() => {
    return [
      'layout-tabbar',
      collapseStore.collapse ? 'layout-tabbar-collapse' : '',
    ]
  })
  const getMainClass = computed(() => {
    return ['layout-main', collapseStore.collapse ? 'layout-main-collapse' : '']
  })
</script>

<style lang="scss">
  .layout {
    width: 100%;
    height: 100vh;
    position: relative;
    z-index: 9;
    background-image: var(--app-bg-image);
    background-size: cover;
    background-color: var(--app-bg);
    &-sidebar {
      position: absolute;
      width: $sidebar-width;
      height: 100%;
      background-color: var(--app-surface);
      border: 1px solid var(--app-border);
      opacity: 1;
      z-index: 1;
      transition: all 0.7s ease;
      &-collapse {
        width: $sidebar-min-width;
      }
    }
    &-tabbar {
      position: absolute;
      right: $pixel-10;
      width: calc(100% - $sidebar-width - $pixel-10 - $pixel-10);
      height: $tabbar-height;
      background-color: var(--app-surface);
      border: 1px solid var(--app-border);
      z-index: 1;
      transition: all 0.7s ease;
      &-collapse {
        width: calc(100% - $sidebar-min-width - $pixel-10 - $pixel-10);
      }
    }
    .layout-main {
      width: calc(100% - $sidebar-width - $pixel-10 - $pixel-10);
      position: absolute;
      top: calc($tabbar-height + $pixel-10);
      right: $pixel-10;
      height: calc(100vh - $tabbar-height - $pixel-10 - $pixel-10);
      background-color: var(--app-surface);
      border: 1px solid var(--app-border);
      z-index: 1;
      overflow: auto;
      transition: all 0.7s ease;
      border-radius: 10px 10px 10px 10px;
      &-collapse {
        width: calc(100% - $sidebar-min-width - $pixel-10 - $pixel-10);
      }
      .layout-app {
        height: 1000px;
        width: 100%;
        box-sizing: border-box;
      }
    }
  }
</style>
