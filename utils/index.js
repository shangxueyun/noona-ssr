import Toast from '~/components/toast'
import * as Uuid from './uuid'
import md5 from 'js-md5'

/**
 * toast 提示
 *
 * @export
 * @param {*} options
 */
export function toast (options) {
  Toast({
    message: options.message,
    position: options.position || '',
    className: options.className || '',
    duration: options.duration || 2000,
    iconClass: options.iconClass || '',
    topContent: options.topContent || {},
    bottomContent: options.bottomContent || {}
  })
}

/**
 * 统一错误处理
 *
 * @export
 * @param {*} e
 * @returns
 */
// export function showError (e) {
//   let msg = ''
//   if (typeof e === 'string') {
//     msg = e
//   } else {
//     msg = e.msg
//   }
//   if (!msg) return
//   Toast({
//     message: msg,
//     className: 'zindex-max'
//   })
//   return e
// }

/**
 * 获取URL参数
 *
 * @export
 * @param {*} name
 * @returns
 */
export function getQueryString (name) {
  if (process.server) return
  let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i')
  let r = window.location.search.substr(1).match(reg)

  return (r != null) ? unescape(r[2]) : ''
}

/**
 * 是否在端内
 *
 * @export
 * @returns
 */
export function isInside () {
  let ua = window.navigator.userAgent.toLowerCase()
  return ua.indexOf('yixia') > -1
}

/**
 * 获取常用的的参数
 *
 * @export
 * @param {*} [params={}]
 * @returns
 */
export function getParams (params = {}) {
  let nativePublicParams = window.nativePublicParams || {}
  let udid = nativePublicParams._udid || Uuid.getUdid() || ''
  let userId = params.userId || nativePublicParams._uId || ''
  let uid = params.uid || nativePublicParams._uId || ''
  let token = params.token || nativePublicParams._token || ''
  let options = { userId, udid, uid, token }
  let newParams = Object.assign({}, params, options)

  return newParams
}

/**
 * 日志打印
 *
 * @export
 * @param {*} options
 */
export function log (...options) {
  if (process.env.NODE_ENV !== 'production') {
    console.log(...options)
  }
}

/**
 *  是否是空对象
 *
 * @export
 * @param {*} obj
 * @returns
 */
export function isEmptyObj (obj) {
  // null and undefined are 'empty'
  if (obj == null) return true

  // Assume if it has a length property with a non-zero value
  // that that property is correct.
  if (obj.length > 0) return false
  if (obj.length === 0) return true

  // If it isn't an object at this point
  // it is empty, but it can't be anything *but* empty
  // Is it empty?  Depends on your application.
  if (typeof obj !== 'object') return true

  // Otherwise, does it have any properties of its own?
  // Note that this doesn't handle
  // toString and valueOf enumeration bugs in IE < 9
  for (var key in obj) {
    if (hasOwnProperty.call(obj, key)) return false
  }

  return true
}

/**
 * 获取语言包
 *
 * @export
 */
export function getLang (language) {
  const langLoading = {// 英语en,西班牙es,法语fr,葡语pt,日语ja,繁体-中文zh-TW,简体-中文zh-CN,泰语th,印尼语id,马来语ms,韩语ko,菲律宾fil,越南vi
    'en': 'Loading...',
    'es': 'Cargando...',
    'fr': 'Chargement...',
    'pt': 'Carregando...',
    'ja': '読み込み中...',
    'zh-TW': '加載中...',
    'zh-CN': '加载中...',
    'th': 'กำลังโหลด...',
    'id': 'Memuat...',
    'ms': 'Memuatkan...',
    'ko': '로드 중...',
    'fil': 'Loading...',
    'vi': 'Tải...'
  }
  let langPkg
  let langParam = ',' + (language || 'en') + ',' // 系统语言
  let langLibs = ',' + Object.keys(langLoading).join(',') + ','
  if (langLibs.indexOf(langParam) > -1) {
    langPkg = langParam.replace(/,/g, '')
  } else if (langParam.indexOf('-') > -1) {
    let langArr = langParam.split('-')
    let lang = langArr[0].replace(/,/g, '')
    // let area = langArr[1]
    if (langLibs.indexOf(lang) > -1) {
      langPkg = lang
    } else {
      langPkg = 'en'
    }
  } else {
    langPkg = 'en'
  }

  return {
    langPkg,
    loading: langLoading[langPkg]
  }
}

/**
 * 资讯内容格式化成数组
 *
 * @export
 * @param {*} params
 */
export function getFormatNewsContent (content, covers, videos, wsWidth = 375) {
  let contentArr = []
  let imgMaxWidth = wsWidth - 30
  if (content.match(/(<!--)[\s\S]*?(-->)/gi)) {
    contentArr = content.replace(/(<!--)[\s\S]*?(-->)/gi, '|||||$&|||||').split('|||||')
    let contentArrLen = contentArr.length
    for (let i = 0; i < contentArrLen; i++) {
      if (contentArr[i] && contentArr[i].indexOf('IMG_') > -1) {
        if (covers && covers.length > 0) {
          for (let key in covers) {
            let sourceTag = '<!--IMG_' + (covers[key][1].sortId || (parseInt(key) + 1)) + '-->'
            if (contentArr[i] == sourceTag) {
              // 根据需求把content里数据图片信息5改为1
              let imageW = covers[key][1].width || 0
              let imageH = covers[key][1].height || 0
              let src = covers[key][1].url
              if (covers[key][0]) {
                imageW = covers[key][1].width
                imageH = covers[key][1].height
                src = covers[key][1].url
              }
              let imgW = imageW < imgMaxWidth ? imageW + 'px' : '100%'
              let imgH = imageW < imgMaxWidth ? imageH + 'px' : Math.round((imageH * imgMaxWidth) / imageW) + 'px'
              contentArr[i] = {
                type: 'img',
                sourceWidth: imageW,
                sourceHeigh: imageH,
                calcWidth: imgW,
                calcHeigh: imgH,
                src,
                key
              }
              break
            }
          }
        }
      } else if (contentArr[i] && contentArr[i].indexOf('VIDEO_') > -1) {
        if (videos && videos.length > 0) {
          for (let k in videos) {
            let mediaId = videos[k]['mediaId']
            let sourceTag = '<!--VIDEO_' + mediaId + '-->'
            if (contentArr[i] == sourceTag) {
              let cover = videos[k]['cover'][0]
              let basic = videos[k]['basic']
              let playUrl = videos[k]['video']['playUrl'][0]
              let imageW = cover[1].width || 0
              let imageH = cover[1].height || 0
              let src = cover[1].url
              if (cover[4]) {
                imageW = cover[4].width
                imageH = cover[4].height
                src = cover[4].url
              }
              let imgW = imageW < imgMaxWidth ? imageW + 'px' : '100%'
              let imgH = imageW < imgMaxWidth ? imageH + 'px' : Math.round((imageH * imgMaxWidth) / imageW) + 'px'
              contentArr[i] = {
                type: 'video',
                sourceWidth: imageW,
                sourceHeigh: imageH,
                calcWidth: imgW,
                calcHeigh: imgH,
                src,
                mediaId,
                playStatus: 1, // 播放状态
                duration: basic.duration,
                url: playUrl.url,
                url2: playUrl.url2
              }
              break
            }
          }
        }
      } else {
        contentArr[i] = {
          type: 'text',
          content: contentArr[i]
        }
      }
    }
  } else {
    contentArr.push({
      type: 'text',
      content
    })
  }

  return contentArr
}

/**
 * 请求参数
 *
 * @export
 * @param {*} params
 */
export function getReqParams (options = {}) {
  let secrets = {
    'ANDROID': 'Ac$ncRR6qGg5^Pdv%4@C',
    'IOS': 'E&%D1Z!GngrXtIw&#gSn',
    'WECHAT': 'W^PdvZncRRrXtIw&#gqG'
  }
  let commonParams = {
    '_facturer': 'HUAWEI',
    '_token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOiI3MTUwMDY1NDE1MjM5ODkxOTY4IiwiYXBwSUQiOjEyLCJleHAiOjE1Mzg3OTAyOTQsImlhdCI6MTUzNjE5ODI5NH0.tw4l1fE9zFXFBV0FT2-X4338qoYfgDuCx9doBpJ8ZQ4',
    '_imei': '862538032575173',
    '_brand': 'HONOR',
    '_mac': 'd4:a1:48:ff:89:bc',
    '_appLanguage': 'zh-CN',
    '_pcId': 'norelease',
    '_dId': 'CAM-AL00',
    '_aKey': 'ANDROID',
    '_vOs': '6.0',
    '_uid': '',
    '_cpu': 'arm64-v8a',
    '_devid': 'A942CC1BB69B7A3E2F9395260356207C',
    '_uId': '7150065415239891968',
    '_vName': '1.0.0',
    '_lang': 'zh_CN',
    '_androidID': 'c521fd7e0befeffb',
    '_pgLoad': '0',
    '_pName': 'com.newspark.mobile',
    '_timezone': 'GMT+08:00_Asia Shanghai',
    '_region': 'CN',
    '_px': '720x1208',
    '_rt': '0',
    '_udid': '3BC3B86D5EFA87A14129F7E8C574EF7A',
    '_imsi': '',
    '_vApp': '5295',
    '_t': '1536200958',
    '_nId': '1',
    '_abId': ''
  }
  let common = Object.assign({}, commonParams, options.common || {})
  let data = Object.assign({}, { common }, { params: options.params || {} })
  let sign = md5(JSON.stringify(data) + secrets[common._aKey]).substr(2, 20)
  return { data, sign }
}
