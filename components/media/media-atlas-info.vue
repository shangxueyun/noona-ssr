<template>
  <div class="img-container" :style="{'max-height': mediaInfo.containerHeight + 'px'}">
    <div class="img-container-user">
      <img :data-url="mediaInfo.user.userIcon" :src="mediaInfo.user.userIcon" @click="logEvent('pgcPic')">
      <span>
        <em>{{ mediaInfo.user.nickName }}</em>
      </span>
    </div>
    <div class="img-container-list">
      <page-swiper v-if="mediaInfo.cover && mediaInfo.cover.length > 1" :list="mediaInfo.cover" />
      <img v-else class="img-single" :src="mediaInfo.cover[0][1].url">
    </div>
    <img class="img-container-type" :class="formatImgClass(mediaInfo.cover)" :src="formatImgUrl(mediaInfo.cover)">
  </div>
</template>

<script>
import pageSwiper from '~/components/swiper'
import imgGif from '~/assets/images/share/common/img-gif@2x.png'
import imgSingle from '~/assets/images/share/common/img-single@2x.png'
import imgList from '~/assets/images/share/common/img-list@2x.png'
export default {
  name: 'MediaAtlasInfo',
  components: {
    pageSwiper
  },
  props: {
    mediaInfo: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {}
  },
  beforeMount () {
    this.fontSize = parseFloat(document.documentElement.style.fontSize)
    this.wsWidth = (document.body.clientWidth || document.documentElement.clientWidth)
    this.wsHeight = window.screen.availHeight
    let mediaInfo = this.mediaInfo
    console.log('mediaInfo=>', mediaInfo)
    // console.log('videoList=>', this.videoList)
    let covers = mediaInfo.cover
    // let coverWidth = covers[0].width || this.wsWidth
    // let coverHeight = covers[0].height || (this.fontSize * 4.2)
    let coverWidth = covers[0].width < this.wsWidth ? covers[0].width : this.wsWidth
    let coverHeight = covers[0].height
    let coverFH = Math.floor((coverHeight * this.wsWidth) / coverWidth)
    let topBannerH = Math.round(1.2 * this.fontSize)
    let maxHeight = this.wsHeight - topBannerH
    coverFH = coverFH > maxHeight ? maxHeight : coverFH
    this.mediaInfo.minHeight = 'auto'
    this.mediaInfo.containerHeight = coverFH
  },
  methods: {
    logEvent (key) {
      this.$emit('imageClick', key)
    },
    getImgSuffix (covers) {
      let suffix = 'gif'
      for (let i = 0; i < covers.length; i++) {
        let coverUrl = covers[i][1].url
        let pointPos = coverUrl.lastIndexOf('.')
        let curSuffix = coverUrl.substring(pointPos + 1, coverUrl.length)
        if (curSuffix.toLowerCase() != 'gif') {
          suffix = curSuffix
          break
        }
      }
      return suffix
    },
    formatImgClass (covers) {
      let suffix = this.getImgSuffix(covers)
      let className = 'media-img'
      if (suffix == 'gif') {
        className = 'media-gif'
      }
      return className
    },
    formatImgUrl (covers) {
      let url
      let suffix = this.getImgSuffix(covers)
      if (suffix == 'gif') {
        url = imgGif
      } else if (covers.length > 1) {
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
// 图文
.img-container {
  position: relative;
  overflow: hidden;
  background: #DDD;
  &-user {
    position: absolute;
    left: 10px;
    bottom: 10px;
    z-index: 5;
    height: 30px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    background: rgba(0, 0, 0, .5);
    border-radius: 30px;
    padding-right: 15px;
    img {
      width: 30px;
      height: 30px;
      border-radius: 100%;
      margin-right: 5px;
    }
    span {
      display: flex;
      flex-direction: column;
      justify-content: center;
      color: $color-white;
      font-size: 12px;
      text-align: left;
    }
  }
  &-list {
    // height: 100%;
    display: flex;
    flex-direction: column;
    .img-single {
      width: 100%;
    }
    // align-items: center;
    // justify-content: center;
    // img {
    //   width: 100%;
    //   &:not(:first-of-type) {
    //     margin-top: 5px;
    //   }
    // }
  }
  &-type {
    position: absolute;
    right: 12px;
    top: 12px;
    z-index: 3;
    &.media-img {
      width: 24px;
      height: 24px;
    }
    &.media-gif {
      width: 26px;
      height: 16px;
    }
  }
}
</style>
