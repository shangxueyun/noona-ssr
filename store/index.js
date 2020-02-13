// import Vue from 'vue'
// import Vuex from 'vuex'
// import mutations from './mutations'
// import actions from './actions'
import common from './modules/common'
import mediaInfo from './modules/mediaInfo'
import userInfo from './modules/userInfo'
import inviteInfo from './modules/inviteInfo'
import treasureInfo from './modules/treasureInfo'

// Vue.use(Vuex)

// const store = () => new Vuex.Store({
//   modules: {
//     common,
//     mediaInfo
//   }
// })

// export default store

export const modules = {
  common,
  mediaInfo,
  userInfo,
  inviteInfo,
  treasureInfo
}
