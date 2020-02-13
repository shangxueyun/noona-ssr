<template>
  <!-- 超链接 -->
  <div class="media-container-link">
    <div v-if="mediaInfo.basic.summary" class="title summary">
      {{ mediaInfo.basic.summary }}
    </div>
    <div class="media-container-link-content" :class="formatMediaStyle(mediaInfo)" @click="isFeedModel ? '' : logEvent('mediaInfoLink')">
      <div class="left">
        <div class="title">
          {{ mediaInfo.basic.title || mediaInfo.basic.originDisplayUrl }}
        </div>
      </div>
      <div class="right" :class="{lock : mediaInfo.cover[0] && mediaInfo.cover[0][1].lock}">
        <span v-if="mediaInfo.cover[0]" :style="mediaInfo.cover[0] | formatImgUrl(mediaInfo)" />
        <div v-if="mediaInfo.cover[0] && mediaInfo.cover[0][1].lock" class="link-lock" :data-privatestatus="mediaInfo.cover[0][1].lock || 0" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MediaLinkInfo',
  props: {
    isFeedModel: {
      type: Boolean,
      default: false
    },
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
    return {}
  },
  methods: {
    logEvent (key, params, e) {
      console.log('key=>', key, 'params=>', params, 'e=>', e)
      this.$emit('linkClick', key, params, e)
    },
    // 内容UI样式
    formatMediaStyle (item) {
      let className = ''
      // mediaType(1视频video；2音频audio；3图文imageText；4纯文本text；5资讯news；6外链link；7小组group；)
      let mediaType = item.basic.mediaType
      // coverType 0未知、1左文右图、2三图、3无图、4大图
      // let coverType = item.basic.coverType
      // if (coverType && coverType == 1) {
      //   className = 'row'
      // }
      // cover 1原图；2封图或上图下文；3左文右图小图；4详情页图片；5；6；7gif
      // link 左文右图（小图）: 宽*高 <= 300*180  或  宽 / 高< 1 或 宽 / 高 > 2；展示图片取3
      // 上图下文（大图16：9）: 宽*高 > 300*180  并且  宽 / 高 >= 1 并且 宽 / 高 <= 2；展示图片取2
      let coverObj = item.cover && item.cover[0] && item.cover[0][1]
      if (mediaType == 6 && coverObj && coverObj.width && coverObj.height) {
        let scaleWH = (coverObj.width / coverObj.height).toFixed(3)
        if (coverObj.width * coverObj.height > 300 * 180 && scaleWH >= 1 && scaleWH <= 2) {
          className = 'column-reverse'
        }
      }
      return className
    }
  }
}
</script>

<style lang="scss">
// 超链接
.media-container-link {
  .title {
    font-family: PingFangSC-Regular;
    font-size: 15px;
    line-height: 1.5;
    color: #3B424C;
    word-break: keep-all;
    word-wrap: break-word;
    &.summary {
      margin-bottom: 10px;
    }
  }
  &-content {
    position: relative;
    overflow: hidden;
    background: #F2F3F4;
    padding: 8px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    &.column-reverse {
      padding: 0;
      flex-direction: column-reverse;
      .left {
        background: #EFF1F3;
        padding: 8px;
        height: auto;
      }
      .right {
        width: 100%;
        height: 180px;
        &.lock {
          background-size: 40px 40px;
        }
      }
      .link-lock {
        background-size: 44px 44px;
      }
    }
    // 左文
    .left {
      position: relative;
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding-right: 10px;
      height: 50px;
      .title {
        font-size: 14px;
        letter-spacing: .01rem;
        max-height: 50px;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
      }
    }
    // 右图
    .right {
      position: relative;
      overflow: hidden;
      width: 50px;
      height: 50px;
      background: #DDE0E3 url(~assets/images/share/common/inspub-link@2x.png) no-repeat center;
      background-size: 27px 27px;
      &.lock {
        background: #DDE0E3 url(~assets/images/share/common/inspub-link-lock@2x.png) no-repeat center;
        background-size: 20px 20px;
      }
      span {
        display: inline-block;
        width: 100%;
        height: 100%;
        // background-color: #f3f4f5;
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
      }
    }
    .filter {
      filter: blur(5px);
    }
    .link-lock {
      position: absolute;
      left: 0;
      top: 0;
      z-index: 3;
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      background: url(~assets/images/share/common/video-lock@2x.png) no-repeat center;
      background-size: 16px 16px;
      cursor: pointer;
    }
  }
}
</style>
