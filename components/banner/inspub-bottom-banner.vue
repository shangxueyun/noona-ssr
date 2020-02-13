<template>
  <div class="banner" :class="isTop ? 'top' : 'bottom'" @click="logEvent('bottomBanner')">
    <div class="left">
      <img src="~/assets/images/share/group/bonus.png">
      <ul>
        <!-- <li>{{ lang.share.common.title }}</li> -->
        <li>{{ lang.share.group.inviteBottomBanner }}</li>
      </ul>
    </div>
    <button v-if="inviteCode" :data-clipboard-text="inviteCode" class="copy clipboard">
      {{ lang.share.group.inviteCopyCode }}<br>{{ inviteCode }}
    </button>
    <button v-else class="download" @click.stop="logEvent('download')">
      {{ lang.share.common.download }}
    </button>
  </div>
</template>

<script>
import Clipboard from 'clipboard'
import * as Utils from '~/utils'
export default {
  name: 'InspubBottomBanner',
  props: {
    lang: {
      type: Object,
      default: () => {}
    },
    isTop: {
      type: Boolean,
      default: true
    },
    inviteCode: {
      type: String,
      default: ''
    }
  },
  data () {
    return {}
  },
  mounted () {
    this.clipboardInit()
  },
  methods: {
    logEvent (key) {
      this.$emit('bannerClick', key)
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

<style lang="scss" scoped>
.banner {
  position: fixed;
  left: auto;
  right: auto;
  z-index: 9;
  width: 100%;
  max-width: 750px; /*no*/
  // transform: translateX(-50%);
  height: 50px;
  padding: 0 15px 0 12px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background: #FAFAFA;
  &.top {
    top: 0;
  }
  &.bottom {
    bottom: 0;
  }
  .left {
    display: flex;
    flex: 1;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin-right: 10px;
    img {
      width: 26px;
      height: 33px;
      border: none;
      margin-right: 10px;
      vertical-align: middle;
    }
    ul {
      display: flex;
      flex: 1;
      flex-direction: column;
      justify-content: center;
      li {
        font-family: PingFangSC-Medium;
        font-size: 12px;
        line-height: 1.2;
        color: #F16D23;
        word-break: keep-all;
        word-wrap: break-word;
        // text-align: justify;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        // &:first-of-type {
        //   margin-top: 3px;
        // }
        span {
          color: #F5A623;
          font-size: 12px;
          &.space {
            margin: 0 5px;
          }
          &.space-right {
            margin-right: 5px;
          }
        }
      }
    }
  }
  button {
    position: relative;
    font-family: PingFangSC-Medium;
    font-size: 12px;
    color: #FFFFFF;
    text-align: center;
    background: #FD3A56;
    border-radius: 30px;
    cursor: pointer;
    border: none;
    display: block;
    padding: 8px 20px;
  }
}
</style>
