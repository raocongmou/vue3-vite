<template>
  <div class="login-container">
    <!-- 左侧 -->
    <div class="left-panel">
      <img
        class="login-svg"
        src="@/assets/images/login-left-2.png"
        alt="login-bg"
      />
    </div>

    <!-- 右侧 -->
    <div class="right-panel">
      <div class="login-box">
        <div class="logo">
          <div class="logo-bg">
            <img class="logo-img" src="@/assets/images/rcm.png" />
            <span class="title">{{ title }}</span>
          </div>
          <p class="desc">个人管理项目</p>
        </div>

        <el-form
          class="form"
          size="large"
          :model="form"
          :rules="rules"
          ref="formRef"
        >
          <el-form-item prop="username">
            <el-input placeholder="用户名" v-model="form.username" />
          </el-form-item>

          <el-form-item prop="password">
            <el-input
              type="password"
              v-model="form.password"
              placeholder="密码"
              show-password
            />
          </el-form-item>

          <div class="options">
            <el-checkbox>记住密码</el-checkbox>
            <a class="forget">忘记密码</a>
          </div>

          <el-button
            :loading="loading"
            type="primary"
            class="login-btn"
            @click="handleLogin"
            @keydown.enter="handleKeyup"
          >
            登录
          </el-button>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts" name="login">
  import type { loginForm } from '@/api/system/user/type'
  import { useRouter, useRoute } from 'vue-router'
  import { ElNotification } from 'element-plus'
  import Format from '@/utils/format'
  import useUserStore from '@/store/modules/user'

  // ref
  const form = reactive<loginForm>({
    username: 'admin',
    password: '123456',
  })
  const title = import.meta.env.VITE_APP_TITLE
  const rules = reactive({
    username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
    password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  })
  const formRef = ref<any>(null)
  const loading = ref(false)

  // store
  const userStore = useUserStore()

  // router
  const router = useRouter()
  const route = useRoute()

  // methods
  /**
   * 登录逻辑处理
   */
  const handleLogin = () => {
    formRef.value.validate(async (valid: boolean) => {
      if (valid) {
        try {
          loading.value = true
          await userStore.login(form)
          loading.value = false
          const redirect = route.query.redirect as any
          await router.push(redirect || '/')
          const message = Format.getLoginMessageByTime()
          ElNotification.success({
            title: 'HI,' + message + '好',
            type: 'success',
            message: '欢迎回来!',
          })
        } catch (err) {
          console.log('err', err)
          loading.value = false
          ElNotification.error('登录失败!')
        } finally {
          loading.value = false
        }
      }
    })
  }

  /**
   * enter触发登录进入系统
   * @param e
   */
  const handleKeyup = (e: KeyboardEvent) => {
    if (e.keyCode === 13) {
      handleLogin()
    }
  }

  onMounted(() => {
    //绑定监听事件
    window.addEventListener('keydown', handleKeyup)
  })

  onUnmounted(() => {
    //销毁事件
    window.removeEventListener('keydown', handleKeyup, false)
  })
</script>

<style lang="scss" scoped>
  .login-container {
    display: flex;
    height: 100vh;
    overflow: hidden;
  }

  /* 左侧 */
  .left-panel {
    flex: 1;
    background-color: #2d8cf0; // 接近截图蓝色
    display: flex;
    align-items: center;
    justify-content: center;

    .login-svg {
      width: 60%;
      max-width: 520px;
      min-width: 320px;
      animation: float 4s ease-in-out infinite;
    }

    @keyframes float {
      0% {
        transform: translateY(0);
      }
      50% {
        transform: translateY(-20px);
      }
      100% {
        transform: translateY(0);
      }
    }
  }

  /* 右侧 */
  .right-panel {
    flex: 1;
    background: #fff;
    display: flex;
    align-items: center;
    justify-content: center;

    .login-box {
      width: 380px;

      .logo {
        text-align: center;
        margin-bottom: 32px;
        .logo-bg {
          width: 100%;
          display: flex;
          justify-content: center;
          .logo-img {
            width: 80px;
            height: fit-content;
            margin-right: 10px;
          }
          .title {
            font-size: 28px;
            font-weight: 600;
            color: #333;
          }
        }

        .desc {
          margin-top: 8px;
          font-size: 14px;
          color: #999;
          margin-top: 15px;
        }
      }

      .form {
        .options {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;

          .forget {
            font-size: 14px;
            color: #409eff;
            cursor: pointer;
          }
        }

        .login-btn {
          width: 100%;
          height: 44px;
          font-size: 16px;
        }
      }
    }
  }
</style>
