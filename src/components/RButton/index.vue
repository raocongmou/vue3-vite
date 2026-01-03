<template>
  <div class="r-button">
    <el-button
      v-for="btn in buttons"
      :key="btn.label"
      :type="btn.type || 'primary'"
      :disabled="btn.disabled"
      @click="() => handleClick(btn)"
    >
      {{ btn.label }}
    </el-button>
  </div>
</template>

<script setup lang="ts" name="RButton">
  import { ButtonItem } from '../RTable/type'

  const props = defineProps<{
    buttons: ButtonItem[]
  }>()

  const emit = defineEmits<{
    (e: 'click', btn: ButtonItem): void
  }>()

  function handleClick(btn: ButtonItem) {
    btn.action?.()
    emit('click', btn)
  }
</script>
