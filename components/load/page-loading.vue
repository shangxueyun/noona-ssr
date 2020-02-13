<template>
  <div>
    <template v-if="isLoadingStatus == 3 || isLoadingStatus == 4">
      <div class="banner-container">
        <page-banner :lang="lang" :p-name="pName" :is-top="true" @bannerClick="logEvent" />
      </div>
      <div v-if="isLoadingStatus == 3" class="error-container">
        <section>
          <ul>
            <li><img class="nofound" src="~/assets/images/common/not-found.png" alt=""></li>
            <li>{{ lang.share.common.nofound }}</li>
            <li>{{ lang.share.common.nofoundTip }}</li>
            <li>
              <button @click="logEvent('download')">
                {{ lang.share.common.download }}
              </button>
            </li>
          </ul>
        </section>
      </div>
      <div v-else-if="isLoadingStatus == 4" class="error-container">
        <section>
          <ul>
            <li><img class="delete" src="~/assets/images/share/video/play-error@2x.png" alt=""></li>
            <li>{{ lang.share.common.deleteText }}</li>
            <li><a class="seeMore" href="javascript:;" @click="logEvent('delete')">{{ lang.share.common.seeMore }}</a></li>
          </ul>
        </section>
      </div>
    </template>
    <template v-else>
      <div class="loading-container">
        <section v-if="isLoadingStatus == 1" class="loading">
          {{ lang.share.common.loading }}
        </section>
        <button v-else-if="isLoadingStatus == 2" type="button" class="loading-fail" @click="retry()">
          {{ lang.share.common.loadRetry }}
        </button>
      </div>
    </template>
  </div>
</template>

<script>
import pageBanner from './page-banner'
export default {
  name: 'PageLoading',
  components: {
    pageBanner
  },
  props: {
    lang: {
      type: Object,
      default: () => {}
    },
    isLoadingStatus: {
      type: Number,
      default: 1
    },
    pName: {
      type: String,
      default: 'seely'
    }
  },
  data () {
    return {}
  },
  watch: {
    isLoadingStatus (val) {
      this.isLoadingStatus = val
    }
  },
  methods: {
    retry () {
      this.$emit('retryClick')
    },
    logEvent (key) {
      this.$emit('loadingClick', key, { pStatus: '404' })
    }
  }
}
</script>

<style lang="scss">
.banner-container {
  position: relative;
  width: 100%;
  height: 60px;
}
.loading-container {
  display: flex;
  flex-flow: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  font-size: 14px;
  color: $color-A2A3A5;
  .loading-fail {
    border: none;
    color: $color-A2A3A5;
    padding-top: 130px;
    background: url(~assets/images/common/no-network@2x.png) no-repeat center top;
    background-size: 116px 110px;
    cursor: pointer;
  }
  .loading {
    display: block;
  }
}
.error-container {
  section {
    ul li {
      font-size: 14px;
      width: 100%;
      padding: 5px 0;
      text-align: center;
      color: #666;
      &:first-of-type {
        margin: 40px 0;
      }
      .seeMore {
        color: #ff5722;
        text-decoration: underline;
      }
    }
    img {
      border: none;
      &.nofound {
        width: 250px;
      }
      &.delete {
        width: 80px;
      }
    }
    button {
      margin-top: 40px;
      height: 40px;
      line-height: 38px;
      display: inline-block;
      color: #ff5722;
      border-width: 1px; /*no*/
      border-style: solid;
      border-color: #ff5722;
      border-radius: 8px;
      text-align: center;
      background: transparent;
      padding: 0 20px;
    }
  }
}
</style>
