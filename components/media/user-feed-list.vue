<template>
  <div class="user-list-container">
    <ul class="user-list-container-tabs">
      <li :class="{show: tabs.showWorks}" @click="showTabs('works')">
        <span>{{ lang.share.user.works }}</span>
        <!-- <span v-if="userInfo.stats.videoNum">{{ userInfo.stats.videoNum }}</span> -->
      </li>
      <li :class="{show: tabs.showLikes}" @click="showTabs('likes')">
        <span>{{ lang.share.user.likes }}</span>
        <!-- <span v-if="userInfo.stats.favoriteNum">{{ userInfo.stats.favoriteNum }}</span> -->
      </li>
    </ul>
    <media-feed-list v-if="tabs.showWorks && userVideoList.length" :media-list="userVideoList" :lang="lang" :p-name="pName" @mediaFeedClick="logEvent" />
    <media-feed-list v-else-if="tabs.showLikes && userLikesList.length" :media-list="userLikesList" :lang="lang" :p-name="pName" @mediaFeedClick="logEvent" />
    <div v-else class="no-video">
      <img src="~/assets/images/share/user/no-video@2x.png">{{ lang.share.user.noVideo }}
    </div>
    <div class="open-banner-container">
      <button @click="logEvent('openBanner')">
        {{ lang.media.news.openBtn }}
      </button>
    </div>
  </div>
</template>

<script>
import mediaFeedList from '~/components/media/media-feed-list'
export default {
  name: 'UserFeedList',
  components: {
    mediaFeedList
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
    userInfo: {
      type: Object,
      default: () => {}
    },
    userVideoList: {
      type: Array,
      default: () => []
    },
    userLikesList: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      tabs: {
        showWorks: false,
        showLikes: false
      }
    }
  },
  created () {
    let userVideoList = this.userVideoList
    let userLikesList = this.userLikesList
    // console.log('userVideoList=>', userVideoList)
    if (userVideoList.length == 0 && userLikesList.length > 0) {
      this.showTabs('likes')
    } else {
      this.showTabs('works')
    }
  },
  methods: {
    logEvent (key, params) {
      this.$emit('userFeedClick', key, params)
    },
    showTabs (tabs) {
      if (tabs == 'works') {
        this.tabs.showWorks = true
        this.tabs.showLikes = false
      } else if (tabs == 'likes') {
        this.tabs.showWorks = false
        this.tabs.showLikes = true
      }
    }
  }
}
</script>

<style lang="scss">
.user-list-container {
  margin-top: 30px;
  &-tabs {
    width: 100%;
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid #EDEDED; /*no*/
    padding-bottom: 10px;
    li {
      width: 50%;
      font-family: PingFangSC-Regular;
      font-size: 15px;
      color: #9999A1;
      text-align: center;
      &.show {
        color: #262628;
      }
      span {
        &:first-of-type {
          margin-right: 5px;
        }
      }
    }
  }
}
.open-banner-container {
  display: flex;
  padding: 15px;
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
.no-video {
  text-align: center;
  width: 100%;
  padding: 0;
  height: auto;
  border: none;
  color: $color-999;
  font-size: $font15;
  display: inline-flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 50px 0;
  img {
    width: 50px;
    margin-bottom: 10px;
  }
}
</style>
