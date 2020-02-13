<template>
  <div class="group-recommend-container">
    <template v-if="groupList && groupList.length > 0">
      <div class="mid-banner" @click="logEvent('middleBanner')">
        {{ lang.share.group.inviteBannerBtn }}
      </div>
      <p class="title">
        {{ lang.share.group.inviteRecListTitle }}
      </p>
      <ul class="list">
        <template v-for="(item, index) in groupList">
          <li v-if="index < 5" :id="item.mediaId" :key="item.mediaId">
            <span><strong>{{ item.basic.title }}</strong><em v-html="formatJoinNum(item.stat)" /></span><button @click="logEvent('recJoinBtn', {mediaId: item.mediaId})">
              {{ lang.share.group.inviteJoinBtn }}
            </button>
          </li>
        </template>
      </ul>
    </template>
    <div v-else-if="moreLoading" class="more-loading">
      {{ lang.share.common.loading }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'GroupRecommendList',
  props: {
    lang: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      moreLoading: true, // 更多loading
      groupList: []
    }
  },
  created () {
    this.getHotGroup()
  },
  methods: {
    // 异步加载推荐列表
    getHotGroup () {
      this.$axios.$post('/v1/recommend/group', { page: 1, count: 5 }).then(res => {
        let code = res && res.code
        let dataMedias = (res && res.data && res.data.medias) || []
        if (code == 0 && dataMedias.length > 0) {
          this.groupList = dataMedias
        } else {
          this.moreLoading = false
          // this.isLoadingStatus = 2
        }
      }).catch(() => {
        this.moreLoading = false
        // this.isLoadingStatus = 2
      })
    },
    logEvent (key, params) {
      this.$emit('recClick', key, params)
    },
    // 格式化加入小组人数
    formatJoinNum (stat) {
      let joinNum = (stat.groupMember + stat.vipGroupMember) || 0
      let inviteJoinNum = this.lang.share.group.inviteJoinNum
      // if (parseInt(joinNum) < 100) {
      //   joinNum = Math.floor(Math.random()*(10000 - 100) + 100)
      // }
      if (parseInt(joinNum) > 9999) {
        joinNum = Math.floor(joinNum / 10000) + 'W'
      }
      return inviteJoinNum.replace('{num}', joinNum)
    }
  }
}
</script>

<style lang="scss">
.group-recommend-container {
  .mid-banner {
    margin: 20px 15px;
    padding: 15px 0;
    border: 1px solid #e2e2e2;
    text-align: center;
    border-radius: 40px;
    font-family: PingFangSC-Medium;
    font-size: 14px;
    color: #3B424C;
  }
  .title {
    font-family: PingFangSC-Medium;
    font-size: 15px;
    color: #3B424C;
    // border-bottom: 1px solid #D8D8D8; /*no*/
    padding-bottom: 10px;
    padding-left: 10px;
    font-weight: bold;
  }
  .list {
    li {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-top: 1px solid #eee; /*no*/
      padding: 10px;
      span {
        display: inline-flex;
        flex-direction: column;
        strong {
          font-family: PingFangSC-Medium;
          font-size: 15px;
          color: #3B424C;
          max-width: 240px;
        }
        em {
          font-style: normal;
          font-family: PingFangSC-Regular;
          font-size: 12px;
          color: #8E96A0;
        }
      }
      button {
        padding: 10px 20px;
        background: #FD3A56;
        border-radius: 30px;
        font-family: PingFangSC-Medium;
        font-size: 14px;
        color: #FFFFFF;
        border: none;
        cursor: pointer;
      }
    }
  }
  // 加载更多
  .more-loading {
    padding-top: 10px;
    text-align: center;
    font-size: 14px;
    color: #A2A3A5;
  }
}

</style>
