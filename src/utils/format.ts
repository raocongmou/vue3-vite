class Format {
  /**
   * 通过时间获取登录消息提示语
   */
  public static getLoginMessageByTime(): string {
    let message = ''
    const time = Number(new Date().getHours())
    if (5 <= time && time <= 8) {
      message = '早上'
    } else if (0 <= time && time < 5) {
      message = '傍晚'
    } else if (8 < time && time <= 12) {
      message = '上午'
    } else if (12 < time && 16 <= time) {
      message = '下午'
    } else message = '晚上'
    return message
  }
}

export default Format
