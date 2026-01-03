<template>
  <div class="user-info-card">
    <div class="user-info-card-header">
      <div class="user-info-card-header-left">
        <div class="user-info-card-header-left-box">
          <img :src="userStore.userInfo?.avatar" />
        </div>
        <div class="user-info-card-header-right">
          <span>{{ userStore.userInfo?.username }}</span>
          <el-tag type="success" class="user-info-card-header-right-tag">
            {{ '管理员' }}
          </el-tag>
        </div>
      </div>
    </div>
    <ul class="user-info-card-content">
      <li class="user-info-card-content-item">
        {{ userStore.userInfo?.nickname }}
      </li>
      <li class="user-info-card-content-item">
        {{ userStore.userInfo?.email }}
      </li>
      <li class="user-info-card-content-item">
        {{ userStore.userInfo?.phone }}
      </li>
    </ul>
    <div class="user-info-card-footer">
      <el-tooltip content="控制中心" effect="customized">
        <div class="user-info-card-footer-item" @click="handleController">
          <div class="user-info-card-footer-item-bg" />
          <SvgIcon name="controll" height="22px" width="22px" />
        </div>
      </el-tooltip>

      <div class="user-info-card-footer-item">
        <el-dropdown placement="bottom">
          <template #default>
            <div class="user-info-card-footer-item-default-slot">
              <div class="user-info-card-footer-item-default-slot-bg" />
              <SvgIcon name="more" height="22px" width="22px" />
            </div>
          </template>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item>修改密码</el-dropdown-item>
              <el-dropdown-item>个人资料</el-dropdown-item>
              <el-dropdown-item>
                <a href="https://github.com/raocongmou" target="_blank">
                  github仓库地址
                </a>
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>

      <el-tooltip content="退出登录" effect="customized">
        <div class="user-info-card-footer-item" @click="handleLogout">
          <div class="user-info-card-footer-item-bg" />
          <SvgIcon name="exit" height="22px" width="22px" />
        </div>
      </el-tooltip>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useRouter, useRoute } from 'vue-router'
  import useUserStore from '@/store/modules/user'
  import SvgIcon from '@/components/SvgIcon/index.vue'

  const userStore = useUserStore()
  const router = useRouter()
  const route = useRoute()

  // methods
  const handleController = () => {
    console.log('handleController')
    router.push('/index')
  }

  const handleLogout = async () => {
    await userStore.logout()
    router.replace({
      path: '/login',
      query: {
        redirect: route.path,
      },
    })
  }
</script>

<style lang="scss" scoped>
  .user-info-card {
    width: 240px;
    border-radius: 20px;
    &-header {
      width: calc(100% - 40px);
      height: 45px;
      display: flex;
      justify-content: start;
      margin-bottom: 10px;
      margin: 20px;
      &-left {
        display: flex;
        justify-content: space-between;
        &-box {
          width: 45px;
          height: 45px;
          border-radius: 5px;
          background-color: #eee;
          margin-right: 10px;
          cursor: pointer;
          img {
            width: 100%;
            height: 100%;
            border-radius: 50%;
          }
        }
      }
      &-right {
        display: flex;
        flex-direction: column;
        align-items: center;
        span {
          color: #000;
          font-size: 14px;
        }
        &-tag {
          //   font-size: 12px;
          //   color: #fff;
          //   line-height: 25px;
        }
      }
    }
    &-content {
      width: calc(100% - 40px);
      margin: 20px;
      &-item {
        color: #999;
        font-size: 14px;
        line-height: 25px;
        position: relative;
        padding-left: 15px;
        &::after {
          position: absolute;
          content: '';
          top: 10px;
          left: 0px;
          background-color: #999;
          width: 5px;
          height: 5px;
          border-radius: 50%;
        }
      }
    }
    &-footer {
      width: calc(100% - 40px);
      display: flex;
      justify-content: space-around;
      align-items: center;
      border-top: 1px solid #efeff5;
      margin: 20px 20px 10px 20px;
      &-item {
        flex: 1;
        height: 40px;
        display: flex;
        justify-content: center;
        align-items: center;
        padding-top: 5px;
        cursor: pointer;
        svg {
          transition: all 0.5;
        }
        &-default-slot {
          position: relative;
          svg {
            transition: all 0.5;
          }
          &:hover > &-bg {
            top: -7px;
            left: -7px;
            width: 36px;
            height: 36px;
            border-radius: 50%;
            background-color: #efeff5;
            position: absolute;
            opacity: 0.9;
          }

          &:hover {
            svg {
              transform: scale(1.2);
            }
          }
        }
        &:hover > &-bg {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background-color: #efeff5;
          position: absolute;
          opacity: 0.9;
        }
        &:hover {
          svg {
            transform: scale(1.2);
          }
        }
        &:nth-child(1),
        &:nth-child(2) {
          position: relative;
          &::after {
            position: absolute;
            content: '';
            width: 1px;
            height: 22px;
            top: 8px;
            right: 0;
            background-color: #efeff5;
          }
        }
      }
    }
  }
</style>
