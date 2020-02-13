/**
 * 公共模块
 */
// import cookies from 'js-cookie'

const state = () => ({
  icoUrl: '//s.noonaapps.com/ssr/static/images/common/favicon.ico',
  lang: 'en',
  pn: 'com.newspark.mobile', // 包名
  pName: 'noona', // 包名
  langs: {}, // 语言包
  region: 'en', // 地区
  webUrl: '',
  meta: []
})

const actions = {
  async nuxtServerInit ({ commit }, { route, req, res }) {
    let { lang, pn } = route.query
    let pName = 'noona'
    lang = lang || 'en'
    pn = pn || 'com.newspark.mobile'
    // 全局语言包
    const langRes = await this.$axios.$get(`http://${process.env.HOST || 'localhost'}:${process.env.PORT || 3000}/lang/${lang}.json`)
    commit('SET_LANGS', langRes.data)
    // 设置meta info
    const metaUrl = req.protocol + '://' + req.headers.host + req.originalUrl
    commit('SER_META', metaUrl)
    // 路径
    commit('SET_HREFURL', req.protocol + '://' + req.headers.host)

    commit('SET_LANG', lang)
    commit('SET_PNAME', pName)
    commit('SET_PN', pn)

    // 全局地区
    let regionData
    let cookies = []
    const headersCookie = (req.headers && req.headers.cookie) || ''
    if (headersCookie) {
      if (headersCookie.indexOf(';') > -1) {
        headersCookie.split(';').forEach(cookie => {
          if (cookie.indexOf('=') > -1) {
            let parts = cookie.split('=')
            cookies[parts[0].trim()] = (parts[1] || '').trim()
          }
        })
      } else if (headersCookie.indexOf('=') > -1) {
        let parts = headersCookie.split('=')
        cookies[parts[0].trim()] = (parts[1] || '').trim()
      }
    }
    if (cookies['region']) {
      regionData = cookies['region']
    } else {
      const regionRes = await this.$axios.$post(`/v1/config/startUp`, {})
      regionData = regionRes.data && (regionRes.data.region || regionRes.data.df)
      // 设置cookie
      res.setHeader('Set-Cookie', 'region=' + regionData + ';')
    }
    commit('SET_REGION', regionData)
  },
  async logCollect ({ commit, state }, params) {
    const logParams = {
      type: 'noonaJsLog',
      mode: process.env.NODE_ENV === 'production' ? 'pro' : 'dev',
      app: 'noona',
      pages: 'news',
      action: 'getContentHeight',
      h5: params // {api: {errType, errMsg, errContent, errLine}, h5:{errType, errMsg, errContent, errLine}, client: {code, msg, data}}
    }
    return this.$axios.$post('https://syslog.hbahei.com/jslog', logParams)
  }
}

const mutations = {
  // 设置语言参数
  SET_LANG (state, data) {
    state.lang = data
  },
  // 设置包名
  SET_PNAME (state, data) {
    state.pName = data
  },
  SET_PN (state, data) {
    state.pn = data
  },
  // 设置语言包
  SET_LANGS (state, data) {
    state.langs = data
  },
  // 设置地区
  SET_REGION (state, data) {
    state.region = data
  },
  // 路径
  SET_HREFURL (state, data) {
    state.hrefURL = data
  },
  SER_META (state, metaUrl) {
    const data = state.langs
    state.webUrl = metaUrl
    state.meta = [
      { name: 'keywords', content: data.seo.keywords },
      // { name: 'description', content: data.seo.description },
      // fackbook
      { property: 'fb:app_id', content: '680630372383411' },
      // { property: 'og:description', content: data.seo.description },
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: metaUrl }
      // { property: 'og:title', content: data.title },
      // { property: 'og:image', content: data.image },
      // { property: 'og:image:width', content: data.imagewidth },
      // { property: 'og:image:height', content: data.imageheight },
      // { itemprop: 'name', content: data.title },
      // { itemprop: 'image', content: data.image },
      // { itemprop: 'description', content: data.seo.description },
      // twitter
      // { name: 'twitter:title', content: data.title },
      // { name: 'twitter:image:src', content: data.image },
      // { name: 'twitter:description', content: data.seo.description }
    ]
  }
}

export default {
  state,
  actions,
  mutations
}
