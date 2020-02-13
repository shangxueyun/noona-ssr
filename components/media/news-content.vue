<template>
  <div ref="newsContent" class="news-container-content">
    <div v-if="mediaInfo.basic.mediaType == '3'" class="title" :class="fontSize">
      {{ mediaInfo.basic.title }}
    </div>
    <template v-for="(item, key) in mediaInfo.content">
      <div
        v-if="item.type == 'img'"
        :key="key"
        class="img-box"
        :style="{'width': item.calcWidth, 'height': item.calcHeigh}"
        :data-src="item.src"
        :data-index="item.key"
        @click="getNativeViewMode"
      >
        <img class="lazy news-cover" src="~/assets/images/common/default.png" :style="{'width': item.calcWidth, 'height': item.calcHeigh}" :data-src="item.src" :data-index="item.key">
      </div>
      <div v-else-if="item.type == 'video'" :id="'video' + item.mediaId" :key="key" class="video-container">
        <div class="player-container" :style="{'height': item.calcHeigh}">
          <div class="player-container-video">
            <video
              :class="'video' + item.mediaId"
              :data-width="item.videoW"
              :data-height="item.videoH"
              :poster="item.src"
              :src="item.url || item.url2"
              controls
              webkit-playsinline
              playsinline
              x5-video-player-type="h5"
              :preload="net > 0 ? 'auto' : 'none'"
            />
          </div>
          <!-- 封面图 -->
          <div v-if="item.playStatus && item.src" class="player-container-poster" :style="{'background-image': 'url('+ item.src + ')'}" />
          <!-- 开始播放 -->
          <div v-if="item.playStatus == 1 || item.playStatus == 5" class="player-container-layer" @click="playControl(1, item)">
            <span class="play-btn" />
          </div>
          <!-- 加载中 -->
          <div v-if="item.playStatus == 2" class="player-container-layer">
            <div class="loading">
              Loading...
            </div>
          </div>
          <!-- 重播 -->
          <div v-if="item.playStatus == 3" class="player-container-layer mask" @click="playControl(3, item)">
            <span class="replay-btn">{{ lang.share.video.replay }}</span>
          </div>
          <!-- 网络错误重试 -->
          <div v-if="item.playStatus == 4" class="player-container-layer mask" @click="playControl(4, item)">
            <span class="retry-txt">{{ lang.share.video.failedLoad }}</span>
            <span class="retry-txt retry-btn">{{ lang.share.video.retryBtn }}</span>
          </div>
          <!-- 非wifi提示 -->
          <div v-if="item.playStatus == -1" class="player-container-layer mask">
            <div class="tips">
              <p class="title">
                {{ lang.share.video.tips1 }}
              </p>
              <p class="title">
                {{ lang.share.video.tips2 }}
              </p>
              <p class="button">
                <button class="cancel" @click="playControl(6)">
                  {{ lang.share.video.cancelBtn }}
                </button><button class="continue" @click="playControl(7, item)">
                  {{ lang.share.video.continueBtn }}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
      <div v-else-if="item.content" :key="key" :class="fontSize" v-html="item.content" />
    </template>
  </div>
</template>

<script>
import Native from '~/plugins/native'
export default {
  name: 'NewsContent',
  props: {
    isNative: {
      type: Boolean,
      default: true
    },
    lang: {
      type: Object,
      default: () => {}
    },
    mediaInfo: {
      type: Object,
      default: () => {}
    },
    fontSize: {
      type: String,
      default: 'normal'
    }
  },
  data () {
    return {
      net: 1, // -1: 无网络 (或无法识别) 0: 无网络 (或无法识别) 1: WIFI
      currItem: {},
      mediaId: '',
      playStatus: 1, // 0播放中,1开始播放,2加载中,3重播,4重试,5暂停-1非wifi提示
      videoDom: {} // 视频dom
    }
  },
  mounted () {
    if (this.isNative) {
      this.$nextTick(() => {
        this.$emit('newsContainerHeight', this.$refs.newsContent.offsetHeight + this.$refs.newsContent.offsetTop)
      })
      // 获取公共参数
      Native.getNativePublicParams().then((res) => {
        if (res && res.data) {
          this.net = parseInt(res.data._nId) || 1
        }
      })
    } else {
      // 滚动检测视频是否播放
      let content = this.mediaInfo.content
      let wsHeight = window.screen.availHeight
      window.addEventListener('scroll', (event) => {
        for (let i = 0; i < content.length; i++) {
          if (content[i] && content[i]['type'] == 'video') {
            let videoDom = document.querySelector('video.video' + content[i]['mediaId'])
            let offsetTop = videoDom.getBoundingClientRect().y
            let offsetHeight = videoDom.offsetHeight
            // 暂停播放
            if ((offsetTop + offsetHeight < 0 || offsetTop > wsHeight) && videoDom && !videoDom.paused) {
              videoDom.pause()
              content[i]['playStatus'] = 5
            }
          }
        }
        this.mediaInfo.content = content
      }, true)
    }
  },
  methods: {
    logEvent (key, params) {
      this.$emit('contentClick', key, params)
    },
    getNativeViewMode () {
      if (this.isNative) {
        let e = event || window.event
        let target = e.target || e.srcElement
        let index = parseInt(target.dataset.index)
        let list = this.mediaInfo.cover
        let params = {
          type: 3,
          data: {
            list,
            index
          }
        }
        Native.setNativeActionStatus(params).then((res) => {})
      }
    },
    // 播放控制
    playControl (key, item = {}) {
      let _self = this
      let event = ''
      let data = {}
      if (item && item.mediaId) {
        _self.currItem = item
        _self.videoDom = document.querySelector('video.video' + _self.currItem.mediaId)
      }
      switch (key) {
        case 1: // 开始播放
          let content = this.mediaInfo.content
          if (_self.currItem && _self.currItem.mediaId && content) {
            for (let i = 0; i < content.length; i++) {
              if (content[i] && content[i]['type'] == 'video') {
                if (_self.currItem.mediaId == content[i]['mediaId']) {
                  if (this.net > 0) {
                    if (_self.currItem.playStatus == 5) {
                      event = 'againPlay'
                    } else {
                      event = 'play'
                    }
                    _self.currItem.playStatus = 2 // 显示加载状态
                    _self.startPlay()
                    // native设置当前播放视频及位置
                    if (this.isNative) {
                      let videoDom = document.querySelector('#video' + content[i]['mediaId'])
                      let params = {
                        type: 4,
                        data: {
                          mediaId: _self.currItem.mediaId,
                          offsetTop: videoDom.offsetTop || 0
                        }
                      }
                      Native.setNativeActionStatus(params).then((res) => {})
                    }
                  } else {
                    _self.currItem.playStatus = -1 // 非wifi提示
                  }
                } else {
                  let otherVideoDom = document.querySelector('video.video' + content[i]['mediaId'])
                  // 暂停播放
                  if (otherVideoDom && !otherVideoDom.paused) {
                    otherVideoDom.pause()
                    content[i]['playStatus'] = 5
                  } else {
                    content[i]['playStatus'] = 1
                  }
                }
              }
            }
            this.mediaInfo.content = content
          }
          break
        case 2: // 加载中 播放时间改变(当视频的currentTime大于0.1时表示黑屏时间已过，已有视频画面)
          if (_self.currItem.playStatus == 2 && _self.videoDom.currentTime > 0.1) {
            _self.currItem.playStatus = 0 // 播放中
          }
          break
        case 3: // 重播
          _self.currItem.playStatus = 2 // 显示加载状态
          event = 'replay'
          _self.startPlay()
          break
        case 4: // 重试
          _self.currItem.playStatus = 2 // 显示加载状态
          event = 'retry'
          _self.startPlay()
          break
        case 5: // 播放结束
          _self.currItem.playStatus = 3 // 显示重播
          event = 'endPlay'
          data = {
            playDuration: (_self.currItem.duration || _self.videoDom.duration)
          }
          break
        case 6: // 取消
          _self.currItem.playStatus = 1 // 开始播放
          break
        case 7: // 继续
          this.net = 1
          _self.playControl(1)
          break
        case 8: // 暂停pauseTimes
          break
        default:
          break
      }
      if (event) {
        data.mediaId = _self.currItem.mediaId
        data.url = _self.videoDom.currentSrc
        data.duration = (_self.currItem.duration || _self.videoDom.duration)
        if (this.isNative) {
          Native.getNativeLogCollect({ eventId: event, params: data }).then(res => {})
        } else {
          _self.logEvent(event, data)
        }
      }
    },
    // 视频播放
    startPlay () {
      let _self = this
      // _self.recProcessTimer && clearTimeout(_self.recProcessTimer)
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
      // _self.videoDom.play()
      try {
        _self.videoDom.play()
      } catch (error) {
        _self.playStatus = 4
        if (_self.currItem && _self.currItem.url2) {
          _self.videoDom.src = _self.currItem.url2
          _self.videoDom.load()
        }
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
    }
  }
}
</script>

<style lang="scss">
// 媒资信息
.news-container-content {
  // position: relative;
  width: 100%;
  // height: 100%;
  padding-top: 20px;
  font-family: PingFangSC-Regular;
  font-size: 17px;
  color: #343445;
  // text-align: justify;
  .title {
    font-family: PingFangSC-Medium;
    font-size: 17px;
    color: #343445;
    line-height: 1.5;
    // text-align: justify;
    // word-break: break-all;
    word-break: keep-all;
    word-wrap: break-word;
    // letter-spacing: 1px;
    margin-bottom: 20px;
  }
  p {
    padding: 0;
    margin: 0;
    line-height: 1.5;
    font-size: 17px;
    word-break: keep-all;
    word-wrap: break-word;
    // text-align: justify;
    // letter-spacing: 1px;
    padding-bottom: 15px;
    &~p {
      padding-bottom: 15px;
    }
  }
  .tiny {
    font-size: 13px;
    p {
      font-size: 13px;
    }
  }
  .small {
    font-size: 15px;
    p {
      font-size: 15px;
    }
  }
  .large {
    font-size: 19px;
    p {
      font-size: 19px;
    }
  }
  .oversized {
    font-size: 21px;
    p {
      font-size: 21px;
    }
  }
  .img-box {
    position: relative;
    background: #F3F4F5;
    // min-height: 100px;
    img {
      position: relative;
      width: 100%;
      z-index: 8;
      cursor: pointer;
      // position: absolute;
      // left: 0;
      // top: 0;
      // width: 100%;
      // z-index: 9;
    }
    &::before {
      content: '';
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      z-index: 1;
      font-size: 15px;
      color: #A2A3A5;
    }
    margin-bottom: 15px;
  }
}
// 视频容器
.video-container {
  width: 100%;
  transform: translate(0, 0);
  text-align: center;
  overflow: hidden;
  background: #000;
  margin-bottom: 15px;
  // 播放器
  .player-container {
    position: relative;
    width: 100%;
    transform: translate(0, 0);
    text-align: center;
    overflow: hidden;
    // max-height: 100vh;
    &-video {
      text-align: center;
      video {
        width: 100%;
        height: 100%;
      }
    }
    &-poster {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 4;
      display: flex;
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
        background: rgba(0, 0, 0, 0.50);
      }
      .play-btn {
        width: 44px;
        height: 44px;
        // margin-left: -22px;
        // margin-top: -22px;
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
    }
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
