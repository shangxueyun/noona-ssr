<template>
  <div class="container">
    <div v-if="mediaInfo && mediaInfo.mediaId" class="main-container">
      <div class="banner-container">
        <!-- 顶部banner -->
        <page-banner :lang="langs" :p-name="pName" :is-top="true" @bannerClick="logEvent" />
      </div>
      <!-- 已删除 -->
      <media-status v-if="mediaInfo.basic.showLimit" :media-type="mediaInfo.type" :error-text="langs.share.common.deleteWorks" :user-info="mediaInfo.user" />
      <!-- 版权地区限制 -->
      <media-status v-else-if="mediaInfo.basic.regionLimit" :media-type="mediaInfo.type" :error-text="langs.share.common.regionLimit" :user-info="mediaInfo.user" />
      <!-- 资讯 -->
      <media-news-info v-else-if="mediaInfo.type == 'news'" :media-info="mediaInfo" :lang="langs" @newsClick="logEvent" />
      <!-- 视频 -->
      <media-video-info v-else-if="mediaInfo.type == 'video'" :media-info="mediaInfo" :lang="langs" :layout="'under'" @videoClick="logEvent" />
      <!-- 中部banner -->
      <div class="banner-container-mid">
        <button @click="logEvent('openBanner')">
          {{ langs.media.news.openBtn }}
        </button>
      </div>
      <!-- 更多资讯 -->
      <div v-if="newsList && newsList.length > 0" ref="listContainer" class="more-news-container">
        <div class="more-news-container-title">
          <span>{{ langs.media.news.moreNews }}</span>
        </div>
        <media-list :list="newsList" :lang="langs" @mediaClick="logEvent" @setVideoPauseStatus="setVideoPauseStatus" />
        <div class="sub-title">
          <p>{{ langs.share.video.end }}</p>
        </div>
      </div>
      <div v-else-if="moreLoading" class="more-loading">
        {{ langs.share.common.loading }}
      </div>
    </div>
    <div v-else class="main-container">
      <!-- 404 -->
      <page-loading :lang="langs" :p-name="pName" :is-loading-status="loadingStatus" @loadingClick="logEvent" />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { pageLoading, pageBanner } from '~/components/load'
import mediaStatus from '~/components/media/media-status'
import mediaNewsInfo from '~/components/media/media-news-info'
import mediaVideoInfo from '~/components/media/media-video-info'
import mediaList from '~/components/media/media-list'
import Log from '~/plugins/log'
import * as Utils from '~/utils'
import defaultAvatar from '~/assets/images/common/default-avatar@3x.png'
export default {
  name: 'NewsparkShareMedia',
  components: {
    pageLoading,
    pageBanner,
    mediaStatus,
    mediaVideoInfo,
    mediaNewsInfo,
    mediaList
  },
  data () {
    return {
      moreLoading: true, // 更多loading
      newsList: [],
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

      // 资讯相关
      mId: state => state.mediaInfo.mId,
      fSizeClass: state => state.mediaInfo.fSizeClass,
      fStatus: state => state.mediaInfo.fStatus,
      screenWidth: state => state.mediaInfo.screenWidth
    })
  },
  async asyncData ({ store, route, req, error }) {
    let mediaInfo = {}
    let videos = []
    let loadingStatus = 1
    let metaInfo = {
      title: store.state.common.langs.seo.title
    }
    const wsWidth = store.state.mediaInfo.screenWidth
    await store.dispatch('getMediaInfo').then((resData) => {
      mediaInfo = (resData && resData.media) || {}
    })
    if (mediaInfo && mediaInfo.mediaId) {
      let videoIds = mediaInfo.basic.embedVideoIds
      if (videoIds && videoIds.length > 0) {
        await store.dispatch('getMediaInfos', { videoIds }).then((res) => {
          videos = (res.data && res.data.medias) || []
        })
      }
      mediaInfo.user.userIcon = mediaInfo.user.userIcon || defaultAvatar
      mediaInfo.playStatus = 1 // 默认视频播放状态
      let covers = mediaInfo.cover || []
      let coversLength = (covers && covers.length) || 0
      let content = (mediaInfo.basic && mediaInfo.basic.content) || ''
      // store.commit('SER_META', { title: metaTitle })
      metaInfo.title = mediaInfo.basic.title
      if (covers && covers.length > 0) {
        metaInfo.image = covers[0][1].url
        metaInfo.imagewidth = covers[0][1].width
        metaInfo.imageheight = covers[0][1].height
      }
      if (mediaInfo.type == 'news') {
        // 图文转资讯
        if (!content && coversLength > 0) {
          for (let key in covers) {
            let index = ((covers[key][4] && covers[key][4].sortId) || covers[key][1].sortId || (parseInt(key) + 1))
            content += '<!--' + 'IMG_' + index + '-->'
          }
        }
        mediaInfo.content = Utils.getFormatNewsContent(content, covers, videos, wsWidth)
      }
      // store.commit('SET_MEDIAINFO', mediaInfo)
    } else {
      loadingStatus = 3
    }
    return { loadingStatus, metaInfo, mediaInfo }
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
  created () {
    this.$store.dispatch('getRecommendMediaList').then((resData) => {
      let newsList = resData && resData.medias
      if (newsList.length > 0) {
        for (let index = 0; index < newsList.length; index++) {
          newsList[index].playStatus = 1
        }
        this.newsList = newsList
      } else {
        this.moreLoading = false
      }
    }).catch(() => {
      this.moreLoading = false
    })
  },
  mounted () {
    this.logEvent('pageView')
  },
  methods: {
    setVideoPauseStatus (mediaId) {
      let content = this.newsList
      let contentLength = (content && content.length) || 0
      if (contentLength > 0) {
        for (let key in content) {
          if (content[key] && content[key]['type'] == 'video') {
            // console.log('videoDom=>', videoDom)
            if (mediaId == content[key]['mediaId']) {
              content[key]['playStatus'] = 2 // 加载中
            } else {
              let videoDom = document.querySelector('video.video' + content[key]['mediaId'])
              let currVideoDom = document.querySelector('video.video' + this.mId)
              // 暂停播放
              if (videoDom && !videoDom.paused) {
                videoDom.pause()
                content[key]['playStatus'] = 1 // 点击播放
              }
              // 暂停当前播放
              if (currVideoDom && !currVideoDom.paused) {
                currVideoDom.pause()
                this.mediaInfo.playStatus = 1 // 点击播放
              }
            }
          }
        }
        this.newsList = content
      }
    },
    // 日志投递
    logEvent (key, params = {}) {
      let pName = 'newspark'
      const mediaInfo = this.mediaInfo
      const mediaId = params.mediaId || mediaInfo.mediaId || this.mId || ''
      const mediaType = params.type || mediaInfo.type || 'video'
      params.mediaId = mediaId
      params.type = mediaType
      let schemeUrl
      switch (mediaType) {
        case 'news':
          schemeUrl = `${pName}://web/n?nid=${mediaId}`
          break
        case 'imageText':
          schemeUrl = `${pName}://web/a?aid=${mediaId}`
          break
        case 'link':
          schemeUrl = `${pName}://web/l?lid=${mediaId}`
          break
        default:
          schemeUrl = `${pName}://web/v?vid=${mediaId}`
          break
      }
      const options = {
        app: 'noonaH5',
        page: 'shareMedia',
        params: { schemeUrl, ...params }
      }
      Log.event({ key, ...options })
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
.banner-container-mid {
  display: flex;
  padding: 20px 15px;
  button {
    width: 100%;
    border: none;
    background: #FD415F;
    border-radius: 4px;
    font-family: PingFang-SC-Bold;
    font-size: 15px;
    color: #fff;
    padding: 12px 0;
    text-align: center;
  }
}

.more-video-container {
  .loading-container {
    padding: 15px 0;
    justify-content: flex-start !important;
    min-height: 200px;
  }
}

.more-loading {
  padding-top: 10px;
  text-align: center;
  font-size: 14px;
  color: $color-A2A3A5;
}

// 更多资讯
.more-news-container {
  position: relative;
  display: flex;
  flex-flow: column;
  &-title {
    display: flex;
    padding-bottom: 15px;
    margin-bottom: 5px;
    span {
      border-left: 3px solid #FD415F; /*no*/
      font-family: PingFang-SC-Bold;
      font-size: 17px;
      color: #343445;
      font-weight: bold;
      padding-left: 13px;
    }
  }
  .media-list-container {
    padding: 0 15px;
    &-content {
      padding-bottom: 10px;
      border-top: 1px solid #ECECEC; /*no*/
      &:last-of-type {
        border-bottom: 1px solid #ECECEC; /*no*/
      }
    }
  }
}

// 到底
.sub-title {
  display: flex;
  flex-direction: row;
  // justify-content: space-between;
  justify-content: center;
  align-items: center;
  padding: 20px;
  font-size: 14px;
  color: rgba(162,163,165,0.70);
  span {
    &:first-of-type {
      flex: 1;
      height: 1px; /*no*/
      display: inline-block;
      background: #DDDDDD;
    }
    &:nth-of-type(2) {
      padding: 0 20px;
      font-size: 14px;
      color: $color-333;
      display: inline-block;
      background: $color-white;
      &.end {
        color: $color-999 !important;
        font-size: 12px !important;
      }
    }
    &:last-of-type {
      flex: 1;
      height: 1px; /*no*/
      display: inline-block;
      background: #DDDDDD;
    }
  }
}
</style>
