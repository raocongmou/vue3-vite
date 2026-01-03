import { defineStore } from 'pinia'
import type { tabInter } from '../type'
import type { TabPaneName } from 'element-plus'
import LocalStorage from '@/utils/localStorage'

const useTabsStore = defineStore('tabs', () => {
  const tabs = ref<tabInter[]>(
    LocalStorage.get('tabs') ?? [
      {
        title: '首页',
        path: '/index',
      },
    ],
  )
  const activeTab = ref<TabPaneName>(LocalStorage.get('activeTab') ?? '/index')

  const remove = () => {
    tabs.value = [
      {
        title: '首页',
        path: '/index',
      },
    ]
    activeTab.value = '/index'
  }

  return { tabs, activeTab, remove }
})

export default useTabsStore
