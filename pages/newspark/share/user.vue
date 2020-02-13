<template>
  <div class="container">
    <div v-if="userInfo && userInfo.userId" class="main-container">
      <!-- 顶部banner -->
      <div class="banner-container">
        <page-banner :lang="langs" :p-name="pName" :is-top="true" @bannerClick="logEvent" />
      </div>
      <!-- 用户信息 -->
      <user-info :user-info="userInfo" :lang="langs" @userClick="logEvent" />
      <!-- 用户作品&喜欢feed -->
      <user-feed-list :user-info="userInfo" :lang="langs" :user-video-list="userVideoList" :user-likes-list="userLikesList" @userFeedClick="logEvent" />
    </div>
    <div v-else class="main-container">
      <!-- loading 重试 -->
      <page-loading :lang="langs" :p-name="pName" :is-loading-status="loadingStatus" @loadingClick="logEvent" />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { pageLoading, pageBanner } from '~/components/load'
import userInfo from '~/components/media/user-info'
import userFeedList from '~/components/media/user-feed-list'
import Log from '~/plugins/log'
import defaultAvatar from '~/assets/images/common/default-avatar@3x.png'
export default {
  name: 'NewsparkShareUser',
  components: {
    pageLoading,
    pageBanner,
    userInfo,
    userFeedList
  },
  data () {
    return {
      userInfo: {}, // 用户信息
      userVideoList: [], // 用户视频列表
      userLikesList: [], // 用户喜欢列表
      loadingStatus: 1 // 加载状态1加载中，2加载失败，3加载数据为空，4删除，5审核
    }
  },
  computed: {
    ...mapState({
      // common
      icoUrl: state => state.common.icoUrl,
      lang: state => state.common.lang,
      pName: state => state.common.pName,
      langs: state => state.common.langs,
      meta: state => state.common.meta,

      // 用户信息
      userId: state => state.userInfo.userId
    })
  },
  async asyncData ({ store, route, req, error }) {
    let userInfo = {}
    let userVideoList = []
    let userLikesList = []
    let loadingStatus = 1
    let metaInfo = {
      title: store.state.common.langs.seo.title
    }
    // 用户基本信息
    await store.dispatch('getUserInfo').then((resData) => {
      userInfo = (resData && resData.user) || {}
      if (userInfo && userInfo.userId) {
        userInfo.basic.userIcon = userInfo.basic.userIcon || defaultAvatar
        metaInfo.title = userInfo.basic.nickName
        metaInfo.image = userInfo.basic.userIcon || defaultAvatar
        // if (covers && covers.length > 0) {
        //   metaInfo.image = covers[0][1].url
        //   metaInfo.imagewidth = covers[0][1].width
        //   metaInfo.imageheight = covers[0][1].height
        // }
      } else {
        loadingStatus = 3
      }
    })
    // 用户作品列表
    await store.dispatch('getUserVideoList').then((resData) => {
      userVideoList = (resData && resData.videos) || []
      // 初始化视频播放状态
      const userVideoListLen = (userVideoList && userVideoList.length) || 0
      if (userVideoListLen) {
        for (let index = 0; index < userVideoList.length; index++) {
          userVideoList[index].playStatus = 1
        }
      }
    })
    // 用户喜欢列表
    await store.dispatch('getUserLikesList').then((resData) => {
      userLikesList = (resData && resData.videos) || []
      // 初始化视频播放状态
      const userLikesListLen = (userLikesList && userLikesList.length) || 0
      if (userLikesListLen) {
        for (let index = 0; index < userLikesList.length; index++) {
          userLikesList[index].playStatus = 1
        }
      }
    })
    return {
      loadingStatus,
      metaInfo,
      userInfo,
      userVideoList,
      userLikesList
    }
  },
  head () {
    return {
      title: this.metaInfo.title,
      meta: [
        ...this.meta,
        { name: 'description', content: this.langs.seo.description },
        // facebook
        { property: 'og:title', content: this.metaInfo.title },
        { property: 'og:description', content: this.langs.seo.description },
        { property: 'og:image', content: this.metaInfo.image },
        { property: 'og:image:width', content: this.metaInfo.imagewidth },
        { property: 'og:image:height', content: this.metaInfo.imageheight },

        { itemprop: 'name', content: this.metaInfo.title },
        { itemprop: 'image', content: this.metaInfo.image },
        { itemprop: 'description', content: this.langs.seo.description },

        // twitter
        { name: 'twitter:title', content: this.metaInfo.title },
        { name: 'twitter:image:src', content: this.metaInfo.image },
        { name: 'twitter:description', content: this.langs.seo.description }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: this.icoUrl }
      ]
    }
  },
  mounted () {
    // let _self = this
    this.logEvent('pageView')
    // 图片预加载
    document.querySelectorAll('img.lazy').forEach((el) => {
      const src = el.getAttribute('data-src')
      this.preloadImage(src).then(() => {
        el.setAttribute('src', src)
      }).catch(() => {
        if (el.getAttribute('data-type') == 'avatar') {
          el.setAttribute('src', defaultAvatar)
        }
        // console.log(err)
      })
    })
  },
  methods: {
    // 日志投递
    logEvent (key, params = {}) {
      let pName = 'newspark'
      const userId = this.userInfo.userId
      const schemeUrl = `${pName}://web/u?uid=${userId}`
      const options = {
        app: 'noonaH5',
        page: 'shareUser',
        params: { userId, schemeUrl, ...params }
      }
      Log.event({ key, ...options })
    },
    // 图片预加载
    preloadImage (src) {
      return new Promise(function (resolve, reject) {
        const image = new Image()
        image.onload = resolve
        image.onerror = reject
        image.src = src
      })
    }
  }
}
</script>

<style lang="scss">
.banner-container {
  position: relative;
  width: 100%;
  height: 60px;
}
</style>
