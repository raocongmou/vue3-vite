class StatusConstant {
  public static readonly 401 = '登录令牌缺失，请重新登录!'
  public static readonly 403 = '当前用户没有访问权限，请联系管理员!'
  public static readonly 404 = '访问资源不存在，请联系管理员!'
  public static readonly 500 = '服务器出现异常，请联系管理员!'
  public static readonly other = '网络异常，请检查网络问题!'
}

export default StatusConstant