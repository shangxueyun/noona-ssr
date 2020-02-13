<template>
  <div ref="newsContainer" class="news-container">
    <div class="news-container-desc">
      <div class="title">
        {{ mediaInfo.basic.title }}
      </div>
      <div ref="authorContainer" class="author">
        <section>
          <span><img class="lazy" src="~/assets/images/common/default.png" data-type="avatar" :data-src="mediaInfo.user.userIcon" @click="logEvent('pgcPic')"></span>
          <span><strong>{{ mediaInfo.user.nickName }}</strong><em>{{ mediaInfo.basic.addTime | formatAddTime }}</em></span>
        </section>
        <button @click="logEvent('followBtn')">
          {{ lang.media.news.followBtn }}
        </button>
      </div>
    </div>
    <div ref="newsContentOutside" class="news-container-content-outside" :class="{'two-screens': showExpandAll}" :style="{'height': contentHeight}">
      <news-content :lang="lang" :media-info="mediaInfo" :is-native="false" @contentClick="logEvent" />
      <div v-if="showExpandAll" class="expand-all" @click="expandAll()">
        <img src="~/assets/images/share/media/expand@2x.png">
      </div>
    </div>
    <!-- <div class="open-banner-container">
      <button @click="logEvent('openBanner')">{{ lang.media.news.openBtn }}</button>
    </div> -->
  </div>
</template>

<script>
import newsContent from '~/components/media/news-content'
import defaultAvatar from '~/assets/images/common/default-avatar@3x.png'
// import * as Utils from '~/utils'
export default {
  name: 'MediaNewsInfo',
  components: { newsContent },
  props: {
    lang: {
      type: Object,
      default: () => {}
    },
    mediaInfo: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      showExpandAll: false,
      contentHeight: 'auto',
      loaded: {
        showUserIcon: false
      }
    }
  },
  beforeMount () {
    let content = this.mediaInfo.content
    let wsWidth = (document.body.clientWidth || document.documentElement.clientWidth)
    let imgMaxWidth = wsWidth - 30
    if (content && content.length > 0) {
      for (let key in content) {
        if (content[key].type != 'text') {
          let sourceWidth = content[key]['sourceWidth'] || 0
          let sourceHeigh = content[key]['sourceHeigh'] || 0
          content[key]['calcWidth'] = sourceWidth < imgMaxWidth ? sourceWidth + 'px' : '100%'
          content[key]['calcHeigh'] = sourceWidth < imgMaxWidth ? sourceHeigh + 'px' : Math.round((sourceHeigh * imgMaxWidth) / sourceWidth) + 'px'
        }
      }
      this.mediaInfo.content = content
    }
  },
  mounted () {
    let _self = this
    let wsHeight = window.screen.availHeight
    if (!this.showExpandAll) {
      let newsContentH = Math.round(this.$refs.newsContentOutside.offsetHeight / 2)
      if (newsContentH > wsHeight) {
        this.contentHeight = newsContentH + 'px'
        this.showExpandAll = true
      }
    }
    // 图片预加载
    document.querySelectorAll('img.lazy').forEach(function (el) {
      let src = el.getAttribute('data-src')
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
    logEvent (key, params = {}) {
      this.$emit('newsClick', key, params)
    },
    // 图片预加载
    preloadImage (src) {
      return new Promise(function (resolve, reject) {
        const image = new Image()
        image.onload = resolve
        image.onerror = reject
        image.src = src
      })
    },
    // 展开全部
    expandAll () {
      this.showExpandAll = false
      this.contentHeight = 'auto'
    }
  }
}
</script>

<style lang="scss">
// 媒资信息
.news-container {
  display: flex;
  flex-flow: column;
  padding: 15px 15px 0;
  // height: 100%;
  &-desc {
    .title {
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
        font-family: PingFangSC-Regular;
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
          background: #DDD;
          color: #9999A1;
        }
      }
    }
  }
  &-content-outside {
    position: relative;
    &.two-screens {
      overflow: hidden;
      margin-bottom: 20px;
    }
    .expand-all {
      position: absolute;
      width: 100%;
      height: 65px;
      left: 0;
      bottom: 0;
      z-index: 8;
      background: -webkit-linear-gradient(top, rgba(255, 255, 255, .2), rgba(255, 255, 255, 1));
      display: flex;
      justify-content: center;
      align-items: flex-end;
      img {
        width: 26px;
        height: 19px;
      }
      button {
        border: none;
        background: transparent;
        font-size: 14px;
        color: #4A90E2;
        i {
          display: inline-block;
          border-right: 1px solid #4A90E2;
          border-top: 1px solid #4A90E2;
          height: 8px;
          width: 8px;
          transform: rotate(135deg);
          border-left: 1px solid transparent;
          border-bottom: 1px solid transparent;
          vertical-align: top;
          margin-left: 8px;
          margin-top: 3px;
        }
      }
    }
  }
}
</style>
