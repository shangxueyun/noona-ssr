/**
 * 媒资模块
 */

const state = () => ({
  // query params
  userId: '', // 媒资ID
  // response
  userInfo: {} // 用户信息
})

const actions = {
  async nuxtServerInit ({ commit }, { route }) {
    let { uId, userId, uid } = route.query
    userId = uId || userId || uid
    commit('SET_USERID', userId)
  },
  async getUserInfo ({ commit, state }) {
    // console.log('context=>', context)
    const { data } = await this.$axios.$post(`/v1/user/info`, { userId: state.userId })
    // commit('SET_MEDIAINFO', data)
    return data
  },
  async getUserVideoList ({ commit, state }) {
    // console.log('context=>', context)
    const { data } = await this.$axios.$post(`/v1/user/videos`, { userId: state.userId, pageToken: '', size: 6 })
    // commit('SET_MEDIAINFOS', data)
    return data
  },
  async getUserLikesList ({ commit, state }) {
    // console.log('context=>', context)
    const { data } = await this.$axios.$post(`/v1/favorite/video/list`, { userId: state.userId, pageToken: '', size: 6 })
    // commit('SET_MEDIAINFOS', data)
    return data
  }
}

const mutations = {
  // 设置媒资ID
  SET_USERID (state, data) {
    state.userId = data
  }
}

export default {
  state,
  actions,
  mutations
}
