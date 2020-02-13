<template>
  <div class="txt-container">
    <div class="txt-container-user">
      <img :data-url="mediaInfo.user.userIcon" :src="mediaInfo.user.userIcon" @click="logEvent('pgcPic')">
      <span>{{ mediaInfo.user.nickName }}</span>
    </div>
    <div class="txt-container-content" v-html="mediaInfo.basic.title" />
  </div>
</template>

<script>
export default {
  name: 'MediaTextInfo',
  props: {
    mediaInfo: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {}
  },
  methods: {
    logEvent (key) {
      this.$emit('textClick', key)
    }
  }
}
</script>

<style lang="scss">
// 文本
.txt-container {
  padding: 15px;
  background: #FFFFFF;
  &-user {
    display: flex;
    align-items: center;
    margin-bottom: 6px;
    img {
      width: 30px;
      height: 30px;
      border-radius: 100%;
      margin-right: 10px;
      vertical-align: middle;
    }
    span {
      font-family: PingFangSC-Semibold;
      font-size: 14px;
      color: #3B424C;
    }
  }
  &-content {
    font-family: PingFangSC-Regular;
    font-size: 15px;
    color: #3B424C;
    line-height: 23px;
    p {
      margin: 0;
      padding: 0;
    }
  }
}
</style>
