<template>
  <div class="video-list-container">
    <div class="sub-title">
      <span /><span>{{ lang.share.video.moreVideo }}</span><span />
    </div>
    <ul>
      <li v-for="(item) in list" :key="item.mediaId" :data-id="item.mediaId" @click="logEvent('moreVideo', {mediaId: item.mediaId})">
        <div :style="{'background-image': 'url('+ item.cover[0][1].url + ')'}" />
        <div><p>{{ item.basic.title }}</p></div>
      </li>
    </ul>
    <div class="sub-title">
      <span /><span class="end">{{ lang.share.video.end }}</span><span />
    </div>
  </div>
</template>

<script>
export default {
  name: 'MediaVideoList',
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
  methods: {
    logEvent (key, params) {
      this.$emit('videoClick', key, params)
    }
  }
}
</script>

<style lang="scss">
.video-list-container {
  position: relative;
  // margin-left: 15px;
  // margin-right: 15px;
  .sub-title {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 15px;
    span {
      &:first-of-type {
        flex: 1;
        height: 1px; /*no*/
        display: inline-block;
        background: #DDDDDD;
      }
      &:nth-of-type(2) {
        padding: 0 20px;
        font-size: 14px;
        color: $color-333;
        display: inline-block;
        background: $color-white;
        &.end {
          color: $color-999 !important;
          font-size: 12px !important;
        }
      }
      &:last-of-type {
        flex: 1;
        height: 1px; /*no*/
        display: inline-block;
        background: #DDDDDD;
      }
    }
  }
  ul {
    width: 100%;
    li {
      position: relative;
      width: 50%;
      padding-top: 60%;
      height: 0;
      overflow: hidden;
      display: inline-block;
      vertical-align: top;
      cursor: pointer;
      border-style: solid;
      border-color: #FFF;
      background: #EEE;
      &:nth-child(odd) {
        border-width: 0 2px 4px 0; /*no*/
      }
      &:nth-child(even) {
        border-width: 0 0 4px 2px; /*no*/
      }
      &:last-child {
        border-bottom-width: 0 !important;
      }
      &:nth-last-child(2) {
        border-bottom-width: 0 !important;
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
          padding: 5px 7px;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          height: 46px;
          p {
            font-size: 12px;
            width: 100%;
            line-height: 15px;
            color: $color-white;
            overflow: hidden;
            text-overflow: ellipsis;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            display: -webkit-box;
          }
        }
      }
    }
  }
}
</style>
