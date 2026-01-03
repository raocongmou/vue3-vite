<template>
  <div class="app-logo" @click="goHome">
    <img class="app-logo__img" :src="logo" />
    <span v-show="!collapseStore.collapse" class="app-logo__title">
      {{ title }}
    </span>
  </div>
</template>

<script setup lang="ts" name="Logo">
  import { useRouter } from 'vue-router'
  import useCollapseStore from '@/store/modules/collapse'

  defineProps<{
    title: string
    logo: string
  }>()

  const router = useRouter()

  const collapseStore = useCollapseStore()

  const goHome = () => {
    router.push('/')
  }
</script>

<style lang="scss" scoped>
  .app-logo {
    height: 56px;
    padding: 0 6px;
    display: flex;
    align-items: center;
    gap: 10px;
    cursor: pointer;
    user-select: none;

    &__img {
      width: 48px;
      flex-shrink: 0;
    }

    &__title {
      font-size: 16px;
      font-weight: 600;
      color: #1677ff; // 和 Admin Plus 风格接近
      white-space: nowrap;
    }
  }
</style>
