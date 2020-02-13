<template>
  <div class="container">
    <div v-if="treasureInfo && treasureInfo.phase_info" style="width: 100vw;">
      <!-- 顶部banner -->
      <!-- <iframe id="iframePage" style="width:100vw;height:100vh" :src="`${hrefURL}/inside/treasure/TreasureDetails.html?phase_id=${phaseId},type`" /> -->
    </div>
    <div v-else class="main-container">
      <!-- loading 重试 -->
      <page-loading :lang="langs" :p-name="pName" :is-loading-status="loadingStatus" @loadingClick="logEvent" />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { pageLoading } from '~/components/load'
import Log from '~/plugins/log'
import defaultAvatar from '~/assets/images/common/default-avatar@3x.png'
export default {
  name: 'NewsparkShareTreasure',
  components: {
    pageLoading
  },
  data () {
    return {
      treasureInfo: {},
      iframeWidth: '100%',
      iframeHeight: '100%',
      loadingStatus: 1 // 加载状态1加载中，2加载失败，3加载数据为空，4删除，5审核
    }
  },
  computed: {
    ...mapState({
      // common
      icoUrl: state => state.common.icoUrl,
      lang: state => state.common.lang,
      pName: state => state.common.pName,
      langs: state => state.common.langs,
      hrefURL: state => state.common.hrefURL,
      meta: state => state.common.meta,

      // 期号信息
      phaseId: state => state.treasureInfo.phaseId
    })
  },
  async asyncData ({ store, route, req, error }) {
    let treasureInfo = {}
    let loadingStatus = 1
    let metaInfo = {
      title: store.state.common.langs.seo.title
    }
    // 一元夺宝详情
    await store.dispatch('getphaseInfo').then((resData) => {
      treasureInfo = resData
      if (treasureInfo && treasureInfo.phase_info) {
        let summary = resData.phase_info.media_info.basic.summary
        summary = summary.length > 100 ? summary.slice(0, 100) : summary
        metaInfo.title = '₱1 Game - Win big prizes for just ₱1.'
        metaInfo.description = summary
        // 配置0为商品列表图
        metaInfo.image = resData.phase_info.media_info.cover[0]['1'].url
        metaInfo.imagewidth = resData.phase_info.media_info.cover[0]['1'].width
        metaInfo.imageheight = resData.phase_info.media_info.cover[0]['1'].height
      } else {
        loadingStatus = 2
      }
    })
    return {
      loadingStatus,
      metaInfo,
      treasureInfo
    }
  },
  head () {
    return {
      title: this.metaInfo.title,
      meta: [
        ...this.meta,
        { name: 'description', content: this.metaInfo.description },
        { name: 'viewport', content: 'width=device-width,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no' },
        // facebook
        { property: 'og:title', content: this.metaInfo.title },
        { property: 'og:description', content: this.metaInfo.description },
        { property: 'og:image', content: this.metaInfo.image },
        { property: 'og:image:width', content: this.metaInfo.imagewidth },
        { property: 'og:image:height', content: this.metaInfo.imageheight },

        { itemprop: 'name', content: this.metaInfo.title },
        { itemprop: 'image', content: this.metaInfo.image },
        { itemprop: 'description', content: this.metaInfo.description },

        // twitter
        { name: 'twitter:title', content: this.metaInfo.title },
        { name: 'twitter:image:src', content: this.metaInfo.image },
        { name: 'twitter:description', content: this.metaInfo.description }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: this.icoUrl }
      ]
    }
  },
  mounted () {
    // 图片预加载
    // this.iframeWidth = document.body.scrollWidth + 'px'
    // this.iframeHeight = document.body.scrollHeight + 'px'
    window.location.href = `${this.hrefURL}/inside/treasure/TreasureDetails.html?phase_id=${this.phaseId},type`
    document.querySelectorAll('img.lazy').forEach((el) => {
      const src = el.getAttribute('data-src')
      this.preloadImage(src).then(() => {
        el.setAttribute('src', src)
      }).catch(() => {
        if (el.getAttribute('data-type') == 'avatar') {
          el.setAttribute('src', defaultAvatar)
        }
        // console.log(err)
      })
    })
  },
  methods: {
    // 日志投递
    logEvent (key, params = {}) {
      let pName = 'newspark'
      const treasureId = this.treasureInfo.treasureId
      const schemeUrl = `${pName}://web/u?uid=${treasureId}`
      const options = {
        app: 'noonaH5',
        page: 'sharetreasure',
        params: { treasureId, schemeUrl, ...params }
      }
      Log.event({ key, ...options })
    },
    // 图片预加载
    preloadImage (src) {
      return new Promise(function (resolve, reject) {
        const image = new Image()
        image.onload = resolve
        image.onerror = reject
        image.src = src
      })
    }
  }
}
</script>

<style lang="scss">
#iframePage{
  border: 0;
}
</style>
<style>
html,body{
  width: 100vw;
  height: 100vh;
}
</style>
