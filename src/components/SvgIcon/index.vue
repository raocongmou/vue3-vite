<template>
  <svg
    aria-hidden="true"
    :style="{
      height,
      width,
    }"
  >
    <use :href="symbolId" :fill="color" />
  </svg>
</template>

<script lang="ts" setup name="SvgIcon">
  const props = withDefaults(
    defineProps<{
      prefix?: string
      name: string
      color?: string
      height?: string
      width?: string
    }>(),
    {
      prefix: 'icon',
      color: '#2c2c2c',
      height: '16px',
      width: '16px',
    },
  )

  const symbolId = computed(() => `#${props.prefix}-${props.name}`)
</script>
