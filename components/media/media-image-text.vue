<template>
  <!-- 图文 -->
  <div class="media-container-image-text">
    <div v-if="mediaInfo.basic.title" class="title" @click="isFeedModel ? '' : logEvent('mediaInfoTitle', {mediaId: mediaInfo.mediaId, type: mediaInfo.type})">
      {{ mediaInfo.basic.title }}
    </div>
    <div v-if="mediaInfo.cover && mediaInfo.cover.length > 0" class="list" :class=" mediaInfo.cover | formatImgListClass" @click="isFeedModel ? '' : logEvent('mediaInfoImage', {mediaId: mediaInfo.mediaId, type: mediaInfo.type}, $event)">
      <template v-for="(covers, index) in mediaInfo.cover">
        <div v-if="index < 9" :key="index">
          <span class="cover" :style="covers | formatImgUrl(mediaInfo)" :data-privatestatus="covers[1].lock || 0" />
          <!-- 显示图片标识(锁) -->
          <span :class="covers | formatImgFlagClass" :data-privatestatus="covers[1].lock || 0" />
        </div>
      </template>
      <!-- 大于9张显示 -->
      <span v-if="mediaInfo.cover.length > 9" class="diff">+{{ mediaInfo.cover.length - 9 }}</span>
    </div>
    <!-- 邀请组队 -->
    <div v-else-if="iStatus && mediaInfo.basic.privateStatus != 10" class="bg" />
    <template v-if="iStatus && mediaInfo.basic.privateStatus != 10">
      <div class="mask" />
      <div class="tips">
        <p class="txt">
          {{ lang.share.group.teamTips }}
        </p>
        <p><span v-html="formatPlayNum(mediaInfo.group[0].stat)" /></p>
      </div>
    </template>
  </div>
</template>

<script>
export default {
  name: 'MediaImageText',
  props: {
    iStatus: {
      type: Boolean,
      default: false
    },
    isFeedModel: {
      type: Boolean,
      default: false
    },
    lang: {
      type: Object,
      default: () => {}
    },
    mediaInfo: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      diffLen: 0
    }
  },
  methods: {
    logEvent (key, params, e) {
      console.log('key=>', key, 'params=>', params, 'e=>', e)
      this.$emit('imageClick', key, params, e)
    },
    formatPlayNum (stat) {
      let playNum = (stat && stat.playNum) || 0
      let privateNum = this.lang.share.group.privateNum
      if (parseInt(playNum) < 100) {
        playNum = Math.floor(Math.random() * (10000 - 100) + 100)
      } else if (parseInt(playNum) > 9999) {
        playNum = Math.floor(playNum / 10000) + 'W'
      }
      return privateNum.replace('{num}', playNum)
    }
  }
}
</script>

<style lang="scss">
// 图文
.media-container-image-text {
  // margin-top: 10px;
  position: relative;
  overflow: hidden;
  .title {
    font-family: PingFangSC-Regular;
    font-size: 15px;
    line-height: 1.5;
    color: #3B424C;
    word-break: keep-all;
    word-wrap: break-word;
    margin-bottom: 10px;
  }
  // 图片列表
  .list {
    position: relative;
    // display: flex;
    // border-radius: 5px;
    overflow: hidden;
    // margin-bottom: 10px;
    background: #b2b2b2;
    div {
      position: relative;
      border-style: solid;
      border-color: #FFF;
      background: #EEE;
      overflow: hidden;
      height: 0;
      display: inline-block;
      vertical-align: middle;
      span {
        position: absolute;
        top: 4px;
        right: 4px;
        z-index: 4;
        &.cover {
          left: 0;
          top: 0;
          z-index: 3;
          width: 100%;
          height: 100%;
          background-color: #eee;
          background-position: center;
          background-size: cover;
        }
        &.none {
          background: transparent;
        }
        &.img {
          width: 24px;
          height: 24px;
          background: url(~assets/images/share/common/img-single@2x.png) no-repeat center;
          background-size: 24px 24px;
        }
        &.lock {
          width: 16px;
          height: 16px;
          background: url(~assets/images/share/common/img-lock@2x.png) no-repeat center;
          background-size: 16px 16px;
        }
        &.gif {
          width: 24px;
          height: 16px;
          background: url(~assets/images/share/common/inspub-gif@2x.png) no-repeat center;
          background-size: 24px 16px;
        }
        &.gif-lock {
          width: 32px;
          height: 16px;
          background: url(~assets/images/share/common/inspub-gif-lock@2x.png) no-repeat center;
          background-size: 32px 16px;
        }
      }
    }
    .diff {
      position: absolute;
      right: 10px;
      bottom: 10px;
      z-index: 5;
      color: #FFF;
      font-size: 20px;
    }
    &.custom {
      div {
        border-width: 0;
        width: 60%;
        // padding-top: 55%;
      }
    }
    &.one {
      div {
        width: 345px;
        height: 194px;
        // border-radius: 5px;
        border-width: 0;
      }
    }
    &.two {
      div {
        width: 50%;
        padding-top: 50%;
        &:nth-of-type(odd) {
          border-width: 2px 1px 0 0; /*no*/
        }
        &:nth-of-type(even) {
          border-width: 2px 0 0 1px; /*no*/
        }
        &:nth-of-type(1) {
          border-width: 0 1px 0 0; /*no*/
        }
        &:nth-of-type(2) {
          border-width: 0 0 0 1px; /*no*/
        }
      }
    }
    &.three {
      div {
        width: 33.3333%;
        padding-top: 33.3333%;
        &:nth-of-type(3n+1) {
          border-width: 2px 1px 0 0; /*no*/
        }
        &:nth-of-type(3n+2) {
          border-width: 2px 1px 0 2px; /*no*/
        }
        &:nth-of-type(3n+3) {
          border-width: 2px 0 0 1px; /*no*/
        }
        &:nth-of-type(1) {
          border-width: 0 1px 0 0; /*no*/
        }
        &:nth-of-type(2) {
          border-width: 0 1px 0 1px; /*no*/
        }
        &:nth-of-type(3) {
          border-width: 0 0 0 1px; /*no*/
        }
      }
    }
  }
  // 默认背景
  .bg {
    display: block;
    width: 345px;
    height: 194px;
    background-color: #F3F4F5;
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
  }
  .mask {
    position: absolute;
    left: 0;
    top: 0;
    opacity: 0.5;
    background: #000000;
    z-index: 7;
    width: 100%;
    height: 100%;
  }
  .tips {
    position: absolute;
    left: 0;
    top: 0;
    z-index: 8;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    p {
      font-family: PingFangSC-Medium;
      font-size: 15px;
      color: #FFFFFF;
      text-align: center;
      text-shadow: 0 2px 4px rgba(0,0,0,0.50);
      line-height: 1.5;
      &.txt {
        width: 60%;
        word-break: keep-all;
        word-wrap: break-word;
      }
      span {
        margin-top: 10px;
        opacity: 0.8;
        background: #FFFFFF;
        border-radius: 12px;
        font-family: PingFangSC-Regular;
        font-size: 12px;
        color: #3B424C;
        padding: 2px 10px;
      }
    }
  }
}
</style>
