<template>
  <div class="tags-view">
    <Vue3TabsChrome
      ref="tabsChromeRef"
      :model-value="chromeActiveKey"
      :tabs="chromeTabs"
      :is-mousedown-active="false"
      :class="{ 'theme-dark': isDark }"
      @update:model-value="handleModelValueChange"
      @click="handleTabClick"
      @remove="handleRemove"
      @swap="handleSwap"
    />
  </div>
</template>

<script setup lang="ts">
  import type { Tab as ChromeTab } from 'vue3-tabs-chrome'
  import { useRouter, useRoute } from 'vue-router'
  import Vue3TabsChrome from 'vue3-tabs-chrome'
  import 'vue3-tabs-chrome/dist/vue3-tabs-chrome.css'
  import useTabsStore from '@/store/modules/tabs'
  import LocalStorage from '@/utils/localStorage'

  const router = useRouter()
  const route = useRoute()
  const tabsStore = useTabsStore()

  const HOME_PATH = '/index'
  const HOME_TITLE = '\u9996\u9875'
  const HIDDEN_TAB_PATHS = new Set(['/login', '/404'])

  const tabsChromeRef = ref<{
    doLayout: () => void
    addTab: (...tabs: ChromeTab[]) => void
  } | null>(null)

  const isDark = ref(
    document.documentElement.getAttribute('data-theme') === 'dark',
  )
  let themeObserver: MutationObserver | null = null

  const chromeTabs = ref<ChromeTab[]>(
    (tabsStore.tabs || []).map((tab) => ({
      key: tab.path,
      label: tab.title,
      closable: tab.path !== HOME_PATH,
    })),
  )

  const relayout = () => {
    nextTick(() => {
      tabsChromeRef.value?.doLayout?.()
    })
  }

  const normalizeChromeTabsInPlace = () => {
    const seen = new Set<string>()
    for (let i = 0; i < chromeTabs.value.length; i += 1) {
      const tab = chromeTabs.value[i]
      const key = String(tab?.key || '').trim()
      if (!key || seen.has(key)) {
        chromeTabs.value.splice(i, 1)
        i -= 1
        continue
      }
      seen.add(key)
      tab.key = key
      tab.label = String(tab.label || key)
      tab.closable = key !== HOME_PATH
    }

    const homeIndex = chromeTabs.value.findIndex(
      (tab) => String(tab.key) === HOME_PATH,
    )
    if (homeIndex === -1) {
      chromeTabs.value.unshift({
        key: HOME_PATH,
        label: HOME_TITLE,
        closable: false,
      })
    } else {
      const homeTab = chromeTabs.value[homeIndex]
      homeTab.key = HOME_PATH
      homeTab.label = HOME_TITLE
      homeTab.closable = false
      if (homeIndex > 0) {
        chromeTabs.value.splice(homeIndex, 1)
        chromeTabs.value.unshift(homeTab)
      }
    }
  }

  const syncTabsCache = () => {
    normalizeChromeTabsInPlace()
    tabsStore.tabs = chromeTabs.value.map((tab) => ({
      path: String(tab.key),
      title: String(tab.label || tab.key),
    }))
    if (!tabsStore.tabs.some((tab) => tab.path === tabsStore.activeTab)) {
      tabsStore.activeTab = HOME_PATH
    }
    LocalStorage.set('tabs', tabsStore.tabs)
    LocalStorage.set('activeTab', tabsStore.activeTab)
  }

  const chromeActiveKey = computed(() => tabsStore.activeTab || HOME_PATH)

  const handleModelValueChange = (path: string | number) => {
    const nextPath = String(path || HOME_PATH)
    if (!nextPath) return
    tabsStore.activeTab = nextPath
    syncTabsCache()
    if (nextPath !== route.fullPath) {
      router.push(nextPath)
    }
  }

  const handleTabClick = (_event: Event, tab: ChromeTab) => {
    const nextPath = String(tab.key || HOME_PATH)
    if (!nextPath) return
    tabsStore.activeTab = nextPath
    syncTabsCache()
    if (nextPath !== route.fullPath) {
      router.push(nextPath)
    }
  }

  const handleRemove = (tab: ChromeTab, index: number) => {
    const targetPath = String(tab.key)
    if (targetPath === HOME_PATH) {
      syncTabsCache()
      relayout()
      return
    }

    // remove event fires after internal splice; only sync state here.
    syncTabsCache()
    const fallbackPath =
      String(chromeTabs.value[index]?.key || '') ||
      String(chromeTabs.value[index - 1]?.key || '') ||
      HOME_PATH
    if (route.fullPath === targetPath && fallbackPath !== route.fullPath) {
      router.push(fallbackPath)
    }
    relayout()
  }

  const handleSwap = (_tab: ChromeTab, _targetTab: ChromeTab) => {
    syncTabsCache()
    relayout()
  }

  watch(
    () => route.fullPath,
    () => {
      const path = route.fullPath
      if (HIDDEN_TAB_PATHS.has(route.path)) {
        tabsStore.activeTab = path
        syncTabsCache()
        return
      }

      const title = path === HOME_PATH ? HOME_TITLE : String(route.meta.title || path)
      const exists = chromeTabs.value.find((tab) => String(tab.key) === path)
      if (exists) {
        exists.label = title
      } else {
        const newTab: ChromeTab = {
          key: path,
          label: title,
          closable: path !== HOME_PATH,
        }
        if (tabsChromeRef.value?.addTab) {
          tabsChromeRef.value.addTab(newTab)
        } else {
          chromeTabs.value.push(newTab)
        }
      }

      tabsStore.activeTab = path
      syncTabsCache()
      relayout()
    },
    { immediate: true },
  )

  onMounted(() => {
    themeObserver = new MutationObserver(() => {
      isDark.value = document.documentElement.getAttribute('data-theme') === 'dark'
    })
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    })
    syncTabsCache()
    window.addEventListener('resize', relayout)
    relayout()
  })

  onUnmounted(() => {
    themeObserver?.disconnect()
    window.removeEventListener('resize', relayout)
  })
</script>

<style lang="scss" scoped>
  .tags-view {
    width: 100%;
    height: 36px;
    box-sizing: border-box;
    padding: 2px 10px 0;
    background: var(--app-surface-muted);
    border-bottom: 1px solid var(--app-border);
  }

  :deep(.vue3-tabs-chrome) {
    padding-top: 0;
    background-color: transparent;
  }

  :deep(.vue3-tabs-chrome .tabs-content) {
    height: 32px;
  }

  :deep(.vue3-tabs-chrome .tabs-label) {
    font-size: 12px;
  }

  :deep(.vue3-tabs-chrome .tabs-close-icon:hover) {
    background-color: rgba(17, 24, 39, 0.08);
  }

  :deep(.vue3-tabs-chrome .tabs-footer) {
    height: 2px;
    background-color: var(--app-surface-muted);
  }
</style>
