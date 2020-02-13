import JSBridge from '~/plugins/JSBridge'
import * as Utils from '~/utils'
/**
 * H5<=>Native交互
 *
 * @class Native
 * @extends {JSBridge}
 */
class Native extends JSBridge {
  /**
   * Creates an instance of JSBridge.
   * @memberof JSBridge
   */
  constructor () {
    super()
    // this.init()
    const methods = {}
    const callMethods = this.callMethods()
    Object.keys(callMethods).forEach((item) => {
      methods[item] = (h5Params = {}) => {
        return this.promiseCallMethods(callMethods[item], h5Params)
      }
    })
    methods.getNativePublicParams = this.getNativePublicParams.bind(this)

    const registerMethods = this.registerMethods()
    Object.keys(registerMethods).forEach((item) => {
      methods[item] = (h5callback, isReturn = false) => {
        this.promiseRegisterMethods(registerMethods[item], h5callback, isReturn)
      }
    })

    // methods.init = this.init()

    // schema协议
    methods.schemaMethods = this.schemaMethods()
    // 移除方法
    methods.removeHandler = this.removeHandler.bind(this)

    return methods
  }
  /**
   * 获取客户端公共参数
   *
   * @returns
   * @memberof Native
   */
  getNativePublicParams () {
    let _self = this
    return new Promise(function (resolve, reject) {
      let nativePublicParams = {
        _token: Utils.getQueryString('token') || '',
        _udid: Utils.getQueryString('udid') || ''
      }
      _self.promiseCallMethods('getNativePublicParams').then((res) => {
        if (res && res.code == '200') {
          nativePublicParams = typeof res.data === 'object' ? res.data : JSON.parse(res.data)
        }
        resolve(nativePublicParams)
      }).catch(() => {
        resolve(nativePublicParams)
      })
    })
  }

  /**
   * 注册客户端回调
   *
   * @param {*} name
   * @memberof Native
   */
  promiseRegisterMethods (name, h5callback, isReturn) {
    console.log('registerHandler-params-' + name, h5callback, isReturn)
    this.registerHandler(name, (clientParams = {}, clientCallback = () => {}) => {
      console.log('registerHandler-res-' + name, clientParams, clientCallback)
      clientParams = (typeof clientParams === 'object') ? clientParams : JSON.parse(clientParams)
      const defaultBack = { code: 200, msg: 'success', data: { handled: false } }
      // 是否开启自定义返回值
      const callbackParams = { clientParams, clientCallback: () => {} }
      if (!isReturn && typeof clientCallback === 'function') {
        clientCallback(defaultBack)
      } else {
        callbackParams.clientCallback = clientCallback
      }
      console.log('h5callback=>', callbackParams)
      typeof h5callback === 'function' && h5callback(callbackParams)
    })
  }

  /**
   * h5调用客户端
   *
   * @param {*} name
   * @param {*} [params={}]
   * @returns
   * @memberof Native
   */
  promiseCallMethods (name, h5Params = {}) {
    return new Promise((resolve, reject) => {
      let result = {}
      if (!Utils.isInside()) {
        result.code = '403'
        reject(result)
      }
      try {
        console.log('callHandler-params-' + name, h5Params)
        this.callHandler(name, h5Params, (res) => {
          try {
            result = typeof res === 'object' ? res : JSON.parse(res)
          } catch (error) {
            console.log('callHandler-res-json-' + name, res, error)
          }
          console.log('callHandler-res-' + name, result)
          resolve(result)
        })
      } catch (error) {
        result.code = '404'
        reject(result)
      }
    }).catch((error) => {
      Utils.log(name + '-error=>', error)
      switch (error.code) {
        case '403':
          Utils.toast({ message: 'Please open it on the app client.' })
          // Utils.toast({message: '请在Seely客户端打开'})
          break
        case '404':
          Utils.toast({ message: 'Please download the latest version of the app client to open.' })
          // Utils.toast({message: '请下载最新版Seely客户端打开'})
          break
        default:
          break
      }
      if (name === 'setJumpUrl') {
        setTimeout(() => {
          window.location.href = h5Params.url
        }, 1000)
      }
    })
  }
  /**
   * H5调用客户端方法
   * @method
   */
  callMethods () {
    return {
      /**
       * 系统相关
       * @return
       */
      // getNativePublicParams: 'getNativePublicParams', // 获取客户端公共参数
      /**
       * @name 设置页面链接跳转
       * @param {url}
       * @description eg: url: http://bbobo.com
       */
      setJumpUrl: 'setJumpUrl',
      /**
       * @param {title}
       * @description
       * title: '标题'
       */
      setNativeTitle: 'setNativeTitle', // 设置客户端标题
      /**
       * @name 设置标题栏右上角(分享或链接)
       * @param {options}
       * @description
       */
      setNativeSubtitle: 'setNativeSubtitle',
      /**
       * @name 调起客户端升级面板
       * @param {}
       * @description
       */
      callUpgradePanel: 'callUpgradePanel',
      /**
       * @name 调起客户端分享面板
       * @param {title, desc, iconUrl, webUrl, from, way, style, imgUrl}
       * @description
       * title: '分享的标题'
       * desc: '分享的描述'
       * iconUrl: 'H5 分享的小图标 URL'
       * imgUrl： 'img 分享的大图片URL'
       * from: '7：收徒分享面板_h5 8 : 唤醒分享面板_h5 9:炫耀分享面板_h5 32：连续收徒分享，33：连续收徒分享唤醒'
       * way: 1:微信好友，2:微信朋友圈 3:qq好友,4:qq空间,5:邮件 6：短信,7：新浪微博 8：系统分享，默认-1即调起面板
       * style： h5(卡片), img(纯图片), text(文本)，默认h5
       * webUrl：分享跳转地址
       */
      callSharePanel: 'callSharePanel',
      /**
       * @type 调起客户端模块/组件/面板
       */
      /**
       * @name 调起客户端登录模块
       * @param {from}
       * @description  from: 来源
       */
      callLoginModule: 'callLoginModule',
      /**
       * @type 资讯详情
       */
      /**
       * @name 设置客户端状态
       * @param {type, data}
       * @description  type 1关注 2标题 3图集 data(status true关注 false取消关注),data(scrollTop),data(list, index)
       */
      setNativeActionStatus: 'setNativeActionStatus',
      /**
       * @type
       */
      /**
       * @name 获取客户端日志投递
       * @param {eventId, params}
       * @description  eventId 事件名称 params 参数
       */
      getNativeLogCollect: 'getNativeLogCollect'
    }
  }
  /**
   * 注册客户端回调方法
   * @method
   */
  registerMethods () {
    return {
      /**
       * @name 重载⻚面
       * @param {}
       * @description
       */
      cbReloadPage: 'cbReloadPage',
      /**
       * @name 客户端操作(1左上角关闭按钮2返回键)
       * @param {type}
       * @description
       */
      cbNativeAction: 'cbNativeAction',
      /**
       * @name 客户端操作(绑定邀请码))
       * @param {type}
       * @description
       */
      cbH5DialogPanel: 'cbH5DialogPanel',
      /**
       * @name 设置h5状态
       * @param {type, data}
       * @description type1关注 2字体,data(status true关注 false取消关注),data(size 1,2,3)
       */
      setH5ActionStatus: 'setH5ActionStatus'
    }
  }
  /**
   * schema协议跳转
   * @method
   */
  schemaMethods () {
    return {
      /**
       * @name 唤起客户端首页
       * @param {}
       * @description
       */
      home: 'seely://seely.web/',
      /**
       * @name 唤起客户端用户页
       * @param {}
       * @description
       */
      user (userId) {
        return `seely://seely.web/u?uid=${userId}`
      },
      /**
       * @name 唤起客户端视频页
       * @param {}
       * @description
       */
      video (videoId) {
        return `seely://seely.web/v?vid=${videoId}`
      },
      /**
       * @name 唤起newspark客户端用户页
       * @param {}
       * @description
       */
      nUser () {
        return `newspark://web/u?uid={uid}&from={from}`
      }
    }
  }
}

export default new Native()
