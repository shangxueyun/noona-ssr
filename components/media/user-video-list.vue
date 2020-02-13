<template>
  <div class="user-video-list">
    <ul v-if="list && list.length > 0">
      <li v-for="(item) in list" :key="item.mediaId">
        <div :data-mediaid="item.mediaId" :style="item.cover[0] | formatImgUrl(item)" @click="logEvent('userVideo')" />
        <a v-if="item.stat.favoriteNum > 0" href="javascript:;" @click="logEvent('videoLike')">
          <img src="~/assets/images/share/user/video-like@2x.png"><span>{{ item.stat.favoriteNum }}</span>
        </a>
        <img v-if="item.type != 'video' && item.cover && item.cover.length" class="media-type" :class="formatImgClass(item)" :src="formatImgUrl(item)">
      </li>
    </ul>
    <ul v-else>
      <li class="no-video">
        <img src="~/assets/images/share/user/no-video@2x.png">{{ lang.share.user.noVideo }}
      </li>
    </ul>
  </div>
</template>

<script>
import imgGif from '~/assets/images/share/common/img-gif@2x.png'
import imgSingle from '~/assets/images/share/common/img-single@2x.png'
import imgList from '~/assets/images/share/common/img-list@2x.png'
export default {
  name: 'UserVideoList',
  props: {
    lang: {
      type: Object,
      default: () => {}
    },
    list: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {}
  },
  created () {
    console.log('list=>', this.list)
  },
  methods: {
    logEvent (key) {
      this.$emit('userVideoClick', key)
    },
    getImgSuffix (item) {
      let covers = item.cover
      let suffix = ''
      for (let i = 0; i < covers.length; i++) {
        let coverUrl = covers[i][1].url
        let pointPos = coverUrl.lastIndexOf('.')
        let curSuffix = coverUrl.substring(pointPos + 1, coverUrl.length)
        if (curSuffix.toLowerCase() == 'gif') {
          suffix = curSuffix
          break
        }
      }
      return suffix
    },
    formatImgClass (item) {
      let suffix = this.getImgSuffix(item)
      let className = 'media-img'
      if (suffix == 'gif') {
        className = 'media-gif'
      }
      return className
    },
    formatImgUrl (item) {
      let url
      let suffix = this.getImgSuffix(item)
      if (suffix == 'gif') {
        url = imgGif
      } else if (item.cover.length > 1) {
        url = imgList
      } else {
        url = imgSingle
      }
      return url
    }
  }
}
</script>

<style lang="scss">
.user-video-list {
  // padding-bottom: 60px;
  margin-top: 20px;
  ul {
    width: 100%;
    li {
      position: relative;
      width: 33.33%;
      padding-top: 33%;
      height: 0;
      overflow: hidden;
      border-style: solid;
      border-color: #FFF;
      display: inline-block;
      vertical-align: top;
      background: #EEE;
      &:nth-of-type(3n+1) {
        border-width: 2px 1px 0 0; /*no*/
      }
      &:nth-of-type(3n+2) {
        border-width: 2px 1px 0 1px; /*no*/
      }
      &:nth-of-type(3n+3) {
        border-width: 2px 0 0 1px; /*no*/
      }
      &.no-video {
        text-align: center;
        width: 100%;
        padding: 0;
        height: auto;
        border: none;
        color: $color-999;
        font-size: $font15;
        display: inline-flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        background: #FFF;
        padding: 50px 0;
        img {
          width: 50px;
          margin-bottom: 10px;
        }
      }
      img {
        &.containW {
          width: 100%;
          height: auto;
        }
        &.containH {
          width: auto;
          height: 100%;
        }
        &.media-type {
          position: absolute;
          right: 4px;
          top: 4px;
          z-index: 9;
        }
        &.media-img {
          width: 24px;
          height: 24px;
        }
        &.media-gif {
          width: 26px;
          height: 16px;
        }
      }
      div {
        position: absolute;
        left: 0;
        top: 0;
        z-index: 3;
        width: 100%;
        height: 100%;
        background-color: #eee;
        background-position: center;
        background-size: cover;
      }
      a {
        display: block;
        position: absolute;
        right: 7px;
        bottom: 7px;
        z-index: 5;
        color: $color-white;
        display: inline-block;
        height: 22px;
        line-height: 22px;
        img {
          width: 14px;
          height: 14px;
          vertical-align: middle;
          margin-right: 2px;
        }
        span {
          font-size: $font12;
          vertical-align: middle;
        }
      }
    }
  }
}
</style>
