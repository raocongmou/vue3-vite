<template>
  <router-view v-slot="{ Component }">
    <transition name="fade">
      <component :is="Component" :key="refreshKey" />
    </transition>
  </router-view>
</template>

<script setup lang="ts">
  import useSettingStore from '@/store/modules/setting'
  import { KeepAlive } from 'vue'

  const settingStore = useSettingStore()
  const refreshKey = ref(0)
  watch(
    () => settingStore.refresh,
    () => {
      refreshKey.value++
    },
  )
</script>

<style lang="scss" scoped></style>
