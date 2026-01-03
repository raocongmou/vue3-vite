<template>
  <div class="collapse-icon" @click="handleCollapse">
    <el-icon v-if="!collapseStore.collapse" :size="12" color="#409eff">
      <ArrowLeftBold />
    </el-icon>
    <el-icon v-else :size="12" color="#409eff">
      <ArrowRightBold />
    </el-icon>
  </div>
</template>

<script setup lang="ts">
  import { ArrowLeftBold, ArrowRightBold } from '@element-plus/icons-vue'
  import useCollapseStore from '@/store/modules/collapse'

  // store
  const collapseStore = useCollapseStore()

  // methods
  const handleCollapse = () => {
    collapseStore.collapse = !collapseStore.collapse
  }
</script>

<style lang="scss" scoped>
  .collapse-icon {
    position: absolute;
    top: 50%;
    right: 0;
    transform: translateY(-50%);
    .el-icon {
      width: 20px;
      height: 30px;
      background-color: rgb(222, 234, 254);
      border-radius: 7px 0 0 7px;

      &:hover {
        background-color: rgb(187, 215, 250);
        cursor: pointer;
      }
    }
  }
</style>
