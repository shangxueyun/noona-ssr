<template>
  <div ref="teamContainer" class="team-container">
    <div class="team-container-invite">
      <div class="code-info">
        <p>
          <span class="avatar"><img v-if="userInfo.joinUser[0] && userInfo.joinUser[0].userIcon" :src="userInfo.joinUser[0].userIcon"></span><span class="title">{{ lang.share.group.teamInviteCode }}</span>
        </p>
        <p>
          <span class="code">{{ userInfo.user.InviteID }}</span>
          <button :data-clipboard-text="userInfo.user.InviteID" class="copy clipboard">
            {{ lang.share.group.teamCopy }}
          </button>
        </p>
      </div>
      <button class="go-team" @click="logEvent('teamNow')">
        {{ userInfo.user.Status == 2 ? lang.share.group.teamSeeBtn : lang.share.group.teamBtn }}
      </button>
    </div>
    <div class="team-container-rule">
      <p v-if="userInfo.user.Status == 2" class="success">
        {{ lang.share.group.teamSuccess }}
      </p>
      <p v-else class="title" v-html="html.lessNum" />
      <p class="member">
        <span><img v-if="userInfo.joinUser[0] && userInfo.joinUser[0].userIcon" :src="userInfo.joinUser[0].userIcon"></span>
        <span><img v-if="userInfo.joinUser[1] && userInfo.joinUser[1].userIcon" :src="userInfo.joinUser[1].userIcon"></span>
      </p>
      <p class="sub-title">
        <span /><span>{{ lang.share.group.teamRule }}</span><span />
      </p>
      <p class="list">
        {{ lang.share.group.teamRuleTxt1 }}
      </p>
      <p class="list">
        {{ lang.share.group.teamRuleTxt2 }}
      </p>
      <p class="list">
        {{ lang.share.group.teamRuleTxt3 }}
      </p>
    </div>
  </div>
</template>

<script>
import Clipboard from 'clipboard'
import * as Utils from '~/utils'
export default {
  name: 'GroupTeamInfo',
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
    return {
      finishedNum: 2, // 完成人数
      html: {
        lessNum: ''
      }
    }
  },
  created () {
    console.log('userInfo=>', this.userInfo)
  },
  mounted () {
    this.clipboardInit()
    let userInfo = this.userInfo
    if (userInfo.user.Status == 1) {
      let num = this.finishedNum - parseInt(userInfo.joinUser.length || 0)
      this.html.lessNum = num > 0 ? (this.lang.share.group.teamNum).replace('{num}', '<span>' + num + '</span>') : this.lang.share.group.teamSuccess
    }
  },
  methods: {
    logEvent (key) {
      this.$emit('teamClick', key)
    },
    // 复制INIT
    clipboardInit () {
      let clipboardObj = new Clipboard('.clipboard')
      clipboardObj.on('success', (e) => {
        Utils.toast({
          message: 'Successful copy'
        })
      })
      clipboardObj.on('error', (e) => {
        Utils.toast({ message: 'Copy failed, please press and copy manually' })
      })
    }
  }
}
</script>

<style lang="scss">
.team-container {
  padding: 15px;
  &-invite {
    display: flex;
    flex-direction: column;
    .code-info {
      padding: 15px;
      background: #F6F6F6;
      border-radius: 5px;
      p {
        display: flex;
        align-items: center;
        width: 100%;
        border-radius: 20px;
        &:first-of-type {
          .avatar {
            display: inline-flex;
            width: 28px;
            height: 28px;
            background: #ddd;
            border-radius: 100%;
            overflow: hidden;
            img {
              width: 28px;
              height: 28px;
              border-radius: 100%;
              vertical-align: middle;
            }
          }
          .title {
            margin-left: 12px;
            font-family: PingFangSC-Semibold;
            font-size: 17px;
            color: #FD415F;
            font-weight: bold;
            font-style: normal;
            word-break: keep-all;
            word-wrap: break-word;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 1;
          }
        }
        &:last-of-type {
          justify-content: space-between;
          margin-top: 10px;
          .code {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            flex: 1;
            height: 42px;
            font-family: PingFangSC-Semibold;
            font-size: 20px;
            color: #3B424C;
            font-weight: bold;
            font-weight: bold;
            text-align: center;
            background: #FFF;
            border-radius: 21px;
          }
          .copy {
            // width: 85px;
            padding: 0 20px;
            height: 42px;
            background: transparent;
            font-family: PingFang-SC-Bold;
            font-size: 17px;
            color: #FD415F;
            font-weight: bold;
            border: 1px solid #FD415F; /*no*/
            border-radius: 21px;
            margin-left: 10px;

          }
        }
      }
    }
    .go-team {
      margin-top: 10px;
      width: 100%;
      height: 65px;
      line-height: 65px;
      border: none;
      font-family: PingFangSC-Medium;
      font-size: 18px;
      color: #FFFFFF;
      text-align: center;
      background: url(~assets/images/share/team/btn-bg.png) no-repeat left center;
      background-size: 100% auto;
    }
  }
  &-rule {
    margin-top: 10px;
    display: flex;
    flex-direction: column;
    background: #F6F6F6;
    border-radius: 5px;
    padding: 15px;
    .title {
      font-family: PingFangSC-Semibold;
      font-size: 18px;
      color: #3B424C;
      line-height: 24px;
      text-align: center;
      span {
        font-family: PingFangSC-Semibold;
        font-size: 18px;
        color: #FD3B57;
        line-height: 24px;
        margin: 0 5px;
      }
    }
    .success {
      font-family: PingFangSC-Semibold;
      font-size: 18px;
      color: #FD3B57;
      line-height: 24px;
      text-align: center;
    }
    .member {
      position: relative;
      margin: 15px 0;
      display: flex;
      justify-content: center;
      align-items: center;
      span {
        position: relative;
        display: inline-block;
        width: 40px;
        height: 40px;
        background: url(~assets/images/share/team/avatar-bg.png) no-repeat center;
        background-size: 40px 40px;
        border-radius: 100%;
        overflow: hidden;
        img {
          position: absolute;
          left: 0;
          top: 0;
          z-index: 3;
          width: 40px;
          height: 40px;
          border-radius: 100%;
          border: none;
        }
        &:not(:first-of-type) {
          margin-left: 15px;
        }
      }
    }
    .sub-title {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      margin: 10px auto;
      span {
        &:first-of-type {
          flex: 1;
          height: 1px; /*no*/
          display: inline-block;
          background: #D8D8D8;
          width: 90px;
        }
        &:nth-of-type(2) {
          padding: 0 35px;
          display: inline-block;
          font-family: PingFangSC-Medium;
          font-size: 15px;
          color: #3B424C;
        }
        &:last-of-type {
          flex: 1;
          height: 1px; /*no*/
          display: inline-block;
          background: #D8D8D8;
          width: 90px;
        }
      }
    }
    .list {
      font-family: PingFangSC-Regular;
      font-size: 12px;
      color: #3B424C;
      line-height: 20px;
      text-align: justify;
    }
  }
}
</style>
