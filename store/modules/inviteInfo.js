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
  async getUserInviteInfo ({ commit, state }) {
    // console.log('context=>', context)
    const { data } = await this.$axios.$post(`/v1/new/user/invite`, { userId: state.userId })
    // commit('SET_MEDIAINFO', data)
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
