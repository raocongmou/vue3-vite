import { createI18n } from 'vue-i18n'

const i18n = createI18n({
  // something vue-i18n options here ...
  locale: 'zh',
  legacy: false, // you must set `false`, to use Composition API
  messages: {
    zh: {
      login: {
        username: '用户名',
        password: '密码',
        rememberPwd: '记住密码',
        login: '登录',
        forgetPwd: '忘记密码',
        personBlogManagement: '个人博客管理',
        validateCode: '验证码',
        title: '点击刷新',
        validateCodePlaceholder: '验证码',
        usernameValidate: '请输入用户名',
        passwordValidate: '请输入密码',
        validateCodeValidate: '请输入验证码',
        welcome: '欢迎回来!',
        well: '好',
        loginFailed: '登录失败!',
        validateCodeLength: '验证码长度为4!',
        error_validate_code:'验证码错误!'
      },
    },
    en: {
      login: {
        username: 'username',
        password: 'password',
        rememberPwd: 'rememberPwd',
        login: 'login',
        forgetPwd: 'forgetPwd',
        personBlogManagement: 'personBlogManagement',
        validateCode: 'validateCode',
        title: '点击刷新',
        validateCodePlaceholder: 'validate code',
        usernameValidate: 'input username',
        passwordValidate: 'input password',
        validateCodeValidate: 'input validate code',
        welcome: 'welcome back!',
        well: 'well',
        loginFailed: 'login failed!',
        validateCodeLength: 'validate code length is four!',
      },
    },
  },
  fallbackLocale: 'en',
})

export default i18n
