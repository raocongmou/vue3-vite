import { defineStore } from 'pinia'

const useSettingStore = defineStore('setting', () => {
  const refresh = ref(false)

  return { refresh }
})

export default useSettingStore