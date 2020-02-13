/*
 * @Author: 欧阳威
 * @Date: 2018-04-02 14:04:34
 * @Desc: 设备检测
 * @Last Modified by: 欧阳威
 * @Last Modified time: 2018-06-12 11:26:30
 */
const detect = function () {
  if (process.server) return
  const os = {}
  const browser = {}
  const u = navigator.userAgent
  const android = u.match(/(Android);?[\s\\/]+([\d.]+)?/)
  const iPad = u.match(/(iPad).*OS\s([\d_]+)/)
  const iPod = u.match(/(iPod)(.*OS\s([\d_]+))?/)
  const iPhone = !iPad && u.match(/(iPhone\sOS)\s([\d_]+)/)
  const chrome = u.match(/Chrome\/([\d.]+)/) || u.match(/CriOS\/([\d.]+)/)

  // Android
  if (android) {
    os.android = true
    os.platform = 'Android'
    os.version = android[2]
  } else {
    os.android = false
  }
  // IOS
  if (iPad || iPhone || iPod) {
    os.ios = true
    os.platform = 'iOS'
  } else {
    os.ios = false
  }
  if (iPhone) {
    os.version = iPhone[2].replace(/_/g, '.')
    os.iPhone = true
  }
  if (iPad) {
    os.version = iPad[2].replace(/_/g, '.')
    os.iPad = true
  }
  // chrome
  if (chrome) {
    os.version = chrome[1]
    os.chrome = true
  }

  // 版本号
  os.version = parseFloat(os.version)
  // UC浏览器
  browser.ucbrowser = !!u.match(/ucbrowser/gi)
  // QQ浏览器
  browser.qqbrowser = !!u.match(/qqbrowser/gi)
  // 微信浏览器
  browser.weixin = /MicroMessenger/i.test(u)
  // 是否是端内
  browser.inside = !!u.match(/bobobrowser/gi)

  return {
    os: os,
    browser: browser
  }
}

export default detect()
