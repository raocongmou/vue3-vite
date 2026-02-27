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
          <p class="desc">{{ $t('login.personBlogManagement') }}</p>
        </div>

        <el-form
          class="form"
          size="large"
          :model="form"
          :rules="rules"
          ref="formRef"
        >
          <el-form-item prop="username">
            <el-input
              :placeholder="$t('login.username')"
              v-model="form.username"
            />
          </el-form-item>

          <el-form-item prop="password">
            <el-input
              type="password"
              v-model="form.password"
              :placeholder="$t('login.password')"
              show-password
            />
          </el-form-item>

          <el-form-item prop="validateCodeValue">
            <div class="captcha-row">
              <el-input
                v-model="form.validateCodeValue"
                :placeholder="$t('login.validateCodePlaceholder')"
                clearable
                inputmode="numeric"
                maxlength="10"
                class="captcha-input"
              />
              <img
                :src="validateCodeImg"
                class="captcha-img"
                :alt="$t('login.validateCode')"
                :title="$t('login.title')"
                @click="refreshValidateCode"
              />
            </div>
          </el-form-item>

          <div class="options">
            <el-checkbox>{{ $t('login.rememberPwd') }}</el-checkbox>
            <a class="forget">{{ $t('login.forgetPwd') }}</a>
          </div>

          <el-button
            :loading="loading"
            type="primary"
            class="login-btn"
            @click="handleLogin"
            @keydown.enter="handleKeyup"
          >
            {{ $t('login.login') }}
          </el-button>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts" name="login">
  import type { loginForm } from '@/api/system/user/type'
  import { generateValidateCode } from '@/api/system/user/index'
  import { useRouter, useRoute } from 'vue-router'
  import { ElNotification } from 'element-plus'
  import { useI18n } from 'vue-i18n'
  import Format from '@/utils/format'
  import useUserStore from '@/store/modules/user'

  // 第三方插件hooks
  const { t } = useI18n()

  // ref、reactive
  const form = reactive<loginForm>({
    username: 'admin',
    password: '123456',
    validateCodeValue: '',
    validateCodeKey: '',
  })
  const validateCodeImg = ref('')
  const title = import.meta.env.VITE_APP_TITLE
  const rules = reactive({
    username: [
      { required: true, message: t('login.usernameValidate'), trigger: 'blur' },
    ],
    password: [
      { required: true, message: t('login.passwordValidate'), trigger: 'blur' },
    ],
    validateCodeValue: [
      {
        required: true,
        message: t('login.validateCodeValidate'),
        trigger: 'blur',
      },
      // {
      //   len: 4,
      //   message: t('login.validateCodeLength'),
      //   trigger: 'blur',
      // },
    ],
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
          form.validateCodeValue = (form.validateCodeValue || '').trim()
          loading.value = true
          await userStore.login(form)
          loading.value = false
          const redirect = route.query.redirect as any
          await router.push(redirect || '/')
          const message = Format.getLoginMessageByTime()
          ElNotification.success({
            title: 'HI,' + message + t('login.well'),
            type: 'success',
            message: t('login.welcome'),
          })
        } catch (err: any) {
          console.log('err', err)
          loading.value = false
          ElNotification.error({
            title: t('login.loginFailed'),
            message: typeof err === 'string' ? err : err?.message ?? String(err),
          })
          await generateValidateCodeApi()
        } finally {
          loading.value = false
        }
      }
    })
  }

  /**
   * 获取验证码
   */
  const generateValidateCodeApi = async () => {
    const res = await generateValidateCode()
    console.log('res', res)
    validateCodeImg.value = res.data.codeValue
    form.validateCodeKey = res.data.codeKey
    form.validateCodeValue = ''
  }

  const refreshValidateCode = async () => {
    await generateValidateCodeApi()
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

  onMounted(async () => {
    //绑定监听事件
    window.addEventListener('keydown', handleKeyup)
    await generateValidateCodeApi()
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

  .captcha-row {
    display: flex;
    align-items: center;
    width: 100%;
  }

  .captcha-input {
    flex: 1;
  }

  .captcha-img {
    width: 130px;
    height: 38px;
    margin-left: 12px;
    cursor: pointer;
    border-radius: 4px;
    border: 1px solid var(--el-border-color);
  }
</style>
