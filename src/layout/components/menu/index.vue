<template>
  <el-scrollbar class="menu">
    <el-menu
      :default-active="route.path"
      unique-opened
      :popper-offset="16"
      :collapse="collapseStore.collapse"
      active-text-color="#358cf1"
    >
      <template v-for="route in menuList" :key="route.path">
        <template v-if="!route.children">
          <el-menu-item
            :index="route.path"
            v-if="!route?.meta?.hidden"
            @click="handleRouter(route?.path)"
          >
            <el-icon>
              <component :is="is(route?.meta?.icon)" />
            </el-icon>
            <template #title>
              <span>{{ route?.meta?.title }}</span>
            </template>
          </el-menu-item>
        </template>
        <template v-if="route.children && route.children.length === 1">
          <el-menu-item
            :index="route.children[0].path"
            v-if="!route.children[0]?.meta?.hidden"
            @click="handleRouter(route.children[0]?.path)"
          >
            <el-icon>
              <component :is="is(route.children?.[0]?.meta?.icon)" />
            </el-icon>
            <template #title>
              <span>{{ route.children[0]?.meta?.title }}</span>
            </template>
          </el-menu-item>
        </template>
        <template v-if="route.children && route.children.length > 1">
          <el-sub-menu :index="route.path" v-if="!route?.meta?.hidden">
            <template #title>
              <el-icon>
                <component :is="is(route?.meta?.icon)" />
              </el-icon>
              <span>{{ route?.meta?.title }}</span>
            </template>
            <Menu :menuList="route.children" />
          </el-sub-menu>
        </template>
      </template>
    </el-menu>
  </el-scrollbar>
</template>

<script setup lang="ts">
  import MenuIconsConstant from '@/constant/menuIconsConstant'
  import type { RouteRecordRaw } from 'vue-router'
  import { useRouter, useRoute } from 'vue-router'
  import useCollapseStore from '@/store/modules/collapse'

  // props
  withDefaults(
    defineProps<{
      menuList: RouteRecordRaw[]
    }>(),
    {},
  )

  // useRouter useRoute
  const router = useRouter()
  const route = useRoute()

  // store
  const collapseStore = useCollapseStore()

  // computed
  const is = computed(() => (icon: string | unknown) => {
    return MenuIconsConstant.menuIconsMap.get(icon)
  })

  // methods
  const handleRouter = (path: string) => {
    console.log('handleRouter', path)

    router.push(path)
  }
</script>

<script lang="ts">
  export default {
    name: 'Menu',
  }
</script>

<style lang="scss" scoped>
  .menu {
    height: calc(100% - 56px);
    overflow: auto;
  }

  /* 一级菜单 */
  .el-menu-item,
  .el-sub-menu__title {
    padding-left: 20px !important;
  }

  /* 二级菜单 */
  .el-sub-menu .el-menu-item {
    padding-left: 40px !important;
  }

  /* 三级菜单 */
  .el-sub-menu .el-sub-menu .el-menu-item {
    padding-left: 60px !important;
  }

  .el-menu {
    border-right: none;
  }
</style>
