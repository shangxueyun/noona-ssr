import * as Utils from '~/utils'

export default function ({ $axios, route }) {
  $axios.onRequest((config) => {
    let { lang, pn } = route.query
    lang = lang || 'en'
    pn = (pn || 'com.newspark.mobile').toLowerCase()
    const headers = config.headers
    if (headers && headers.common) {
      const options = {}
      const ua = headers.common['user-agent'] || window.navigator.userAgent
      const webUrl = route.fullPath
      options.common = {}
      options.params = config.data || {}
      options.common._appLanguage = lang
      options.common._pName = pn
      options.common._aKey = ua.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/) ? 'IOS' : 'ANDROID'
      options.common._region = options.params.region || 'en'
      const reqParams = Utils.getReqParams(options)
      config.data = reqParams.data
      headers.common.sign = reqParams.sign
      headers.common.noencrypt = '1'
      headers.post['Content-Type'] = 'application/json'
      // headers.common['notsign'] = '1'

      if (process.env.NODE_ENV === 'production') {
        console.log('Access web url ' + webUrl)
        console.log('Making request to ' + config.url)
        // console.log('Making request to ' + config.url)
        // console.log('Request params ', JSON.stringify(config.data.params, null, 4))
      } else {
        console.log('---------------- Access log start ----------------')
        console.log('Access web url ' + webUrl)
        console.log('baseURL ' + config.baseURL)
        console.log('Making request to ' + config.url)
        console.log('Request params ', JSON.stringify(config.data.params, null, 4))
        console.log('---------------- Access log end   ----------------')
        console.log('')
      }
    }
    return config
  })

  $axios.onError((error) => {
    console.log('error=>', error)
    const code = parseInt(error.response && error.response.status)
    switch (code) {
      case 400:
        break
      case 401:
        break
      case 403:
        break
      case 404:
        break
      case 405:
        break
      case 408:
        break
      case 500:
        break
      case 501:
        break
      case 502:
        break
      case 503:
        break
      case 504:
        break
      case 505:
        break
      default:
        break
    }
    console.log('axios.onError=>', code)
  })

  $axios.onResponse((response) => {
    // console.log('response=>', response)
  })

  // $axios.onResponseError(err => {
  //   console.log('onResponseError=>', err)
  // })
}
