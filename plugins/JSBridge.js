import Detect from '~/plugins/detect'
/**
 *
 *
 * @export
 * @class JSBridge
 */
export default class JSBridge {
  /**
   * JSBridge初始化
   *
   * @param {*} callback
   * @returns
   * @memberof JSBridge
   */
  init (callback) {
    if (process.server) return
    if (Detect.os.android) {
      if (window.WebViewJavascriptBridge) {
        callback(WebViewJavascriptBridge)
      } else {
        document.addEventListener('WebViewJavascriptBridgeReady', function () {
          callback(WebViewJavascriptBridge)
        }, false)
      }
    } else if (Detect.os.ios) {
      if (window.WebViewJavascriptBridge) {
        return callback(WebViewJavascriptBridge)
      }
      if (window.WVJBCallbacks) {
        return window.WVJBCallbacks.push(callback)
      }
      window.WVJBCallbacks = [callback]
      const WVJBIframe = document.createElement('iframe')
      WVJBIframe.style.display = 'none'
      WVJBIframe.src = 'https://__bridge_loaded__'
      document.documentElement.appendChild(WVJBIframe)
      setTimeout(function () {
        document.documentElement.removeChild(WVJBIframe)
      }, 0)
    }
  }
  /**
   * native调用js
   *
   * @param {*} name
   * @param {*} callback
   * @memberof JSBridge
   */
  registerHandler (name, callback) {
    this.init(function (bridge) {
      bridge.registerHandler(name, callback)
    })
  }
  /**
   * 移除js已注册方法
   *
   * @param {*} name
   * @param {*} params
   * @param {*} callback
   * @memberof JSBridge
   */
  removeHandler (name) {
    this.init(function (bridge) {
      bridge.removeHandler && bridge.removeHandler(name)
    })
  }
  /**
   * js调用native
   *
   * @param {*} name
   * @param {*} params
   * @param {*} callback
   * @memberof JSBridge
   */
  callHandler (name, params, callback) {
    this.init(function (bridge) {
      bridge.callHandler(name, params, callback)
    })
  }
}
