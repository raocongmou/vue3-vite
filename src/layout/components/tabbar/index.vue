<template>
  <div class="tabbar">
    <Crumb />
    <Setting />
  </div>
</template>

<script setup lang="ts">
  import Crumb from './components/crumb/index.vue'
  import Setting from './components/setting/index.vue'
</script>

<style lang="scss" scoped>
  .tabbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 45px;
    padding-left: 20px;
  }
</style>
