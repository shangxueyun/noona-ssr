<template>
  <div ref="mainContainer" class="main-container">
    <div v-if="userInfo && userInfo.basic" class="invite-container">
      <div class="invite-container__header">
        <div class="invite-container__header-banner">
          <img src="~/assets/images/share/invite/head_logo@2x.png">
          <span>{{ langs.share.invite.topTips }}</span>
        </div>
      </div>
      <div class="invite-container__main">
        <!-- <p class="title">
          {{ langs.share.invite.title }}
        </p> -->
        <p class="gift">
          <!-- <strong>{{ langs.share.invite.subTitleNum }}</strong><span>{{ langs.share.invite.subTitle }}</span> -->
        </p>
        <p class="userIcon">
          <span><img v-if="userInfo.basic.userIcon" :src="userInfo.basic.userIcon"></span>
          <span>{{ userInfo.basic.nickName }}</span>
          <span>{{ langs.share.invite.inviteTxt }}</span>
        </p>
        <p class="inviteCode">
          <span>
            <em>{{ langs.share.invite.inviteCodeTxt }}</em>
            <strong>{{ userInfo.private.inviteCode }}</strong>
          </span>
          <button :data-clipboard-text="userInfo.private.inviteCode" class="clipboard">
            {{ langs.share.invite.btnCopyTxt }}
          </button>
        </p>
        <p class="copyTips">
          {{ langs.share.invite.copyTxt }}
        </p>
      </div>
      <div class="invite-container__footer">
        <button @click="logEvent('inviteDownload')">
          {{ langs.share.invite.btnDownloadTxt }}
        </button>
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
import { pageLoading } from '~/components/load'
import Log from '~/plugins/log'
import Clipboard from 'clipboard'
import * as Utils from '@/utils'
import defaultAvatar from '~/assets/images/common/default-avatar@3x.png'
import shareLogo from '~/static/images/share/logo.jpeg'
export default {
  name: 'ShareInvite',
  components: {
    pageLoading
  },
  data () {
    return {
      userInfo: {}, // 语言包
      loadingStatus: 1 // 0加载完成，1加载中，2重试，3加载数据为空404，4删除，5审核
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

      // 用户信息
      userId: state => state.inviteInfo.userId
    })
  },
  async asyncData ({ store, route, req, error }) {
    return store.dispatch('getUserInviteInfo').then((resData) => {
      const langs = store.state.common.langs
      let loadingStatus = 1
      let metaInfo = {
        title: langs.share.invite.shareTitle || langs.common.seo.title,
        description: langs.share.invite.shareDesc || langs.common.seo.description,
        image: shareLogo,
        imagewidth: 120,
        imageheight: 120
      }
      let userInfo = (resData && resData.user) || {}
      if (userInfo && userInfo.basic) {
        userInfo.basic.userIcon = userInfo.basic.userIcon || defaultAvatar
        return {
          loadingStatus,
          metaInfo,
          userInfo
        }
      } else {
        loadingStatus = 3
        return {
          loadingStatus,
          metaInfo,
          userInfo
        }
      }
    })
  },
  head () {
    return {
      title: this.metaInfo.title,
      meta: [
        ...this.meta,
        { name: 'description', content: this.metaInfo.description },
        // facebook
        { property: 'og:title', content: this.metaInfo.title },
        { property: 'og:description', content: this.metaInfo.description },
        { property: 'og:image', content: this.metaInfo.image },
        { property: 'og:image:width', content: this.metaInfo.imagewidth },
        { property: 'og:image:height', content: this.metaInfo.imageheight },

        { itemprop: 'name', content: this.metaInfo.title },
        { itemprop: 'image', content: this.metaInfo.image },
        { itemprop: 'description', content: this.metaInfo.description },

        // twitter
        { name: 'twitter:title', content: this.metaInfo.title },
        { name: 'twitter:image:src', content: this.metaInfo.image },
        { name: 'twitter:description', content: this.metaInfo.description }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: this.icoUrl }
      ]
    }
  },
  mounted () {
    this.clipboardInit()
  },
  methods: {
    // 日志投递
    logEvent (key, params = {}) {
      const schemeUrl = `newspark://web/`
      const options = {
        app: 'noonaH5',
        page: 'shareInvite',
        params: { schemeUrl, ...params }
      }
      console.log({ key, ...options })
      Log.event({ key, ...options })
    },
    // 复制INIT
    clipboardInit () {
      let clipboardObj = new Clipboard('.clipboard')
      clipboardObj.on('success', (e) => {
        Utils.toast({
          message: 'Successful copy'
        })
        // Log.logEvent('copy')
      })
      clipboardObj.on('error', (e) => {
        // Log.logEvent('copy')
        Utils.toast({ message: 'Copy failed, please press and copy manually' })
      })
    }
  }
}
</script>

<style lang="scss">
.invite-container {
  min-height: 100vh;
  // font-family: PingFang-SC-Medium;
  &__header {
    position: relative;
    width: 100%;
    height: 40px;
    &-banner {
      position: fixed;
      top: 0;
      left: auto;
      right: auto;
      z-index: 9;
      width: 100%;
      max-width: 750px; /*no*/
      height: 40px;
      padding: 0 17px;
      background: #e04141;
      display: flex;
      justify-content: space-between;
      align-items: center;
      img {
        width: 50px;
        height: 28px;
      }
      span {
        // font-family: HelveticaNeue-Medium;
        font-size: 14px;
        color: rgba(255, 255, 255, 0.9);
      }
    }
  }
  &__main {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    p {
      width: 100%;
      text-align: center;
      &.title {
        background-image: linear-gradient(-39deg, #3B57F9 0%, #8E3CF5 100%);
        background-clip: text;
        -webkit-text-fill-color: transparent;
        margin-top: 10px;
        // font-family: HelveticaNeue-CondensedBlack;
        font-size: 30px;
        color: #262628;
        font-weight: bold;
      }
      &.gift {
        display: inline-flex;
        justify-content: center;
        align-items: flex-start;
        margin-top: 10px;
        width: 280px;
        height: 247px;
        background: url(~assets/images/share/invite/gift_txt@2x.png) no-repeat center;
        background-size: 280px 247px;
        strong {
          font-size: 30px;
          color: #fff;
          font-weight: bold;
          margin-right: 5px;
          line-height: 35px;
        }
        span {
          // font-family: HelveticaNeue-BoldItalic;
          font-size: 20px;
          color: #fff;
          line-height: 35px;
        }
      }
      &.userIcon {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-top: 22px;
        span {
          // font-family: PingFangSC-Semibold;
          font-size: 17px;
          color: #262626;
          &:first-of-type {
            width: 40px;
            height: 40px;
            background: #f3f4f5;
            border-radius: 100%;
            overflow: hidden;
            margin-bottom: 15px;
            img {
              width: 40px;
              height: 40px;
              border-radius: 100%;
              vertical-align: middle;
            }
          }
          &:last-of-type {
            // font-family: PingFangSC-Semibold;
            font-size: 14px;
            color: #9999a1;
            margin-top: 5px;
          }
        }
      }
      &.inviteCode {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 25px 20px 0;
        span {
          display: inline-flex;
          justify-content: space-between;
          align-items: center;
          flex: 1;
          background: #f2f3f4;
          padding: 10px 18px;
          border-radius: 20px;
          margin-right: 15px;
          em {
            font-style: normal;
            // font-family: PingFangSC-Semibold;
            font-size: 14px;
            color: #9999A1;
          }
          strong {
            // font-family: PingFangSC-Semibold;
            font-size: 20px;
            color: #3B424C;
            text-align: center;
          }
        }
        button {
          width: 75px;
          padding: 10px 0;
          // height: 40px;
          // line-height: 40px;
          // font-family: PingFang-SC-Bold;
          font-size: 17px;
          color: #e04141;
          text-align: center;
          border-radius: 20px;
          border: 1px solid #e04141; /*no*/
          background: transparent;
        }
      }
      &.copyTips {
        margin-top: 10px;
        // font-family: PingFang-SC-Bold;
        font-size: 14px;
        color: #9999A1;
        text-align: left;
        padding-left: 38px;
      }
    }
  }
  &__footer {
    display: flex;
    padding: 26px 15px;
    button {
      width: 100%;
      padding: 15px 0;
      border: none;
      outline: none;
      background-image: linear-gradient(-39deg, #ff5a5a 0%, #e04141 100%);
      border-radius: 25px;
      box-shadow: 5px 15px 20px 0 rgba(0, 0, 0, 0.2); /*no*/
      // font-family: PingFangSC-Medium;
      font-size: 18px;
      color: #fff;
      letter-spacing: 0;
      text-align: center;
    }
  }
}
</style>
