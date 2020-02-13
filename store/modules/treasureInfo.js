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
    let query = route.query
    commit('SET_PHASEId', query.phase_id)
  },
  async getphaseInfo ({ commit, state }) {
    // console.log('context=>', context)
    const { data } = await this.$axios.$post(`/v1/treasure/phaseInfo`, { phase_id: state.phaseId })
    // commit('SET_MEDIAINFO', data)
    return data
  }
}

const mutations = {
  // 设置媒资ID
  SET_PHASEId (state, data) {
    state.phaseId = data
  }
}

export default {
  state,
  actions,
  mutations
}
