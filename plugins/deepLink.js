import Detect from '~/plugins/detect'
// import DownloadLink from './downloadLink'
import * as Utils from '~/utils'

/**
 * 端外落地页唤起及下载APP
 *
 * @class DeppLink
 */
class DeppLink {
  /**
   * 创建iframe
   *
   * @returns
   * @memberof DeppLink
   */
  createIframe () {
    let iframe = document.createElement('iframe')
    iframe.style.display = 'none'
    document.body.appendChild(iframe)
    return iframe
  }

  /**
   * 唤起已安装客户端
   *
   * @param {*} url sechma协议
   * @param {*} pn 包名
   * @memberof DeppLink
   */
  callInstalledApp (params) {
    const iframe = this.createIframe()
    if (!Utils.isEmptyObj(iframe) && Detect.os.android) {
      iframe.src = params.schemeUrl
    } else {
      window.location.href = params.schemeUrl
    }
    // 3000毫秒没有唤醒则跳转至相关渠道进行下载
    setTimeout(() => {
      this.downloadApp(params.pName)
    }, 3000)
  }

  /**
   * 唤起已安装客户端
   *
   * @param {*} url
   * @memberof DeppLink
   */
  callApp (url) {
    let iframe = this.createIframe()
    // let scheme = Detect.os.ios ? 'sparknews' : 'newspark'
    // url = url.replace('{scheme}', scheme)
    if (!Utils.isEmptyObj(iframe) && Detect.os.android) {
      iframe.src = url
    } else {
      window.location.href = url
    }
    // 600毫秒没有唤醒则跳转至相关渠道进行下载
    setTimeout(() => {
      this.downloadApp()
    }, 600)
  }

  /**
   * 下载客户端
   *
   * @param {*} url
   * @memberof DeppLink
   */
  downloadApp () {
    if (Detect.os.ios) {
      window.location.href = 'https://itunes.apple.com/ph/app/id1446000206?l=zh&ls=1&mt=8'
    } else {
      window.location.href = 'https://play.google.com/store/apps/details?id=com.newspark.mobile'
    }
  }
}

export default new DeppLink()
