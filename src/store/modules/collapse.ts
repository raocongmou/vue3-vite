import { defineStore } from 'pinia'

const useCollapseStore = defineStore('collapse', () => {
  const collapse = ref(false)

  return { collapse }
})

export default useCollapseStore
