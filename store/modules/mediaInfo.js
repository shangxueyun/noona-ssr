/**
 * 媒资模块
 */

const state = () => ({
  // query params
  mId: '', // 媒资ID
  fSize: '1', // 字体大小 ('1': 'normal', '2': 'large', '3': 'oversized', '4': 'tiny', '5': 'small')
  fSizeClass: 'normal',
  fStatus: 0, // 关注状态
  screenWidth: 375, // 屏幕宽度
  // response
  mediaInfo: {}, // 媒资信息
  mediaInfos: {} // 媒资信息
})

const actions = {
  async nuxtServerInit ({ commit }, { route }) {
    let { mId, mid, fSize, fStatus, w } = route.query
    mId = mId || mid
    // pn = (pn || 'com.newspark.mobile').toLowerCase()
    let screenWidth = w || 375
    let fontSizes = {
      '1': 'normal',
      '2': 'large',
      '3': 'oversized',
      '4': 'tiny',
      '5': 'small'
    }
    commit('SET_MID', mId)
    commit('SET_SCREENWIDTH', screenWidth)
    commit('SET_FOLLOWSTATUS', !!parseInt(fStatus))
    // commit('SET_FONTSIZE', fSize)
    commit('SET_FONTSIZECLASS', fontSizes[fSize])
  },
  async getMediaInfo ({ commit, state, rootState }) {
    const region = rootState.common.region
    const videoId = state.mId
    // console.log('context=>', context)
    const { data } = await this.$axios.$post(`/v1/video/info`, { region, videoId })
    // commit('SET_MEDIAINFO', data)
    return data
  },
  async getMediaInfos ({ commit, rootState }, videoIds) {
    const region = rootState.common.region
    // console.log('context=>', context)
    const { data } = await this.$axios.$post(`/v1/video/infos`, { region, videoIds })
    // commit('SET_MEDIAINFOS', data)
    return data
  },
  async getRecommendMediaList ({ commit, state }) {
    const videoId = state.mId
    const { data } = await this.$axios.$post('/v1/recommend/aboutMedia', { videoId, navId: '1', mediaType: 'info', custom: 1, count: 6 })
    return data
  }
}

const mutations = {
  // 设置媒资ID
  SET_MID (state, data) {
    state.mId = data
  },
  // 设置屏幕宽度
  SET_SCREENWIDTH (state, data) {
    state.screenWidth = data
  },
  // 设置关注状态
  SET_FOLLOWSTATUS (state, data) {
    state.fStatus = data
  },
  // 设置字体大小样式
  SET_FONTSIZECLASS (state, data) {
    state.fSizeClass = data
  },
  // 设置媒资信息
  SET_MEDIAINFO (state, data) {
    state.mediaInfo = data
  },
  SET_MEDIAINFOS (state, data) {
    state.mediaInfos = data
  }
}

export default {
  state,
  actions,
  mutations
}
