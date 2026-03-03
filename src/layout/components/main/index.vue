<template>
  <router-view v-slot="{ Component }">
    <transition name="fade">
      <div :key="refreshKey" class="layout-main-view">
        <component :is="Component" />
      </div>
    </transition>
  </router-view>
</template>

<script setup lang="ts">
  import useSettingStore from '@/store/modules/setting'

  const settingStore = useSettingStore()
  const refreshKey = ref(0)
  watch(
    () => settingStore.refresh,
    () => {
      refreshKey.value++
    },
  )
</script>

<style lang="scss" scoped>
  .layout-main-view {
    height: 100%;
    min-height: 0;
    overflow: hidden;
  }
</style>
