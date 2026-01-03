<template>
  <div class="setting">
    <el-button
      style="border: none; background-color: #efeff5"
      circle
      :icon="Search"
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
    <el-button
      style="border: none; background-color: #efeff5"
      circle
      :icon="Moon"
      @click="handleSwitchTheme"
    />
    <el-button
      style="border: none; background-color: #efeff5"
      circle
      :icon="Bell"
    />

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
            {{ userStore.userInfo?.nickname || '无' }}
          </span>
        </div>
      </span>
      <template #dropdown>
        <UserInfoCard />
      </template>
    </el-dropdown>
  </div>
</template>

<script setup lang="ts">
  import {
    Bell,
    FullScreen,
    Moon,
    Refresh,
    Search,
  } from '@element-plus/icons-vue'
  import useSettingStore from '@/store/modules/setting'
  import useUserStore from '@/store/modules/user'
  import UserInfoCard from './components/userInfoCard/index.vue'

  // store
  const settingStore = useSettingStore()
  const userStore = useUserStore()

  // methods
  const errorHandler = () => true
  const handleRefresh = () => {
    settingStore.refresh = !settingStore.refresh
  }
  // 全屏
  const handleFullScreen = () => {
    const isFullScreen = document.fullscreenElement
    console.log('isFullScreen', isFullScreen)

    if (!isFullScreen) {
      document.documentElement.requestFullscreen()
    } else {
      document.exitFullscreen()
    }
  }
  // 切换主题
  const handleSwitchTheme = () => {}
</script>

<style lang="scss" scoped>
  .setting {
    margin-right: 20px;
    display: flex;
    .setting-avatar {
      display: flex;
      align-items: center;
      cursor: pointer;
      .setting-avatar-username {
        margin-left: 10px;
        color: #767c82;
      }
    }
  }
</style>
