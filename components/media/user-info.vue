<template>
  <div class="user-info">
    <ul>
      <li class="basic">
        <span class="avatar"><img class="lazy" src="~/assets/images/common/default.png" data-type="avatar" :data-src="userInfo.basic.userIcon" @click="logEvent('pgcPic')"></span>
        <section>
          <p>
            <span><strong>{{ userInfo.stats.followerNum }}</strong><br>{{ lang.share.user.followers }}</span>
            <span><strong>{{ userInfo.stats.followNum }}</strong><br>{{ lang.share.user.following }}</span>
            <span><strong>{{ userInfo.stats.heatNum }}</strong><br>{{ lang.share.user.hearts }}</span>
          </p>
          <button @click="logEvent('followBtn')">
            {{ lang.share.user.followBtn }}
          </button>
        </section>
      </li>
      <li v-if="userInfo.basic.nickName" class="nickName">
        {{ userInfo.basic.nickName }}
      </li>
      <li v-if="userInfo.basic.sex || (userInfo.ext && userInfo.ext.constellation)" class="constellation">
        <img v-if="userInfo.basic.sex == '1'" src="~/assets/images/share/user/male.png">
        <img v-else-if="userInfo.basic.sex == '2'" src="~/assets/images/share/user/female.png">
        <span>{{ userInfo.ext.constellation && userInfo.ext.constellation.text }}</span>
      </li>
      <!-- <li class="identity" v-if="userInfo.ident.identity">ID：{{ userInfo.ident.identity }}</li> -->
      <li v-if="userInfo.basic.summary" class="summary">
        {{ userInfo.basic.summary }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'UserInfo',
  props: {
    lang: {
      type: Object,
      default: () => {}
    },
    userInfo: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {}
  },
  methods: {
    logEvent (key) {
      this.$emit('userClick', key)
    }
  }
}
</script>

<style lang="scss">
// 用户信息
.user-info {
  position: relative;
  overflow: hidden;
  padding: 0 20px;
  ul {
    position: relative;
    z-index: 3;
    width: 100%;
    li {
      display: flex;
      &.basic {
        align-items: center;
        padding: 20px 0;
        .avatar {
          width: 90px;
          height: 90px;
          background: #F3F4F5;
          border-radius: 100%;
          overflow: hidden;
          img {
            display: inline-block;
            width: 90px;
            height: 90px;
            border-radius: 100%;
            border: none;
            cursor: pointer;
            vertical-align: middle;
          }
        }
        section {
          flex: 1;
          display: flex;
          flex-flow: column wrap;
          padding-left: 20px;
          p {
            display: flex;
            justify-content: space-between;
            margin-bottom: 15px;
            padding: 0 10px;
            span {
              font-size: $font12;
              color: $color-999;
              text-align: center;
              line-height: 20px;
              display: block;
            }
            strong {
              font-size: $font18;
              color: $color-333;
              font-style: normal;
              font-weight: 500;
            }
          }
          button {
            font-size: $font15;
            color: $color-white;
            text-align: center;
            padding: 8px 0;
            // letter-spacing: 20px;
            // text-indent: 20px;
            border: none;
            border-radius: 20px;
            background: -webkit-linear-gradient(left, #FD8350, #FA2764);
            display: block;
          }
        }
      }
      &.nickName {
        font-family: PingFang-SC-Bold;
        font-size: 17px;
        color: #262628;
      }
      &.constellation {
        margin-top: 5px;
        img {
          width: 26px;
          height: 16px;
          vertical-align: middle;
          margin-right: 6px;
        }
        span {
          background: #F8E71C;
          border-radius: 9px;
          opacity: 0.8;
          font-family: PingFang-SC-Heavy;
          font-size: 11px;
          color: #3B424C;
          padding: 2px 5px;
          display: inline-block;
          vertical-align: middle;
        }
      }
      &.identity {
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color: #9999A1;
      }
      &.summary {
        margin-top: 5px;
        line-height: 22px;
        font-size: $font12;
        font-family: PingFangSC-Regular;
        font-size: 12px;
        color: #9999A1;
        max-height: 100px;
        overflow: hidden;
        text-overflow: ellipsis;
        -webkit-line-clamp: 4;
        -webkit-box-orient: vertical;
        display: -webkit-box;
        text-align: justify;
      }
    }
  }
}
</style>
