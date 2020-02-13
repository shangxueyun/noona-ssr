<template>
  <div class="error-container">
    <div v-if="mediaType == 'text'" class="txt-container">
      <div class="txt-container-user">
        <img :data-url="userInfo.userIcon" :src="userInfo.userIcon" @click="logEvent('pgcPic')">
        <span>{{ userInfo.nickName }}</span>
      </div>
      <div class="img-container-content" v-html="errorText" />
    </div>
    <div v-else class="img-container">
      <div class="img-container-content" v-html="errorText" />
      <div class="img-container-user">
        <img :data-url="userInfo.userIcon" :src="userInfo.userIcon" @click="logEvent('pgcPic')">
        <span>
          <em>{{ userInfo.nickName }}</em>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MediaStatus',
  props: {
    errorText: {
      type: String,
      default: ''
    },
    userInfo: {
      type: Object,
      default: () => {}
    },
    mediaType: {
      type: String,
      default: 'img'
    }
  },
  data () {
    return {}
  },
  methods: {
    logEvent (key) {
      this.$emit('errorClick', key)
    }
  }
}
</script>

<style lang="scss">
.error-container {
  .img-container {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    position: relative;
    padding: 15px;
    background: #FFF;
    &-user {
      position: relative;
      height: 30px;
      display: inline-flex;
      flex-direction: row;
      // justify-content: space-between;
      background: rgba(0, 0, 0, .7);
      border-radius: 30px;
      padding-right: 15px;
      img {
        width: 30px;
        height: 30px;
        border-radius: 100%;
        margin-right: 5px;
      }
      span {
        display: inline-flex;
        flex-direction: column;
        justify-content: center;
        color: #FFF;
        font-size: 12px;
        text-align: left;
      }
    }
    &-content {
      padding: 40px 0;
      font-family: PingFang-SC-Medium;
      font-size: 15px;
      color: #9999A1;
      letter-spacing: 0;
      text-align: center;
      align-self: center;
    }
  }
  .txt-container {
    position: relative;
    padding: 15px;
    background: #FFF;
    &-user {
      display: flex;
      align-items: center;
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
      padding: 40px 0;
      font-family: PingFang-SC-Medium;
      font-size: 15px;
      color: #9999A1;
      letter-spacing: 0;
      text-align: center;
    }
  }
}
</style>
