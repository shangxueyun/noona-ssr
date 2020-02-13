<template>
  <div class="media-feed-list-container">
    <div v-for="(item) in mediaList" :key="item.mediaId" class="media-feed-list-container-content">
      <div class="user">
        <span class="user-icon"><img v-if="item.user.userIcon" :src="item.user.userIcon" @click="logEvent('mediaListPgcPic', {mediaId: item.mediaId, type: item.type})"></span>
        <span class="user-name"><strong>{{ item.user.nickName }}</strong></span>
        <!-- <em v-html="formatTime(item.basic.addTime)"></em> -->
        <span class="user-follow" @click="logEvent('mediaListFollowBtn', {mediaId: item.mediaId, type: item.type})"><i>‧</i>{{ lang.share.user.following }}</span>
      </div>
      <!-- 媒资列表 -->
      <media-list :list="[item]" :lang="lang" :is-feed-model="true" @mediaClick="logEvent" @setVideoPauseStatus="setVideoPauseStatus" />
      <!-- 评论/喜欢/分享相关 -->
      <div v-if="pName == 'inspub'" class="action">
        <span @click="logEvent('mediaListComment', {mediaId: item.mediaId, type: item.type})">{{ lang.share.group.inviteCommentBtn }}</span><span @click="logEvent('mediaListLike', {mediaId: item.mediaId, type: item.type})">{{ lang.share.group.inviteLikesBtn }}</span><span @click="logEvent('mediaListShare', {mediaId: item.mediaId, type: item.type})">{{ lang.share.group.inviteShareBtn }}</span>
      </div>
      <div v-else class="action">
        <span @click="logEvent('mediaListComment', {mediaId: item.mediaId, type: item.type})">{{ item.stat.commentNum }}</span><span @click="logEvent('mediaListLike', {mediaId: item.mediaId, type: item.type})">{{ item.stat.favoriteNum }}</span><span @click="logEvent('mediaListShare', {mediaId: item.mediaId, type: item.type})">{{ lang.share.user.shareBtn }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import mediaList from '~/components/media/media-list'
export default {
  name: 'MediaFeedList',
  components: {
    mediaList
  },
  props: {
    lang: {
      type: Object,
      default: () => {}
    },
    pName: {
      type: String,
      default: ''
    },
    mediaList: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {}
  },
  methods: {
    logEvent (key, params, e) {
      console.log('key=>', key, 'params=>', params, 'e=>', e)
      this.$emit('mediaFeedClick', key, params, e)
    },
    setVideoPauseStatus (mediaId) {
      let content = this.mediaList
      let contentLength = (content && content.length) || 0
      if (contentLength > 0) {
        for (let key in content) {
          if (content[key] && content[key]['type'] == 'video') {
            // console.log('videoDom=>', videoDom)
            if (mediaId == content[key]['mediaId']) {
              content[key]['playStatus'] = 2 // 加载中
            } else {
              let videoDom = document.querySelector('video.video' + content[key]['mediaId'])
              // 暂停播放
              if (videoDom && !videoDom.paused) {
                videoDom.pause()
                content[key]['playStatus'] = 1 // 点击播放
              }
            }
          }
        }
        this.mediaList = content
      }
    }
  }
}
</script>

<style lang="scss">
.media-feed-list-container {
  padding: 0 15px;
  &-content {
    padding: 14px 0;
    display: flex;
    flex-direction: column;
    border-bottom: 1px solid #EDEDED; /*no*/
    .user {
      display: flex;
      align-items: center;
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
          // flex: 1;
          flex-direction: column;
          justify-content: center;
          margin-left: 10px;
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
            font-family: PingFangTC-Medium;
            font-size: 11px;
            color: #9999A1;
            margin-top: 2px;
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
    .action {
      display: flex;
      margin-top: 10px;
      span {
        // width: 20px;
        height: 20px;
        padding-left: 25px;
        font-family: PingFangSC-Regular;
        font-size: 12px;
        line-height: 1.7;
        color: #3B424C;
        &:first-of-type {
          background: url(~assets/images/share/user/works-comment@2x.png) no-repeat left center;
          background-size: 20px 20px;
        }
        &:nth-of-type(2) {
          margin: 0 25px;
          background: url(~assets/images/share/user/works-like@2x.png) no-repeat left center;
          background-size: 20px 20px;
        }
        &:last-of-type {
          // padding-left: 50px;
          background: url(~assets/images/share/user/works-share@2x.png) no-repeat left center;
          background-size: 20px 20px;
          word-break: keep-all;
          word-wrap: break-word;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 1;
        }
      }
    }
    &:last-of-type {
      border-bottom: none;
      padding-bottom: 0;
    }
  }
}
</style>
