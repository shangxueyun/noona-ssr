<template>
  <div ref="mainContainer" class="main-container">
    <div ref="newsContainer" class="news-container">
      <div ref="newsDescContainer" class="news-container-desc">
        <div class="title" :class="fSizeClass">
          {{ mediaInfo.basic.title }}
        </div>
        <div ref="authorContainer" class="author">
          <section @click="jumpUserPage">
            <span :data-src="mediaInfo.user.userIcon"><img class="lazy" src="~/assets/images/common/default.png" data-type="avatar" :data-src="mediaInfo.user.userIcon"></span>
            <span><strong>{{ mediaInfo.user.nickName }}</strong><em>{{ mediaInfo.basic.addTime | formatAddTime }}</em></span>
          </section>
          <button :class="{followed: fStatus}" @click="getNativeFollow">
            {{ fStatus ? langs.media.news.followedBtn : langs.media.news.followBtn }}
          </button>
        </div>
      </div>
      <news-content :lang="langs" :media-info="mediaInfo" :font-size="fSizeClass" :is-native="true" @newsContainerHeight="setNewsContainerHeight" />
      <div ref="hackAndroidContainer" class="hack-android">
        <img src="~/assets/images/common/default.png">
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import newsContent from '~/components/media/news-content'
// import Api from '~/server/api/common'
import * as Utils from '~/utils'
import Native from '~/plugins/native'
import defaultAvatar from '~/assets/images/common/default-avatar@3x.png'
export default {
  name: 'NewsparkMediaNews',
  components: { newsContent },
  data () {
    return {
      bodyHeight: 0,
      newsContainerHeight: 0
    }
  },
  // metaInfo: {
  //   title: 'metaTitle'
  // },
  computed: {
    ...mapState({
      // common
      icoUrl: state => state.common.icoUrl,
      lang: state => state.common.lang,
      pName: state => state.common.pName,
      langs: state => state.common.langs,
      meta: state => state.common.meta,
      webUrl: state => state.common.webUrl,

      // 资讯相关
      mId: state => state.mediaInfo.mId,
      fSizeClass: state => state.mediaInfo.fSizeClass,
      fStatus: state => state.mediaInfo.fStatus,
      screenWidth: state => state.mediaInfo.screenWidth
    })
  },
  async asyncData ({ store, route, req, error }) {
    const wsWidth = store.state.mediaInfo.screenWidth
    let videos = []
    let mediaInfo = {}
    await store.dispatch('getMediaInfo').then((resData) => {
      mediaInfo = (resData && resData.media) || {}
    })
    if (mediaInfo && mediaInfo.type == 'news') {
      let videoIds = mediaInfo.basic.embedVideoIds
      if (videoIds && videoIds.length > 0) {
        await store.dispatch('getMediaInfos', { videoIds }).then((res) => {
          videos = (res.data && res.data.medias) || []
        })
      }
      let covers = mediaInfo.cover || []
      let coversLength = (covers && covers.length) || 0
      let content = (mediaInfo.basic && mediaInfo.basic.content) || ''
      let metaTitle = mediaInfo.basic.title
      // store.commit('SER_META', { title: metaTitle })
      // 图文转资讯
      if (!content && coversLength > 0) {
        for (let key in covers) {
          let index = ((covers[key][4] && covers[key][4].sortId) || covers[key][1].sortId || (parseInt(key) + 1))
          content += '<!--' + 'IMG_' + index + '-->'
        }
      }
      // 格式化资讯内容
      mediaInfo.content = Utils.getFormatNewsContent(content, covers, videos, wsWidth)

      return { metaTitle, mediaInfo }
      // store.commit('SET_MEDIAINFO', mediaInfo)
    } else {
      error({ statusCode: 404, message: 'mediaInfo is null' })
    }
  },
  head () {
    return {
      title: this.metaTitle,
      meta: [
        ...this.meta,
        { property: 'og:title', content: this.metaTitle },
        // { property: 'og:image', content: data.image },
        // { property: 'og:image:width', content: data.imagewidth },
        // { property: 'og:image:height', content: data.imageheight },
        { itemprop: 'name', content: this.metaTitle },
        // { itemprop: 'image', content: data.image }

        // twitter
        { name: 'twitter:title', content: this.metaTitle }
        // { name: 'twitter:image:src', content: data.image },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: this.icoUrl }
      ]
    }
  },
  mounted () {
    const _self = this
    // console.log('content=>', this.mediaInfo)
    // 首次加载设置滚动高度
    _self.setNativeScrollHeight(1)

    // 客户端关注/字体设置
    Native.setH5ActionStatus(({ clientParams, clientCallback }) => {
      if (clientParams && clientParams.type) {
        const type = parseInt(clientParams.type)
        switch (type) {
          case 1:
            const fStatus = clientParams.status
            this.$store.commit('SET_FOLLOWSTATUS', fStatus)
            const callbackParams = { code: 200, msg: 'success', data: { fStatus } }
            clientCallback(callbackParams)
            break
          case 2:
            let fClass
            const fSize = clientParams.fontSize
            if (fSize == '2') {
              fClass = 'large'
            } else if (fSize == '3') {
              fClass = 'oversized'
            } else if (fSize == '4') {
              fClass = 'tiny'
            } else if (fSize == '5') {
              fClass = 'small'
            } else {
              fClass = 'normal'
            }
            this.$store.commit('SET_FONTSIZECLASS', fClass)
            // 改变字体大小重置滚动高度
            this.setNativeScrollHeight(2)
            this.$nextTick(() => {
              const bodyHeight = this.getContentHeight(3)
              const callbackParams = { code: 200, msg: 'success', data: { bodyHeight } }
              clientCallback(callbackParams)
            })
            break
          case 3:
            const mediaId = clientParams.mediaId || ''
            this.setVideoPauseStatus(mediaId)
            break
          default:
            break
        }
      }
    }, true)
    // 图片预加载
    document.querySelectorAll('img.lazy').forEach(function (el) {
      const src = el.getAttribute('data-src')
      _self.preloadImage(src).then(() => {
        el.setAttribute('src', src)
      }).catch(() => {
        // console.log(err)
        if (el.getAttribute('data-type') == 'avatar') {
          el.setAttribute('src', defaultAvatar)
        }
      })
    })
  },
  methods: {
    // 图片预加载
    preloadImage (src) {
      return new Promise(function (resolve, reject) {
        const image = new Image()
        image.onload = resolve
        image.onerror = reject
        image.src = src
      })
    },
    // sendLog (params) {
    //   const logParams = {
    //     type: 'noonaJsLog',
    //     mode: 'prod',
    //     app: 'noona',
    //     pages: 'news',
    //     action: 'getContentHeight',
    //     h5: params // {api: {errType, errMsg, errContent, errLine}, h5:{errType, errMsg, errContent, errLine}, client: {code, msg, data}}
    //   }
    //   return this.$axios.$post('https://syslog.hbahei.com/jslog', logParams)
    // },
    // 资讯详情高度
    getContentHeight (from) {
      const bodyHeight = document.body.clientHeight || document.documentElement.clientHeight
      const mainHeight = this.$refs.mainContainer.offsetHeight
      const newsHeight = this.$refs.newsContainer.offsetHeight
      const newsDescHeight = this.$refs.newsDescContainer.offsetHeight
      const newsContainerHeight = this.newsContainerHeight
      const hackAndroidContainerHeight = this.$refs.hackAndroidContainer.offsetHeight

      if (newsHeight <= 0) {
        this.$store.dispatch('logCollect', {
          mediaId: this.mediaInfo.mediaId,
          title: this.metaTitle,
          url: this.webUrl,
          from,
          bodyHeight,
          mainHeight,
          newsHeight,
          newsDescHeight,
          newsContainerHeight,
          hackAndroidContainerHeight
        })
      }

      return newsHeight + hackAndroidContainerHeight
    },
    setNewsContainerHeight (height) {
      this.newsContainerHeight = height
    },
    // 设置客户端滑动高度
    setNativeScrollHeight (from) {
      this.$nextTick(() => {
        const bodyHeight = this.getContentHeight(from)
        const scrollTop = this.$refs.authorContainer.offsetHeight + this.$refs.authorContainer.offsetTop
        const params = {
          type: 2,
          data: {
            scrollTop,
            bodyHeight
          }
        }
        Native.setNativeActionStatus(params).then((res) => {})
      })
    },
    setVideoPauseStatus (mediaId) {
      const content = this.mediaInfo.content
      const contentLength = (content && content.length) || 0
      if (contentLength > 0) {
        for (const key in content) {
          if (content[key] && content[key].type == 'video') {
            const otherVideoDom = document.querySelector('video.video' + content[key].mediaId)
            // console.log('otherVideoDom=>', otherVideoDom)
            // 暂停播放
            if (otherVideoDom && !otherVideoDom.paused) {
              otherVideoDom.pause()
              content[key].playStatus = 5
            } else {
              content[key].playStatus = 1
            }
          }
        }
        this.mediaInfo.content = content
      }
    },
    // 关注
    getNativeFollow () {
      const status = !this.$store.state.mediaInfo.fStatus
      const params = {
        type: 1,
        data: {
          status
        }
      }
      Native.setNativeActionStatus(params).then((res) => {})
    },
    // 用户主页
    jumpUserPage () {
      const url = `newspark://web/u?uid=${this.mediaInfo.user.userId}&from=in`
      Native.setJumpUrl({ url })
    }
  }
}
</script>

<style lang="scss">
.hack-android {
  display: flex;
  visibility: hidden;
}
// 媒资信息
.news-container {
  // position: relative;
  display: flex;
  flex-flow: column;
  padding: 15px;
  // height: 100%;
  // min-height: 100vh;
  &-desc {
    .title {
      // clear:both;
      font-family: PingFangSC-Medium;
      font-size: 23px;
      color: #343445;
      line-height: 1.5;
      font-weight: bold;
      // word-break: break-all;
      word-break: keep-all;
      word-wrap: break-word;
      // text-align: justify;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 4;
      &.tiny {
        font-size: 19px;
      }
      &.small {
        font-size: 21px;
      }
      &.large {
        font-size: 25px;
      }
      &.oversized {
        font-size: 27px;
      }
    }
    .author {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      padding-top: 20px;
      section {
        display: inline-flex;
        span {
          display: inline-flex;
          &:first-of-type {
            width: 36px;
            height: 36px;
            background: #F3F4F5;
            border-radius: 100%;
            overflow: hidden;
            img {
              width: 36px;
              height: 36px;
              border-radius: 100%;
              vertical-align: middle;
            }
          }
          &:last-of-type {
            flex-direction: column;
            justify-content: center;
            margin-left: 8px;
            strong {
              font-family: PingFangSC-Regular;
              font-size: 14px;
              color: #3B424C;
              font-weight: 500;
              margin-bottom: 2px;
              width: 170px;
              word-break: break-all;
              overflow: hidden;
              text-overflow: ellipsis;
              display: -webkit-box;
              -webkit-box-orient: vertical;
              -webkit-line-clamp: 1;
            }
            em {
              font-family: PingFangSC-Regular;
              font-size: 11px;
              color: #A2A3A5;
            }
          }
        }
      }
      button {
        position: relative;
        padding: 5px 17px;
        // font-family: PingFangSC-Regular;
        font-size: 14px;
        color: #FFFFFF;
        text-align: center;
        border-radius: 100px;
        // background-image: linear-gradient(-135deg, #FD8350 0%, #FA2764 100%);
        background-image: linear-gradient(-135deg, #FA2764 0%, #FD8350 100%);
        cursor: pointer;
        border: none;
        display: block;
        white-space: nowrap;
        &.followed {
          border: 1px solid #DDD;
          background: #FFF;
          color: #9999A1;
        }
      }
    }
  }
}
</style>
