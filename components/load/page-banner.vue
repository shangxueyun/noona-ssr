<template>
  <div class="banner" :class="isTop ? 'top' : 'bottom'" @click="logEvent('topBanner')">
    <div class="left">
      <img src="~/assets/images/common/logo.png">
      <ul>
        <li>{{ lang.share.common.title }}</li>
        <li>{{ lang.share.common.desc }}</li>
      </ul>
    </div>
    <button @click.stop="logEvent('download')">
      {{ lang.share.common.download }}
    </button>
  </div>
</template>

<script>
export default {
  name: 'PageBanner',
  props: {
    lang: {
      type: Object,
      default: () => {}
    },
    isTop: {
      type: Boolean,
      default: true
    },
    pName: {
      type: String,
      default: 'seely'
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

<style lang="scss">
.banner {
  position: fixed;
  left: auto;
  right: auto;
  z-index: 9;
  width: 100%;
  max-width: 750px; /*no*/
  // transform: translateX(-50%);
  height: 60px;
  color: $color-white;
  padding: 0 5px 0 10px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background: #fff url(~assets/images/share/common/banner-bg@2x.png) no-repeat left top;
  background-size: contain;
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
      width: 40px;
      height: 40px;
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
        font-size: 12px;
        color: $color-262628;
        &:first-of-type {
          margin-bottom: 3px;
        }
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
    padding: 0 15px;
    color: $color-white;
    font-size: 14px;
    // width: 90px;
    height: 30px;
    line-height: 30px;
    text-align: center;
    border-radius: 90px;
    background: -webkit-linear-gradient(left, #FD8350, #FA2764);
    cursor: pointer;
    border: none;
    display: block;
  }
}
</style>
