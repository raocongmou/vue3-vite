import logo from '@/assets/images/rcm.png'

/**
 * 全局配置
 */
class Config {
  public static readonly title = import.meta.env.VITE_APP_TITLE
  public static readonly logo = logo
}

export default Config
