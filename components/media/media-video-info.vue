<template>
  <div class="media-video-container">
    <!-- <div v-if="mediaInfo.basic.privateStatus && mediaInfo.basic.privateStatus != 10" class="video-container-private" :data-id="mediaInfo.mediaId" :data-privatestatus="mediaInfo.basic.privateStatus" :style="mediaInfo.cover[0] | formatImgUrl(mediaInfo)">
      <span class="video-lock" :data-id="mediaInfo.mediaId" :data-privatestatus="mediaInfo.basic.privateStatus"></span>
      <span class="time">{{ mediaInfo.basic.duration | formatVideoDuration }}</span>
    </div> -->
    <div class="video-container" :class="{'rec-video': isExistRec}">
      <!-- <div class="player-container" :style="{'height': mediaInfo.containerHeight + 'px', 'min-height': mediaInfo.minHeight}"> -->
      <div class="player-container" :style="formatWidthHeight(mediaInfo.video.playUrl[0])">
        <div class="player-container-video">
          <video
            ref="videoPlayer"
            :class="'video' + mediaInfo.mediaId"
            :data-width="mediaInfo.video.playUrl[0].width || ''"
            :data-height="mediaInfo.video.playUrl[0].height || ''"
            :poster="mediaInfo.cover[0][1].url || mediaInfo.cover[0][1].url2"
            :src="mediaInfo.video.playUrl[0].url || mediaInfo.video.playUrl[0].url2"
            controls="controls"
            webkit-playsinline="true"
            playsinline="true"
            x5-video-player-type="h5"
            x5-video-player-fullscreen="true"
            x5-video-orientation="portraint"
            preload="auto"
            @click.stop=""
          />
        </div>
        <!-- 封面图 -->
        <div v-if="mediaInfo && mediaInfo.cover && mediaInfo.playStatus" class="player-container-poster" :style="{'background-image': 'url('+ (mediaInfo.cover[0][1].url || mediaInfo.cover[0][1].url2) + ')'}" />
        <!-- 开始播放 -->
        <div v-if="mediaInfo.playStatus == 1 || mediaInfo.playStatus == 5" class="player-container-layer" @click.stop="playControl(1)">
          <span v-if="mediaInfo.playStatus == 1" class="play-btn" />
          <span v-if="isShowDuration && mediaInfo.basic.duration" class="play-time">{{ mediaInfo.basic.duration | formatVideoDuration }}</span>
          <!-- 显示封图上用户信息 -->
          <div v-if="layout == 'layer' && mediaInfo.user && mediaInfo.user.userIcon" class="user">
            <img :data-url="mediaInfo.user.userIcon" :src="mediaInfo.user.userIcon" @click.stop="logEvent('pgcPic')">
            <span>
              <em>{{ mediaInfo.user.nickName }}</em>
            </span>
          </div>
        </div>
        <!-- 加载中 -->
        <div v-if="mediaInfo.playStatus == 2" class="player-container-layer">
          <div class="loading">
            Loading...
          </div>
        </div>
        <!-- 重播 -->
        <div v-if="mediaInfo.playStatus == 3" class="player-container-layer mask" @click.stop="playControl(3)">
          <span class="replay-btn">{{ lang.share.video.replay }}</span>
          <span v-if="isShowDuration && mediaInfo.basic.duration" class="play-time">{{ mediaInfo.basic.duration | formatVideoDuration }}</span>
        </div>
        <!-- 网络错误重试 -->
        <div v-if="mediaInfo.playStatus == 4" class="player-container-layer mask" @click.stop="playControl(4)">
          <span class="retry-txt">{{ lang.share.video.failedLoad }}</span>
          <span class="retry-txt retry-btn">{{ lang.share.video.retryBtn }}</span>
        </div>
        <!-- 试看结束 -->
        <div v-if="mediaInfo.playStatus == 6" class="player-container-layer mask" @click.stop="playControl(10)">
          <span class="see-tips">{{ lang.share.video.seeTips }}</span>
          <span class="see-btn">{{ lang.share.video.see }}</span>
          <span v-if="isShowDuration && mediaInfo.basic.duration" class="play-time">{{ mediaInfo.basic.duration | formatVideoDuration }}</span>
        </div>
        <!-- 非wifi提示 -->
        <div v-if="mediaInfo.playStatus == -1" class="player-container-layer mask">
          <div class="tips">
            <p class="title">
              {{ lang.share.video.tips1 }}
            </p>
            <p class="title">
              {{ lang.share.video.tips2 }}
            </p>
            <p class="button">
              <button class="cancel" @click.stop="playControl(6)">
                {{ lang.share.video.cancelBtn }}
              </button>
              <button class="continue" @click.stop="playControl(7)">
                {{ lang.share.video.continueBtn }}
              </button>
            </p>
          </div>
        </div>
      </div>
      <!-- 播放结束显示推荐 -->
      <div v-if="mediaInfo.playStatus == 5" class="recommend-container">
        <ul>
          <li v-for="(recItem) in recVideoList" :key="recItem.mediaId | formatKey" @click.stop="logEvent('recVideo', {mediaId: recItem.mediaId})">
            <div v-if="recItem.cover && recItem.cover.length > 0" :style="{'background-image': 'url('+ recItem.cover[0][1].url + ')'}" />
            <span class="play-btn" />
            <div>
              <p>{{ recItem.basic.title }}</p>
              <span class="play-process" :class="{'progressBar-ani': progressBar}" />
            </div>
          </li>
        </ul>
        <button class="btn-continue" @click.stop="playControl(8)">
          {{ lang.share.video.keepPlaying }}
        </button>
        <a href="javascript:;" class="btn-replay" @click.stop="playControl(3)">{{ lang.share.video.replay }}</a>
      </div>
    </div>
    <div v-if="layout == 'under'" class="media-desc-container">
      <div class="title" :class="{expand: isExpand}" @click.stop="isExpand = !isExpand">
        {{ mediaInfo.basic.title }}<i v-show="isShowFlag" :class="{up: isExpand}" />
      </div>
      <div v-if="mediaInfo && mediaInfo.group && mediaInfo.group[0]" ref="groupContainer" class="group">
        <span>{{ mediaInfo.group[0].basic.title }}</span>
        <button @click.stop="logEvent('joinGroupBtn')">
          {{ lang.share.group.inviteJoinBtn }}
        </button>
      </div>
      <div v-else ref="authorContainer" class="author">
        <section>
          <span><img class="lazy" :src="mediaInfo.user.userIcon" @click.stop="logEvent('pgcPic')"></span>
          <span><strong>{{ mediaInfo.user.nickName }}</strong></span>
          <!-- <em>{{ mediaInfo.basic.addTime | formatAddTime }}</em> -->
        </section>
        <button @click.stop="logEvent('followBtn')">
          {{ lang.media.news.followBtn }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MediaVideoInfo',
  props: {
    lang: {
      type: Object,
      default: () => {}
    },
    isFeedModel: {
      type: Boolean,
      default: false
    },
    isShowDuration: {
      type: Boolean,
      default: false
    },
    isFlexPlayer: {
      type: Boolean,
      default: false
    },
    pName: {
      type: String,
      default: 'newspark'
    },
    mediaInfo: {
      type: Object,
      default: () => {}
    },
    videoLists: {
      type: Array,
      default: () => []
    },
    layout: {
      type: String,
      default: 'none'
    }
  },
  data () {
    return {
      item: {},
      net: 1, // -1: 无网络 (或无法识别) 0: 无网络 (或无法识别) 1: WIFI
      fontSize: 50,
      isShowFlag: false,
      isExpand: false,
      randomNum: 4, // 随机显示视频数量
      playStatus: 1, // 0播放中,1开始播放,2加载中,3重播,4重试,5暂停-1非wifi提示,6试看结束
      recProcessTimer: null, // 推荐倒计时
      progressBar: false, // 倒计时进度条
      videoDom: {}, // 视频dom
      videoList: [],
      isExistRec: false, // 是否有推荐视频
      recVideoList: [] // 推荐视频列表
    }
  },
  watch: {
    videoLists (val) {
      // 直接读取已有视频列表数据
      if (val && val.length >= this.randomNum) {
        this.videoList = val
        this.recVideoList = this.getRandomList(this.videoList, this.randomNum)
      }
    }
  },
  beforeMount () {
    this.fontSize = parseFloat(document.documentElement.style.fontSize)
    this.wsWidth = (document.body.clientWidth || document.documentElement.clientWidth)
    this.wsHeight = window.screen.availHeight
    // let mediaInfo = this.item
    // let covers = mediaInfo.cover
    // let coverWidth = this.wsWidth
    // let coverHeight = (this.fontSize * 4.2)
    // let coverFH = Math.floor((coverHeight * this.wsWidth) / coverWidth)
    // let topBannerH = Math.round(1.2 * this.fontSize)
    // let maxHeight = this.wsHeight - topBannerH
    // coverFH = coverFH > maxHeight ? maxHeight : coverFH
    // this.mediaInfo.minHeight = 'auto'
    // this.mediaInfo.containerHeight = coverFH

    if (this.layout == 'under') {
      // 展开标记是否显示
      let maxWidth = Math.round(6.5 * this.fontSize)
      let title = this.mediaInfo.basic.title
      if (typeof title != 'string') {
        title += ''
      }
      // eslint-disable-next-line
      let len = title.replace(/[^\x00-\xff]/g, '01').length

      // console.log(title, len, maxWidth, len > maxWidth)
      this.isShowFlag = len > maxWidth
    }
  },
  methods: {
    getVideoList () {
      let videoId = this.mediaInfo.mediaId
      return this.$axios.$post('/v1/recommend/aboutMedia', { videoId, navId: '1', mediaType: 'video', custom: 1, count: 20 })
    },
    logEvent (key, params) {
      this.$emit('videoClick', key, params)
    },
    // 播放控制
    playControl (key) {
      let _self = this
      let event = ''
      let data = {}
      switch (key) {
        case 1: // 点击播放
          if (this.net > 0) {
            _self.mediaInfo.playStatus = 2// 显示加载状态
          } else {
            _self.mediaInfo.playStatus = -1 // 非wifi提示
          }
          event = 'play'
          _self.startPlay()
          // feed视频列表
          if (_self.isFeedModel) {
            this.$emit('videoPlayStatus', _self.mediaInfo.mediaId)
          }
          break
        case 2: // 加载中 播放时间改变(当视频的currentTime大于0.1时表示黑屏时间已过，已有视频画面)
          if (_self.mediaInfo.playStatus == 2 && _self.videoDom.currentTime > 0.1) {
            _self.mediaInfo.playStatus = 0 // 播放中
          } else if (_self.mediaInfo.basic.privateStatus && _self.mediaInfo.basic.privateStatus != 10) {
            // 私密视频试看 视频总时长>=1分钟&<10分钟可预览时长50%
            if (_self.mediaInfo.basic.duration >= 60 && _self.mediaInfo.basic.duration < 60 * 10 && _self.videoDom.currentTime > _self.mediaInfo.basic.duration / 2) {
              _self.videoDom.pause()
              _self.mediaInfo.playStatus = 6 // 试看结束
            } else if (_self.mediaInfo.basic.duration >= 60 * 10 && _self.videoDom.currentTime > 60 * 6) {
              // 视频总时长>=10分钟可预览时长6分钟
              _self.videoDom.pause()
              _self.mediaInfo.playStatus = 6 // 试看结束
            }
          }
          break
        case 3: // 重播
          _self.isExistRec = false
          _self.progressBar = false // 关闭所有倒计时动画
          _self.mediaInfo.playStatus = 2 // 显示加载状态
          event = 'replay'
          _self.startPlay()
          // feed视频列表
          if (_self.isFeedModel) {
            this.$emit('videoPlayStatus', _self.mediaInfo.mediaId)
          }
          break
        case 4: // 重试
          _self.mediaInfo.playStatus = 2 // 显示加载状态
          event = 'retry'
          _self.startPlay()
          break
        case 5: // 播放结束
          if (_self.recVideoList && _self.recVideoList.length > 0) {
            _self.mediaInfo.playStatus = 5 // 结束显示推荐
            _self.isExistRec = true // 调整容器高度
            // 设置倒计时刷新
            _self.setCountDownRefresh()
          } else {
            _self.mediaInfo.playStatus = 3 // 显示重播
          }
          event = 'endPlay'
          data = {
            playDuration: _self.mediaInfo.basic.duration
          }
          break
        case 6: // 取消
          _self.mediaInfo.playStatus = 1 // 开始播放
          break
        case 7: // 非wifi继续播放
          this.net = 1
          _self.playControl(1)
          break
        case 8: // 继续播放
          event = 'keepPlaying'
          break
        case 9: // 暂停pauseTimes
          event = 'pausePlay'
          break
        case 10: // 试看
          event = 'goPlay'
          break
        default:
          break
      }
      if (event) {
        data.mediaId = _self.mediaInfo.mediaId
        data.url = _self.videoDom.currentSrc
        data.duration = (_self.mediaInfo.basic.duration || _self.videoDom.duration)
        _self.logEvent(event, data)
      }
    },
    // 视频播放
    startPlay () {
      let _self = this
      _self.recProcessTimer && clearTimeout(_self.recProcessTimer)
      _self.videoDom = document.querySelector('video.video' + _self.mediaInfo.mediaId)
      // _self.videoDom = _self.$refs.videoPlayer
      // Utils.log('error', _self.videoDom.error)
      // 0:没有关于音频/视频是否就绪的信息
      // 1:关于音频/视频就绪的元数据
      // 2:关于当前播放位置的数据是可用的，但没有足够的数据来播放下一帧/毫秒
      // 3.当前及至少下一帧的数据是可用的
      // 4.可用数据足以开始播放
      // Utils.log('readyState', _self.videoDom.readyState)
      // 0.音频/视频尚未初始化
      // 1.音频/视频是活动的且已选取资源，但并未使用网络
      // 2.浏览器正在下载数据
      // 3.未找到音频/视频来源
      // Utils.log('networkState', _self.videoDom.networkState)
      // Utils.log('videoDom', _self.videoDom)
      // console.log('_self.videoDom=>', _self.videoDom)
      try {
        _self.videoDom.play()
      } catch (error) {
        _self.mediaInfo.playStatus = 4
        if (_self.mediaInfo.video && _self.mediaInfo.video.playUrl && _self.mediaInfo.video.playUrl[0].url2) {
          _self.videoDom.src = _self.mediaInfo.video.playUrl[0].url2
          _self.videoDom.load()
        }
        // _self.enableVideoBackupUrl = true
        // _self.videoDom.load()
        // Utils.log('play-error=>', error)
      }
      _self.videoDom.addEventListener('ended', _self.onPlayerEnded, false)
      _self.videoDom.addEventListener('timeupdate', _self.onPlayerUpdate, false)
    },
    // 播放时间改变
    onPlayerUpdate () {
      let _self = this
      // Utils.log('player timeupdate!')
      _self.playControl(2)
    },
    // 播放结束
    onPlayerEnded () {
      let _self = this
      // Utils.log('player ended!')
      _self.playControl(5)
    },
    // 倒计时
    setCountDownRefresh () {
      let _self = this
      if (_self.videoList && _self.videoList.length >= _self.randomNum) {
        _self.progressBar = true
        _self.recProcessTimer && clearTimeout(_self.recProcessTimer)
        _self.recProcessTimer = setTimeout(() => {
          _self.progressBar = false
          _self.recVideoList = _self.getRandomList(_self.videoList, _self.randomNum)
          _self.setCountDownRefresh()
        }, 5000)
      }
    },
    // 获取随机数组
    getRandomList (arr, num) {
      let currArr = arr.slice(0) // 克隆数组
      let result = [] // 随机数组
      let currLen = currArr.length
      for (let i = 0; i < num; i++) {
        let key = Math.floor(Math.random() * (currLen - i))
        result.push(currArr[key])
        currArr[key] = currArr[currLen - i - 1]
      }
      return result
    },
    formatWidthHeight (videoObj) {
      if (this.isFlexPlayer && videoObj) {
        let width = videoObj.width
        let height = videoObj.height
        let caleWidth = width
        let caleHeight
        if (width < height) {
          caleWidth = width
          caleHeight = height
        }
        return `width:${caleWidth}px;height:${caleHeight}px;`
      }
    }
  }
}
</script>

<style lang="scss">
// 视频容器
.video-container {
  position: relative;
  width: 100%;
  height: 210px;
  transform: translate(0, 0);
  text-align: center;
  overflow: hidden;
  background: #000;
  max-height: 100vh;
  &.rec-video {
    height: 500px;
  }
  // 播放器
  .player-container {
    position: relative;
    width: 100%;
    height: 100%;
    transform: translate(0, 0);
    text-align: center;
    overflow: hidden;
    &-video {
      display: flex;
      height: 100%;
      width: 100%;
      text-align: center;
      video {
        width: 100%;
        height: 100%;
        // object-fit: fill;
        // object-fit: cover;
      }
    }
    &-poster {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 4;
      background-color: #000;
      background-repeat: no-repeat;
      background-size: cover;
      background-position: center;
    }
    &-layer {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 5;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      &.mask {
        background: rgba(0, 0, 0, .6);
      }
      .see-tips {
        font-family: PingFangSC-Regular;
        font-size: 15px;
        color: #FFFFFF;
      }
      .see-btn {
        margin-top: 20px;
        border: 1px solid #fff; /*no*/
        border-radius: 30px;
        padding: 6px 20px;
        font-family: PingFangSC-Regular;
        font-size: 15px;
        color: #FFFFFF;
        cursor: pointer;
      }
      .play-time {
        position: absolute;
        right: 8px;
        bottom: 8px;
        z-index: 6;
        padding: 3px 7px;
        border-radius: 15px;
        background: rgba(0, 0, 0, .3);
        font-family: Helvetica;
        font-size: 12px;
        line-height: 1;
        color: #FFF;
      }
      .play-btn {
        width: 44px;
        height: 44px;
        background: url(~assets/images/share/video/play@2x.png) no-repeat center;
        background-size: 44px 44px;
        cursor: pointer;
      }
      .replay-btn {
        width: auto;
        height: 28px;
        line-height: 28px;
        background: url(~assets/images/share/video/replay@2x.png) no-repeat left center;
        background-size: 28px 28px;
        padding-left: 37px;
        font-family: PingFangSC-Regular;
        font-size: 17px;
        color: #FFFFFF;
        cursor: pointer;
      }
      .retry-txt {
        font-family: PingFang-SC-Medium;
        font-size: 17px;
        color: rgba(255,255,255,0.90);
        text-align: center;
      }
      .retry-btn {
        margin-top: 10px;
        border: 1px solid rgba(255,255,255,0.70); /*no*/
        border-radius: 18px;
        padding: 7px 27px;
      }
      .loading {
        color: #ffffff;
        font-size: 40px;
        text-indent: -9999em;
        overflow: hidden;
        width: 1em;
        height: 1em;
        border-radius: 50%;
        margin: 0 auto;
        position: relative;
        transform: translateZ(0);
        animation: load6 1.7s infinite ease, round 1.7s infinite ease;
      }
      .tips {
        background: #FFFFFF;
        box-shadow: 0 0 6px 0 rgba(0,0,0,0.20); /*no*/
        border-radius: 8px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding: 15px;
        .title {
          font-family: PingFang-SC-Medium;
          font-size: 17px;
          line-height: 1.5;
          color: #3B424C;
          margin: 0;
          padding: 0;
        }
        .button {
          display: flex;
          margin-top: 15px;
          padding: 0;
          button {
            margin: 0;
            padding: 8px 40px;
            border: none;
            border-radius: 4px;
            font-size: 17px;
            white-space: nowrap;
            &.cancel {
              background: #E0E0E0;
              font-family: PingFangSC-Regular;
              color: #A2A3A5;
            }
            &.continue {
              margin-left: 15px;
              background: #3B424C;
              font-family: PingFang-SC-Medium;
              color: #FFFFFF;
            }
          }
        }
      }
      .user {
        position: absolute;
        left: 10px;
        bottom: 10px;
        z-index: 5;
        height: 35px;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        background: rgba(0, 0, 0, .5);
        border-radius: 35px;
        padding-right: 15px;
        img {
          width: 35px;
          height: 35px;
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
    }
  }
}

// 私密视频大图样式
.video-container-private {
  position: relative;
  transform: translate(0, 0);
  height: 194px;
  overflow: hidden;
  background-color: #f3f4f5;
  background-size: cover;
  background-position: center top;
  background-repeat: no-repeat;
  .time {
    position: absolute;
    right: 8px;
    bottom: 8px;
    z-index: 9;
    padding: 3px 7px;
    border-radius: 15px;
    background: rgba(0, 0, 0, .3);
    font-family: Helvetica;
    font-size: 12px;
    color: #FFF;
    line-height: 1;
  }
  .video-lock {
    position: absolute;
    left: 50%;
    top: 50%;
    z-index: 4;
    transform: translate(-50%, -50%);
    width: 44px;
    height: 44px;
    background: url(~assets/images/share/common/video-lock@2x.png) no-repeat center;
    background-size: 44px 44px;
  }
}

// 媒资相关信息
.media-desc-container {
  position: relative;
  display: flex;
  flex-flow: column;
  padding: 15px;
  border-bottom: 1px solid #eee; /*no*/
  .title {
    position: relative;
    font-family: PingFangSC-Medium;
    font-size: 17px;
    color: #3B424C;
    line-height: 1.5;
    font-weight: bold;
    word-break: break-all;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    padding-right: 20px;
    &.expand {
      -webkit-line-clamp: initial;
    }
    i {
      position: absolute;
      top: 25px;
      right: 0;
      // transform: translateY(-50%);
      z-index: 3;
      display: inline-block;
      width: 0;
      height: 0;
      border-left: 8px solid transparent;
      border-right: 8px solid transparent;
      border-top: 8px solid #3B424C;
      opacity: 0.5;
      &.up {
        transform: rotate(180deg);
      }
    }
  }
  .author {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding-top: 15px;
    section {
      display: inline-flex;
      span {
        display: inline-flex;
        &:first-of-type {
          width: 36px;
          height: 36px;
          background: #F3F4F5;
          border-radius: 100%;
          overflow: hidden;
          img {
            width: 36px;
            height: 36px;
            border-radius: 100%;
            vertical-align: middle;
          }
        }
        &:last-of-type {
          flex-direction: column;
          justify-content: center;
          margin-left: 8px;
          strong {
            font-family: PingFangSC-Regular;
            font-size: 14px;
            color: #3B424C;
            font-weight: 500;
            margin-bottom: 2px;
            width: 170px;
            word-break: break-all;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 1;
          }
          em {
            font-family: PingFangSC-Regular;
            font-size: 11px;
            color: #A2A3A5;
          }
        }
      }
    }
    button {
      position: relative;
      padding: 5px 17px;
      // font-family: PingFangSC-Regular;
      font-size: 14px;
      color: #FFFFFF;
      text-align: center;
      border-radius: 100px;
      // background-image: linear-gradient(-135deg, #FD8350 0%, #FA2764 100%);
      background-image: linear-gradient(-135deg, #FA2764 0%, #FD8350 100%);
      cursor: pointer;
      border: none;
      display: block;
      white-space: nowrap;
      &.followed {
        background: #DDD;
        color: #9999A1;
      }
    }
  }
  .group {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding-top: 15px;
    span {
      font-family: PingFangSC-Regular;
      font-size: 14px;
      color: #3B424C;
      font-weight: 500;
      margin-bottom: 2px;
      width: 210px;
      word-break: break-all;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 1;
    }
    button {
      position: relative;
      padding: 5px 17px;
      // font-family: PingFangSC-Regular;
      font-size: 14px;
      color: #FFFFFF;
      text-align: center;
      border-radius: 100px;
      // background-image: linear-gradient(-135deg, #FD8350 0%, #FA2764 100%);
      background-image: linear-gradient(-135deg, #FA2764 0%, #FD8350 100%);
      cursor: pointer;
      border: none;
      display: block;
      white-space: nowrap;
    }
  }
}

// 播放后推荐视频
.recommend-container {
  position: absolute;
  left: 0;
  top: 50%;
  width: 100%;
  height: 100%;
  transform: translateY(-50%);
  // min-height: 500px;
  z-index: 9;
  padding: 0 25px;
  background: rgba(0, 0, 0, .6);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  ul {
    width: 100%;
    margin-top: 25px;
    li {
      position: relative;
      width: 50%;
      padding-top: 50%;
      height: 0;
      overflow: hidden;
      display: inline-block;
      vertical-align: top;
      cursor: pointer;
      border-style: solid;
      border-color: transparent;
      // background: #EEE;
      &:nth-child(odd) {
        border-width: 0 2px 4px 0; /*no*/
      }
      &:nth-child(even) {
        border-width: 0 0 4px 2px; /*no*/
      }
      .play-num {
        position: absolute;
        top: 6px;
        right: 6px;
        z-index: 3;
        color: $color-white;
        font-size: 12px;
      }
      .play-btn {
        position: absolute;
        left: 50%;
        top: 50%;
        z-index: 3;
        width: 44px;
        height: 44px;
        margin-left: -22px;
        margin-top: -22px;
        background: url(~assets/images/share/video/play@2x.png) no-repeat center;
        background-size: 44px 44px;
      }
      .play-process {
        position: absolute;
        left: 0;
        bottom: 0;
        z-index: 3;
        width: 100%;
        height: 4px;
        background: -webkit-linear-gradient(left, #FD8350, #FA2764);
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
      }
      div {
        position: absolute;
        left: 0;
        &:first-of-type {
          top: 0;
          z-index: 3;
          width: 100%;
          height: 100%;
          background-color: #eee;
          background-position: center;
          background-size: cover;
        }
        &:last-of-type {
          bottom: 0;
          z-index: 5;
          width: 100%;
          background: -webkit-linear-gradient(top, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.7));
          padding: 5px;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          height: 35px;
          p {
            font-size: 12px;
            width: 100%;
            height: 30px;
            line-height: 30px;
            color: $color-white;
            overflow: hidden;
            text-overflow: ellipsis;
            -webkit-line-clamp: 1;
            -webkit-box-orient: vertical;
            display: -webkit-box;
            text-align: left;
          }
        }
      }
    }
  }
  .btn-continue {
    width: 100%;
    color: $color-white;
    font-size: 16px;
    height: 40px;
    line-height: 40px;
    text-align: center;
    border-radius: 100px;
    background: -webkit-linear-gradient(left, #FD8350, #FA2764);
    margin-top: 6px;
    margin-bottom: 15px;
    cursor: pointer;
    border: none;
  }
  .btn-replay {
    height: 30px;
    line-height: 30px;
    color: $color-white;
    font-size: 16px;
    padding-left: 30px;
    background: url(~assets/images/share/video/replay@2x.png) no-repeat left center;
    background-size: 20px 20px;
    cursor: pointer;
  }
}

.progressBar-ani {
  animation: progressBar 5s ease;
}
@keyframes progressBar {
  from {
    width: 100%;
  }
  to {
    width: 0;
  }
}

// 动画
@-webkit-keyframes load6 {
  0% {
    box-shadow: 0 -0.83em 0 -0.4em, 0 -0.83em 0 -0.42em, 0 -0.83em 0 -0.44em, 0 -0.83em 0 -0.46em, 0 -0.83em 0 -0.477em;
  }
  5%,
  95% {
    box-shadow: 0 -0.83em 0 -0.4em, 0 -0.83em 0 -0.42em, 0 -0.83em 0 -0.44em, 0 -0.83em 0 -0.46em, 0 -0.83em 0 -0.477em;
  }
  10%,
  59% {
    box-shadow: 0 -0.83em 0 -0.4em, -0.087em -0.825em 0 -0.42em, -0.173em -0.812em 0 -0.44em, -0.256em -0.789em 0 -0.46em, -0.297em -0.775em 0 -0.477em;
  }
  20% {
    box-shadow: 0 -0.83em 0 -0.4em, -0.338em -0.758em 0 -0.42em, -0.555em -0.617em 0 -0.44em, -0.671em -0.488em 0 -0.46em, -0.749em -0.34em 0 -0.477em;
  }
  38% {
    box-shadow: 0 -0.83em 0 -0.4em, -0.377em -0.74em 0 -0.42em, -0.645em -0.522em 0 -0.44em, -0.775em -0.297em 0 -0.46em, -0.82em -0.09em 0 -0.477em;
  }
  100% {
    box-shadow: 0 -0.83em 0 -0.4em, 0 -0.83em 0 -0.42em, 0 -0.83em 0 -0.44em, 0 -0.83em 0 -0.46em, 0 -0.83em 0 -0.477em;
  }
}

@keyframes load6 {
  0% {
    box-shadow: 0 -0.83em 0 -0.4em, 0 -0.83em 0 -0.42em, 0 -0.83em 0 -0.44em, 0 -0.83em 0 -0.46em, 0 -0.83em 0 -0.477em;
  }
  5%,
  95% {
    box-shadow: 0 -0.83em 0 -0.4em, 0 -0.83em 0 -0.42em, 0 -0.83em 0 -0.44em, 0 -0.83em 0 -0.46em, 0 -0.83em 0 -0.477em;
  }
  10%,
  59% {
    box-shadow: 0 -0.83em 0 -0.4em, -0.087em -0.825em 0 -0.42em, -0.173em -0.812em 0 -0.44em, -0.256em -0.789em 0 -0.46em, -0.297em -0.775em 0 -0.477em;
  }
  20% {
    box-shadow: 0 -0.83em 0 -0.4em, -0.338em -0.758em 0 -0.42em, -0.555em -0.617em 0 -0.44em, -0.671em -0.488em 0 -0.46em, -0.749em -0.34em 0 -0.477em;
  }
  38% {
    box-shadow: 0 -0.83em 0 -0.4em, -0.377em -0.74em 0 -0.42em, -0.645em -0.522em 0 -0.44em, -0.775em -0.297em 0 -0.46em, -0.82em -0.09em 0 -0.477em;
  }
  100% {
    box-shadow: 0 -0.83em 0 -0.4em, 0 -0.83em 0 -0.42em, 0 -0.83em 0 -0.44em, 0 -0.83em 0 -0.46em, 0 -0.83em 0 -0.477em;
  }
}

@-webkit-keyframes round {
  0% {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}

@keyframes round {
  0% {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
</style>
