<template>
  <div class="swiper-container">
    <div class="swiper-wrapper">
      <div v-for="(item) in list" :key="item[1].sortId" class="swiper-slide">
        <img :data-width="item[1].width" :data-height="item[1].height" :src="item[1].url">
      </div>
    </div>
    <!-- 分页器 -->
    <div class="swiper-pagination" />
  </div>
</template>

<script>
import Swiper from 'swiper'
import 'swiper/dist/css/swiper.min.css'
export default {
  name: 'PageSwiper',
  props: {
    list: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {}
  },
  mounted () {
    /* eslint-disable no-new */
    new Swiper('.swiper-container', {
      pagination: {
        el: '.swiper-pagination',
        type: 'fraction'
      }
    })
  }
}
</script>

<style lang="scss">
.swiper-container {
  width: 100%;
  background: #000;
  .swiper-wrapper {
    align-items: center;
  }
  .swiper-slide {
    width: 100%;
    text-align: center;
    img {
      width: 100%;
    }
  }
  .swiper-pagination {
    // position: absolute;
    // left: 50%;
    top: 10px;
    bottom: auto;
    opacity: 0.9;
    color: #FFF;
    text-align: center;
    font-size: 14px;
    .swiper-pagination-current {
      font-size: 20px;
    }
    .swiper-pagination-total {
      font-size: 14px;
    }
  }
}
</style>
