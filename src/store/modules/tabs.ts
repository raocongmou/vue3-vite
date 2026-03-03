import { defineStore } from 'pinia'
import type { tabInter } from '../type'
import LocalStorage from '@/utils/localStorage'

const HOME_PATH = '/index'
const HOME_TITLE = '\u9996\u9875'
const HOME_TAB: tabInter = {
  title: HOME_TITLE,
  path: HOME_PATH,
}

const normalizeTabs = (source: tabInter[] | null | undefined): tabInter[] => {
  const nextTabs = Array.isArray(source) ? source : []
  const seen = new Set<string>()
  const result: tabInter[] = []

  for (const item of nextTabs) {
    if (!item || typeof item.path !== 'string') continue

    const path = item.path.trim()
    if (!path || path === HOME_PATH || seen.has(path)) continue

    seen.add(path)
    result.push({
      path,
      title: item.title || path,
    })
  }

  return [HOME_TAB, ...result]
}

const useTabsStore = defineStore('tabs', () => {
  const tabs = ref<tabInter[]>(normalizeTabs(LocalStorage.get<tabInter[]>('tabs')))
  const activeTab = ref<string>(LocalStorage.get<string>('activeTab') ?? HOME_PATH)

  if (!tabs.value.some((item) => item.path === activeTab.value)) {
    activeTab.value = HOME_PATH
  }

  const remove = () => {
    tabs.value = [HOME_TAB]
    activeTab.value = HOME_PATH
  }

  return { tabs, activeTab, remove }
})

export default useTabsStore
