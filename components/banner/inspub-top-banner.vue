<template>
  <div class="banner" :class="isTop ? 'top' : 'bottom'" @click="logEvent('topBanner')">
    <div class="left">
      <img src="~/assets/images/common/logo.png">
      <ul>
        <!-- <li>{{ lang.share.common.title }}</li> -->
        <li>{{ lang.share.group.inviteDesc }}</li>
      </ul>
    </div>
    <button @click.stop="logEvent('download')">
      {{ lang.share.group.inviteJoinBtn }}
    </button>
  </div>
</template>

<script>
export default {
  name: 'InspubTopBanner',
  props: {
    lang: {
      type: Object,
      default: () => {}
    },
    isTop: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {}
  },
  methods: {
    logEvent (key) {
      this.$emit('bannerClick', key)
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
    img {
      width: 36px;
      height: 36px;
      border-radius: 10px;
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
        font-size: 14px;
        color: #3B424C;
        // &:first-of-type {
        //   margin-bottom: 3px;
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
    padding: 10px 30px;
    font-family: PingFangSC-Medium;
    font-size: 14px;
    color: #FFFFFF;
    text-align: center;
    background: #FD3A56;
    border-radius: 30px;
    cursor: pointer;
    border: none;
    display: block;
  }
}
</style>
