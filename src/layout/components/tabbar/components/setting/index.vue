<template>
  <div class="setting">
    <el-button
      style="border: none; background-color: #efeff5"
      circle
      :icon="Search"
      @click="openSearch"
    />
    <el-button
      style="border: none; background-color: #efeff5"
      circle
      :icon="Refresh"
      @click="handleRefresh"
    />
    <el-button
      style="border: none; background-color: #efeff5"
      circle
      :icon="FullScreen"
      @click="handleFullScreen"
    />
    <el-popover placement="bottom" trigger="click" width="260">
      <template #reference>
        <el-button
          style="border: none; background-color: #efeff5"
          circle
          :icon="Moon"
        />
      </template>
      <div class="theme-panel">
        <div class="theme-panel__row">
          <span class="theme-panel__label">Dark mode</span>
          <el-switch
            :model-value="isDark"
            inline-prompt
            active-text="On"
            inactive-text="Off"
            @change="handleSwitchTheme"
          />
        </div>
        <div class="theme-panel__row">
          <span class="theme-panel__label">Theme color</span>
          <el-color-picker
            v-model="themeColor"
            :predefine="predefineColors"
            :show-alpha="false"
            @change="handleThemeColorChange"
          />
        </div>
      </div>
    </el-popover>
    <el-badge :value="unreadCount" :hidden="unreadCount === 0" :max="99">
      <el-button
        style="border: none; background-color: #efeff5"
        circle
        :icon="Bell"
        @click="notifyVisible = true"
      />
    </el-badge>

    <el-dropdown placement="bottom-end" trigger="click">
      <span class="el-dropdown-link">
        <div class="setting-avatar">
          <el-avatar
            style="margin-left: 10px; cursor: pointer"
            :size="36"
            @error="errorHandler"
          >
            <img
              :src="userStore.userInfo?.avatar ?? '@/assets/images/avatar.jfif'"
            />
          </el-avatar>
          <span class="setting-avatar-username">
            {{ userStore.userInfo?.nickname || '未知' }}
          </span>
        </div>
      </span>
      <template #dropdown>
        <UserInfoCard />
      </template>
    </el-dropdown>
  </div>

  <el-dialog
    v-model="searchVisible"
    title="Menu Search"
    width="420px"
    :close-on-click-modal="false"
    :append-to-body="true"
    :z-index="3000"
    class="setting-search-dialog"
  >
    <el-input
      ref="searchInputRef"
      v-model="searchKeyword"
      placeholder="Type menu name, press Enter"
      clearable
      @keydown.enter="handleSearchEnter"
    />
    <div class="setting-search-list">
      <el-empty v-if="filteredRoutes.length === 0" description="No matches" />
      <ul v-else>
        <li
          v-for="item in filteredRoutes"
          :key="item.path"
          class="setting-search-item"
          @click="handleRouteClick(item.path)"
        >
          <span class="setting-search-item__title">{{ item.title }}</span>
          <span class="setting-search-item__path">{{ item.path }}</span>
        </li>
      </ul>
    </div>
  </el-dialog>

  <el-drawer
    v-model="notifyVisible"
    title="Notifications"
    size="360px"
    :append-to-body="true"
    :z-index="3000"
  >
    <template #header>
      <div class="setting-notify-header">
        <span>Notifications</span>
        <div class="setting-notify-actions">
          <el-button size="small" @click="markAllRead">Mark all read</el-button>
          <el-button size="small" @click="clearAll">Clear</el-button>
        </div>
      </div>
    </template>
    <el-scrollbar class="setting-notify-list">
      <el-empty v-if="notifications.length === 0" description="No notifications" />
      <ul v-else>
        <li
          v-for="item in notifications"
          :key="item.id"
          class="setting-notify-item"
          :class="{ 'is-read': item.read }"
          @click="markRead(item.id)"
        >
          <div class="setting-notify-item__title">{{ item.title }}</div>
          <div class="setting-notify-item__content">{{ item.content }}</div>
          <div class="setting-notify-item__time">{{ item.time }}</div>
        </li>
      </ul>
    </el-scrollbar>
  </el-drawer>
</template>

<script setup lang="ts">
  import {
    Bell,
    FullScreen,
    Moon,
    Refresh,
    Search,
  } from '@element-plus/icons-vue'
  import { ElMessage } from 'element-plus'
  import { useRouter } from 'vue-router'
  import useSettingStore from '@/store/modules/setting'
  import useUserStore from '@/store/modules/user'
  import useRoutesStore from '@/store/modules/routes'
  import UserInfoCard from './components/userInfoCard/index.vue'
  import LocalStorage from '@/utils/localStorage'

  // store
  const settingStore = useSettingStore()
  const userStore = useUserStore()
  const routesStore = useRoutesStore()
  const router = useRouter()

  const searchVisible = ref(false)
  const searchKeyword = ref('')
  const searchInputRef = ref()
  const notifyVisible = ref(false)
  const isDark = ref(false)
  const themeColor = ref(LocalStorage.get<string>('theme-color') || '#0969da')
  const predefineColors = [
    '#0969da',
    '#2f81f7',
    '#8250df',
    '#1f883d',
    '#d1242f',
    '#fb8c00',
    '#14b8a6',
    '#0ea5e9',
  ]

  const notifications = ref([
    {
      id: 1,
      title: 'Welcome back',
      content: 'Have a productive day.',
      time: 'Just now',
      read: false,
    },
    {
      id: 2,
      title: 'System notice',
      content: 'You have new system messages.',
      time: '2 minutes ago',
      read: false,
    },
  ])

  const unreadCount = computed(
    () => notifications.value.filter((item) => !item.read).length,
  )

  const clamp = (value: number, min = 0, max = 255) =>
    Math.min(max, Math.max(min, value))
  const hexToRgb = (hex: string) => {
    const normalized = hex.replace('#', '')
    if (normalized.length === 3) {
      const r = parseInt(normalized[0] + normalized[0], 16)
      const g = parseInt(normalized[1] + normalized[1], 16)
      const b = parseInt(normalized[2] + normalized[2], 16)
      return { r, g, b }
    }
    const r = parseInt(normalized.slice(0, 2), 16)
    const g = parseInt(normalized.slice(2, 4), 16)
    const b = parseInt(normalized.slice(4, 6), 16)
    return { r, g, b }
  }
  const rgbToHex = (r: number, g: number, b: number) => {
    const toHex = (n: number) => clamp(n).toString(16).padStart(2, '0')
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`
  }
  const mix = (color1: string, color2: string, weight: number) => {
    const w = Math.max(0, Math.min(1, weight))
    const c1 = hexToRgb(color1)
    const c2 = hexToRgb(color2)
    const r = Math.round(c1.r * (1 - w) + c2.r * w)
    const g = Math.round(c1.g * (1 - w) + c2.g * w)
    const b = Math.round(c1.b * (1 - w) + c2.b * w)
    return rgbToHex(r, g, b)
  }
  const setThemeColor = (color: string) => {
    if (!color) return
    const root = document.documentElement
    root.style.setProperty('--el-color-primary', color)
    for (let i = 1; i <= 9; i += 1) {
      root.style.setProperty(
        `--el-color-primary-light-${i}`,
        mix(color, '#ffffff', i / 10),
      )
    }
    root.style.setProperty('--el-color-primary-dark-2', mix(color, '#000000', 0.2))
    root.style.setProperty('--vxe-ui-font-primary-color', color)
    LocalStorage.set('theme-color', color)
  }

  const flattenRoutes = (routes: any[]) => {
    const result: { title: string; path: string }[] = []
    const walk = (list: any[]) => {
      list.forEach((route) => {
        if (route?.meta?.hidden) return
        if (route?.meta?.title) {
          result.push({
            title: route.meta.title,
            path: route.path,
          })
        }
        if (Array.isArray(route.children) && route.children.length > 0) {
          walk(route.children)
        }
      })
    }
    walk(routes)
    return result
  }

  const allRoutes = computed(() => flattenRoutes(routesStore.routes))
  const filteredRoutes = computed(() => {
    const keyword = searchKeyword.value.trim().toLowerCase()
    if (!keyword) return allRoutes.value
    return allRoutes.value.filter(
      (item) =>
        item.title.toLowerCase().includes(keyword) ||
        item.path.toLowerCase().includes(keyword),
    )
  })

  // methods
  const errorHandler = () => true

  const openSearch = () => {
    searchVisible.value = true
    nextTick(() => {
      searchInputRef.value?.focus?.()
    })
  }
  const handleSearchEnter = () => {
    if (filteredRoutes.value.length === 1) {
      handleRouteClick(filteredRoutes.value[0].path)
      return
    }
    ElMessage.info('Please pick a menu item')
  }
  const handleRouteClick = (path: string) => {
    searchVisible.value = false
    router.push(path)
  }
  const handleRefresh = () => {
    settingStore.refresh = !settingStore.refresh
  }
  // 鍏ㄥ睆
  const handleFullScreen = async () => {
    try {
      const isFullScreen = document.fullscreenElement
      if (!isFullScreen) {
        await document.documentElement.requestFullscreen()
      } else {
        await document.exitFullscreen()
      }
    } catch {
      ElMessage.error('Unable to toggle fullscreen')
    }
  }
  // 鍒囨崲涓婚
  const applyTheme = (dark: boolean) => {
    isDark.value = dark
    document.documentElement.classList.toggle('dark', dark)
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light')
    document.documentElement.setAttribute(
      'data-vxe-ui-theme',
      dark ? 'dark' : 'light',
    )
    LocalStorage.set('theme', dark ? 'dark' : 'light')
  }

  const runThemeTransition = (nextDark: boolean) => {
    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches
    const canTransition =
      'startViewTransition' in document && !prefersReduced
    if (!canTransition) {
      applyTheme(nextDark)
      return
    }

    const startX = nextDark ? 0 : window.innerWidth
    const startY = nextDark ? 0 : window.innerHeight
    const endRadius = Math.hypot(window.innerWidth, window.innerHeight)
    // @ts-ignore - View Transition API
    const transition = document.startViewTransition(() => {
      applyTheme(nextDark)
    })

    transition.ready.then(() => {
      const clip = [
        `circle(0px at ${startX}px ${startY}px)`,
        `circle(${endRadius}px at ${startX}px ${startY}px)`,
      ]
      document.documentElement.animate(
        { clipPath: clip },
        {
          duration: 520,
          easing: 'ease-in-out',
          // @ts-ignore - View Transition API
          pseudoElement: '::view-transition-new(root)',
        },
      )
    })
  }

  const handleSwitchTheme = (value?: boolean) => {
    const next = typeof value === 'boolean' ? value : !isDark.value
    runThemeTransition(next)
  }

  const handleThemeColorChange = (color: string) => {
    if (color) setThemeColor(color)
  }

  watch(
    () => themeColor.value,
    (value) => {
      if (value) setThemeColor(value)
    },
  )

  const markAllRead = () => {
    notifications.value = notifications.value.map((item) => ({
      ...item,
      read: true,
    }))
  }
  const clearAll = () => {
    notifications.value = []
  }
  const markRead = (id: number) => {
    notifications.value = notifications.value.map((item) =>
      item.id === id ? { ...item, read: true } : item,
    )
  }

  onMounted(() => {
    const saved = LocalStorage.get<string>('theme')
    applyTheme(saved === 'dark')
    setThemeColor(themeColor.value)
  })
</script>

<style lang="scss" scoped>
  .setting {
    margin-right: 20px;
    display: flex;
    gap: 8px;
    .setting-avatar {
      display: flex;
      align-items: center;
      cursor: pointer;
      .setting-avatar-username {
        margin-left: 10px;
        color: var(--app-text-muted);
      }
    }
  }

  .theme-panel {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  .theme-panel__row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }
  .theme-panel__label {
    font-size: 13px;
    color: var(--app-text);
  }

  .setting-search-list {
    margin-top: 12px;
    max-height: 260px;
  }
  .setting-search-list ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  .setting-search-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 10px;
    border-radius: 8px;
    cursor: pointer;
  }
  .setting-search-item:hover {
    background: var(--app-surface-muted);
  }
  .setting-search-item__title {
    font-size: 14px;
    color: var(--app-text);
  }
  .setting-search-item__path {
    font-size: 12px;
    color: var(--app-text-muted);
  }

  .setting-notify-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
  }
  .setting-notify-actions {
    display: flex;
    gap: 6px;
  }
  .setting-notify-list {
    padding-right: 6px;
  }
  .setting-notify-list ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  .setting-notify-item {
    padding: 10px 8px;
    border-bottom: 1px solid #f0f0f0;
    cursor: pointer;
  }
  .setting-notify-item.is-read .setting-notify-item__title {
    color: var(--app-text-muted);
  }
  .setting-notify-item__title {
    font-size: 14px;
    color: var(--app-text);
    margin-bottom: 4px;
  }
  .setting-notify-item__content {
    font-size: 12px;
    color: var(--app-text-muted);
    margin-bottom: 4px;
  }
  .setting-notify-item__time {
    font-size: 12px;
    color: var(--app-text-muted);
  }
</style>
