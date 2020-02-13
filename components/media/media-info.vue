<template>
  <div class="media-container">
    <!-- 视频 mediaType(1视频video；2音频audio；3图文imageText；4纯文本text；5资讯news；6外链link；7小组group；)-->
    <!-- 视频播放 -->
    <media-video-info
      v-if="mediaInfo.basic.mediaType == 1"
      :media-info="mediaInfo"
      :lang="lang"
      :layout="'under'"
      :is-show-duration="true"
      @videoClick="logEvent"
    />
    <template v-else>
      <div class="media-container-user" @click="logEvent('pgcPic')">
        <span class="user-icon"><img v-if="mediaInfo.user.userIcon" :src="mediaInfo.user.userIcon"></span>
        <span class="user-name"><strong>{{ mediaInfo.user.nickName }}</strong></span>
        <span class="user-follow" @click.stop="logEvent('followBtn')"><i>‧</i>{{ lang.share.user.following }}</span>
      </div>
      <div class="media-container-content">
        <!-- 图文 -->
        <media-image-text v-if="mediaInfo.basic.mediaType == 3" :media-info="mediaInfo" :lang="lang" :i-status="iStatus" @imageClick="logEvent" />
        <!-- 超链接 -->
        <media-link-info v-else-if="mediaInfo.basic.mediaType == 6" :media-info="mediaInfo" :lang="lang" @linkClick="logEvent" />
        <!-- 其它 -->
        <!-- 分享邀请立即查看 -->
        <!-- <button v-if="!iStatus && mediaInfo.basic.privateStatus != 10" class="join" @click="logEvent('viewNow')">{{ lang.share.group.privateBtn }}</button> -->
      </div>
    </template>
  </div>
</template>

<script>
import mediaVideoInfo from '~/components/media/media-video-info'
import mediaLinkInfo from '~/components/media/media-link-info'
import mediaImageText from '~/components/media/media-image-text'
export default {
  name: 'MediaInfo',
  components: {
    mediaVideoInfo,
    mediaLinkInfo,
    mediaImageText
  },
  props: {
    iStatus: {
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
    return {
      diffLen: 0
    }
  },
  methods: {
    logEvent (key, params, e) {
      this.$emit('mediaClick', key, params)
    }
  }
}
</script>

<style lang="scss">
.media-container {
  position: relative;
  background: #FFF;
  &-user {
    display: flex;
    align-items: center;
    padding: 15px 15px 0;
    span {
      display: inline-flex;
      &.user-icon {
        width: 30px;
        height: 30px;
        background: #F3F4F5;
        border-radius: 100%;
        overflow: hidden;
        img {
          width: 30px;
          height: 30px;
          border-radius: 100%;
          vertical-align: middle;
        }
      }
      &.user-name {
        flex-direction: column;
        justify-content: center;
        margin-left: 8px;
        strong {
          font-family: PingFangSC-Regular;
          font-size: 14px;
          color: #3B424C;
          font-weight: 500;
          // width: 170px
          // word-break: break-all;
          // overflow: hidden;
          // text-overflow: ellipsis;
          // display: -webkit-box;
          // -webkit-box-orient: vertical;
          // -webkit-line-clamp: 1;
        }
        em {
          font-family: PingFangSC-Regular;
          font-size: 11px;
          color: #A2A3A5;
        }
      }
      &.user-follow {
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color: #FD415F;
        i {
          margin: 0 8px;
          display: inline-block;
          color: #A2A3A5;
        }
      }
    }
  }
  &-content {
    padding: 10px 15px 0;
    // 组队
    .join {
      width: 100%;
      height: 65px;
      line-height: 65px;
      margin-top: 20px;
      border: none;
      font-family: PingFangSC-Medium;
      font-size: 18px;
      color: #FFFFFF;
      text-align: center;
      background: url(~assets/images/share/team/btn-bg.png) no-repeat left center;
      background-size: 100% auto;
    }
  }
}
</style>
