<template>
  <div class="media-list-container">
    <div
      v-for="(item) in list"
      :key="item.mediaId"
      class="media-list-container-content"
      :data-id="item.mediaId"
      :class="formatMediaStyle(item)"
      @click="logEvent('mediaListContent', {mediaId: item.mediaId, type: item.type}, $event)"
    >
      <!-- mediaType(1视频video；2音频audio；3图文imageText；4纯文本text；5资讯news；6外链link；7小组group；)-->
      <template v-if="item.basic.mediaType == 1">
        <!-- 左文右视频 -->
        <template v-if="item.basic.coverType == 1">
          <div class="left">
            <div class="title">
              {{ item.basic.title }}
            </div>
            <div v-if="!isFeedModel" class="author">
              <span>{{ item.user.nickName }}</span>
              <span />
            </div>
          </div>
          <div class="right" :style="item.cover[0] | formatImgUrl(item)">
            <span class="play" />
            <span class="time">{{ item.basic.duration | formatVideoDuration }}</span>
          </div>
        </template>
        <!-- 16:9视频 宽/高 >= 1.3 -->
        <template v-else>
          <div v-if="item.basic.title" class="title video">
            {{ item.basic.title }}
          </div>
          <media-video-info
            :media-info="item"
            :lang="lang"
            :is-feed-model="isFeedModel"
            :is-show-duration="true"
            @videoClick="logEvent"
            @videoPlayStatus="videoPlayStatus"
          />
          <div v-if="!isFeedModel" class="author">
            <span>{{ item.user.nickName }}</span><span />
          </div>
        </template>
      </template>
      <!-- 图文 -->
      <media-image-text v-else-if="isFeedModel && item.basic.mediaType == 3" :media-info="item" :lang="lang" :is-feed-model="isFeedModel" />
      <template v-else-if="item.basic.mediaType == 3 && item.cover && item.cover.length >= 1">
        <div class="left">
          <div class="title">
            {{ item.basic.title }}
          </div>
          <div v-if="!isFeedModel" class="author">
            <span>{{ item.user.nickName }}</span>
            <span />
          </div>
        </div>
        <div class="right" :style="item.cover[0] | formatImgUrl(item)" />
      </template>
      <!-- 资讯 -->
      <template v-else-if="item.basic.mediaType == 5">
        <!-- 三图 -->
        <template v-if="item.basic.coverType == 2 && item.cover && item.cover.length >= 3">
          <div class="title">
            {{ item.basic.title }}
          </div>
          <div class="three-img">
            <span :style="item.cover[0] | formatImgUrl(item)" />
            <span :style="item.cover[1] | formatImgUrl(item)" />
            <span :style="item.cover[2] | formatImgUrl(item)" />
          </div>
          <div v-if="!isFeedModel" class="author">
            <span>{{ item.user.nickName }}</span>
            <span />
          </div>
        </template>
        <!-- 左文右图 -->
        <template v-else-if="item.basic.coverType == 1 && item.cover && item.cover.length >= 1">
          <div class="left">
            <div class="title">
              {{ item.basic.title }}
            </div>
            <div v-if="!isFeedModel" class="author">
              <span>{{ item.user.nickName }}</span>
              <span />
            </div>
          </div>
          <div class="right" :style="item.cover[0] | formatImgUrl(item)" />
        </template>
        <!-- 大图 -->
        <template v-else-if="item.basic.coverType == 4 && item.cover && item.cover.length >= 1">
          <div class="title">
            {{ item.basic.title }}
          </div>
          <div class="big-img" :data-id="item.mediaId" :style="item.cover[0] | formatImgUrl(item)" />
          <div v-if="!isFeedModel" class="author news">
            <span>{{ item.user.nickName }}</span><span />
          </div>
        </template>
        <template v-else>
          <div class="title">
            {{ item.basic.title }}
          </div>
          <div v-if="!isFeedModel" class="author">
            <span>{{ item.user.nickName }}</span>
            <span />
          </div>
        </template>
      </template>
      <!-- 超链接 -->
      <media-link-info v-else-if="item.basic.mediaType == 6" :media-info="item" :lang="lang" :is-feed-model="isFeedModel" />
      <!-- 文本 -->
      <template v-else>
        <div class="title">
          {{ item.basic.title }}
        </div>
        <div v-if="!isFeedModel" class="author text">
          <span>{{ item.user.nickName }}</span>
          <span />
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import mediaVideoInfo from '~/components/media/media-video-info'
import mediaImageText from '~/components/media/media-image-text'
import mediaLinkInfo from '~/components/media/media-link-info'
export default {
  name: 'MediaList',
  components: {
    mediaVideoInfo,
    mediaImageText,
    mediaLinkInfo
  },
  props: {
    lang: {
      type: Object,
      default: () => {}
    },
    isFeedModel: {
      type: Boolean,
      default: false
    },
    list: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {}
  },
  methods: {
    logEvent (key, params, e) {
      this.$emit('mediaClick', key, params, e)
    },
    videoPlayStatus (mediaId) {
      this.$emit('setVideoPauseStatus', mediaId)
    },
    // 内容UI样式
    formatMediaStyle (item) {
      let className = 'column'
      // mediaType(1视频video；2音频audio；3图文imageText；4纯文本text；5资讯news；6外链link；7小组group；)
      let mediaType = item.basic.mediaType
      // 非feed图文显示为左图右文
      let isImageText = !this.isFeedModel && mediaType == 3
      // coverType 0未知、1左文右图、2三图、3无图、4大图
      let coverType = item.basic.coverType
      if ((coverType && coverType == 1) || isImageText) {
        className = 'row'
      }
      // link 左文右图（小图）: 宽*高 <= 300*180  或  宽 / 高< 1 或 宽 / 高 > 2
      // let coverObj = item.cover && item.cover[0] && item.cover[0][1]
      // if (mediaType == 6 && coverObj && coverObj.width && coverObj.height) {
      //   let scaleWH = (coverObj.width / coverObj.height).toFixed(3)
      //   if (coverObj.width * coverObj.height <= 300 * 180 || scaleWH < 1 || scaleWH > 2) {
      //     className = 'row link'
      //   } else {
      //     className = 'column-reverse'
      //   }
      // }
      return className
    }
  }
}
</script>

<style lang="scss">
.media-list-container {
  &-content {
    position: relative;
    display: flex;
    // padding: 10px 0;
    padding-top: 10px;
    // 横排列
    &.row {
      flex-direction: row;
      justify-content: space-between;
    }
    // 纵排列
    &.column {
      flex-direction: column;
    }
    &.column-reverse {
      flex-direction: column-reverse;
      .left {
        background: #EFF1F3;
        padding: 8px;
        &.link {
          height: auto;
        }
      }
      .right {
        width: 100%;
        height: 180px;
        &.link {
          width: 100%;
          height: 180px;
        }
      }
    }
    &.link {
      background: #F2F3F4;
      padding: 8px;
      margin-top: 10px;
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
      background: rgba(255, 255, 255, 0.2) url(~assets/images/share/common/img-lock@2x.png) no-repeat center;
      background-size: 16px 16px;
      cursor: pointer;
    }
    div {
      // display: flex;
      &.title {
        font-family: PingFangSC-Regular;
        font-size: 15px;
        // font-size: 17px;
        color: #3B424C;
        line-height: 1.5;
        max-height: 50px;
        // word-break: break-all;
        word-break: keep-all;
        word-wrap: break-word;
        // text-align: justify;
        letter-spacing: .01rem;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        &.video {
          margin-bottom: 10px;
        }
      }
      &.author {
        width: 100%;
        display: flex;
        // justify-content: space-between;
        line-height: 1.5;
        &.text {
          margin-top: 5px;
        }
        &.news {
          margin-top: 5px;
        }
        span {
          opacity: 0.7;
          font-size: 12px;
          color: #A2A3A5;
          &:first-of-type {
            max-width: 120px;
            word-break: break-all;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 1;
          }
          &:last-of-type {
            margin-left: 10px;
          }
        }
      }
    }
    // 左文
    .left {
      position: relative;
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      // align-items: center;
      padding-right: 10px;
      height: 70px;
      &.link {
        justify-content: center;
        height: 50px;
        .title {
          font-size: 14px;
        }
      }
    }
    // 右图
    .right {
      position: relative;
      overflow: hidden;
      width: 125px;
      height: 70px;
      // background: #F3F4F5;
      background-color: #f3f4f5;
      background-size: cover;
      background-position: center;
      background-repeat: no-repeat;
      // border-radius: 5px;
      &.link {
        width: 50px;
        height: 50px;
        background: #DDD url(~assets/images/share/common/inspub-link@2x.png) no-repeat center;
        background-size: 27px 27px;
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
    }
    // 大图
    .big-img {
      position: relative;
      transform: translate(0, 0);
      margin-top: 8px;
      height: 194px;
      overflow: hidden;
      background-color: #f3f4f5;
      background-size: cover;
      background-position: center top;
      background-repeat: no-repeat;
      // border-radius: 5px;
      .cover {
        width: 100%;
        background: #F3F4F5;
        vertical-align: top;
      }
      .play {
        // width: 29px;
        // height: 33px;
        // background: url(~assets/images/share/media/play-big@2x.png) no-repeat left center;
        // background-size: 29px 33px;
        width: 44px;
        height: 44px;
        background: url(~assets/images/share/video/play@2x.png) no-repeat center;
        background-size: 44px 44px;
        cursor: pointer;
      }
      .time {
        position: absolute;
        right: 8px;
        bottom: 8px;
        padding: 3px 7px;
        border-radius: 15px;
        background: rgba(0, 0, 0, .3);
        font-family: Helvetica;
        font-size: 12px;
        line-height: 1;
      }
      .lock {
        position: absolute;
        left: 50%;
        top: 50%;
        z-index: 4;
        transform: translate(-50%, -50%);
        width: 20px;
        height: 20px;
        background: url(~assets/images/share/common/locked@2x.png) no-repeat center;
        background-size: 20px 20px;
      }
      .video-lock {
        position: absolute;
        left: 50%;
        top: 50%;
        z-index: 4;
        transform: translate(-50%, -50%);
        width: 44px;
        height: 44px;
        background: url(~assets/images/share/common/video-lock@2x.png) no-repeat center;
        background-size: 44px 44px;
      }
    }
    // 三图
    .three-img {
      position: relative;
      margin: 8px 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 65px;
      overflow: hidden;
      img {
        background: #F3F4F5;
        display: inline-block;
        // width: 33.1%;
        width: 114px;
        height: 100%;
        overflow: hidden;
      }
      span {
        width: 114px;
        height: 100%;
        background-color: #f3f4f5;
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
        // &:first-of-type {
        //   border-top-left-radius: 5px;
        //   border-bottom-left-radius: 5px;
        // }
        // &:last-of-type {
        //   border-top-right-radius: 5px;
        //   border-bottom-right-radius: 5px;
        // }
      }
    }
  }
  // 播放按钮
  .play {
    position: absolute;
    left: 50%;
    top: 50%;
    z-index: 9;
    transform: translate(-50%, -50%);
    // width: 19px;
    // height: 21px;
    // background: url(~assets/images/share/media/play-lit@2x.png) no-repeat left center;
    // background-size: 19px 21px;
    width: 22px;
    height: 22px;
    background: url(~assets/images/share/video/play@2x.png) no-repeat center;
    background-size: 22px 22px;
    cursor: pointer;
  }
  // 视频时长
  .time {
    position: absolute;
    right: 5px;
    bottom: 5px;
    padding: 1px 2px;
    z-index: 9;
    background: rgba(0, 0, 0, .8);
    border-radius: 2px;
    font-size: 10px;
    color: #FFF;
  }
  .mask {
    position: absolute;
    left: 0;
    top: 0;
    z-index: 3;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.2);
  }
}
</style>
